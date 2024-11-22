import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: String,
  message: String,
  name: String,
  tags: [String],
  selectedFile: String,
  likes: { type: [String], default: [] },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  views: {
    type: Number,
    default: 0, // Initialize with 0 views
  },
  creatorName: String,
});

const Posts = mongoose.model("Posts", postSchema);

export default Posts;
