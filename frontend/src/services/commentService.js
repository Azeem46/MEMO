// src/services/commentService.js

import axios from "axios";

// Create an axios instance
const API = axios.create({ baseURL: "http://localhost:5000" });

// Set up request interceptor to include auth token
API.interceptors.request.use((req) => {
  const storedProfile = localStorage.getItem("persist:root");
  console.log("Stored Profile (Raw):", storedProfile); // Log the raw stored profile

  if (storedProfile) {
    const parsedProfile = JSON.parse(storedProfile)?.user;
    console.log("Parsed Profile:", parsedProfile); // Log the parsed profile

    if (parsedProfile) {
      const userProfile = JSON.parse(parsedProfile);
      console.log("User Profile:", userProfile); // Log the user profile

      if (userProfile?.token) {
        console.log("Auth Token (Before Setting Header):", userProfile.token); // Log the token before setting the header
        req.headers.Authorization = `Bearer ${userProfile.token.replace(
          /"/g,
          ""
        )}`;
        console.log("Request Headers After Setting 111:", req.headers); // Log the request headers after setting the token
      } else {
        console.log("Token is missing or undefined in User Profile."); // Log if token is missing
      }
    } else {
      console.log("Parsed Profile is undefined or null."); // Log if parsedProfile is null/undefined
    }
  } else {
    console.log("No stored profile found in localStorage."); // Log if storedProfile is null/undefined
  }

  return req;
});

// Define comment-related API methods
export const fetchComments = (commentId) => API.get(`/comments/${commentId}`);
export const createComment = (newComment) => API.post("/comments", newComment);
export const deleteComment = (id) => API.delete(`/comments/${id}`);
export const updateComment = (id, text) =>
  API.patch(`/comments/${id}`, { text });
