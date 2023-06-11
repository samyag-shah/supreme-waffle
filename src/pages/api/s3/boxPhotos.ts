// import { NextApiRequest, NextApiResponse, PageConfig } from "next";
// import multer from 'multer';
// const upload = multer({ dest: 'uploads/' });

// const { S3Client, CreateBucketCommand, PutObjectCommand } = require("@aws-sdk/client-s3");

// type Request1 = NextApiRequest & Request & {
//     files: any[]
// }
// export const config: PageConfig = {
// 	api: {
// 		bodyParser: false,
// 	},
// };

// const client = new S3Client({
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     },
//     region: process.env.S3_REGION,
// })

// export default async (req:NextApiRequest, res: NextApiResponse) => {
//     const bucketName = 'node-sdk-sample-1' 
//     const keyName = 'hello_world.txt'
    
//     const createCommand = new CreateBucketCommand({
//         Bucket: bucketName
//     })
    
//     const middleware = upload.single("icon")
//     middleware(req, res, async () => {
//         console.log({body: req.file})
//         return 
//     })
    
    
//     // const putCommand = new PutObjectCommand({
//     //     Bucket: bucketName,
//     //     Key: keyName,
//     //     Body: 'Hello World!'
//     // })
    
//     // try {
//     //     await client.send(createCommand)
//     //     const response = await client.send(putCommand)
//     //     console.log({response})
//     //     return res.json({status: 200, message: "success", response})
//     // } catch(err) {
//     //     console.error(err)
//     //     return res.json({status: 200, message: "error"})
//     // }

//     return res.json({status: 200, message: "what"})

     
// }
import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { createRouter } from "next-connect";
import multer from 'multer';

export const config: PageConfig = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
  };

interface NextApiRequest1 extends NextApiRequest {
    files: any[]
} 
const router = createRouter<NextApiRequest1, NextApiResponse>();

const upload = multer({
    storage: multer.diskStorage({
      destination: './public/uploads',
      filename: (req, file, cb) => cb(null, file.originalname),
    }),
  });


const uploadMiddleware = upload.array('files');

//wrong
router.use(uploadMiddleware as any)

router.post((req, res) => {
    console.log({files: req.files})
    //console.log({headers: req.headers})
    return res.status(200).json({message: "success", files: req.files});
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