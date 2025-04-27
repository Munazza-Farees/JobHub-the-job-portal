import SavedJob from "../models/SavedJob.js";

export const saveJob = async (req, res) => {
  try {
    if (req.user.role !== "jobSeeker") {
      return res.status(403).json({ error: "Only job seekers can save jobs" });
    }

    const { jobId } = req.body;
    const savedJob = new SavedJob({
      userId: req.user.id,
      jobId,
    });

    await savedJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Error saving job:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    if (req.user.role !== "jobSeeker") {
      return res.status(403).json({ error: "Only job seekers can view saved jobs" });
    }

    const savedJobs = await SavedJob.find({ userId: req.user.id }).populate("jobId");
    res.status(200).json(savedJobs);
  } catch (error) {
    console.error("Error fetching saved jobs:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export const removeSavedJob = async (req, res) => {
  try {
    if (req.user.role !== "jobSeeker") {
      return res.status(403).json({ error: "Only job seekers can remove saved jobs" });
    }

    const { jobId } = req.params;
    await SavedJob.findOneAndDelete({ userId: req.user.id, jobId });
    res.status(200).json({ message: "Saved job removed" });
  } catch (error) {
    console.error("Error removing saved job:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};