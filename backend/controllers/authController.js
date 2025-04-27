import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("Registration attempt with:", { name, email, role });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already exists:", email);
      return res.status(400).json({ error: "Email already exists" });
    }

    if (!["jobseeker", "jobprovider"].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be 'jobseeker' or 'jobprovider'" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    console.log("New user created with ID:", newUser._id);

    const newProfile = new UserProfile({ userId: newUser._id });
    await newProfile.save();
    console.log("New profile created with ID:", newProfile._id, "for userId:", newProfile.userId);

    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    console.log("Token generated:", token);
    res.status(201).json({ message: "User registered successfully", token, userId: newUser._id });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: `Validation failed: ${messages.join(", ")}` });
    }
    res.status(500).json({ error: "Registration failed", details: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    let userProfile = await UserProfile.findOne({ userId });

    if (!userProfile) {
      userProfile = new UserProfile({ userId });
    }

    if (req.file) {
      userProfile.profilePicture = `/uploads/${req.file.filename}`;
    }

    userProfile.fullName = req.body.fullName || userProfile.fullName;
    userProfile.phoneNumber = req.body.phoneNumber || userProfile.phoneNumber;
    userProfile.jobTitle = req.body.jobTitle || userProfile.jobTitle;
    userProfile.industry = req.body.industry || userProfile.industry;
    userProfile.experienceLevel = req.body.experienceLevel || userProfile.experienceLevel;
    userProfile.skills = req.body.skills || userProfile.skills;

    const role = req.body.role?.toLowerCase();
    if (role && !["jobseeker", "jobprovider"].includes(role)) {
      return res.status(400).json({ error: "Invalid role value" });
    }
    if (role) {
      userProfile.role = role;
      // Update User model role
      await User.findByIdAndUpdate(userId, { role });
    }

    userProfile.education = userProfile.education || {};
    userProfile.education.degree = req.body["education.degree"] || userProfile.education.degree;
    userProfile.education.school = req.body["education.school"] || userProfile.education.school;

    userProfile.workExperience = userProfile.workExperience || {};
    userProfile.workExperience.jobTitle = req.body["workExperience.jobTitle"] || userProfile.workExperience.jobTitle;
    userProfile.workExperience.company = req.body["workExperience.company"] || userProfile.workExperience.company;
    userProfile.workExperience.duration = req.body["workExperience.duration"] || userProfile.workExperience.duration;
    userProfile.workExperience.description = req.body["workExperience.description"] || userProfile.workExperience.description;

    await userProfile.save();
    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (role && role !== user.role) {
      return res.status(403).json({ message: "Selected role does not match account type" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, userId: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.userId }).populate("userId", "name email role");
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json({ ...profile.toObject(), userId: profile.userId });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const uploadNews = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile || userProfile.role !== "jobprovider") {
      return res.status(403).json({ error: "Only job providers can upload news" });
    }

    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const news = new News({
      title,
      description,
      company: userProfile.fullName || "Unknown",
      postedBy: userId,
      imageId: req.file ? { path: `/uploads/${req.file.filename}` } : null,
    });
    await news.save();
    res.status(201).json({ message: "News uploaded successfully", news });
  } catch (error) {
    console.error("News upload error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};