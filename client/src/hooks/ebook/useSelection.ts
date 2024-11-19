import { axiosWithAuth } from '@/lib/axios';
import {
  cfiRangeSpliter,
  compareCfi,
  timeFormatter,
} from '@/utils/ebook.utils';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import useAuth from '../useAuth';
import useEbookStore, { Color, Highlight } from '../useEbookStore';

interface UseSelectionProps {
  viewerRef: any;
  onLocationChange: (cfi: string) => void;
  // takeNote?:string;
  // setTakeNote?:(note:string)=>void;
}

export default function useSelection({
  viewerRef,
  onLocationChange,
}: UseSelectionProps) {
  const {
    currentLocation,
    setCurrentLocation,
    highlights,
    setHighlights,
    color,
    book,
  } = useEbookStore();
  const { user } = useAuth();
  const [selection, setSelection] = useState<Highlight | null>(null);
  // const [takeNote, setTakeNote] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  const updateHighlights = async (_highlights: any) => {
    const token = user?.accessToken;
    if (!token) {
      console.warn('User not logged in or session information missing');
      return null;
    }
    const data = {
      highlights: _highlights,
    };
    try {
      const res = await axiosWithAuth(token).post(`/reader/${book?._id}`, data);
      // console.log('Location update successful:', res.data);
      const result = await res.data;
      console.log(result);
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

  const onSelection = useCallback(
    (cfiRange: string) => {
      if (!viewerRef.current) return false;

      const iframe = viewerRef.current.querySelector('iframe');
      if (!iframe) return false;

      const iframeWin = iframe.contentWindow;
      if (!iframeWin) return false;

      const content = iframeWin.getSelection()!.toString().trim();
      console.log(content, currentLocation);
      // onOpen();

      setSelection({
        key: Date.now(),
        cfiRange,
        content,
        createAt: timeFormatter(new Date()),
        chapterName: currentLocation.chapterName,
        pageNum: currentLocation.currentPage,
        takeNote: '',
      });
      console.log('ls', highlights);
      setOpen(true);
    },
    [viewerRef, highlights, selection, currentLocation],
  );

  const onHighlight = useCallback(
    async (color: Color, note?: string) => {
      if (!viewerRef.current) return;
      if (!selection) return;

      const newSelection = {
        ...selection,
        ...(color && color.code ? { color: color.code } : {}), // Chỉ cập nhật color nếu color.code không trống
        ...(note && note.trim() ? { takeNote: note } : {}), // Cập nhật note nếu note không trống
      };
      console.log('newSelection: ', newSelection);
      setSelection(newSelection);

      const updatedHighlights = (() => {
        const existingHighlightIndex = highlights.findIndex(
          (item: Highlight) => item.key === selection.key,
        );

        if (existingHighlightIndex !== -1) {
          return highlights.map((highlight, index) =>
            index === existingHighlightIndex ? newSelection : highlight,
          );
        } else {
          return [...highlights, newSelection];
        }
      })();

      setHighlights(updatedHighlights);
      await updateHighlights(updatedHighlights);
    },
    [viewerRef, highlights, selection, setSelection, currentLocation, user],
  );

  const goToHighLight = useCallback(
    (selection: Highlight) => {
      const startCfi = cfiRangeSpliter(selection.cfiRange)?.startCfi;
      if (!startCfi) return;
      onLocationChange(startCfi);
    },
    [viewerRef, onLocationChange],
  );

  const onRemoveHighlight = useCallback(
    async (highlight: Highlight) => {
      if (!viewerRef.current) return;
      const newHighlights = highlights.filter(
        (item) => item.key !== highlight.key,
      );
      setHighlights(newHighlights);
      await updateHighlights(newHighlights);
      viewerRef.current.offHighlight(highlight.cfiRange);
      setSelection(null);
    },
    [viewerRef, highlights],
  );

  const onHighlightClick = useCallback((highlight: Highlight) => {
    // setOpen(true);
    setOpen(true);
    setSelection(highlight);
  }, []);
  // const contextItem = useCallback(() => {
  //   if (!selection) return null;
  //   return (

  //   );
  // }, []);

  useEffect(() => {
    if (!viewerRef.current) return;
    const iframe = viewerRef.current!.querySelector('iframe');
    if (!iframe) return;

    const iframeWin = iframe.contentWindow;
    if (!iframeWin) return;

    highlights.forEach((item) => {
      const cfiRange = cfiRangeSpliter(item.cfiRange);
      if (!cfiRange) return;
      const { startCfi } = cfiRange;
      if (
        compareCfi(currentLocation.startCfi, startCfi) < 1 &&
        compareCfi(currentLocation.endCfi, startCfi) > -1
      ) {
        viewerRef.current?.onHighlight(
          item.cfiRange,
          (e: any) => {
            onHighlightClick(item);
          },
          item.color,
        );
        iframeWin.getSelection()!.removeAllRanges();
      }
    });
  }, [
    viewerRef,
    highlights,
    currentLocation,
    onHighlightClick,
    onLocationChange,
    updateHighlights,
  ]);

  return {
    selection,
    setSelection,
    onSelection,
    onHighlight,
    onRemoveHighlight,
    setOpen,
    open,
    goToHighLight,
    onHighlightClick,
    // takeNote,
    // setTakeNote,
    // listHighLight,
  };
}
