// models/Job.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  description: { type: String, required: true },
  companyName: { type: String, required: true },
  companyAddress: { type: String, required: true },
  salary: { type: String, required: true },
  skills: { type: String, required: true },
  vacancy: { type: Number },
  experience: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
  hrName: { type: String },
  hrEmail: { type: String },
  hrPhone: { type: String },
  jobType: { type: String },
  region: { type: String },
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);