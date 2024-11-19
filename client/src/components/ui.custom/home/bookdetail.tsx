'use client';
import { Book } from '@/components/ui.custom/home/listbook';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React, { useEffect, useState } from 'react';

import Rating from './rating';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

import axios, { axiosWithAuth } from '@/lib/axios';

import useAuth from '@/hooks/useAuth';
import {
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  Globe,
  Heart,
  Share2,
} from 'lucide-react';
import Link from 'next/link';

interface Favourite {
  userId: string;
  bookId: {
    _id: string;
    title: string;
    bookUrl: string;
    cover: string;
  };
}
interface UserInfor{
  premiumStatus:{
    isPremium:boolean;
    expiryDate:Date;
  }
}
export default function BookDetail({ id }: { id: string }) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favourite, setFavourite] = useState<Favourite[] | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfor | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`/book/${id}`);
        setBook(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Error fetching book details');
        setLoading(false);
      }
    };

    const checkIfFavorite = async () => {
      if (user) {
        try {
          const response = await axiosWithAuth(user.accessToken).get(
            `/favourites`,
          );
          const favorites: Favourite[] = response.data; // Sử dụng kiểu Favourite đã định nghĩa
          console.log('favorites: ', favorites);
          const isFav = favorites.some(
            (fav: Favourite) => fav.bookId._id === id,
          ); // Sử dụng bookId._id
          console.log('isFav: ', isFav);
          setIsFavorite(isFav);
        } catch (err) {
          console.error('Error fetching favorites:', err);
        }
      }
    };
    const fetchUserInfo = async () => {
      const token = user?.accessToken;
      if (!token) {
        return;
      }
      const response = await axiosWithAuth(token).get("/users/user-info");
      setUserInfo(response.data);
    };

    fetchBook();
    checkIfFavorite();
    fetchUserInfo();
  }, [id, user]);

  // const checkFavourite = () => {
  //   if (favourite) {
  //     return favourite.bookId === book?._id; // Kiểm tra bookId có trong favourites không
  //   }
  //   return false;
  // }
  const handleAddToFavorite = async () => {
    try {
      const token = user?.accessToken;
      if (!token) {
        alert('Please login to add to favorites!');
        return;
      }
      if (isFavorite) {
        // Remove from favorites
        const response = await axiosWithAuth(token).delete(`/favourites/${id}`);
        console.log('response: ', response.data);
        setIsFavorite(false);
        alert('Book removed from favorites!');
      } else {
        // Add to favorites
        const response = await axiosWithAuth(token).post(`/favourites/${id}`);
        console.log('response: ', response.data);
        setFavourite(response.data);
        setIsFavorite(true);
        alert('Book added to favorites!');
      }
    } catch (err) {
      console.error('Error toggling favorites:', err);
      alert('Failed to toggle favorite status.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <Card className="animate-pulse">
          <CardHeader className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-8">
              <Skeleton className="h-96 w-72" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="container mx-auto mt-10">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!book) {
    return (
      <Alert className="container mx-auto mt-10">
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>
          The requested book could not be found.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <Breadcrumb>
        <BreadcrumbList className="text-lg">
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="dark:text-gray-400" />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-gray-600 dark:text-gray-300">
              {book.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="shadow-lg dark:shadow-gray-800/10 dark:border-gray-800">
        <CardContent className="p-0">
          <div className="md:flex">
            <div className="md:w-1/3 p-6 bg-gray-100 dark:bg-gray-800/50 rounded-l">
              <div className="sticky top-6">
                <img
                  className="w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                  src={book.cover}
                  alt={book.title}
                />
                <div className="mt-6 space-y-4">
                  <Button
                    className="w-full"
                    onClick={handleAddToFavorite}
                    variant={isFavorite ? 'secondary' : 'default'}
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${
                        isFavorite ? 'fill-current' : ''
                      }`}
                    />
                    {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
                  </Button>
                  {book.forPremium === "premium" && !userInfo?.premiumStatus.isPremium ? (
                    <Button variant="default" className="w-full" disabled>
                      <Globe className="w-4 h-4 mr-2" />
                      You need a premium account to read this book
                    </Button>
                  ) : (
                    <Button asChild className="w-full" variant="default">
                      <Link href={`/ebook/${book._id}`}>
                        <Globe className="w-4 h-4 mr-2" />
                        Read Book
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-8 md:w-2/3">
              <div className="flex flex-wrap gap-2 mb-4">
                {book.category.map((c) => (
                  <Badge
                    key={c.name}
                    variant="secondary"
                    className="text-sm dark:bg-gray-700 dark:text-gray-200"
                  >
                    {c.name}
                  </Badge>
                ))}
              </div>

              <CardTitle className="text-4xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                {book.title}
              </CardTitle>

              <CardDescription className="text-xl mb-6 flex items-center text-gray-600 dark:text-gray-300">
                by{' '}
                <span className="font-medium text-primary dark:text-primary/80 ml-1">
                  {book.author.name}
                </span>
              </CardDescription>
              {/* <div className="flex items-center mb-4">

              
              <div className="flex items-center mb-6 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">

                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < ((book as any).rating || 0)
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                    fill="currentColor"
                  />
                ))}
                <span className="ml-2 font-medium dark:text-gray-200">
                  {(book as any).rating || "Not rated"}
                </span>

              </div> */}
              <Rating bookId={book._id} ratings={book.ratings} />
              <div className="flex items-center space-x-2 mb-6">
                <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400 font-semibold">
                  {book.views} views
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-lg">
                {book.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <InfoItem
                  icon={
                    <BookOpen className="w-5 h-5 text-primary dark:text-primary/80" />
                  }
                  label="Status"
                  value={
                    <span className="font-medium text-primary dark:text-primary/80">
                      {book.status}
                    </span>
                  }
                />
                <InfoItem
                  icon={
                    <DollarSign className="w-5 h-5 text-primary dark:text-primary/80" />
                  }
                  label="Price"
                  value={
                    <span className="font-medium text-primary dark:text-primary/80">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(book.price)}
                    </span>
                  }
                />
                <InfoItem
                  icon={
                    <Calendar className="w-5 h-5 text-primary dark:text-primary/80" />
                  }
                  label="Published"
                  value={new Date(book.createdAt).toLocaleDateString()}
                />
                <InfoItem
                  icon={
                    <Clock className="w-5 h-5 text-primary dark:text-primary/80" />
                  }
                  label="Updated"
                  value={new Date(book.updatedAt).toLocaleDateString()}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 dark:shadow-gray-800/10 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl dark:text-gray-100">
            About the Author
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-start space-x-6">
          <Avatar className="w-24 h-24 border-2 border-gray-200 dark:border-gray-700">
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${book.author.name}`}
            />
            <AvatarFallback className="text-xl dark:bg-gray-700 dark:text-gray-200">
              {book.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
              {book.author.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {book.author.description || 'No description available'}
            </p>
          </div>
        </CardContent>
      </Card>
      {/* <CardFooter className="flex justify-between p-0">
        <Button asChild variant="outline">
      <CardFooter className="flex justify-between p-4">
        <Button 
          asChild 
          variant="outline" 
          className="shadow-sm dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <Link href={`/admin/editbook/${book._id}`}>
            <PenTool className="w-4 h-4 mr-2" />
            Edit Book
          </Link>
        </Button>
        <Button 
          asChild 
          variant="secondary" 
          className="shadow-sm dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <Link href="/admin/listbook">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Link>
        </Button>
      </CardFooter> */}
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center space-x-3 text-base">
      {icon}
      <span className="font-medium text-gray-700 dark:text-gray-300">
        {label}:
      </span>
      <span className="text-gray-600 dark:text-gray-400">{value}</span>
    </div>
  );
}
