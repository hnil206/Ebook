import mongoose, { Schema } from "mongoose";
const bookSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    cover: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["ONGOING", "COMPLETED", "DISCONTINUED"], // Example status options, adjust as needed
      default: "ONGOING",
    },
    bookUrl: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    // author: {
    //   name: {
    //     type: String,
    //     require: true,
    //     trim: true
    //   },
    //   description: {
    //     type: String,
    //     require: true,
    //     trim: true,
    //   }
    // },

    ratings: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        score: {
          type: Number,
          min: 0,
          max: 5,
          required: true,
        },
      },
    ],

    price: {
      type: Number,
      required: true,
    },
    currentQuantity: {
      type: Number,
      default: 0,
      required: true,
    },

    category: [
      {
        name: {
          type: String,
        },
      },
    ],
    forPremium: {
      type: String,
      enum:["user", "premium"],
      default: "user",
    },
  },
  { timestamps: true }
);
const Book =
  // mongoose.models.Reader ||
  mongoose.model("Book", bookSchema);
export default Book;
