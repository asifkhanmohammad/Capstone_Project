import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: String, required: true },
    details: { type: String },
  },
  { timestamps: true }
);

export const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
