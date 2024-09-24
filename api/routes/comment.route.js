import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  Editcomment,
  getpostComments,
  likeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getpostcomment/:postId", getpostComments);
router.put("/likecomment/:commentId", verifyToken, likeComment);
router.put("/editcomment/:commentId", verifyToken, Editcomment);
export default router;
