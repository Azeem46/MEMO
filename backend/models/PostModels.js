import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    name: String,
    tags: [String],
    selectedFile: String,
    likes: { type: [String], default: [] },
    comments: { type: [String], default: [] },
    createdAt: {
        type: Date,
        default: new Date(),
    },
     creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

const Posts = mongoose.model('Posts', postSchema);

export default Posts;