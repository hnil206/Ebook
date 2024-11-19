import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';
export default function BookCard({ book }: any) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            className="h-full w-full hover:shadow-lg transition-all duration-200 rounded-lg"
            href={`/book/${book._id}`}
          >
            <div className="flex flex-col items-center p-4 h-full">
              <div className="w-full h-[350px] mb-4">
                <img
                  src={book.cover || '/api/placeholder/510/350'}
                  alt={`Cover of ${book.title}`}
                  className="h-full w-[510px] object-cover rounded-md"
                />
              </div>
              <div className="flex flex-col items-center flex-1">
                <h3 className="font-semibold text-lg text-center line-clamp-2 mb-2">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {book.author?.name || 'Unknown Author'}
                </p>
              </div>
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="w-64 p-4">
          <h4 className="font-bold mb-2">{book.title}</h4>
          <p className="text-sm mb-2">by {book.author?.name}</p>
          <p className="text-sm text-gray-600 line-clamp-3">
            {book.description || 'No description available'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
