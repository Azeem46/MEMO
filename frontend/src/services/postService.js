import axios from "axios";

// Create an axios instance
const API = axios.create({ baseURL: "http://localhost:5000" }); // Replace with your backend URL

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
        console.log("Request Headers After Setting Token:", req.headers); // Log the request headers after setting the token
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
