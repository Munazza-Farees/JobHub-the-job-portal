import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

export const createApplication = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    // if (user.role !== "jobseeker" || user.role !== "jobprovider") {
    //   return res.status(403).json({ error: "Only job seekers can apply" });
    // }

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
      resume: req.file ? `/Uploads/${req.file.filename}` : null,
    });

    await application.save();
    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    console.error("Application error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate("jobId", "jobTitle companyName");
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    if (req.user.role !== "jobProvider") {
      return res.status(403).json({ error: "Only job providers can review applications" });
    }

    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job || job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to view applications for this job" });
    }

    const applications = await Application.find({ jobId }).populate("userId", "name email");
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    if (req.user.role !== "jobProvider") {
      return res.status(403).json({ error: "Only job providers can update application status" });
    }

    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findById(applicationId).populate("jobId");
    if (!application || application.jobId.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();
    res.status(200).json(application);
  } catch (error) {
    console.error("Error updating application status:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};