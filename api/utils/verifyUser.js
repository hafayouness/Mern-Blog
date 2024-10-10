import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  // Get token either from cookies or Authorization header
  const tokenFromCookies = req.cookies.access_token;
  const tokenFromHeader = req.headers.authorization?.split(" ")[1];

  console.log("Token from cookies:", tokenFromCookies);
  console.log("Token from header:", tokenFromHeader);

  const token = tokenFromCookies || tokenFromHeader;

  // Check if token is missing
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Token is missing or undefined" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification error:", err);
      return next(errorHandler(401, "Unauthorized: Invalid or expired token"));
    }

    // Store the authenticated user in request
    req.user = user;
    next();
  });
};
