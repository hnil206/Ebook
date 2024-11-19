import { Schema, model, Document, Types, Model } from "mongoose";

interface IRating extends Document {
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
  rating: number;
}

interface RatingModel extends Model<IRating> {
  calculateAverageRating(bookId: Types.ObjectId): Promise<void>;
}

const ratingSchema = new Schema<IRating>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
});

const Rating = model<IRating, RatingModel>("Rating", ratingSchema);

export default Rating;
