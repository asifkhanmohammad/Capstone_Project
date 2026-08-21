import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    complaintId: { type: String, required: true },
    studentId: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
    createdAt: { type: String, required: true },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model('Feedback', feedbackSchema);
