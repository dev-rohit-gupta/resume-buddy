import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CONFIG } from "../config/cloudinary.config.js";

// Configuration
cloudinary.config(CLOUDINARY_CONFIG);

export function uploadToCloudinary(file: Buffer, folder: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "raw", folder }, (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url) {
          return reject(new Error("Upload failed"));
        }
        resolve(result.secure_url);
      })
      .end(file);
  });
}
