import express from "express";
const router = express.Router();
import { Create, getPosts } from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

router.post("/create", verifyToken, Create);
router.get("/getposts", getPosts);

export default router;
