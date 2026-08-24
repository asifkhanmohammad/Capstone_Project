import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    user_id: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error', 'sla'],
      default: 'info',
    },
    is_read: { type: Boolean, default: false },
    created_at: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

notificationSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Notification = mongoose.model('Notification', notificationSchema);
