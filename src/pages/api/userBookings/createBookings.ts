import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const prisma = new PrismaClient();
const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(async (req, res, next) => {
  const validations = [
    body("userId").trim().notEmpty().withMessage("userId required"),
    body("boxCricketId").trim().notEmpty().withMessage("userId required"),
    body("userBookings").trim().notEmpty().withMessage("userId required"),
    body("date").trim().notEmpty().withMessage("userId required"),
  ];
  await Promise.all(validations.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  const err: any[] = [];
  errors
    .array()
    .map((err1: any) => err.push({ field: err1?.path, msg: err1.msg }));
  //console.log({ err });
  if (errors.isEmpty()) next();
  else res.status(422).json({ status: 422, message: "bad request", err });
});

router.post(async (req, res) => {
  try {
    const { userId, boxCricketId, userBookings, date } = req.body;

    const userBooking = await prisma.userbooking.create({
      data: {
        userId,
        boxCricketId,
        userBookings: JSON.parse(userBookings),
        date,
      },
    });

    res
      .status(201)
      .json({ status: 201, message: "booking success", userBooking });
  } catch (err) {
    res.status(500).json({ status: 500, message: "something went wrong", err });
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
