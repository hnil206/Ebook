'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import axios from '@/lib/axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import BookCard from './bookcard';

interface Category {
  _id: string;
  name: string;
}
export interface Book {
  _id: string;
  title: string;
  description: string;
  cover: string;
  views: number;
  status: 'ONGOING' | 'COMPLETED';
  bookUrl: string;
  author: Author;
  category: Category[];
  createdAt: string;
  updatedAt: string;
  ratings: Rating[];
  price: number;
}
interface Author {
  _id: string;
  name: string;
  description: string;
}
export interface Rating {
  userId: string;
  score: number;
}
interface CategoryBooks {
  books: Book[];
  total: number;
}
interface BooksByCategory {
  [categoryName: string]: CategoryBooks;
}

export default function ListBook() {
  const [listCategory, setListCategory] = useState<
    { category: string; cout: number }[] | null
  >();
  const [books, setBooks] = useState<BooksByCategory>({});
  const [loadingCategories, setLoadingCategories] = useState<{
    [key: string]: boolean;
  }>({}); // Track loading for each category
  useEffect(() => {
    const fetchListCategory = async () => {
      const res = await axios.get('/book/category');
      const data = await res.data;
      setListCategory(data);
    };
    fetchListCategory();
    return () => {
      setListCategory(null);
    };
  }, []);
  useEffect(() => {
    const fetchBook = async (category: string) => {
      setLoadingCategories((prev) => ({ ...prev, [category]: true })); // Set loading for the specific category
      const res = await axios.get(
        `/book/?category=${encodeURIComponent(category)}`,
      );
      const data = await res.data;
      setBooks((prevBooks) => ({
        ...prevBooks,
        [category]: data, // Lưu trữ sách theo danh mục
      }));
      setLoadingCategories((prev) => ({ ...prev, [category]: false })); // Set loading to false for the specific category
    };
    if (listCategory) {
      // console.log('chay lis cate');
      listCategory.forEach(async (category) => {
        fetchBook(category.category);
      });
    }
    return () => {
      setBooks({});
    };
  }, [listCategory]);
  console.log(books);
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Books by Category
      </h1>
      {Object.keys(books).map((category) => (
        <div key={category} className="mb-12">
          <Link
            className="text-3xl font-semibold mb-4 text-gray-700 hover:underline"
            href={`/category/${category}`}
          >
            {category}
          </Link>
          <Carousel
            opts={{
              align: 'start',
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {loadingCategories[category] // Check if loading for this category
                ? Array.from({ length: 4 }).map(
                    (
                      _,
                      index, // Display 4 skeletons
                    ) => (
                      <CarouselItem
                        key={index}
                        className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                      >
                        <Skeleton /> {/* Skeleton component */}
                      </CarouselItem>
                    ),
                  )
                : books[category].books.map((book) => (
                    <CarouselItem
                      key={book._id}
                      className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 transition-transform transform hover:scale-105 hover:shadow-lg"
                    >
                      <BookCard book={book} />
                    </CarouselItem>
                  ))}
            </CarouselContent>
            <CarouselPrevious className="text-gray-600 hover:text-gray-800" />
            <CarouselNext className="text-gray-600 hover:text-gray-800" />
          </Carousel>
        </div>
      ))}
    </div>
  );
}
