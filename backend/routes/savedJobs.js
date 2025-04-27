import express from "express";
import { saveJob, getSavedJobs, removeSavedJob } from "../controllers/savedJobController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, saveJob);
router.get("/", authMiddleware, getSavedJobs); 
router.delete("/:jobId", authMiddleware, removeSavedJob); 

export default router;