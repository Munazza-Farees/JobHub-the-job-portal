import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import auth from "./middleware/auth.js";
import jobRoutes from "./routes/jobRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import savedJobRoutes from "./routes/savedJobs.js";
import newsRoutes from "./routes/newsRoutes.js";

dotenv.config();
connectDB();
const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/uploads', express.static(path.join(process.cwd(), "uploads")));
app.use("/api", activityRoutes);
app.use("/api", contentRoutes);
app.use("/api", applicationRoutes);
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/auth/profile", profileRoutes);

const jobs = [
  { id: 1, title: 'Frontend Developer', company: 'Google', location: 'California', salary: '100k' },
  { id: 2, title: 'Backend Developer', company: 'Microsoft', location: 'Seattle', salary: '110k' },
];

app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
