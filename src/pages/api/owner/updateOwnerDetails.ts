import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
import { createRouter } from "next-connect";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(async (req, res, next) => {
  //console.log({boxCricketId: req.query.boxCricketId})
  const validations = [
    body("ownerPhone").trim().notEmpty().withMessage("owner Phone is required"),
    body("ownerName").trim().notEmpty().withMessage("owner Name is required"),
    body("ownerEmail").trim().notEmpty().withMessage("owner Email is required"),
    body("ownerId").trim().notEmpty().withMessage("owner Id is required"),
  ];
  await Promise.all(validations.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  const err: any[] = [];
  errors
    .array()
    .map((err1: any) => err.push({ field: err1.slot, msg: err1.msg }));

  if (errors.isEmpty()) next();
  else res.status(422).json({ status: 422, message: "bad request", err });
});

router.post(async (req, res) => {
  try {
    const { ownerPhone, ownerName, ownerEmail, ownerId } = req.body;
    const newOwner = await prisma.owner.update({
      where: {
        id: ownerId,
      },
      data: {
        ownerPhone,
        ownerName,
        ownerEmail,
      },
    });

    if (newOwner) {
      res.status(200).json({ status: 200, newOwner });
    } else {
      res.status(404).json({ status: 404, message: "owner not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "something went wrong" });
  }
});

export default router.handler({
  onError: (err: unknown, req, res) => {
    //console.error(err.stack);
    //res.status(err.statusCode || 500).end(err.message);
    res.status(500).json({ status: 500, message: "somwthing went wrong" });
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ status: 405, message: "no method found" });
  },
});
