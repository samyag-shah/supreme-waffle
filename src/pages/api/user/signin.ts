import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { createRouter } from "next-connect";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(async (req, res, next) => {
  //console.log({ body: req.body });
  let validations;
  if (req.body.phone || req.body.phone === "") {
    validations = [
      body("phone").trim().notEmpty().withMessage("phone is required"),
    ];
  } else if (req.body.email || req.body.email === "") {
    validations = [
      body("email")
        .trim()
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("Valid Email required"),
    ];
  } else {
    res
      .status(422)
      .json({ status: 422, message: "either phone or email required" });
  }

  if (validations) {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    const err: any[] = [];
    errors
      .array()
      .map((err1: any) => err.push({ field: err1.slot, msg: err1.msg }));

    if (errors.isEmpty()) next();
    else res.status(422).json({ status: 422, message: "bad request", err });
  }
});

router.post(async (req, res) => {
  const { phone, email } = req.body;
  try {
    if (phone) {
      const user = await prisma.user.findFirst({
        where: { phone },
      });

      //user does not exists
      if (user === null) {
        return res
          .status(404)
          .json({ status: 404, message: "user does not exists" });
      }

      //user does exists
      const payload = {
        username: user.username,
        phone: user.phone,
        exp: Date.now() / 1000 + 24 * 60 * 60,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY || "");
      return res.status(200).json({ status: 200, user, token });
    } else if (email) {
      const user = await prisma.user.findFirst({
        where: { email },
      });
      //user does not exists
      if (user === null) {
        return res
          .status(404)
          .json({ status: 404, message: "user does not exists" });
      }
      //user does exists
      const payload = {
        username: user.username,
        phone: user.email,
        exp: Date.now() / 1000 + 24 * 60 * 60,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY || "");
      return res.status(200).json({ status: 200, user, token });
    } else {
      return res.status(422).json({ status: 422, message: "bad request" });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 500, message: "something went wrong" });
  }
});

export default router.handler({
  onError: (err: unknown, req, res) => {
    //console.error(err.stack);
    //res.status(err.statusCode || 500).end(err.message);
    res.status(500).json({ status: 500, message: "something went wrong" });
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ status: 405, message: "no method found" });
  },
});
