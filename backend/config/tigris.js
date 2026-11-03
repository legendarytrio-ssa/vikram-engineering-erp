import dotenv from "dotenv"
dotenv.config()
import { S3Client } from "@aws-sdk/client-s3";

const tigris = new S3Client({
  region: "auto",

  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: true,

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default tigris;