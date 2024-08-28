// src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from '../src/features/auth/authSlice';
import postReducer from '../src/features/post/postSlice'; // Import your post slice

// Persist config
const persistConfig = {
  key: 'root',
  storage,
};

// Root reducer with persistReducer
const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  posts: postReducer, // Add post reducer here
});

// Configure store
const store = configureStore({
  reducer: rootReducer,  // Use rootReducer directly, not wrapped in an object
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
