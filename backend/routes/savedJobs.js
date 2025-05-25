import express from 'express';
import SavedJob from '../models/SavedJob.js';
import Job from '../models/Job.js';
import auth from '../middleware/auth.js';
import { createActivity } from '../controllers/activityController.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.userId;
    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    const savedJob = new SavedJob({ userId, jobId });
    await savedJob.save();
    await createActivity(userId, `Saved job: ${job.jobTitle} at ${job.companyName}`);
    res.status(201).json({ message: 'Job saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving job' });
  }
});

export default router;