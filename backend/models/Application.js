import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  name: { type: String }, 
  email: { type: String },
  phoneNumber: { type: String },
  posFor: { type: String },
  coverLetter: { type: String },
  heardFrom: { type: String },
  resume: { type: String },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  appliedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Application", ApplicationSchema);