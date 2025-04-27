import express from "express";
import Job from "../models/Job.js";
import auth from "../middleware/auth.js";
import { getJob } from "../controllers/jobController.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { title, description, company, location, salary, skills } = req.body;

    // Basic validation
    if (!title || !description || !company || !location || !salary || !skills) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const job = new Job({
      title,
      description,
      company,
      location,
      salary,
      skills,
      postedBy: req.user.id, // Assuming user ID is stored in token
    });

    await job.save();
    res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Error creating job", error });
  }
});

router.get("/:id", auth, getJob);

router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({message: "Error fetching jobs", error });
  }
});

// module.exports = router;
export default router;