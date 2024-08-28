// src/services/postService.js

import axios from "axios";

// Create an axios instance
const API = axios.create({ baseURL: "http://localhost:5000" }); // Replace with your backend URL

// Set up request interceptor to include auth token
API.interceptors.request.use(
  (req) => {
    const root = localStorage.getItem("token");

    if (root) {
      req.headers.Authorization = `Bearer ${root}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define API methods
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPostsBySearch = (searchQuery) =>
  API.get(
    `/posts/search?searchQuery=${searchQuery.search || "none"}&tags=${
      searchQuery.tags
    }`
  );
export const createPost = (newPost) => API.post("/posts", newPost);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const commentPost = (value, id) =>
  API.post(`/posts/${id}/commentPost`, { value });
export const updatePost = (id, updatedPost) =>
  API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
