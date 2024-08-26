import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
export const test = (req, res) => {
  res.json({ message: " api is working " });
};

export const updateUser = async (req, res, next) => {
  console.log("ID de l'utilisateur authentifié :", req.user.id);
  console.log("ID de l'utilisateur à mettre à jour :", req.params.userId);
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 character"));
    }
    req.body.password = bcryptjs.hashSync(generatePassword, 10);
  }
  if (req.body.username) {
    const { username } = req.body;
    if (Array.isArray(req.body.username)) {
      return next(
        errorHandler(400, "Username should be a string, not an array")
      );
    }

    if (typeof username !== "string") {
      return next(errorHandler(400, "Invalid username format"));
    }

    // Vérifier la longueur du nom d'utilisateur
    if (username.length < 8 || username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 8 and 20 characters")
      );
    }

    // Vérifier si le nom d'utilisateur contient des espaces
    if (username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }

    // Vérifier si le nom d'utilisateur est en minuscules
    if (username !== username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }

    // Vérifier si le nom d'utilisateur ne contient que des lettres et des chiffres
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
  }

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    if (!updateUser) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
    console.log(updateUser);
  } catch (err) {
    next(err);
  }
};
