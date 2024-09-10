import express from "express";
import {
  deletUser,
  getUsers,
  signout,
  test,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deletUser);
router.post("/signout", signout);
router.get("/getusers", verifyToken, getUsers);

export default router;
