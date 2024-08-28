import express from "express";
import mongoose from "mongoose";

import Posts from "../models/PostModels.js";

const router = express.Router();

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

    const total = await Posts.countDocuments({});
    const posts = await Posts.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.json({
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

  const newPostMessage = new Posts({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPostMessage.save();

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

export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Posts.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push(value);
    const updatedPost = await Posts.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
