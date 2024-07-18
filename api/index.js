import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "../api/routes/user.route.js";
import authRoutes from "../api/routes/auth.router.js";

const app = express();
app.use(express.json());
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri)
  .then(() => {
    console.log("Mongodb is conneted");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(3000, () => {
  console.log("Server is running on part 3000 !!");
});

// apitest
// app.get("/test", (req, res) => {
//   res.json({ message: "hello world" });
// });
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
