import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  deletecomment,
  Editcomment,
  getComments,
  getpostComments,
  likeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getpostcomment/:postId", getpostComments);
router.put("/likecomment/:commentId", verifyToken, likeComment);
router.put("/editcomment/:commentId", verifyToken, Editcomment);
router.delete("/deletecomment/:commentId", verifyToken, deletecomment);
router.get("/getcomments", verifyToken, getComments);
export default router;
