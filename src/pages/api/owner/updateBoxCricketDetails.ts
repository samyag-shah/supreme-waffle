import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
import { createRouter } from "next-connect";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(async (req, res, next) => {
  //console.log({boxCricketId: req.query.boxCricketId})
  let validations;
  if (req.body.bookingSlots) {
    validations = [
      body("bookingSlots")
        .trim()
        .notEmpty()
        .withMessage("bookingSlots is required"),
      body("boxCricketId")
        .trim()
        .notEmpty()
        .withMessage("boxCricketId is required"),
    ];
  } else {
    validations = [
      body("boxCricketName")
        .trim()
        .notEmpty()
        .withMessage("boxCricketName is required"),
      body("boxCricketAddress")
        .trim()
        .notEmpty()
        .withMessage("boxCricketAddress is required"),
      body("boxCricketState")
        .trim()
        .notEmpty()
        .withMessage("boxCricketState is required"),
      body("boxCricketCity")
        .trim()
        .notEmpty()
        .withMessage("boxCricketCity is required"),
      body("boxCricketArea")
        .trim()
        .notEmpty()
        .withMessage("boxCricketArea is required"),
      body("boxCricketLandmark")
        .trim()
        .notEmpty()
        .withMessage("boxCricketLandmark is required"),
      body("boxCricketFreeFacilities")
        .trim()
        .notEmpty()
        .withMessage("boxCricketFreeFacilities is required"),
      body("boxCricketPaidFacilities")
        .trim()
        .notEmpty()
        .withMessage("boxCricketPaidFacilities is required"),
      body("boxCricketId")
        .trim()
        .notEmpty()
        .withMessage("boxCricketId is required"),
    ];
  }
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
    const {
      boxCricketName,
      boxCricketAddress,
      boxCricketState,
      boxCricketCity,
      boxCricketArea,
      boxCricketLandmark,
      boxCricketFreeFacilities,
      boxCricketPaidFacilities,
      boxCricketId,
      bookingSlots,
    } = req.body;

    let newData;
    if (bookingSlots) {
      newData = {
        bookingSlots: JSON.parse(bookingSlots),
      };
    } else {
      newData = {
        boxCricketName,
        boxCricketAddress,
        boxCricketState,
        boxCricketCity,
        boxCricketArea,
        boxCricketLandmark,
        boxCricketFreeFacilities,
        boxCricketPaidFacilities,
      };
    }
    const updatedBoxCricket = await prisma.boxcricket.update({
      where: {
        id: boxCricketId,
      },
      data: newData,
    });

    if (updatedBoxCricket) {
      res.status(200).json({ status: 200, updatedBoxCricket });
    } else {
      res.status(404).json({ status: 404, message: "boxCricket not found" });
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
