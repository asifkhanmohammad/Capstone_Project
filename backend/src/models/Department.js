import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    headName: { type: String, required: true },
    headEmail: { type: String, required: true },
    staffCount: { type: Number, default: 0 },
    activeComplaints: { type: Number, default: 0 },
    slaTargetHours: { type: Number, default: 24 },
    monthlyBudget: { type: Number, default: 50000 },
  },
  { timestamps: true }
);

export const Department = mongoose.model('Department', departmentSchema);
