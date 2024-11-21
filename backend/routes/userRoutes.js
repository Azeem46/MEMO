import express from "express";
import rateLimit from "express-rate-limit";
const router = express.Router();

import {
  signin,
  signup,
  logoutUser,
  getUserById,
  uploadProfilePic,
} from "../controllers/UserContollers.js";
import validateUser from "../middleware/validateUser.js";
import upload from "../middleware/multerConfig.js"; // Import Multer-Cloudinary configuration
// Rate limiter for signin and signup routes
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // Limit each IP to 5 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.',
// });
router.post(
  "/upload-profile-pic",
  upload.single("profilePic"),
  uploadProfilePic
);
router.post("/signin", signin);
router.post("/signup", validateUser, signup);
router.post("/logout", logoutUser);
router.get("/:id", getUserById);

export default router;
