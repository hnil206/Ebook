'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import axios from '@/lib/axios';
import { Separator } from '@radix-ui/react-separator';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PagePagination from '../pagepagination';
import BookCard from './bookcard';
import { Book } from './listbook';

interface Sort {
  sortBy: 'title' | 'createdAt' | 'updatedAt' | 'views';
  sortOrder: 'asc' | 'desc';
}

export interface PageQuery {
  page?: number; //&skip=0&take=10
  query?: string; //authorName=John%20Doe&title=Example&category=Fiction
  sort?: Sort; //&sortBy=createdAt&sortOrder=asc
  path?: string;
}

export default function BookPage({ page, query, sort, path }: PageQuery) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState<number>(0);
  const take = 6;
  useEffect(() => {
    const fetch = async () => {
      const queryParams = [];
      queryParams.push(`${query}`);
      if (sort) {
        queryParams.push(`sortBy=${sort.sortBy}&sortOrder=${sort.sortOrder}`);
      }
      if (page) {
        queryParams.push(`take=${take}`);
        queryParams.push(`skip=${(page - 1) * take}`);
      }
      const queryString =
        queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      console.log(queryString);
      const res = await axios.get(`/book/${queryString}`);
      const data = await res.data;
      setBooks(data.books);
      setTotal(data.total);
      setIsLoading(false);
      console.log(data);
    };
    fetch();
    return () => {
      setBooks([]);
      setIsLoading(true);
    };
  }, [page, query, sort, path]);
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {path!.includes('category') && (
          <BreadcrumbBook href={path!} name={'Category'} />
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {books.map((_, i) => (
              <BookSkeleton index={i} />
            ))}
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-8">Books</h1>
            {getQueryFieldAndValue(query) && (
              <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
                {getQueryFieldAndValue(query)!.field === 'category' && (
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {`Category: ${getQueryFieldAndValue(query)!.value}`}
                  </div>
                )}
                {getQueryFieldAndValue(query)!.field === 'title' && (
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {`Search: ${getQueryFieldAndValue(query)!.value}`}
                  </div>
                )}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <div key={book._id}>
                  <BookCard book={book} />
                </div>
              ))}
            </div>
            <Separator className="my-6" />
            <PagePagination
              page={page ?? 0}
              totalPage={Math.ceil(total / take)}
              href={path as string}
            />
          </div>
        )}
      </div>
    </>
  );
}
export function BookSkeleton({ index }: any) {
  return (
    <div
      key={index}
      className="rounded-lg bg-white shadow-md transition-transform duration-300 dark:bg-gray-800"
    >
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <Skeleton className="h-full w-full rounded-t-lg" />
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="ml-2 h-4 w-24" />
        </div>
        <Skeleton className="mb-2 h-6 w-full" />
        <Skeleton className="mb-4 h-4 w-full" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  );
}
function getQueryFieldAndValue(queryString?: string) {
  if (!queryString) return null;
  const queries = queryString.split('&');
  for (let query of queries) {
    const [key, value] = query.split('=');
    if (key === 'authorName' || key === 'title' || key === 'category') {
      return { field: key, value: decodeURIComponent(value) };
    }
  }
  return null; // Nếu không tìm thấy trường nào hợp lệ
}
export function BreadcrumbBook({ name, href }: { name: string; href: string }) {
  return (
    <div className="py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-xl" asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-xl" asChild>
              <Link href={href}>{name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
