import express from "express";
import { register, login, updateProfile, getProfile } from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, upload.single("profilePicture"), updateProfile);

export default router;