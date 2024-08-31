import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store, { persistor } from "./store.js";
import HomeScreen from "./screens/HomeScreen.jsx";
import App from "./App.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import "./index.css";
import LoginScreen from "./screens/LoginScreen.jsx";
import PrivateRoute from "../src/components/PrivateRoute.jsx";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "react-query";
import queryclient from "./queryclient.js";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import PostList from "./components/PostList.jsx";
import PostForm from "./components/PostForm.jsx";
import PostDetails from "./components/PostDetails.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>
      <Route path="/" element={<PostList />} />
      <Route path="/create" element={<PostForm />} />
      <Route path="/edit/:id" element={<PostForm />} />
      <Route path="/posts/:id" element={<PostDetails />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryclient}>
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);
