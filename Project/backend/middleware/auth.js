// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    req.user = decoded;
    req.userModel = user; 
    next();
  } catch (error) {
    console.error("Auth error:", error);
    const errorMsg = error.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    res.status(401).json({ error: errorMsg });
  }
};

export default auth;