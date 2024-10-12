import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import userRoutes from "../api/routes/user.route.js";
import authRoutes from "../api/routes/auth.router.js";
import PostRoutes from "../api/routes/post.router.js";
import CommentRoutes from "../api/routes/comment.route.js";
import cookieParser from "cookie-parser";
import path from "path";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

const uri = process.env.MONGODB_URL;
mongoose
  .connect(uri)
  .then(() => {
    console.log("Mongodb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

// Routes

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", PostRoutes);
app.use("/api/comment", CommentRoutes);
app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html")); // Fix here
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
