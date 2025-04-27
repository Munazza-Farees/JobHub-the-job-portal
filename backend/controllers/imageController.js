import Image from "../models/Image.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage, limit: {fileSize: 51200} });

export const uploadImage = [
    upload.single("image"),
    async (req, res) => {
      try {
        const { name } = req.body;
        if (!req.file) {
          return res.status(400).json({ error: "No image file provided" });
        }
        const image = new Image({
          name: name || req.file.originalname,
          path: `/uploads/images/${req.file.filename}`,
        });
        await image.save();
        res.status(201).json(image);
      } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: "Server error" });
      }
    },
  ];