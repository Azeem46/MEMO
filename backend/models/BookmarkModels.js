import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" },
  createdAt: { type: Date, default: Date.now },
});

const BookMark = mongoose.model("Bookmark", bookmarkSchema);
export default BookMark;
