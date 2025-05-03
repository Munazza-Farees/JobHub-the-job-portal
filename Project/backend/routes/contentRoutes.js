import express from "express";
import { getImages, getJobs, getNews, getSkills, uploadJob, uploadNews, getJobById } from "../controllers/contentController.js";
import { uploadImage } from "../controllers/imageController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/jobs", getJobs);
router.get("/news", getNews);
router.get("/skills", auth, getSkills);
router.get("/images", auth, getImages);
router.get("/jobs/:id", getJobById);
router.post("/jobs", auth, uploadJob);
router.post("/images", auth, uploadImage);
router.post("/news", auth, uploadNews);

export default router;