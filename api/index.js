import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
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
// TgoiiBqVMecjeWEW
