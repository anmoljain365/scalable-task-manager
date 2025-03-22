import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  message: String,
  userId: String,
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model('Notification', NotificationSchema);