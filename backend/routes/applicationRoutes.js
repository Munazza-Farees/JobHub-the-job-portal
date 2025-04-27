import express from "express";
import { getUserApplications, getJobApplications, updateApplicationStatus } from "../controllers/applicationController.js";
import auth from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import { submitApplication } from "../controllers/activityController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post("/", auth, upload.single("resume"), submitApplication);
router.get("/user", auth, getUserApplications);
router.get("/job/:jobId", auth, getJobApplications);
router.patch("/:applicationId", auth, updateApplicationStatus);

export default router;