import mongoose, { Schema } from 'mongoose';
const notificationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      // required: true
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
