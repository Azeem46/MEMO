import express from "express";
import {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} from "../controllers/commentsController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create a new comment
router.post("/", auth, createComment);

// Get comments for a specific post
router.get("/:postId", getCommentsByPost);

// Update a comment
router.patch("/:id", auth, updateComment);

// Delete a comment
router.delete("/:id", auth, deleteComment);

export default router;
