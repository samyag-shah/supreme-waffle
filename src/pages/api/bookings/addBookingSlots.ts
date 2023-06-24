import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { body, matchedData, validationResult } from "express-validator";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = createRouter<NextApiRequest, NextApiResponse>();

//validate request data
router.use(async (req, res, next) => {
  //console.log({body : typeof req.body.date})
  const validations = [
    body("date")
      .trim()
      .notEmpty()
      .withMessage("date should not be empty")
      .isString()
      .withMessage("date should be string"),
    body("slots").trim().notEmpty().withMessage("slots can't be empty"),
    body("boxCricketId")
      .trim()
      .notEmpty()
      .withMessage("boxCricketId can't be empty"),
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

//make api call once data is validated
router.post(async (req, res) => {
  //const {date, slots, boxCricketId} = matchedData(req)

  try {
    const { date, slots, boxCricketId } = req.body;
    console.log({ date, slots, boxCricketId });

    //check if booking already exists
    const booking = await prisma.booking.findFirst({
      where: {
        date,
        boxCricketId,
      },
    });
    if (booking) {
      res.status(200).json({ status: 200, message: "booking already exist" });
    } else {
      //create new booking as it does not exists
      const booking = await prisma.booking.create({
        data: {
          date,
          slots: JSON.parse(slots),
          boxCricketId,
        },
      });
      return res
        .status(201)
        .json({ status: 201, message: "booking created", booking });
    }
  } catch (err) {
    console.error(err);
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
