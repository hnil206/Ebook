import Author from '../models/author.model';
import Book from '../models/book.model';

interface QueryOptions {
  authorName?: string;
  title?: string;
  category?: string | string[];
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'views'; // Added sorting fields
  sortOrder?: 'asc' | 'desc';
}
// export interface ExtendedBook extends InstanceType<typeof Book> {
//   averageRating?: number; // Rating trung bình
//   totalRatings?: number; // Tổng số đánh giá
// }

export async function newBook(data: any): Promise<InstanceType<typeof Book>> {
  let author = await Author.findOne({ name: data.author_name });
  if (!author) {
    const _author = new Author({
      name: data.author_name,
      description: data.author_description,
    });
    author = await _author.save();
  }
  const book = new Book({
    title: data.title,
    description: data.description,
    cover: data.cover,
    bookUrl: data.bookUrl,
    author: author,
    category: data.category,
    price: data.price,
    currentQuantity: data.currentQuantity,
    priceRead: data.priceRead,
    forPremium: data.forPremium,
  });
  const savedBook = await book.save();
  return await savedBook;
}
export async function getBook(
  options: QueryOptions,
  skip?: number,
  take?: number,
): Promise<{ books: InstanceType<typeof Book>[]; total: number }> {
  console.log(skip, take);
  let query = Book.find();
  if (options?.authorName) {
    const keywords = options.authorName.split(' ').filter((k) => k);
    query = query.where({
      'author.name': {
        $in: keywords.map((keyword) => new RegExp(keyword, 'i')),
      },
    });
  }
  if (options?.title) {
    const keywords = options.title.split(' ').filter((k) => k);
    query = query
      .where({
        $or: keywords.map((keyword) => ({
          title: new RegExp(keyword, 'i'),
        })),
      })
      .sort({ createdAt: -1 });
  }
  if (options?.category) {
    const categories = Array.isArray(options.category)
      ? options.category
      : [options.category];
    query = query.where({
      'category.name': { $in: categories },
    });
  }
  if (options?.sortBy) {
    const sortOrder = options.sortOrder === 'desc' ? -1 : 1; // Determine sort order
    query = query.sort({ [options.sortBy]: sortOrder }); // Apply sorting
  }
  if (skip) {
    query = query.skip(skip);
  }
  if (take) {
    query = query.limit(take);
  }
  const [books, total] = await Promise.all([
    query.populate('author').exec(),
    Book.countDocuments(query),
  ]);
  return {
    books,
    total,
  };
}
export async function getBookById(id: string): Promise<InstanceType<typeof Book> | null> {
  const book = await Book.findById(id).populate('author');
  if (!book) {
    return null;
  }

  return book; // Trả về sách tìm thấy hoặc null nếu không tìm thấy
}
export async function getAllCategories(): Promise<
  { category: string; count: number }[]
> {
  const categoriesCount = await Book.aggregate([
    { $unwind: '$category' },
    { $group: { _id: '$category.name', count: { $sum: 1 } } },
    { $sort: { count: -1 } }, // Sort by count in descending order
  ]);

  return categoriesCount.map((cat) => ({
    category: cat._id,
    count: cat.count,
  }));
}
export async function getAllAuthor() {
  const author = await Author.find();
  return await author;
}
// rating
export async function ratingBook(
  userId: string,
  bookId: string,
  score: number,
) {
  const book = await getBookById(bookId);
  if (!book) {
    throw new Error('Book not found');
  }
  const existingRatingIndex = book.ratings.findIndex(
    (rating) => rating.userId.toString() === userId,
  );

  if (existingRatingIndex !== -1) {
    if (score === 0) {
      // Nếu đã đánh giá và score = 0, xóa đánh giá
      book.ratings.splice(existingRatingIndex, 1);
    } else {
      // Nếu đã đánh giá và có điểm số mới, cập nhật điểm số
      book.ratings[existingRatingIndex].score = score;
    }
  } else if (score > 0) {
    // Nếu chưa đánh giá và có điểm số mới (lớn hơn 0), thêm mới đánh giá
    book.ratings.push({ userId: userId, score });
  }

  return await Book.updateOne({ _id: bookId }, book); // Trả về sách đã được cập nhật
}

export async function checkUserRating(
  userId: string,
  bookId: string,
): Promise<InstanceType<typeof Number> | null> {
  const book = await getBookById(bookId);
  if (!book) {
    throw new Error('Book not found');
  }
  const rating = book.ratings.find(
    (rating) => rating.userId.toString() === userId,
  );
  return rating ? rating.score : null;
}

export const updateBook = async (id: string, data: any) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        title: data.title,
        cover: data.cover,
        description: data.description,
        bookUrl: data.bookUrl,
        status: data.status,
        category: data.category, // Ensure category is updated correctly
        price: data.price,
        currentQuantity: data.currentQuantity,
        priceRead: data.priceRead,
        forPremium: data.forPremium,
        lastUpdateAt: new Date(), // Update the last updated timestamp
      },
      { new: true } // Return the updated document
    );
    return updatedBook;
  } catch (error: any) {
    throw new Error('Error updating book: ' + error.message);
  }
};

export const deleteBook = async (id: string) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    return deletedBook;
  } catch (error: any) {
    throw new Error('Error deleting book: ' + error.message);
  }
};
