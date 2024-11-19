import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import useEbookStore from '@/hooks/useEbookStore';
import { cn } from '@/lib/utils';
import { BookOption } from '@/types/ebook';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlignLeft,
  BookCopy,
  Bookmark,
  Edit2,
  Highlighter,
  Settings,
  Trash2,
} from 'lucide-react';
import { useCallback, useState } from 'react';

interface HeaderProps {
  onLocation: (loc: string) => void;
  style: {
    onDirection: (type: 'Horizontal' | 'Vertical') => void;
    onThemeChange: (type: 'dark' | 'light') => void;
    onViewType: (isSpread: boolean) => void;
    onFontSize: (size: number) => void;
    onLineHeight: (size: number) => void;
    onMarginVertical: (size: number) => void;
    onMarginHorizontal: (size: number) => void;
    bookOption: BookOption;
  };
  bookmark: {
    addBookmark: (currentLocation: any) => void;
    removeBookmark: (cfi: string) => void;
    isBookmarkAdded: boolean;
  };
  hightlight: {
    onSelection: (cfiRange: string) => void;
    onHighlight: (highlight: any) => void;
    onRemoveHighlight: (highlight: any) => void;
    goToHighLight: (highlight: any) => void;
    onHighlightClick: (highlight: any) => void;
  };
  height?: number;
}
interface TocProps {
  onLocation: (loc: string) => void;
}
interface StyleProps {
  style: {
    onDirection: (type: 'Horizontal' | 'Vertical') => void;
    onThemeChange: (type: 'dark' | 'light') => void;
    onViewType: (isSpread: boolean) => void;
    onFontSize: (size: number) => void;
    onLineHeight: (size: number) => void;
    onMarginVertical: (size: number) => void;
    onMarginHorizontal: (size: number) => void;
    bookOption: BookOption;
  };
}
interface BookmarksProps {
  onLocation: (loc: string) => void;
  bookmark: {
    addBookmark: (currentLocation: any) => void;
    removeBookmark: (cfi: string) => void;
    isBookmarkAdded: boolean;
  };
}

interface HighlightProps {
  onSelection: (cfiRange: string) => void;
  goToHighlight: (highlight: any) => void;
  onRemoveHighlight: (highlight: any) => void;
  onHighlightClick: (highlight: any) => void;
}

export default function Header({
  onLocation,
  style,
  bookmark,
  hightlight,
  height,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'flex justify-between items-center p-4 mb-1',
        // `h-[${height ? height : 30}px]`,
        'h-[30px]',
      )}
    >
      <Toc onLocation={onLocation} />
      <div className="flex space-x-2">
        <Highlight
          goToHighlight={hightlight.goToHighLight}
          onRemoveHighlight={hightlight.onRemoveHighlight}
          onSelection={hightlight.onSelection}
          onHighlightClick={hightlight.onHighlightClick}
        />
        <Bookmarks bookmark={bookmark} onLocation={onLocation} />
        <Style style={style} />
      </div>
    </header>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function Toc({ onLocation }: TocProps) {
  const { toc } = useEbookStore();

  const onClickItem = useCallback(
    (loc: string) => {
      onLocation(loc);
    },
    [onLocation],
  );
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <AlignLeft className="h-6 w-6" />
          <span className="sr-only">Table of Contents</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">
            Table of Contents
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)] mt-6">
          <motion.div
            className="flex flex-col space-y-2 pr-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {Array.isArray(toc) ? ( // Check if toc is an array
              toc.map((item: any, index: number) => (
                <motion.div key={index} variants={itemVariants}>
                  <SheetClose asChild>
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                        onClick={() => onClickItem(item.href)}
                      >
                        <motion.span
                          className="text-sm font-medium"
                          whileHover={{ x: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {item.label}
                        </motion.span>
                      </Button>
                    </motion.div>
                  </SheetClose>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-400">
                No contents available
              </div> // Fallback if toc is not an array
            )}
          </motion.div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function Style({ style }: StyleProps) {
  const { bookStyle, bookOption, theme } = useEbookStore();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <Settings className="h-6 w-6" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Settings</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Font Size : {bookStyle.fontSize}
            </Label>
            <Slider
              id="font-size"
              min={16}
              max={30}
              step={1}
              onValueChange={(value) => style.onFontSize(value[0])}
              // onValueChange={(value) => console.log('value', value)}
              defaultValue={[bookStyle.fontSize]}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Line Height : {bookStyle.lineHeight}
            </Label>
            <Slider
              id="line-height"
              min={1}
              max={3}
              step={0.2}
              onValueChange={(value) => style.onLineHeight(value[0])}
              // onValueChange={(value) => console.log('value', value)}
              defaultValue={[bookStyle.lineHeight]}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Margin Vertical : {bookStyle.marginVertical}
            </Label>
            <Slider
              id="margin-vertical"
              min={0}
              max={25}
              step={1}
              onValueChange={(value) => style.onMarginVertical(value[0])}
              // onValueChange={(value) => console.log('value', value)}
              defaultValue={[bookStyle.marginVertical]}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Margin Horizontal : {bookStyle.marginHorizontal}
            </Label>
            <Slider
              id="margin-horizontal"
              min={0}
              max={25}
              step={1}
              onValueChange={(value) => style.onMarginHorizontal(value[0])}
              // onValueChange={(value) => console.log('value', value)}
              defaultValue={[bookStyle.marginHorizontal]}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Theme</Label>
            <Select
              defaultValue={theme.split('/').pop()?.split('.')[0]}
              onValueChange={(value) =>
                style.onThemeChange(value as 'dark' | 'light')
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Reading Direction</Label>
            <div className="flex flex-row space-x-2">
              <span>Horizontal</span>
              <Switch
                id="direction"
                defaultChecked={bookOption.flow === 'paginated'}
                onCheckedChange={(checked) => {
                  checked
                    ? style.onDirection('Horizontal')
                    : style.onDirection('Vertical');
                }}
              />
              <span>Vertical</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Spread View</Label>
            <div className="flex flex-row space-x-2">
              <span>Single Page</span>
              <Switch
                id="view-type"
                defaultChecked={bookOption.spread === 'auto'}
                onCheckedChange={(checked) => {
                  checked ? style.onViewType(true) : style.onViewType(false);
                }}
                disabled={bookOption.flow === 'scrolled-doc'}
              />
              <span>Double Page</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Bookmarks({ onLocation, bookmark }: BookmarksProps) {
  const { currentLocation, bookMarks } = useEbookStore();
  const goToBookmark = useCallback(
    (_bookmark: any) => {
      const cfi = _bookmark.cfi;
      onLocation(cfi);
    },
    [onLocation],
  );

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'hover:bg-gray-200 dark:hover:bg-gray-800',
          bookmark.isBookmarkAdded && 'text-yellow-400 hover:text-yellow-500',
        )}
        onClick={() => {
          console.log('add bookmark ', currentLocation);
          bookmark.isBookmarkAdded
            ? bookmark.removeBookmark(currentLocation.startCfi)
            : bookmark.addBookmark(currentLocation);
          console.log('bookmarks', bookMarks);
        }}
      >
        <Bookmark className="h-6 w-6" />
        <span className="sr-only">Bookmarks</span>
      </Button>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <BookCopy className="h-6 w-6" />
            <span className="sr-only">Bookmarks</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">Bookmarks</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-80px)] mt-6">
            <motion.div
              className="flex flex-col space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {bookMarks.length === 0 ? (
                <div className="text-center text-gray-400">
                  No bookmarks added yet
                </div>
              ) : (
                <div className="space-y-2">
                  {bookMarks.map((bookmark) => (
                    <motion.div key={bookmark.key} variants={itemVariants}>
                      <SheetClose>
                        <Button
                          variant="ghost"
                          onClick={() => goToBookmark(bookmark)}
                        >
                          <motion.span
                            className="text-sm font-medium"
                            whileHover={{ x: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            Page {bookmark.page}
                            {' - '}
                            {bookmark.chapter !== undefined
                              ? bookmark.chapter
                              : bookmark.name}
                          </motion.span>
                        </Button>
                      </SheetClose>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Highlight({
  goToHighlight,
  onRemoveHighlight,
  onSelection,
  onHighlightClick,
}: HighlightProps) {
  const { highlights, color } = useEbookStore();
  const [editingHighlight, setEditingHighlight] = useState<any>(null);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <Highlighter className="h-6 w-6" />
          <span className="sr-only">Highlights</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Highlights</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)] mt-6">
          <motion.div
            className="flex flex-col space-y-2 pr-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {highlights.map((highlight) => (
                <motion.div
                  key={highlight.key}
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <SheetClose asChild>
                    <Card className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between space-x-4">
                          <motion.div
                            className="flex-1 text-sm cursor-pointer"
                            style={{ color: highlight.color }}
                            onClick={() => goToHighlight(highlight)}
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            "{highlight.content.substring(0, 100)}..."
                          </motion.div>
                          <div className="flex flex-col space-y-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                onHighlightClick(highlight);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveHighlight(highlight);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <AnimatePresence>
                          {editingHighlight?.key === highlight.key && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-4"
                            >
                              <div className="flex flex-wrap gap-2">
                                {color.map((colorItem) => (
                                  <motion.button
                                    key={colorItem.name}
                                    className="w-8 h-8 rounded-full"
                                    style={{ backgroundColor: colorItem.code }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // handleColorChange(highlight, colorItem.code);
                                    }}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </SheetClose>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
