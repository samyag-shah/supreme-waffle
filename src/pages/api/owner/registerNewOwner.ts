import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { createRouter } from "next-connect";
import multer from 'multer';
import path from 'path';
import { PrismaClient } from '@prisma/client';
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
import * as fs from 'node:fs/promises';

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

const storage = multer.diskStorage({
                destination: path.join("src", "pages", "api", "uploads"),
                filename: function (req, file, cb) {
                    console.log({file})
                    let extenstion = file.mimetype.split("/")[1]
                    const uniqueSuffix = Date.now() +'-' + Math.round(Math.random()*1E9)
                    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extenstion)
                }
            })
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
            boxCricketImages,
            bookingSlots,
            minSlotPrice,
            maxSlotPrice,
            boxCricketFacilities
        } 
           = req.body
            
        const boxCricketImages1: any[] = []
        req.files.map(file => {
            boxCricketImages1.push(file.filename)    
        })
        
            //s3 upload
            // const fileContent = await fs.readFile(path.join("public", "uploads", req.file.filename))
            // const putCommand = new PutObjectCommand({
            //     Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
            //     Key: req.file.filename,
            //     Body: fileContent
            // })
            
            // //s3 upload file
            // await client.send(putCommand)
            // //remove local file
            // await fs.unlink(path.join("public", "uploads", req.file.filename))


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
            
            return res.json({status: 201, newOwner})
             
        } catch(err: unknown){
          console.error({err})
          return res.status(500).json({status: 500, message : "something went wrong", err})
        } 
})

export default router.handler({
    onError: (err, req, res) => {
      //console.error(err?.stack);
      //res.status(err?.statusCode || 500).end(err?.message);
      return res.status(500).json({message: "error", err});
    }, onNoMatch: (req, res) => {
        //console.error(err?.stack);
        //res.status(err?.statusCode || 500).end(err?.message);
        return res.status(500).json({message: "no method found with such request"});
      },
  });