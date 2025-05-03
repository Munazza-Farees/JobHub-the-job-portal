import News from "../models/News.js";

export const postNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    const news = new News({
      title,
      content,
      postedBy: req.user.id,
    });

    await news.save();
    res.status(201).json(news);
  } catch (error) {
    console.error("Error posting news:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export const getNews = async (req, res) => {
  try {
    const news = await News.find().populate("postedBy", "name role");
    res.status(200).json(news);
  } catch (error) {
    console.error("Error fetching news:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};