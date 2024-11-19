import mongoose, { Schema } from 'mongoose';

const readerSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    currentLocation: {
      chapterName: {
        type: String,
      },
      currentPage: {
        type: Number,
      },
      totalPage: {
        type: Number,
      },
      startCfi: {
        type: String,
      },
      endCfi: {
        type: String,
      },
      base: {
        type: String,
      },
    },
    highlights: [
      {
        key: {
          type: Number,
        },
        cfiRange: {
          type: String,
        },
        content: {
          type: String,
        },
        color: {
          type: String,
        },
        chapterName: {
          type: String,
        },
        pageNum: {
          type: Number,
        },
        lastAccess: {
          type: String,
        },
        takeNote: {
          type: String,
        },
      },
      // {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: 'Highlight',
      // },
    ],
    bookmarks: [
      {
        key: {
          type: Number,
        },
        name: {
          type: String,
        },
        cfi: {
          type: String,
        },
        chapter: {
          type: String,
        },
        page: {
          type: Number,
        },
        date: {
          type: String,
        },
      },
      // {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: 'Bookmark',
      // },
    ],
  },
  { timestamps: true },
);

const Reader =
  // mongoose.models.Reader ||
  mongoose.model('Reader', readerSchema);
export default Reader;
