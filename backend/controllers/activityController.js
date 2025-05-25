import Activity from "../models/Activity.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

// In activityController.js
export const getRecentActivities = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID not found" });
    }

    const limit = parseInt(req.query.limit) || 0;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const query = Activity.find({ userId }).sort({ createdAt: -1 }).lean();
    if (limit > 0) {
      query.limit(limit).skip(skip);
    }

    const activities = await query;
    const total = await Activity.countDocuments({ userId });

    res.status(200).json({ activities, total, page, limit });
  } catch (error) {
    console.error("Error fetching activities:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const createActivity = async (userId, action) => {
  try {
    if (!userId || !action) {
      throw new Error("Missing required fields: userId or action");
    }
    const activity = new Activity({ userId, action });
    await activity.save();
    console.log("Activity created:", { userId, action });
    return activity;
  } catch (error) {
    console.error("Error creating activity:", error.message);
    throw error;
  }
};

export const submitApplication = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = req.userModel;
    if (!userId || !user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const { jobId, name, email, phoneNumber, posFor, coverLetter, heardFrom } = req.body;
    if (!jobId || !name || !email || !phoneNumber || !posFor) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const application = new Application({
      jobId,
      userId,
      name,
      email,
      phoneNumber,
      posFor,
      coverLetter: coverLetter || "",
      heardFrom: heardFrom || "",
      resume: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await application.save();
    await createActivity(userId, `Applied for ${job.jobTitle} at ${job.companyName}`);

    res.status(201).json({ message: "Application submitted successfully", data: application });
  } catch (error) {
    console.error("Error submitting application:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};