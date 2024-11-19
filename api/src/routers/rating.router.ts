import { Router, Request, Response } from "express";
import Rating from "../models/rating.model";
import Book from "../models/book.model";
import { decode } from "../services/auth.service";
import { authMiddleware } from "../configs/middleware.config";

const ratingRouter = Router({ mergeParams: true });

ratingRouter.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = await decode(token);
    const userId = decoded.id;
    const { rating } = req.body;

    if (rating === undefined || rating === null || rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 0 and 5" });
    }

    // Check if the user has already rated this book
    const existingRating = await Rating.findOne({ userId, bookId });

    let ratingBookId;
    if (existingRating) {
      // Update the existing rating
      existingRating.rating = rating;
      await existingRating.save();
      ratingBookId = existingRating.bookId;
    } else {
      // Create a new rating
      const newRating = new Rating({
        userId,
        bookId,
        rating,
      });
      await newRating.save();
      ratingBookId = newRating.bookId;
    }

    // Calculate the average rating
    const stats = await Rating.aggregate([
      { $match: { bookId: ratingBookId } },
      {
        $group: {
          _id: "$bookId",
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    if (stats.length >= 0) {
      await Book.findByIdAndUpdate(bookId, {
        rating: stats[0].avgRating,
      });
    }

    res.status(201).json({ message: "Rating added/updated successfully" });
  } catch (error) {
    console.error("Error adding/updating rating:", error);
    res.status(500).json({ message: "Error adding/updating rating" });
  }
});

export default ratingRouter;
