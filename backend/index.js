import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/postsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoute from "./routes/commentsRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";

const app = express();
dotenv.config();

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite local development
      "https://memo-five-beta.vercel.app", // Vercel production
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true, // If you're using cookies for authentication
  })
);

// Routes
app.use("/posts", postRoutes);
app.use("/user", userRoutes);
app.use("/comments", commentRoute);
app.use("/bookmarks", bookmarkRoutes);

const PORT = process.env.PORT || 5000;

// Mongoose connection
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
