import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const prisma = new PrismaClient();
const router = createRouter<NextApiRequest, NextApiResponse>();

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

router.use(async (req, res, next) => {
  const validations = [
    body("boxCricketId").trim().notEmpty().withMessage("boxCricketId required"),
    body("date").trim().notEmpty().withMessage("boxCricketId required"),
  ];
  await Promise.all(validations.map((validation) => validation.run(req)));
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
    const { boxCricketId, date } = req.body;
    //console.log({ boxCricketId });
    let userBookings = await prisma.userbooking.findMany({
      where: {
        boxCricketId: boxCricketId as string,
      },
    });

    userBookings = userBookings.filter((booking) => {
      return (
        dayjs(date).format("DD/MM/YYYY") ===
        dayjs(booking.date).format("DD/MM/YYYY")
      );
    });

    res.status(200).json({ status: 200, userBookings });
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
