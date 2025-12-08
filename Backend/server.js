import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

connectDB();

app.use('/api/auth',authRoutes)
app.use('/api/post',postRoutes)
app.use('/api/chat',chatRoutes)


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
