import { createSlice } from "@reduxjs/toolkit";
import { fetchUserById } from "./userActions";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null, status: "idle", error: null },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    incrementPostCount: (state) => {
      if (state.user) {
        state.user.postCount = (state.user.postCount || 0) + 1;
      }
    },
    decrementPostCount: (state) => {
      if (state.user && state.user.postCount > 0) {
        state.user.postCount -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload }; // Merge new data with existing user data
        state.status = "succeeded";
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      });
  },
});

export const {
  setCredentials,
  logout,
  incrementPostCount,
  decrementPostCount,
} = authSlice.actions;

export default authSlice.reducer;
