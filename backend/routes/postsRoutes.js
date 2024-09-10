import express from "express";

import {
  getPosts,
  getPostsBySearch,
  getPostsByCreator,
  getPost,
  createPost,
  updatePost,
  likePost,
  // commentPost,
  deletePost,
  incrementViews,
  getLatestPosts,
} from "../controllers/PostsControllers.js";

const router = express.Router();
import auth from "../middleware/auth.js";

router.get("/latest", auth, getLatestPosts);
router.get("/creator", getPostsByCreator);
router.get("/search", getPostsBySearch);
router.get("/", getPosts);
router.get("/:id", getPost);
router.patch("/:id/view", incrementViews);

router.post("/", auth, createPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost);

// router.post("/:id/commentPost", commentPost);

export default router;
