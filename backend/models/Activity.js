import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Activity", ActivitySchema);