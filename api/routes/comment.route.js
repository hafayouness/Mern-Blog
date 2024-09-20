import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  getpostComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getpostcomment/:postId", getpostComments);
export default router;
