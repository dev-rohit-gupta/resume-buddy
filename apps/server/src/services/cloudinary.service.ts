import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryConfig } from "../config/cloudinary.config.js";

// Configuration
let isInitialized = false;

export function initCloudinary() {
  if (isInitialized) return;

  cloudinary.config(getCloudinaryConfig());
  isInitialized = true;
}

export function uploadToCloudinary(file: Buffer, folder: string) {
  return new Promise<{url: string , id : string}>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "raw", folder }, (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url) {
          return reject(new Error("Upload failed"));
        }
        resolve({ url: result.secure_url, id: result.public_id });
      })
      .end(file);
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
