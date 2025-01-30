import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import dotenv from "dotenv";
dotenv.config();

// TODO : env variables are not working you need to hardcode info
// const accessKeyId = process.env.ACCESS_KEY_ID;
// const secretAccessKey = process.env.SECRET_ACCESS_KEY;
// const bucketName = process.env.BUCKET_NAME;

const accessKeyId = "YOUR_ACCESS_KEY_ID_FROM_AWS";
const secretAccessKey = "YOUR_SECRET_ACCESS_KEY_FROM_AWS";
const bucketName = "YOUR_BUCKET_NAME_FROM_AWS";

if (!accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error("Missing AWS credentials in environment variables");
}

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

// Todo : improve type checks of all parameters

export async function getObjURL(key: any) {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    const url = await getSignedUrl(s3Client, command);
    return url;
}

export async function putObjURL(filename: any, contentType: any) {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `uploads/user-uploads/${filename}`,
        ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command);
    console.log(url);
    return url;
}
