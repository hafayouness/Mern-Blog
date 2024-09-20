import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    const sanitizedPostId = typeof postId === "object" ? postId.postId : postId;

    if (!content || !sanitizedPostId || !userId) {
      return next(errorHandler(400, "Missing required fields"));
    }

    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to create this comment")
      );
    }

    const newComment = new Comment({
      content,
      postId: sanitizedPostId,
      userId,
    });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (err) {
    next(err);
  }
};

export const getpostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found." });
    }
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};
