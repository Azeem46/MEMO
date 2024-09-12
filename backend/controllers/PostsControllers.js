import express from "express";
import mongoose from "mongoose";
import User from "../models/UserModels.js";
import Posts from "../models/PostModels.js";
import Bookmark from "../models/BookmarkModels.js";
import Comment from "../models/comment.js";

const router = express.Router();

export const getPosts = async (req, res) => {
  const { page } = req.query;
  const LIMIT = 6;
  const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

  try {
    const total = await Posts.countDocuments({});
    const posts = await Posts.find()
      .sort({ views: -1 }) // Sort by views in descending order
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, "i");

    const posts = await Posts.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsByCreator = async (req, res) => {
  const { name } = req.query;

  try {
    const posts = await Posts.find({ name });

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Posts.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  try {
    // Fetch the user's name from the User model
    const user = await User.findById(req.userId);
    const creatorName = user ? user.name : "Unknown"; // Fallback if user is not found

    const newPostMessage = new Posts({
      ...post,
      creator: req.userId,
      creatorName, // Add creatorName here
      createdAt: new Date().toISOString(),
    });

    await newPostMessage.save();

    // Increment the post count for the user
    await User.findByIdAndUpdate(req.userId, { $inc: { postCount: 1 } });

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, creator, selectedFile, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

  await Posts.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  // Check if the post ID is valid
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  // Find the post by ID
  const post = await Posts.findById(id);

  // If the post doesn't exist
  if (!post) return res.status(404).send("Post not found");

  // Check if the user trying to delete the post is the creator of the post
  if (post.creator.toString() !== req.userId) {
    return res
      .status(403)
      .json({ message: "You do not have permission to delete this post." });
  }

  // Delete the post if the user is authorized
  await Posts.findByIdAndRemove(id);

  // Decrement the post count for the user
  await User.findByIdAndUpdate(req.userId, { $inc: { postCount: -1 } });

  await Bookmark.deleteMany({ post: id });

  await Comment.deleteMany({ postId: id });

  res.json({ message: "Post deleted successfully." });
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await Posts.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await Posts.findByIdAndUpdate(id, post, { new: true });

  res.status(200).json(updatedPost);
};

export const incrementViews = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the post by ID
    const post = await Posts.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Increment the views count
    post.views += 1;

    // Save the updated post
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getLatestPosts = async (req, res) => {
  try {
    const latestPosts = await Posts.find().sort({ createdAt: -1 }).limit(10); // Adjust limit as needed
    res.json(latestPosts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch latest posts" });
  }
};
