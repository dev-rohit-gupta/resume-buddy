import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryConfig } from "../config/cloudinary.config.js";

// Configuration
let isInitialized = false;

export function initCloudinary() {
  if (isInitialized) return;

  cloudinary.config(getCloudinaryConfig());
  isInitialized = true;
}

export function uploadToCloudinary(file: Express.Multer.File, folder: string) {
  return new Promise<{ id: string; resourceType: string; extension: string }>((resolve, reject) => {
    const EXTENSION = file.originalname.split(".").pop()?.toLowerCase();
    if (!EXTENSION) throw new Error("only pdf and  docx are allowed");
    cloudinary.uploader
      .upload_stream({ resource_type: "raw", folder }, (error, result) => {
        if (error) return reject(error);
        if (!result?.public_id) {
          return reject(new Error("Upload failed"));
        }

        resolve({
          id: result.public_id,
          resourceType: result.resource_type,
          extension: EXTENSION,
        });
      })
      .end(file.buffer);
  });
}

export function deleteFromCloudinary(publicId: string) {
  return new Promise<void>((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { resource_type: "raw" }, (error, result) => {
      if (error) return reject(error);
      resolve();
    });
  });
}
export function getResumeUrl(publicId: string, extension: string) {
  return cloudinary.url(publicId, {
    resource_type: "raw",
    flags: "attachment",
    sign_url: true,
    format: extension,
    expires_at: Math.floor(Date.now() / 1000) + 300,
  });
}
