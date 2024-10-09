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
    .split("")
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
export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const query = {
      ...(req.query.useId && { useId: req.query.useId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: req.query.searchTerm }, // Correspondance exacte du contenu
        ],
      }),
    };

    const posts = await Post.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments(query); // Compte seulement les posts pertinents

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPost = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPost,
    });
  } catch (err) {
    next(err);
  }
};

// export const getPosts = async (req, res, next) => {
//   try {
//     const startIndex = parseInt(req.query.startIndex) || 0;
//     const limit = parseInt(req.query.limit) || 9;
//     const sortDirection = req.query.order === "asc" ? 1 : -1;

//     const query = {
//       ...(req.query.useId && { useId: req.query.useId }),
//       ...(req.query.category && { category: req.query.category }),
//       ...(req.query.slug && { slug: req.query.slug }),
//       ...(req.query.postId && { _id: req.query.postId }),
//       ...(req.query.searchTerm && {
//         $or: [
//           {
//             title: {
//               $regex: req.query.searchTerm,
//               $options: "i",
//             },
//           },
//           {
//             content: {
//               $regex: req.query.searchTerm,
//               $options: "i",
//             },
//           },
//         ],
//       }),
//     };

//     const posts = await Post.find(query)
//       .sort({ updateAt: sortDirection })
//       .skip(startIndex)
//       .limit(limit);

//     const totalPosts = await Post.countDocuments(query); // Compte seulement les posts pertinents

//     const now = new Date();
//     const oneMonthAgo = new Date(
//       now.getFullYear(),
//       now.getMonth() - 1,
//       now.getDate()
//     );
//     const lastMonthPost = await Post.countDocuments({
//       createAt: { $gte: oneMonthAgo },
//     });

//     res.status(200).json({
//       posts,
//       totalPosts,
//       lastMonthPost,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// export const getPosts = async (req, res, next) => {
//   try {
//     const startIndex = parseInt(req.query.startIndex) || 0;
//     const limit = parseInt(req.query.limit) || 9;
//     const sortDirection = req.query.order === " asc" ? 1 : -1;

//     const posts = await Post.find({
//       ...(req.query.useId && { useId: req.query.useId }),
//       ...(req.query.category && { category: req.query.category }),
//       ...(req.query.slug && { slug: req.query.slug }),
//       ...(req.query.postId && { _id: req.query.postId }),
//       ...(req.query.searchTerm && {
//         $or: [
//           {
//             title: {
//               $regex: req.query.searchTerm,
//               $options: "i",
//             },
//           },
//           { content: { $regex: req.query.searchTerm, $options: "i" } },
//         ],
//       }),
//     })
//       .sort({ updateAt: sortDirection })
//       .skip(startIndex)
//       .limit(limit);
//     const totalPosts = await Post.countDocuments();
//     const now = new Date();
//     const oneMonthAgo = new Date(
//       now.getFullYear(),
//       now.getMonth() - 1,
//       now.getDate()
//     );
//     const lastMonthPost = await Post.countDocuments({
//       createAt: { $gte: oneMonthAgo },
//     });
//     res.status(200).json({
//       posts,
//       totalPosts,
//       lastMonthPost,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== res.user.userId) {
    return next(errorHandler(403, "You are  allowed to delete this  post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted ");
  } catch (err) {
    next(err);
  }
};
export const updatePost = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== res.user.userId) {
    return next(errorHandler(403, "You are  allowed to update this  post"));
  }
  try {
    const updatepost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          image: req.body.image,
          category: req.body.category,
        },
      },
      { new: true }
    );

    res.status(200).json(updatepost);
  } catch (err) {
    next(err);
  }
};
