import mongoose from "mongoose";

const SavedJobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  savedAt: { type: Date, default: Date.now },
});

export default mongoose.model("SavedJob", SavedJobSchema);