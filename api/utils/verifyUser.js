import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const verifyToken = (req, res, next) => {
  // const token = req.cookies.access_token;
  // const token =
  //   req.cookies.access_token || req.headers.authorization?.split(" ")[1];
  const tokenFromCookies = req.cookies.access_token;
  const tokenFromHeader = req.headers.authorization?.split(" ")[1];

  console.log("Token from cookies:", tokenFromCookies);
  console.log("Token from header:", tokenFromHeader);

  const token = tokenFromCookies || tokenFromHeader;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Token is missing or undefined" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized"));
    }

    req.user = user;

    next();
  });
};
