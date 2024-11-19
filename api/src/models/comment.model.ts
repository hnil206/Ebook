import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    objectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    replies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        // timestamps: true,
      },
    ],
  },
  { timestamps: true },
);
const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
