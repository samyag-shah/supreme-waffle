import { NextApiRequest, NextApiResponse, PageConfig } from "next";
const { Readable } = require("stream");

import { createRouter } from "next-connect";
import { PrismaClient } from "@prisma/client";
import { Upload } from "@aws-sdk/lib-storage";

import multer from "multer";
import { body, validationResult } from "express-validator";

const { S3Client } = require("@aws-sdk/client-s3");

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
interface NextApiRequest1 extends NextApiRequest {
  files: any[];
}

const prisma = new PrismaClient();
const router = createRouter<NextApiRequest1, NextApiResponse>();

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.NEXT_PUBLIC_S3_REGION,
});

const storage = multer.memoryStorage();
const upload = multer({ storage }).array("files");

//wrong types of multer
router.use(upload as any);

router.use(async (req, res, next) => {
  const validations = [
    body("ownerId").trim().notEmpty().withMessage("ownerId is required"),
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
    body("bookingSlots")
      .trim()
      .notEmpty()
      .withMessage("bookingSlots is required"),
    body("minSlotPrice")
      .trim()
      .notEmpty()
      .withMessage("minSlotPrice is required"),
    body("maxSlotPrice")
      .trim()
      .notEmpty()
      .withMessage("maxSlotPrice is required"),
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
  const {
    boxCricketName,
    boxCricketAddress,
    boxCricketState,
    boxCricketCity,
    boxCricketArea,
    boxCricketLandmark,
    boxCricketFreeFacilities,
    boxCricketPaidFacilities,
    bookingSlots,
    minSlotPrice,
    maxSlotPrice,
    ownerId,
  } = req.body;

  try {
    const boxCricketImages1: any[] = [];

    req.files.map(async (file, index) => {
      const buffer = file.buffer;
      const stream = Readable.from(buffer);

      let extenstion = file.mimetype.split("/")[1];
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = file.fieldname + "-" + uniqueSuffix + "." + extenstion;

      const upload = new Upload({
        client: client,
        params: {
          Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
          Key: fileName,
          Body: stream,
          ContentType: "text/plain",
        },
      });

      await upload.done();
      boxCricketImages1.push(process.env.S3_ACCESS_URL + fileName);
      if (index === req.files.map.length - 1) {
        //db create
        const newBoxCricket = await prisma.boxcricket.create({
          data: {
            ownerId,
            boxCricketName,
            boxCricketAddress,
            boxCricketState,
            boxCricketCity,
            boxCricketArea,
            boxCricketLandmark,
            minSlotPrice: parseInt(minSlotPrice),
            maxSlotPrice: parseInt(maxSlotPrice),
            boxCricketFreeFacilities,
            boxCricketPaidFacilities,
            boxCricketImages: boxCricketImages1,
            bookingSlots: JSON.parse(bookingSlots),
          },
        });

        return res.json({ status: 201, newBoxCricket });
      }
    });
    //return res.json({ status: 500, message: "something went wrong" });
  } catch (err: unknown) {
    console.error({ err });
    return res
      .status(500)
      .json({ status: 500, message: "something went wrong", err });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    //console.error(err?.stack);
    //res.status(err?.statusCode || 500).end(err?.message);
    return res.status(500).json({ status: 500, message: "error", err });
  },
  onNoMatch: (req, res) => {
    //console.error(err?.stack);
    //res.status(err?.statusCode || 500).end(err?.message);
    return res.json({ status: 405, message: "no method found" });
  },
});
