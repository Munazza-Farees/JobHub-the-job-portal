// routes/newsRoutes.js
import express from "express";
import News from "../models/News.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const news = await News.find().populate("postedBy", "name role");
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: "Error fetching news" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, description, company, imageId } = req.body;
    if (!title || !description || !company || !imageId) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const news = new News({
      title,
      description,
      company,
      imageId,
      postedBy: req.user.userId,
    });
    await news.save();
    await news.populate("postedBy", "name role");
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ error: "Error uploading news" });
  }
});

export default router;