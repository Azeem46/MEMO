import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit"; // uncommented
import cron from "node-cron"; // Add node-cron
import postRoutes from "./routes/postsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoute from "./routes/commentsRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";

const app = express();
dotenv.config();

// Rate limiter configuration
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(apiLimiter); // Apply rate limiter to all routes

app.use(
  cors({
    origin: "http://localhost:5173", // Adjust based on where your frontend is running
    methods: ["GET", "POST", "PATCH", "DELETE"],
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

// Cron job configuration
// Run every 30 minutes
cron.schedule("*/30 * * * *", () => {
  console.log("Pinging the server to keep it awake");
});
