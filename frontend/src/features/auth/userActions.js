// userSlice.js or userActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to fetch user by ID
export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/users/${userId}`);
      return response.data; // This will include `postCount`
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
