import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import dotenv from "dotenv";
dotenv.config();

// TODO : env variables are not working

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID as string,
        secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
    },
});

// Todo : type checks of all parameters

export async function getObjURL(key: any) {
    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME as string,
        Key: key,
    });

    const url = await getSignedUrl(s3Client, command);
    return url;
}

export async function putObjURL(filename: any, contentType: any) {
    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME as string,
        Key: `uploads/user-uploads/${filename}`,
        ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command);
    console.log(url);
    return url;
}
