import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Allow users to view their own profile regardless of role
    if (req.user.role !== "jobProvider" && req.user.userId !== userId) {
      return res.status(403).json({ error: "Only job providers can view other user profiles" });
    }

    const user = await User.findById(userId).select("name email role");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userProfile = await UserProfile.findOne({ userId }).catch((err) => {
      console.error("Error fetching user profile:", err);
      return null;
    });

    const userData = {
      ...user.toObject(),
      ...(userProfile ? userProfile.toObject() : {}),
      name: userProfile?.fullName || user.name,
      phone: userProfile?.phoneNumber || user.phone,
      education: userProfile?.education || user.education,
      experienceLevel: userProfile?.experienceLevel || "Not specified",
      experience: userProfile?.workExperience?.duration || user.experience,
      jobTitle: userProfile?.jobTitle,
      industry: userProfile?.industry,
      profilePicture: userProfile?.profilePicture,
      skills: userProfile?.skills,
      role: userProfile?.role || user.role,
    };

    let relatedData = {};
    if (userData.role === "jobProvider") {
      const jobsPosted = await Job.find({ createdBy: userId })
        .populate({
          path: "imageId",
          select: "path name",
          options: { strictPopulate: false },
        })
        .catch((err) => {
          console.error("Error populating jobsPosted imageId:", err);
          return [];
        });
      relatedData.jobsPosted = jobsPosted;
    } else if (userData.role === "jobSeeker") {
      const applications = await Application.find({ userId })
        .populate({
          path: "jobId",
          populate: {
            path: "imageId",
            select: "path name",
            options: { strictPopulate: false },
          },
        })
        .catch((err) => {
          console.error("Error populating applications jobId:", err);
          return [];
        });
      relatedData.applications = applications;
    }

    res.status(200).json({ user: userData, relatedData });
  } catch (error) {
    console.error("Error fetching user profile:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
};