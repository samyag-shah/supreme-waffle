import { S3Client} from "@aws-sdk/client-s3";

const client = new S3Client({
    credentials : {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || ""
    },
    region: process.env.NEXT_PUBLIC_S3_REGION
})

export default client