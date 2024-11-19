import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Page from '@/types/page';

interface ReadingContinueProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentLocation: Page | null;
  onLocationChange: (cfi: string) => void;
}

export default function ReadingContinue({
  isOpen,
  setIsOpen,
  currentLocation,
  onLocationChange,
}: ReadingContinueProps): JSX.Element | null {
  if (!currentLocation) return null;

  const readingContinue = () => {
    onLocationChange(currentLocation.startCfi);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Continue Reading?
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 mt-4">
          You have a saved reading position. Would you like to continue from
          where you left off?
        </p>
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Start from Beginning
          </Button>
          <Button onClick={readingContinue}>Continue Reading</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
