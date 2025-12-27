import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CONFIG } from "../config/cloudinary.config.js";

// Configuration
cloudinary.config(CLOUDINARY_CONFIG);

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
