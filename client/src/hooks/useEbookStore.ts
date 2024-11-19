import { Book } from '@/components/ui.custom/home/listbook';
import { BookFlow } from '@/types/ebook';
import { produce } from 'immer';
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
// Interfaces and types (unchanged)
export interface Highlight {
  key: number;
  cfiRange: string;
  content: string;
  color?: string;
  createAt: string;
  chapterName: string;
  pageNum: number;
  lastAccess?: string;
  takeNote?: string;
}

interface Page {
  chapterName: string;
  currentPage: number;
  totalPage: number;
  startCfi: string;
  endCfi: string;
  base: string;
}

interface BookOption {
  flow: BookFlow;
  resizeOnOrientationChange: boolean;
  spread: 'auto' | 'none';
}

interface BookStyle {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  marginHorizontal: number;
  marginVertical: number;
}

interface ViewerLayout {
  MIN_VIEWER_WIDTH: number;
  MIN_VIEWER_HEIGHT: number;
  VIEWER_HEADER_HEIGHT: number;
  VIEWER_FOOTER_HEIGHT: number;
  VIEWER_SIDEMENU_WIDTH: number;
}

export interface Color {
  name: string;
  code: string;
}

interface EbookState {
  book: Book | null;
  setBook: (book: Book) => void;

  currentLocation: Page;
  setCurrentLocation: (location: Page) => void;

  toc: any[];
  setToc: (toc: any[]) => void;

  viewerLayout: ViewerLayout;
  setViewerLayout: (layout: ViewerLayout) => void;

  theme: string;
  setTheme: (theme: string) => void;

  bookOption: BookOption;
  setBookOption: (option: BookOption) => void;

  bookMarks: any[];
  setBookMarks: (bookmark: any[]) => void;

  highlights: Highlight[];
  setHighlights: (highlights: Highlight[]) => void;

  bookStyle: BookStyle;
  setBookStyle: (style: BookStyle) => void;

  color: Color[];
}

// Initial state values (unchanged)
const initialBook = {
  id: 0,
  coverURL: '',
  title: '',
  description: '',
  author: '',
  published_date: '',
  modified_date: '',
};

const initialCurrentLocation: Page = {
  chapterName: '-',
  currentPage: 0,
  totalPage: 0,
  startCfi: '',
  endCfi: '',
  base: '',
};

const initialBookOption: BookOption = {
  flow: 'paginated',
  resizeOnOrientationChange: true,
  spread: 'auto',
};

const initialBookStyle: BookStyle = {
  fontFamily: 'Origin',
  fontSize: 25,
  lineHeight: 1.9,
  marginHorizontal: 10,
  marginVertical: 8,
};

const initialColor: Color[] = [
  { name: 'yellow', code: '#f7f48b' },
  { name: 'green', code: '#a1f48b' },
  { name: 'blue', code: '#8bb1f4' },
  { name: 'red', code: '#f48b8b' },
  { name: 'purple', code: '#d88bf4' },
];

const initialViewerLayout: ViewerLayout = {
  MIN_VIEWER_WIDTH: 600,
  MIN_VIEWER_HEIGHT: 300,
  VIEWER_HEADER_HEIGHT: 40,
  VIEWER_FOOTER_HEIGHT: 40,
  VIEWER_SIDEMENU_WIDTH: 0,
};

const initialTheme: string = '/themes/dark.theme.css';

// Zustand store
const useEbookStore = create<EbookState>((set, get) => ({
  book: null,
  currentLocation: initialCurrentLocation,
  toc: [],
  viewerLayout: initialViewerLayout,
  theme: initialTheme,
  bookOption: initialBookOption,
  bookMarks: [],
  highlights: [],
  bookStyle: initialBookStyle,
  color: initialColor,

  setBook: (book: Book) =>
    set(
      produce((state) => {
        console.log(book);
        if (!shallow(JSON.stringify(state.book), JSON.stringify(book))) {
          state.book = book;
        }
      }),
    ),

  setCurrentLocation: (location: Page) =>
    set(
      produce((state) => {
        if (
          !shallow(
            JSON.stringify(state.currentLocation),
            JSON.stringify(location),
          )
        ) {
          state.currentLocation = location;
        }
      }),
    ),

  setToc: (newToc: any[]) =>
    set(
      produce((state) => {
        if (!shallow(JSON.stringify(state.toc), JSON.stringify(newToc))) {
          state.toc = newToc;
        }
      }),
    ),

  setViewerLayout: (layout: ViewerLayout) =>
    set(
      produce((state) => {
        if (
          !shallow(JSON.stringify(state.viewerLayout), JSON.stringify(layout))
        ) {
          state.viewerLayout = layout;
        }
      }),
    ),

  setTheme: (theme: string) =>
    set(
      produce((state) => {
        if (!shallow(state.theme, theme)) {
          state.theme = theme;
        }
      }),
    ),

  setBookOption: (option: BookOption) =>
    set(
      produce((state) => {
        state.bookOption = { ...state.bookOption, ...option };
      }),
    ),

  setBookMarks: (bookmarks: any[]) =>
    set(
      produce((state) => {
        state.bookMarks = bookmarks;
      }),
    ),

  setHighlights: (highlights: Highlight[]) =>
    set(
      produce((state) => {
        state.highlights = highlights;
      }),
    ),

  setBookStyle: (style: BookStyle) =>
    set(
      produce((state) => {
        state.bookStyle = style;
      }),
    ),
}));

export default useEbookStore;
