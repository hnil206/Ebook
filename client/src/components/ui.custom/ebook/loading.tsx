import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface FullSpaceLoadingProps {
  className?: string;
}

export default function FullSpaceLoading({ className }: FullSpaceLoadingProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm',
        className,
      )}
    >
      <div className="relative">
        <svg
          className="animate-spin h-16 w-16 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <Loader2 className="animate-spin h-8 w-8 text-secondary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
