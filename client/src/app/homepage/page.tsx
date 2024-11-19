'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface Author {
  _id?: string
  name: string
  description?: string
}

interface Category {
  _id?: string
  name: string
}
interface Book {
  _id: string;
  title: string;
  cover: string;
  status: string;
  createdAt: string; // Assuming createdAt is a string
  author?: Author | string;
  category?: Category | string;
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books', {
          params: {
            category: selectedCategory,
            startDate,
            endDate,
          },
        });
        if (Array.isArray(response.data.books)) {
          setBooks(response.data.books);
        } else {
          throw new Error('Expected an array of books');
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Failed to fetch books. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [selectedCategory, startDate, endDate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Book Library</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book: Book) => (
          <Card key={book._id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg transform hover:scale-105">
            <CardHeader>
              <img src={book.cover} alt={book.title} className="w-full h-48 object-cover" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl font-semibold">{book.title}</CardTitle>
              <Link href={`/books/${book._id}`} className="mt-2 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                View Details
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}