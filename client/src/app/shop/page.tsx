import Cart from "@/components/cart/Cart";
import { Suspense } from "react";
import { getBooks } from "../services/book";
import ProductList from "./components/product-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import SearchBar from "./components/search-bar";
import PriceFilter from "./components/price-filter";
import CategoryFilter from "./components/category-filter";

interface IBook{
    title: string;
    description: string;
    cover: string;
    views: number;
    status: string;
    createdAt: Date;
    lastUpdateAt: Date;
    bookUrl: string;
    author: IAuthor;
    category: ICategory;
  }

  interface IAuthor {
    name: string;
    description: string;
  }
  
  interface ICategory {
    name: string;
  }



export default async function Shop({
    searchParams,
  }: {
    searchParams: { [key: string]: string | string[] | undefined }
  }) {
    // const books = await getBooks();
    // console.log(books);
    return (
      <div className="container mx-auto px-4 py-8">
        {/* <div className="mb-8">
          <Banner />
        </div> */}
        <div className="mb-8">
          <Suspense fallback={<FiltersSkeleton />}>
            <div className="flex flex-wrap items-center gap-4">
              <SearchBar />
              <CategoryFilter />
              <PriceFilter />
            </div>
          </Suspense>
        </div>
        <div className="w-full">
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList searchParams={searchParams} />
          </Suspense>
        </div>
        <Cart/>
      </div>
    );
}



const FiltersSkeleton = () => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-10 w-64" />
    </div>
  );
};


const Banner: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Welcome to Our Ebook Store
        </h1>
        <p className="mt-6 text-xl max-w-3xl">
          Discover a world of knowledge at your fingertips. Browse our extensive collection of ebooks and start your reading journey today.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/shop">
              Browse Books
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/about">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 mb-4 mr-4 text-sm opacity-75">
        Image by <a href="https://unsplash.com" className="underline">Unsplash</a>
      </div>
    </div>
  );
};

const ProductListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-md dark:bg-gray-800"
        >
          <div className="absolute inset-0 z-10" />

          {/* Skeleton Image */}
          <Skeleton className="h-48 w-full object-cover object-center" />

          {/* Product Info Skeleton */}
          <div className="p-10 bg-background dark:bg-gray-900">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
          </div>
        </div>
      ))}
    </div>
  );
};


