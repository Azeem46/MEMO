import express from "express";
import {
  createBookmark,
  getBookmarks,
  removeBookmark,
} from "../controllers/bookmarkController.js";
import auth from "../middleware/auth.js"; // Assuming you have auth middleware to protect routes

const router = express.Router();

// Route to create a bookmark
router.post("/", auth, createBookmark);

// Route to get all bookmarks of a user
router.get("/", auth, getBookmarks);

// Route to remove a bookmark
router.delete("/:id", auth, removeBookmark);

export default router;
