import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String },
  phoneNumber: { type: String },
  jobTitle: { type: String },
  industry: { type: String },
  experienceLevel: { type: String },
  skills: { type: String },
  profilePicture: { type: String },
  role: { 
    type: String, 
    enum: ['jobseeker', 'jobprovider'], 
    default: 'jobseeker' 
  },
  education: {
    degree: { type: String },
    school: { type: String },
  },
  workExperience: {
    jobTitle: { type: String },
    company: { type: String },
    duration: { type: String },
    description: { type: String },
  },
});

export default mongoose.model('UserProfile', userProfileSchema);