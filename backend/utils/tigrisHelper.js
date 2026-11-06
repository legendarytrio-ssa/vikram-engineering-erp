import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import tigris from "../config/tigris.js";

/**
 * Uploads an array of multer files to Tigris and returns an array of AttachmentSchema-compatible objects.
 */
export const uploadFilesToTigris = async (files, folderPath) => {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map(async (file) => {
    // Sanitize file name to prevent object key issues
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileKey = `${folderPath}/${Date.now()}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await tigris.send(command);

    // Matches the structure of your shared/common.js AttachmentSchema
    return {
      key: fileKey,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  });

  return Promise.all(uploadPromises);
};

/**
 * Generates a 5-minute pre-signed download URL for a specific file key.
 */
export const getDownloadUrl = async (fileKey, originalName) => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileKey,
    ResponseContentDisposition: `attachment; filename="${originalName}"`,
  });

  return getSignedUrl(tigris, command, { expiresIn: 300 });
};

export const deleteFileFromTigris = async (fileKey) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    });
    await tigris.send(command);
    return true;
  } catch (error) {
    console.error("Tigris deletion error:", error);
    throw error;
  }
};

export const getViewUrl = async (fileKey, originalName) => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileKey,
    ResponseContentDisposition: `inline; filename="${originalName}"`,
  });

  return getSignedUrl(tigris, command, { expiresIn: 300 });
};