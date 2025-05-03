import express from "express";
import multer from "multer";
import path from "path";
import auth from "../middleware/auth.js";
import { getUserProfile } from "../controllers/userController.js";
import { updateProfile } from "../controllers/authController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get("/profile/:id", auth, getUserProfile); // Fetch profile by ID
router.put("/profile", auth, upload.single("profilePicture"), updateProfile); // Update profile

export default router;