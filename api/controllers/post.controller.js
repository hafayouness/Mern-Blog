import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const Create = async (req, res, next) => {
  console.log();
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are  allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "please provide all required fields"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savePost = await newPost.save();
    res.status(200).json(savePost);
  } catch (err) {
    next(err);
  }
};
