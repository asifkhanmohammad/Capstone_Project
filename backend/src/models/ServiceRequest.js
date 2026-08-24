import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    student_id: { type: String, required: true, index: true },
    student_name: { type: String, required: true },
    service_type: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    preferred_slot: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    created_at: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

serviceRequestSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
