import User from "../models/user.model.js";

import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    next(errorHandler(400, "All fields are required"));
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // return next(errorHandler(409, "user already exists"));
      return res.status(409).json({ message: "user already exists" });
    }
    // const saltRounds = 10;
    // const hashPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      username,
      email,
      password,
    });
    await newUser.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.log(error);
    // next(errorHandler(500, "Internal Server Error"));
    res.status(500).json({ message: "Internal Server Error" });
  }
};
