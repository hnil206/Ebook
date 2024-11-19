'use client';
import React, { useEffect, useState } from 'react';
import axiosWithAuth from '@/lib/axios';
import useAuth from '@/hooks/useAuth';
import axios from 'axios';
import { env } from '@/lib/validateEnv';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  BookOpen, 
  Heart, 
  Trash2, 
  ExternalLink,
  BookMarked,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

type Book = {
  _id: string;
  title: string;
  bookUrl: string;
  cover: string;
};

type BookEntry = {
  _id: string;
  userId: string;
  bookId: Book;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const FavouritesPage = () => {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState<BookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavourites = async () => {
    try {
      const token = user?.accessToken;
      if (!token) {
        return null;
      }
      const response = await axios.get('/favourites', { 
        baseURL: env.NEXT_PUBLIC_API_URL,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data;
      setFavourites(data);
    } catch (err) {
      console.error("Error fetching favourites:", err);
      setError("Failed to load favourites. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (bookId: string) => {
    try {
        const token = user?.accessToken;
        if (!token) return;

        await axios.delete(`/favourites/${bookId}`, {
            baseURL: env.NEXT_PUBLIC_API_URL,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setFavourites(prev => prev.filter(fav => fav.bookId._id !== bookId));
    } catch (err) {
        console.error("Error removing favourite:", err);
        alert("Failed to remove from favourites.");
    }
};

  useEffect(() => {
    fetchFavourites();
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-48 w-32" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return <FavouritesDisplay favourites={favourites} onRemove={handleRemoveFavorite} />;
};

type FavouritesDisplayProps = {
  favourites: BookEntry[];
  onRemove: (id: string) => void;
};

const FavouritesDisplay: React.FC<FavouritesDisplayProps> = ({ favourites, onRemove }) => {
  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="border-none shadow-lg dark:shadow-gray-800/10">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BookMarked className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Your Favourite Books
            </CardTitle>
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Manage your collection of favourite books
          </CardDescription>
        </CardHeader>
        <CardContent>
          {favourites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                You haven't added any favourites yet.
              </p>
              <Button asChild className="mt-4">
                <Link href="/">
                  Explore Books
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favourites.map((favourite) => (
                <Card 
                  key={favourite._id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="relative group">
                    <img
                      src={favourite.bookId.cover}
                      alt={favourite.bookId.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                      <Button 
                        size="icon"
                        variant="secondary"
                        asChild
                      >
                        <Link href={`/book/${favourite.bookId._id}`}>
                          <ExternalLink className="h-5 w-5" />
                        </Link>
                      </Button>
                      <Button 
                        size="icon"
                        variant="secondary"
                        asChild
                      >
                        <Link href={favourite.bookId.bookUrl}>
                          <BookOpen className="h-5 w-5" />
                        </Link>
                      </Button>
                      <Button 
                        size="icon"
                        variant="destructive"
                        onClick={() => onRemove(favourite.bookId._id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h2 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-100 line-clamp-1">
                      {favourite.bookId.title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Added on: {new Date(favourite.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FavouritesPage;