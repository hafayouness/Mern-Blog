import express from "express";
const router = express.Router();
import { Create } from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

router.post("/create", verifyToken, Create);

export default router;
