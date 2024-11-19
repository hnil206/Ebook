import { Router } from 'express';
import roleRequire from '../configs/middleware.config';
import {
  getOrCreateReader,
  reading,
  setBookmarks,
  setHightlights,
} from '../services/reader.service';
const router = Router();

router.get('/:id', roleRequire(), async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    const bookId = req.params.id;
    if (!bookId) {
      return res.status(400).json({ message: 'bookId is required' });
    }
    const reader = await getOrCreateReader(userId, bookId);
    return res.status(200).json(reader);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id', roleRequire(), async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    const bookId = req.params.id;
    if (!bookId) {
      return res.status(400).json({ message: 'bookId is required' });
    }
    const { currentLocation, bookmarks, highlights } = req.body;
    if (currentLocation) {
      console.log('currentLocation:', currentLocation);
      if (!currentLocation || typeof currentLocation !== 'object') {
        return res.status(400).json({ message: 'Invalid currentLocation' });
      }
      const requiredFields = [
        // 'chapterName',
        'currentPage',
        'totalPage',
        'startCfi',
        'endCfi',
        'base',
      ];
      for (const field of requiredFields) {
        if (!(field in currentLocation)) {
          return res
            .status(400)
            .json({ message: `Missing field in currentLocation: ${field}` });
        }
      }
      const updatedReader = await reading(userId, bookId, currentLocation);
      return res.status(200).json(updatedReader);
    }
    if (bookmarks) {
      const updateReader = await setBookmarks(userId, bookId, bookmarks);
      return res.status(200).json(updateReader);
    }
    if (highlights) {
      const updatedReader = await setHightlights(userId, bookId, highlights);
      return res.status(200).json(updatedReader);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// router.post('/bookmark', roleRequire(), async (req, res) => {
//   try {
//     const userId = req.userId;
//     if (!userId) {
//       return res.status(400).json({ message: 'userId is required' });
//     }
//     const bookId = req.body.bookId;
//     if (!bookId) {
//       return res.status(400).json({ message: 'bookId is required' });
//     }
//     const bookmarks = req.body.bookmarks;
//     const updateReader = await setBookMarks(userId, bookId, bookmarks);
//     return res.status(200).json(updateReader);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// });

export default router;
