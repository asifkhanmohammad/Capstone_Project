import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    code: { type: String, required: true, index: true },
    head_name: { type: String, required: true },
    head_email: { type: String, required: true },
    staff_count: { type: Number, default: 0 },
    active_complaints: { type: Number, default: 0 },
    sla_target_hours: { type: Number, default: 24 },
    monthly_budget: { type: Number, default: 50000 },
    created_at: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

departmentSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Department = mongoose.model('Department', departmentSchema);
