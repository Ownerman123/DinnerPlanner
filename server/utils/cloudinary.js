import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import streamifier from 'streamifier';

dotenv.config({path: './../.env'});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const uploadToCloudinary = async (fileBuffer) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "avatars" }, // Folder in Cloudinary
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Convert buffer to readable stream and pipe to Cloudinary
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });

    return result.secure_url; // Return the secure URL from Cloudinary
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
};