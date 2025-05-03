import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  if (req.user.role !== "jobProvider") {
    return res.status(403).json({ error: "Only job providers can post jobs" });
  }
  const { title, description, company, location, salary } = req.body;
  if(!title || !description || !company || !location || !salary) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const newJob = new Job({ 
      title, 
      description, 
      company, 
      location, 
      salary, 
      createdBy: req.user.userId 
    });
    const job = new Job(newJob);
    await job.save();
    res.status(201).json(job);
    // await newJob.save();
    // res.status(201).json(newJob);
  } catch (error) {
    console.error("Error creating job:", error.message, error.stack);
    res.status(500).json({ error: "Job creation failed" });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { search, region, jobType, experience } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { jobTitle: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
      ];
    }
    if (region) query.region = region;
    if (jobType) query.jobType = jobType;
    if (experience) query.experience = { $gte: experience };

    const jobs = await Job.find(query)
      .populate({
        path: "imageId",
        select: "path name",
        options: { strictPopulate: false },
      })
      .catch((err) => {
        console.error("Error populating imageId:", err);
        return [];
      });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export const getJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!jobId || !/^[0-9a-fA-F]{24}$/.test(jobId)) {
      return res.status(400).json({ error: "Invalid job ID format" });
    }

    const job = await Job.findById(jobId)
      .populate({
        path: "imageId",
        select: "path name",
        options: { strictPopulate: false },
      })
      .catch((err) => {
        console.error("Error populating imageId:", err);
        return null;
      });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};