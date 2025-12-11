import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user_id: string;
  type: 'complaint_submitted' | 'status_updated' | 'case_assigned' | 'fir_filed' | 'evidence_verified';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  created_at: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user_id: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['complaint_submitted', 'status_updated', 'case_assigned', 'fir_filed', 'evidence_verified'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: String,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

