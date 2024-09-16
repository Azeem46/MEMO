import axios from "axios";

// Create an axios instance
const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({ baseURL: API_URL }); // Replace with your backend URL

// Set up request interceptor to include auth token
API.interceptors.request.use((req) => {
  const storedProfile = localStorage.getItem("persist:root");

  if (storedProfile) {
    const parsedProfile = JSON.parse(storedProfile)?.user;

    if (parsedProfile) {
      const userProfile = JSON.parse(parsedProfile);

      if (userProfile?.token) {
        req.headers.Authorization = `Bearer ${userProfile.token.replace(
          /"/g,
          ""
        )}`;
      }
    }
  }

  return req;
});

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
export const updatePost = (id, updatedPost) =>
  API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
// src/services/postService.js
// src/services/postService.js
export const incrementViews = (id) => API.patch(`/posts/${id}/view`);
export const fetchBookmarks = () => API.get(`/bookmarks`);
export const createBookmark = (postId) => API.post(`/bookmarks`, { postId });
export const removeBookmark = (bookmarkId) =>
  API.delete(`/bookmarks/${bookmarkId}`);
export const fetchLatestPosts = () => API.get(`/posts/latest`);
