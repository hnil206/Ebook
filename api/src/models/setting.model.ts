import mongoose, { Schema } from 'mongoose';

// interface BookOption {
//   flow: 'paginated' | 'scrolled-doc';
//   resizeOnOrientationChange: boolean;
//   spread: 'auto' | 'none';
// }

// interface BookStyle {
//   fontFamily: string;
//   fontSize: number;
//   lineHeight: number;
//   marginHorizontal: number;
//   marginVertical: number;
// }

const settingSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    bookOption: {
      flow: {
        type: String,
        enum: ['paginated', 'scrolled-doc'],
        required: true,
      },
      resizeOnOrientationChange: {
        type: Boolean,
        required: true,
      },
      spread: {
        type: String,
        enum: ['auto', 'none'],
        required: true,
      },
    },
    bookStyle: {
      fontFamily: {
        type: String,
        required: true,
      },
      fontSize: {
        type: Number,
        required: true,
      },
      lineHeight: {
        type: Number,
        required: true,
      },
      marginHorizontal: {
        type: Number,
        required: true,
      },
      marginVertical: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true },
);

const Setting =
  // mongoose.models.Setting ||
  mongoose.model('Setting', settingSchema);
export default Setting;
