import { Button } from '@/components/ui/button';
import useEbookStore from '@/hooks/useEbookStore';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface FooterProps {
  onPageMove: (type: 'prev' | 'next') => void;
  height?: number;
}

const AnimatedText = ({
  children,
}: // key,
{
  children: React.ReactNode;
  // key: string;
}) => (
  <AnimatePresence mode="wait">
    <motion.span
      // key={key}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.span>
  </AnimatePresence>
);

export default function Footer({ onPageMove, height = 30 }: FooterProps) {
  const { currentLocation, setCurrentLocation } = useEbookStore();

  const handlePreviousPage = () => {
    onPageMove('prev');
  };

  const handleNextPage = () => {
    onPageMove('next');
  };

  // console.log(JSON.stringify(currentLocation));
  return (
    <footer
      className={cn(
        'flex justify-between items-center p-4 mt-1',
        // ` h-[${height}px]`,
        'h-[30px]',
      )}
    >
      <Button variant="ghost" size="icon" onClick={handlePreviousPage}>
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous Page</span>
      </Button>
      <div className="flex items-center space-x-4">
        <AnimatedText key={`chapter-${currentLocation.chapterName}`}>
          <span className="text-sm text-muted-foreground">
            {currentLocation.chapterName !== undefined &&
              `${currentLocation.chapterName} - `}
          </span>
        </AnimatedText>
        <BookOpen className="h-5 w-5 text-muted-foreground" />
        <AnimatedText
        // key={`page-${currentLocation.currentPage}-${currentLocation.totalPage}`}
        >
          <span className="text-sm text-muted-foreground">
            {currentLocation.currentPage !== undefined &&
              currentLocation.totalPage !== undefined &&
              `${currentLocation.currentPage} of ${currentLocation.totalPage}`}
          </span>
        </AnimatedText>
      </div>
      <Button variant="ghost" size="icon" onClick={handleNextPage}>
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next Page</span>
      </Button>
    </footer>
  );
}
