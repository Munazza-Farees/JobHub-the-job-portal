import express from "express";
import { getRecentActivities } from "../controllers/activityController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getRecentActivities);

export default router;