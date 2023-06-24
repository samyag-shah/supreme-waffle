import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();
const prisma = new PrismaClient();

router.use(async (req, res, next) => {
  //console.log({ req: req.body });
  const validations = [
    body("date").trim().notEmpty().withMessage("date is required"),
    body("boxCricketId")
      .trim()
      .notEmpty()
      .withMessage("boxCricketId is required"),
  ];
  await Promise.all(validations.map((validaiton) => validaiton.run(req)));
  const errors = validationResult(req);

  const err: any[] = [];
  errors
    .array()
    .map((err1: any) => err.push({ field: err1?.path, msg: err1.msg }));
  if (errors.isEmpty()) next();
  else res.status(422).json({ status: 422, message: "bad request", err });
});

router.post(async (req, res) => {
  try {
    const { date, boxCricketId } = req.body;
    console.log({ date, boxCricketId });
    const booking = await prisma.booking.findFirst({
      where: {
        date,
        boxCricketId,
      },
    });
    if (booking) {
      res.json({ status: 200, booking });
    } else {
      res.json({ status: 404, message: "Not Found" });
    }
  } catch (err) {
    console.error(err);
    res.json({ status: 500, message: "something went wrong" });
  }
});

export default router.handler({
  onError: (err: unknown, req, res) => {
    //console.error(err.stack);
    //res.status(err.statusCode || 500).end(err.message);
    res.status(500).json({ status: 500, message: "somwthing went wrong", err });
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ status: 405, message: "no method found" });
  },
});
