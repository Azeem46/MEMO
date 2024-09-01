import Comment from "../models/comment.js";
import Post from "../models/PostModels.js";

// Create a new comment
export const createComment = async (req, res) => {
  const { postId, text } = req.body;
  const userId = req.userId; // Assume `req.userId` is set by the auth middleware

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = new Comment({
      postId,
      userId,
      text,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comments by postId
export const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId }).populate("userId", "name"); // Populate user info
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.userId;

  try {
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this comment" });
    }

    comment.text = text;
    comment.updatedAt = Date.now();

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(id);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
