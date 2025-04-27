import express from "express";
import { uploadJob } from "../controllers/contentController.js";
import auth from "../middleware/auth.js";
import Job from "../models/Job.js";

const router = express.Router();

router.post("/", auth, uploadJob);

router.get("/", auth, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { jobTitle: { $regex: search, $options: "i" } },
          { companyName: { $regex: search, $options: "i" } },
          { companyAddress: { $regex: search, $options: "i" } },
        ],
      };
    }
    const jobs = await Job.find(query)
      .populate("createdBy", "name email")
      .populate("imageId", "path");
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("imageId", "path");
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Error fetching job", error: error.message });
  }
});

export default router;