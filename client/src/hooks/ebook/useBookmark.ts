import { axiosWithAuth } from '@/lib/axios';
import { isCfiInRange } from '@/utils/ebook.utils';
import axios from 'axios';
import { useCallback } from 'react';
import useAuth from '../useAuth';
import useEbookStore from '../useEbookStore';
export default function useBookMark({ viewerRef, bookId}: any) {
  const { bookMarks, setBookMarks, currentLocation } = useEbookStore();
  // const [readerId,setReaderId] = useState();
  const { user } = useAuth();
  // if (bookId) return null;

  // useEffect(() => {},[user])


  const updateBookmark = async (bookmarks: any) => {
    const token = user?.accessToken;
    if (!token) {
      console.warn('User not logged in or session information missing');
      return null;
    }
    const data = {
      bookmarks,
    };
    try {
      const res = await axiosWithAuth(token).post(`/reader/${bookId}`, data);
      // console.log('Location update successful:', res.data);
      const result = await res.data
      console.log(result)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error updating bookmark:',
          error.response?.data || error.message,
        );
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const addBookmark = useCallback(
    async (_currentLocation: any) => {
      const bookmark = {
        key: Date.now(),
        name: `Bookmark`,
        cfi: _currentLocation.startCfi,
        chapter: _currentLocation.chapterName,
        page: _currentLocation.currentPage,
        date: new Date().toLocaleString(),
      };
      setBookMarks([...bookMarks, bookmark]);
      await updateBookmark([...bookMarks, bookmark]);
    },
    [bookMarks, user],
  );

  const removeBookmark = useCallback(
    async (_cfi: string) => {
      const bookMarksFilter = bookMarks.filter(
        (bookmark) => bookmark.cfi !== _cfi,
      );
      setBookMarks(bookMarksFilter);
      await updateBookmark(bookMarksFilter);
    },
    [bookMarks, user],
  );

  // const isBookmarkAdded = useMemo(
  //   () =>
  //     bookMarks.find((bookmark) =>
  //       isCfiInRange(
  //         bookmark.cfi,
  //         currentLocation.startCfi,
  //         currentLocation.endCfi,
  //       ),
  //     ),
  //   [bookMarks, currentLocation],
  // );

  // console.log('currentLocation in bookmark', currentLocation);
  const isBookmarkAdded = bookMarks.find((bookmark) =>
    isCfiInRange(
      bookmark.cfi,
      currentLocation.startCfi,
      currentLocation.endCfi,
    ),
  );

  return {
    bookMarks,
    addBookmark,
    removeBookmark,
    isBookmarkAdded,
  };
}
