import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();
const prisma = new PrismaClient();

router.use(async (req, res, next) => {
  const validations = [
    //body("date").trim().notEmpty().withMessage("date is required"),
    body("bookingId").trim().notEmpty().withMessage("booking Id is required"),
    body("slots").trim().notEmpty().withMessage("slots can't be empty"),
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
    //const { date, boxCricketId, slots } = req.body;
    const { bookingId, slots } = req.body;
    //console.log({ slots });
    // const booking = await prisma.booking.findFirst({
    //   where: {
    //     boxCricketId,
    //     date,
    //   },
    // });
    let booking1;
    //if (booking) {
    booking1 = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        //date,
        //boxCricketId,
        slots: JSON.parse(slots),
      },
    });
    //}

    res.json({ status: 200, message: "booking updated", booking1 });
    // if (booking1) {
    //   res.json({ statusCode: 200, message: "booking updated", booking });
    // } else {
    //   res.json({ statusCode: 404, message: "Not Found", booking });
    // }
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
