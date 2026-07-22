import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

const uploadOnCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!buffer) return resolve(null);
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", ...options },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );
    stream.end(buffer);
  });
};

export const deleteFromCloudinary = async (url) => {
  if (!url) return;
  const segments = url.split("/");
  const fileWithExt = segments.at(-1);
  const folder = segments.at(-2);
  if (!fileWithExt || !folder) return;
  const publicId = `${folder}/${fileWithExt.replace(/\.[^.]+$/, "")}`;
  await cloudinary.uploader.destroy(publicId);
};

export default uploadOnCloudinary;
