import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/user.js';

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit : "30mb", extended : true }));
app.use(bodyParser.urlencoded({ limit : "30mb", extended : true }));
app.use(cors());

app.use('/posts', postRoutes);
app.use("/user", userRoutes);

// const CONNECTION_URL = 'mongodb+srv://azeem:azeem464693@cluster0.pujkqsx.mongodb.net/?retryWrites=true&w=majority'
 const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, {
}).then(()=>app.listen(PORT,() => console.log(`Server running on port: ${PORT}`)))
  .catch((error)=>console.log(error.message)) ;     // accept two paramter 


