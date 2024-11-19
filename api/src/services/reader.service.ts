import mongoose from 'mongoose';
import Book from '../models/book.model';
import Reader from '../models/reader.model';

const validateIds = (...ids: string[]) => {
  ids.forEach((id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(id);
      throw new Error(`Invalid ID: ${id}`);
    }
  });
};

export async function getOrCreateReader(userId: string, bookId: string) {
  try {
    validateIds(userId, bookId);
    let reader = await Reader.findOne({ userId, bookId })
      .populate('highlights')
      .populate('bookmarks');

    if (!reader) {
      reader = new Reader({
        userId,
        bookId,
        currentLocation: {},
        highlights: [],
        bookmarks: [],
      });
      await reader.save();
    }
    try {

      await Book.findByIdAndUpdate(bookId, { $inc: { views: 1 } });
      const _book = await Book.findById(bookId);
      console.log(_book)
    } catch(e:any){
      console.log(e.message)
    }
    return reader;
  } catch (error) {
    console.error('Error in getOrCreateReader:', error);
    throw error;
  }
}

// export async function newReader(userId: string, bookId: string) {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(userId))
//       throw new Error('Invalid userId');
//     if (!mongoose.Types.ObjectId.isValid(bookId))
//       throw new Error('Invalid bookId');

//     const existingReader = await Reader.findOne({ userId, bookId });
//     if (existingReader) {
//       throw new Error('Reader already exists for this user and book');
//     }

//     const reader = new Reader({
//       userId,
//       bookId,
//       currentLocation: {},
//       highlights: [],
//       bookmarks: [],
//     });
//     return await reader.save();
//   } catch (error) {
//     console.error('Error in createReader:', error);
//     throw error;
//   }
// }

// export async function getReader(userId: string, bookId: string) {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(userId))
//       throw new Error('Invalid userId');
//     if (!mongoose.Types.ObjectId.isValid(bookId))
//       throw new Error('Invalid bookId');

//     const reader = await Reader.findOne({ userId, bookId })
//       .populate('highlights')
//       .populate('bookmarks');

//     if (!reader) {
//       throw new Error('Reader not found');
//     }

//     return reader;
//   } catch (error) {
//     console.error('Error in getReader:', error);
//     throw error;
//   }
// }

export async function reading(
  userId: string,
  bookId: string,
  currentLocation: any,
) {
  try {
    validateIds(userId, bookId);
    if (!currentLocation || typeof currentLocation !== 'object') {
      throw new Error('Invalid currentLocation');
    }

    const updatedReader = await Reader.findOneAndUpdate(
      { userId, bookId },
      { currentLocation },
      { new: true, upsert: true },
    );

    return updatedReader;
  } catch (error) {
    console.error('Error in updateReaderLocation:', error);
    throw error;
  }
}

export async function updateReaderLocation(
  userId: string,
  bookId: string,
  currentLocation: any,
) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw new Error('Invalid userId');
    if (!mongoose.Types.ObjectId.isValid(bookId))
      throw new Error('Invalid bookId');
    if (!currentLocation || typeof currentLocation !== 'object') {
      throw new Error('Invalid currentLocation');
    }

    const updatedReader = await Reader.findOneAndUpdate(
      { userId, bookId },
      { currentLocation },
      { new: true },
    );

    if (!updatedReader) {
      throw new Error('Reader not found');
    }

    return updatedReader;
  } catch (error) {
    console.error('Error in updateReaderLocation:', error);
    throw error;
  }
}

export async function deleteReader(userId: string, bookId: string) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw new Error('Invalid userId');
    if (!mongoose.Types.ObjectId.isValid(bookId))
      throw new Error('Invalid bookId');

    const deletedReader = await Reader.findOneAndDelete({ userId, bookId });

    if (!deletedReader) {
      throw new Error('Reader not found');
    }

    return deletedReader;
  } catch (error) {
    console.error('Error in deleteReader:', error);
    throw error;
  }
}

// export async function addHighlight(
//   userId: string,
//   bookId: string,
//   highlightData: any,
// ) {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(userId))
//       throw new Error('Invalid userId');
//     if (!mongoose.Types.ObjectId.isValid(bookId))
//       throw new Error('Invalid bookId');
//     if (
//       !highlightData ||
//       typeof highlightData !== 'object' ||
//       !highlightData.cfi ||
//       !highlightData.text
//     ) {
//       throw new Error('Invalid highlight data');
//     }

//     const highlight = new Highlight({
//       ...highlightData,
//       userId,
//       bookId,
//     });
//     const savedHighlight = await highlight.save();

//     const updatedReader = await Reader.findOneAndUpdate(
//       { userId, bookId },
//       { $push: { highlights: savedHighlight._id } },
//       { new: true },
//     ).populate('highlights');

//     if (!updatedReader) {
//       throw new Error('Reader not found');
//     }

//     return updatedReader;
//   } catch (error) {
//     console.error('Error in addHighlight:', error);
//     throw error;
//   }
// }

// export async function removeHighlight(
//   userId: string,
//   bookId: string,
//   highlightId: string,
// ) {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(userId))
//       throw new Error('Invalid userId');
//     if (!mongoose.Types.ObjectId.isValid(bookId))
//       throw new Error('Invalid bookId');
//     if (!mongoose.Types.ObjectId.isValid(highlightId))
//       throw new Error('Invalid highlightId');

//     const deletedHighlight = await Highlight.findByIdAndDelete(highlightId);
//     if (!deletedHighlight) {
//       throw new Error('Highlight not found');
//     }

//     const updatedReader = await Reader.findOneAndUpdate(
//       { userId, bookId },
//       { $pull: { highlights: highlightId } },
//       { new: true },
//     ).populate('highlights');

//     if (!updatedReader) {
//       throw new Error('Reader not found');
//     }

//     return updatedReader;
//   } catch (error) {
//     console.error('Error in removeHighlight:', error);
//     throw error;
//   }
// }

// export async function addBookmark(
//   userId: string,
//   bookId: string,
//   bookmarkData: any,
// ) {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(userId))
//       throw new Error('Invalid userId');
//     if (!mongoose.Types.ObjectId.isValid(bookId))
//       throw new Error('Invalid bookId');
//     if (
//       !bookmarkData ||
//       typeof bookmarkData !== 'object' ||
//       !bookmarkData.cfi
//     ) {
//       throw new Error('Invalid bookmark data');
//     }

//     const bookmark = new Bookmark({
//       ...bookmarkData,
//       userId,
//       bookId,
//     });
//     const savedBookmark = await bookmark.save();

//     const updatedReader = await Reader.findOneAndUpdate(
//       { userId, bookId },
//       { $push: { bookmarks: savedBookmark._id } },
//       { new: true },
//     ).populate('bookmarks');

//     if (!updatedReader) {
//       throw new Error('Reader not found');
//     }

//     return updatedReader;
//   } catch (error) {
//     console.error('Error in addBookmark:', error);
//     throw error;
//   }
// }

// export async function removeBookmark(
//   userId: string,
//   bookId: string,
//   bookmarkId: string,
// ) {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(userId))
//       throw new Error('Invalid userId');
//     if (!mongoose.Types.ObjectId.isValid(bookId))
//       throw new Error('Invalid bookId');
//     if (!mongoose.Types.ObjectId.isValid(bookmarkId))
//       throw new Error('Invalid bookmarkId');

//     const deletedBookmark = await Bookmark.findByIdAndDelete(bookmarkId);
//     if (!deletedBookmark) {
//       throw new Error('Bookmark not found');
//     }

//     const updatedReader = await Reader.findOneAndUpdate(
//       { userId, bookId },
//       { $pull: { bookmarks: bookmarkId } },
//       { new: true },
//     ).populate('bookmarks');

//     if (!updatedReader) {
//       throw new Error('Reader not found');
//     }

//     return updatedReader;
//   } catch (error) {
//     console.error('Error in removeBookmark:', error);
//     throw error;
//   }
// }

export async function updateReaderContent(
  userId: string,
  bookId: string,
  highlights: string[],
  bookmarks: string[],
) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw new Error('Invalid userId');
    if (!mongoose.Types.ObjectId.isValid(bookId))
      throw new Error('Invalid bookId');
    if (
      !Array.isArray(highlights) ||
      !highlights.every((id) => mongoose.Types.ObjectId.isValid(id))
    ) {
      throw new Error('Invalid highlights array');
    }
    if (
      !Array.isArray(bookmarks) ||
      !bookmarks.every((id) => mongoose.Types.ObjectId.isValid(id))
    ) {
      throw new Error('Invalid bookmarks array');
    }

    const updatedReader = await Reader.findOneAndUpdate(
      { userId, bookId },
      { highlights, bookmarks },
      { new: true },
    )
      .populate('highlights')
      .populate('bookmarks');

    if (!updatedReader) {
      throw new Error('Reader not found');
    }

    return updatedReader;
  } catch (error) {
    console.error('Error in updateReaderContent:', error);
    throw error;
  }
}

export async function setBookmarks(
  userId: string,
  bookId: string,
  bookmarks: {
    key: number;
    name: string;
    cfi: string;
    chapter: string;
    page: number;
    date: string;
  }[],
) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw new Error('Invalid userId');
    if (!mongoose.Types.ObjectId.isValid(bookId))
      throw new Error('Invalid bookId');
    const updatedReader = await Reader.findOneAndUpdate(
      { userId, bookId },
      { bookmarks },
      { new: true },
    );

    if (!updatedReader) {
      throw new Error('Reader not found');
    }
    return updatedReader;
  } catch (error) {
    console.error('Error in update bookmark:', error);
    throw error;
  }
}

export async function setHightlights(
  userId: string,
  bookId: string,
  highlights: {
    key: number;
    cfiRange: string;
    content: string;
    color: string;
    chapterName: string;
    pageNum: number;
    lastAccess: string;
  },
) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw new Error('Invalid userId');
    if (!mongoose.Types.ObjectId.isValid(bookId))
      throw new Error('Invalid bookId');
    const updatedReader = await Reader.findOneAndUpdate(
      { userId, bookId },
      { highlights },
      { new: true },
    );

    if (!updatedReader) {
      throw new Error('Reader not found');
    }
    return updatedReader;
  } catch (error) {
    console.error('Error in update bookmark:', error);
    throw error;
  }
}
