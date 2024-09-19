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
