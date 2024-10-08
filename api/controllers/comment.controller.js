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

export const likeComment = async (req, res, next) => {
  try {
    console.log("commnetId", req.params.commentId); // Log l'ID du commentaire
    console.log(req.user.id);
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "comment not found"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
};

export const Editcomment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment")
      );
    }
    const editcomment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      {
        new: true,
      }
    );
    if (!editcomment) {
      return next(errorHandler(404, "Failed to update comment"));
    }
    res.status(200).json(editcomment);
  } catch (err) {
    next(err);
  }
};

export const deletecomment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment")
      );
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("comment has been deleted");
  } catch (err) {
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  try {
    // Check if the user has permission to view the comments
    if (!req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to view these comments")
      );
    }

    // Parse query parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    // Fetch comments with pagination and sorting
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Get total comments count
    const totalComments = await Comment.countDocuments();

    // Calculate the date one month ago from now
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Get the count of comments created in the last month
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Respond with the comments and counts
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (err) {
    next(err);
  }
};
