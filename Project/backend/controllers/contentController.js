import Job from "../models/Job.js";
import News from "../models/News.js";
import Image from "../models/Image.js";
import UserProfile from "../models/UserProfile.js";

// export const getJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find();
//     res.json(jobs);
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

export const getJobs = async (req, res) => {
  try {
    const { search, region, jobType, experience } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { jobTitle: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ];
    }
    if (region) query.region = region;
    if (jobType) query.jobType = jobType;
    if (experience) query.experience = { $gte: parseInt(experience) };

    const jobs = await Job.find(query).populate('imageId');
    res.status(200).json(jobs || []); 
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('imageId');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getNews = async (req, res) => {
  try {
    const news = await News.find().populate('imageId');
    res.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getSkills = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user.userId });
    if (!userProfile || !userProfile.skills) {
      return res.json([]);
    }
    const skills = userProfile.skills.split(',').map(skill => skill.trim());
    res.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getImages = async (req, res) => {
  try {
    const images = await Image.find();
    // res.json(images);
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const uploadNews = async (req, res) => {
  try {
    const { title, description, company, imageId } = req.body;
    if (!title || !description || !company || !imageId) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const news = new News({ title, description, company, imageId });
    await news.save();
    res.status(201).json(news);
  } catch (error) {
    console.error("Error uploading news:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const uploadJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    console.log("Received req.body:", req.body);

    const {
      jobTitle,
      description,
      companyName,
      companyAddress,
      salary,
      skills,
      hrName,
      hrEmail,
      hrPhone,
      imageId,
      jobType,
      experience,
      vacancy,
      region,
    } = req.body;

    if (!jobTitle || !description || !companyName || !companyAddress || !salary || !skills) {
      const missing = [];
      if (!jobTitle) missing.push("jobTitle");
      if (!description) missing.push("description");
      if (!companyName) missing.push("companyName");
      if (!companyAddress) missing.push("companyAddress");
      if (!salary) missing.push("salary");
      if (!skills) missing.push("skills");
      return res.status(400).json({ error: `All required fields must be provided. Missing: ${missing.join(", ")}` });
    }

    const job = new Job({
      jobTitle,
      description,
      companyName,
      companyAddress,
      salary,
      skills,
      vacancy: vacancy || undefined,
      experience: experience || undefined,
      createdBy: userId,
      imageId: imageId || undefined, // Use imageId from request body
      hrName,
      hrEmail,
      hrPhone,
      jobType,
      region,
    });

    await job.save();
    res.status(201).json({ message: "Job uploaded successfully", job });
  } catch (error) {
    console.error("Error uploading job:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};