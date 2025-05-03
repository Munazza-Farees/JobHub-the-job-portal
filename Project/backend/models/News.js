import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true }, 
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postedAt: { type: Date, default: Date.now },
});

export default mongoose.model('News', newsSchema);