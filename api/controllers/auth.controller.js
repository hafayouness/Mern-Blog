import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    next(errorHandler(400, "All fields are required"));
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(409, "user already exists"));
    }
    const saltRounds = 10;
    const hashPassword = bcryptjs.hashSync(password, saltRounds);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are reaquired"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "invalid password"));
    }
    const token = jwt.sign(
      {
        id: validUser._id,
        isAdmin: validUser.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1y" }
    );
    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  const { name, email, photoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const cleanedUsername = generatedUsername.replace(/[0-9]/g, "");
      const saltRounds = 10;
      const hashePassword = bcryptjs.hashSync(generatePassword, saltRounds);
      const newUser = new User({
        username: cleanedUsername,
        email,
        password: hashePassword,
        profilePicture: photoUrl,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (err) {
    next(err);
  }
};
