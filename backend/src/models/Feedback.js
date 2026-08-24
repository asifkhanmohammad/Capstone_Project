import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    complaint_id: { type: String, required: true, index: true },
    student_id: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comments: { type: String },
    is_satisfied: { type: Boolean, default: true },
    created_at: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

feedbackSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Feedback = mongoose.model('Feedback', feedbackSchema);
