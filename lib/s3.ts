// src/lib/s3.ts
import AWS from "aws-sdk";

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
});

export async function uploadToS3(
    key: string,
    body: Buffer | Uint8Array | Blob | string,
    contentType: string
) {
    await s3
        .putObject({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: key,
            Body: body,
            ContentType: contentType,
            ACL: "public-read",
        })
        .promise();

    return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
}
