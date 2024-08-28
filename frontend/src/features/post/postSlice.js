// src/features/posts/postSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../services/postService";

// Thunks for async actions
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async (page) => {
  const response = await api.fetchPosts(page);
  return response.data;
});

export const fetchPost = createAsyncThunk("posts/fetchPost", async (id) => {
  const response = await api.fetchPost(id);
  return response.data;
});

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (newPost) => {
    const response = await api.createPost(newPost);
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, updatedPost }) => {
    const response = await api.updatePost(id, updatedPost);
    return response.data;
  }
);

export const deletePost = createAsyncThunk("posts/deletePost", async (id) => {
  await api.deletePost(id);
  return id;
});

export const commentPost = createAsyncThunk(
  "posts/commentPost",
  async ({ id, comment }) => {
    const response = await api.commentPost(comment, id); // Passing comment first, then id
    return response.data;
  }
);

// Slice
const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    post: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload.data;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.post = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index >= 0) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(commentPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index >= 0) {
          state.posts[index] = action.payload;
        }
        // Update the single post state
        if (state.post && state.post._id === action.payload._id) {
          state.post = action.payload;
        }
      });
  },
});

export default postSlice.reducer;
