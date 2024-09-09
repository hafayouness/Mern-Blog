import express from "express";
const router = express.Router();
import {
  Create,
  deletepost,
  getPosts,
} from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

router.post("/create", verifyToken, Create);
router.get("/getposts", getPosts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);

export default router;
