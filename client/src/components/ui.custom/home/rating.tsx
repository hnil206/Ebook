import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useAuth from '@/hooks/useAuth';
import { axiosWithAuth } from '@/lib/axios';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Rating {
  score: number;
}

interface RateProps {
  ratings: Rating[];
  bookId: string;
}

export default function Rate({ bookId, ratings }: RateProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
      : 0;

  const handleRate = async (index: number) => {
    try {
      const token = user?.accessToken;
      if (!token) return null;
      if (isSubmitting) return;

      const newRating = index + 1;
      const isRated = newRating === rating;

      setIsSubmitting(true);
      setRating(isRated ? 0 : newRating);
      await axiosWithAuth(token).post(`/book/rating`, {
        bookId: bookId,
        score: isRated ? 0 : newRating,
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const isRating = async () => {
      const token = user?.accessToken;
      if (!token) return null;

      const res = await axiosWithAuth(token).get(`/book/rating/${bookId}`);
      if (typeof res.data !== 'number') {
        console.error('Invalid rating data:', res.data);
        return null; // Handle the case where data is not a number
      }
      console.log(res.data);
      setRating(res.data);
    };
    isRating();
  }, [user, handleRate]);
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-4">
        {/* Star Rating */}
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <TooltipProvider key={i}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star
                      className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
                        i < (hoveredRating || rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill={
                        i < (hoveredRating || rating) ? 'currentColor' : 'none'
                      }
                      onClick={() => handleRate(i)}
                      onMouseEnter={() => setHoveredRating(i + 1)}
                      onMouseLeave={() => setHoveredRating(0)}
                    />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{i + 1} stars</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* Rating Stats */}
        <div className="flex items-center gap-3 text-sm">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1"
          >
            <span className="font-medium text-base">
              {averageRating.toFixed(1)}
            </span>
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
          </motion.div>
          <span className="text-muted-foreground">
            ({ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'})
          </span>
        </div>

        {/* Current User Rating */}
        {/* <motion.span
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={rating}
        >
          {rating ? `Your rating: ${rating}` : ''}
        </motion.span> */}
      </div>
    </div>
  );
}
