import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../cloudinaryConfig.js"; // Import your Cloudinary configuration

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile-pics", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed file types
    transformation: [{ width: 300, height: 300, crop: "limit" }], // Optional: Resize images
  },
});

// Create Multer instance
const upload = multer({ storage });

export default upload;
