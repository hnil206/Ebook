'use client';
import useBookController from '@/hooks/ebook/useBookController';
import useBookStyle from '@/hooks/ebook/useBookStyle';
import { useEffect, useRef, useState } from 'react';
import { ReactEpubViewer as ReactViewer } from 'react-epub-viewer';
import 'regenerator-runtime/runtime';
// import ReactViewer from '@/modules/Reader';
import { Book } from '@/components/ui.custom/home/listbook';
import useBookMark from '@/hooks/ebook/useBookmark';
import UseInitBook from '@/hooks/ebook/useInitBook';
import useSelection from '@/hooks/ebook/useSelection';
import Context from './context';
import Footer from './footer';
import Header from './header';
import Loading from './loading';
import ReadingContinue from './readingContinue';
// import {Rendition} from "epubjs";
export default function EbookViewer({ book }: { book: Book }) {
  // const [url, setUrl] = useState<string>(
  //   'https://res.cloudinary.com/dws8h9utn/raw/upload/v1728325552/Cu%C3%8C%C2%81%20So%C3%8C%C2%82%C3%8C%C2%81c%20Tu%C3%8C%C2%9Bo%C3%8C%C2%9Bng%20Lai%20-%20Alvin%20Toffler.epub',
  // );
  const [url, setUrl] = useState<string>(book.bookUrl);
  const viewerRef = useRef<any>(null);
  const [isRead, setIsRead] = useState<boolean>(false);
  const [isOpenContinue, setIsOpenContinue] = useState<boolean>(false);
  const { initCurrentLocation } = UseInitBook(book);
  useEffect(() => {
    console.log(initCurrentLocation);
    if (initCurrentLocation && !isRead) {
      setIsOpenContinue(true);
      setIsRead(true);
    }
  }, [initCurrentLocation]);

  const {
    currentLocation,
    //   isFetching,
    onPageMove,
    onPageChange,
    onTocChange,
    onLocationChange,
    //   updateBook,
  } = useBookController({ viewerRef });

  const {
    theme,
    viewerLayout,
    bookOption,
    bookStyle,
    onDirection,
    onThemeChange,
    onViewType,
    onFontSize,
    onLineHeight,
    onMarginVertical,
    onMarginHorizontal,
  } = useBookStyle({ viewerRef });

  const { addBookmark, removeBookmark, isBookmarkAdded } = useBookMark({
    viewerRef,
    bookId: book._id,
  });

  const {
    selection,
    setSelection,
    setOpen,
    open,
    onSelection,
    onHighlight,
    onRemoveHighlight,
    goToHighLight,
    onHighlightClick,
    // takeNote,
    // setTakeNote,
  } = useSelection({
    viewerRef,
    onLocationChange,
  });

  // const [rendition, setRendition] = useState<Rendition | null>(null);
  return (
    <>
      <Header
        // height={20}
        onLocation={onLocationChange}
        style={{
          onDirection,
          onThemeChange,
          onViewType,
          onFontSize,
          onLineHeight,
          onMarginVertical,
          onMarginHorizontal,
          bookOption,
        }}
        bookmark={{
          addBookmark,
          removeBookmark,
          isBookmarkAdded,
        }}
        hightlight={{
          onSelection,
          onHighlight,
          onRemoveHighlight,
          goToHighLight,
          onHighlightClick,
        }}
      />
      <Context
        selection={selection}
        setSelection={setSelection}
        onRemoveHighlight={onRemoveHighlight}
        isOpen={open}
        setIsOpen={setOpen}
        onHighlight={onHighlight}
      />
      <ReadingContinue
        isOpen={isOpenContinue}
        setIsOpen={setIsOpenContinue}
        currentLocation={initCurrentLocation}
        onLocationChange={onLocationChange}
      />
      <ReactViewer
        url={url}
        ref={viewerRef}
        onPageChange={onPageChange}
        onTocChange={onTocChange}
        viewerStyleURL={theme}
        viewerLayout={viewerLayout}
        viewerOption={bookOption}
        viewerStyle={bookStyle}
        onSelection={onSelection}
        loadingView={<Loading />}
      />
      <Footer
        onPageMove={onPageMove}
        // height={20}
      />
    </>
  );
}
