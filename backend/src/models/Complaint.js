import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => `tl-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` },
    complaint_id: { type: String },
    user_id: { type: String },
    user_name: { type: String },
    user_role: { type: String },
    status: { type: String },
    old_status: { type: String },
    new_status: { type: String },
    timestamp: { type: String, default: () => new Date().toISOString() },
    created_at: { type: String, default: () => new Date().toISOString() },
    updatedBy: { type: String },
    comment: { type: String },
    note: { type: String },
    is_internal: { type: Boolean, default: false },
  },
  { _id: false }
);

timelineSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.user_name = ret.user_name || ret.updatedBy || 'System';
    ret.comment = ret.comment || ret.note || '';
    ret.created_at = ret.created_at || ret.timestamp || new Date().toISOString();
    return ret;
  },
});

const complaintSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    complaint_number: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'emergency'], required: true, index: true },
    status: {
      type: String,
      enum: ['submitted', 'verified', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected', 'reopened'],
      required: true,
      default: 'submitted',
      index: true,
    },
    location: { type: String, required: true },
    student_id: { type: String, required: true, index: true },
    student_name: { type: String, required: true },
    student_email: { type: String, required: true },
    department_id: { type: String, index: true },
    department_name: { type: String },
    assigned_staff_id: { type: String },
    assigned_staff_name: { type: String },
    evidence_urls: [{ type: String }],
    due_at: { type: String, required: true },
    rejection_reason: { type: String },
    resolved_at: { type: String },
    closed_at: { type: String },
    created_at: { type: String, required: true, index: true },
    updated_at: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: String }],
    timeline: [timelineSchema],
  },
  { timestamps: true }
);

complaintSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Complaint = mongoose.model('Complaint', complaintSchema);
