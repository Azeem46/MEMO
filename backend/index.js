import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
// import rateLimit from 'express-rate-limit';
import postRoutes from "./routes/postsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
dotenv.config();

// // Rate limiter configuration
// const apiLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.',
// });

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// app.use(apiLimiter); // Apply rate limiter to all routes

// Routes
app.use("/posts", postRoutes);
app.use("/user", userRoutes);

app.use(
  cors({
    origin: "http://localhost:5173", // or the port your Vite frontend is running on
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

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
