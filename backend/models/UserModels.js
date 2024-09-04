import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  joinDate: {
    type: Date,
    default: Date.now, // Automatically set the current date
  },
  id: { type: String },
});

export default mongoose.model("User", userSchema);
