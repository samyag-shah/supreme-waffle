import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
const { Readable } = require('stream');

import { createRouter } from "next-connect";
import multer from 'multer';

import { PrismaClient } from '@prisma/client';
const { S3Client } = require("@aws-sdk/client-s3");
import { Upload } from "@aws-sdk/lib-storage";

import jwt from 'jsonwebtoken'


export const config : PageConfig = {
    api : {
        bodyParser: false
    }
}
interface NextApiRequest1 extends NextApiRequest {
    files: any[]
}  
const prisma = new PrismaClient()
const router = createRouter<NextApiRequest1, NextApiResponse>()

const client = new S3Client({
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.NEXT_PUBLIC_S3_REGION,
})

const storage = multer.memoryStorage()
const upload = multer({storage}).array('files')

//wrong types of multer
router.use(upload as any)

router.post(async (req, res) => {
    console.log({body: req.body, file : req.files})
        try { 
          const {
            ownerEmail, 
            ownerPhone, 
            ownerName, 
            boxCricketName, 
            boxCricketAddress, 
            boxCricketState,
            boxCricketCity,
            boxCricketArea,
            boxCricketLandmark,
            bookingSlots,
            minSlotPrice,
            maxSlotPrice,
            boxCricketFacilities
        } 
           = req.body

        const boxCricketImages1: any[] = []
        req.files.map(async (file, index) => {
            const buffer = file.buffer
            const stream = Readable.from(buffer);

            let extenstion = file.mimetype.split("/")[1]
            const uniqueSuffix = Date.now() +'-' + Math.round(Math.random()*1E9)
            const fileName = file.fieldname + '-' + uniqueSuffix + '.' + extenstion

            const upload = new Upload({
                client: client,
                params: {
                    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
                    Key: fileName,
                    Body: stream,
                    ContentType: 'text/plain',
                },
            });
        
            await upload.done()
            boxCricketImages1.push(process.env.S3_ACCESS_URL + fileName)
            if(index === req.files.map.length-1){
            //db create
            const newOwner = await prisma.owner.create({
                    data : {
                        ownerName,
                        ownerEmail,
                        ownerPhone,
                        Boxcrickets: {
                            create: [{
                                boxCricketName, 
                                boxCricketAddress, 
                                boxCricketState,
                                boxCricketCity,
                                boxCricketArea,
                                boxCricketLandmark,
                                minSlotPrice: parseInt(minSlotPrice),
                                maxSlotPrice: parseInt(maxSlotPrice),
                                boxCricketFacilities,
                                boxCricketImages: boxCricketImages1, 
                                bookingSlots: JSON.parse(bookingSlots)
                                }
                            ]
                        } 
                    }
            })
            //create Token
            const payload = {
                ownerPhone, 
                ownerId: newOwner.id,
                exp: Date.now()/1000 + 24*60*60
            } 
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY || "")
                return res.json({status: 201, newOwner, token})
            }   
        })             
        } catch(err: unknown){
          console.error({err})
          return res.status(500).json({status: 500, message : "something went wrong", err})
        } 
})

export default router.handler({
    onError: (err, req, res) => {
      //console.error(err?.stack);
      //res.status(err?.statusCode || 500).end(err?.message);
      return res.status(500).json({status: 500, message: "error", err});
    }, onNoMatch: (req, res) => {
        //console.error(err?.stack);
        //res.status(err?.statusCode || 500).end(err?.message);
        return res.json({status: 405, message: "no method found"});
      },
  });