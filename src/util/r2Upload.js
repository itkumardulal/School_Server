const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const { r2Config } = require("../config/config");


const s3 = new S3Client({
  region: r2Config.region,
  endpoint: r2Config.endpoint,
  credentials: {
    accessKeyId: r2Config.accessKeyId,
    secretAccessKey: r2Config.secretAccessKey,
  },
});

const uploadToR2 = async (file) => {
  const fileStream = fs.createReadStream(file.path);
  const fileName = `${uuid()}-${file.originalname}`;

  const uploadCommand = new PutObjectCommand({
    Bucket: r2Config.bucket,
    Key: fileName,
    Body: fileStream,
    ContentType: file.mimetype,
  });

  await s3.send(uploadCommand);
  fs.unlinkSync(file.path); // delete local file after upload

  // Construct public URL based on Cloudflare R2 endpoint and bucket
  const publicUrl = `${r2Config.publicUrl}/${fileName}`;

  return {
    fileName,
    fileUrl: publicUrl,
  };
};

module.exports = uploadToR2;
