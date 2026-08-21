import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ['student', 'staff', 'admin', 'super_admin'],
      required: true,
    },
    department: { type: String },
    phone: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
