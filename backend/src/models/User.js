import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    full_name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    role: {
      type: String,
      enum: ['student', 'staff', 'admin', 'super_admin'],
      required: true,
      default: 'student',
    },
    department: { type: String },
    department_id: { type: String },
    department_name: { type: String },
    phone: { type: String },
    avatar: { type: String },
    avatar_url: { type: String },
    student_id_number: { type: String },
    created_at: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    ret.full_name = ret.full_name || ret.name;
    ret.avatar_url = ret.avatar_url || ret.avatar;
    return ret;
  },
});

export const User = mongoose.model('User', userSchema);

