import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema(
  {
    id: { type: String },
    status: { type: String, required: true },
    timestamp: { type: String, required: true },
    updatedBy: { type: String, required: true },
    note: { type: String },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'emergency'], required: true },
    status: { type: String, required: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    location: { type: String, required: true },
    assignedTo: { type: String },
    assignedStaffName: { type: String },
    departmentId: { type: String },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
    dueAt: { type: String, required: true },
    images: [{ type: String }],
    isRecurring: { type: Boolean, default: false },
    upvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: String }],
    resolutionNotes: { type: String },
    timeline: [timelineSchema],
  },
  { timestamps: true }
);

export const Complaint = mongoose.model('Complaint', complaintSchema);
