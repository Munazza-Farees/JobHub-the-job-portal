import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import Image from '../models/Image.js';
import auth from '../middleware/auth.js';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Image Schema (assumed)
const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now },
});

// GET /api/images
router.get('/', auth, async (req, res) => {
  try {
    const images = await Image.find().select('name path');
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching images' });
  }
});

// POST /api/images
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.body.name) {
      return res.status(400).json({ error: 'Image and name are required' });
    }
    const image = new Image({
      name: req.body.name,
      path: `/uploads/${req.file.filename}`,
      uploadedBy: req.user.userId,
    });
    await image.save();
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: 'Error uploading image' });
  }
});

export default router;