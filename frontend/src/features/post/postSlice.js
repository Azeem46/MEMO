// src/features/posts/postSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../services/postService";
import * as commentApi from "../../services/commentService";

// Thunks for async actions
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async (page) => {
  const response = await api.fetchPosts(page);
  return response.data;
});

export const fetchPostById = createAsyncThunk(
  "posts/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.fetchPost(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

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

export const likePost = createAsyncThunk("posts/likePost", async (id) => {
  const response = await api.likePost(id);
  return response.data;
});

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId) => {
    const response = await commentApi.fetchComments(postId);
    return response.data;
  }
);

export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ postId, text }) => {
    const response = await commentApi.createComment({ postId, text });
    return response.data;
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (id) => {
    await commentApi.deleteComment(id);
    return id;
  }
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ id, text }) => {
    const response = await commentApi.updateComment(id, text);
    return response.data;
  }
);

export const incrementPostViews = createAsyncThunk(
  "posts/incrementPostViews",
  async (id) => {
    const response = await api.incrementViews(id);
    return response.data;
  }
);

export const fetchBookmarks = createAsyncThunk(
  "posts/fetchBookmarks",
  async (userId) => {
    const response = await api.fetchBookmarks(userId);
    return response.data;
  }
);

export const createBookmark = createAsyncThunk(
  "posts/createBookmark",
  async (postId) => {
    const response = await api.createBookmark(postId);

    return response.data;
  }
);

export const removeBookmark = createAsyncThunk(
  "posts/removeBookmark",
  async (bookmarkId) => {
    const response = await api.removeBookmark(bookmarkId);
    return response.data;
  }
);

export const fetchLatestPosts = createAsyncThunk(
  "posts/fetchLatestPosts",
  async () => {
    const response = await api.fetchLatestPosts();
    return response.data;
  }
);

export const clearPost = () => (dispatch) => {
  dispatch({ type: "CLEAR_POST" });
};

// Slice
const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    post: null,
    hasMore: true,
    comments: [], // Added comments array to state
    status: "idle",
    error: null,
    bookmarks: [],
    latestPosts: [],
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
        state.posts = [action.payload, ...state.posts]; // Prepend new post
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
      .addCase(likePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index >= 0) {
          state.posts[index] = action.payload;
        }
      })
      // Comment-related reducers
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload._id
        );
        if (index >= 0) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(incrementPostViews.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index >= 0) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(createBookmark.fulfilled, (state, action) => {
        // Assuming you're adding the bookmark to the post's bookmark list
        const post = state.posts.find(
          (post) => post._id === action.payload.post._id
        );
        if (post) {
          post.bookmarked = true; // mark the post as bookmarked
        }
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.bookmarks = state.bookmarks.filter(
          (bookmark) => bookmark._id !== action.payload._id
        );
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.bookmarks = action.payload; // Store all bookmarks
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.currentPost = action.payload;
      })
      .addCase(fetchLatestPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLatestPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.latestPosts = action.payload;
      })
      .addCase(fetchLatestPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase("CLEAR_POST", (state) => {
        state.post = null;
      });
  },
});

export default postSlice.reducer;
