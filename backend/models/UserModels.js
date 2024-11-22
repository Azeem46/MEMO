import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  id: { type: String },
  postCount: {
    type: Number,
    default: 0, // Initialize to 0
  },
  profilePic: { type: String }, // New field for profile picture URL or path
});

export default mongoose.model("User", userSchema);
