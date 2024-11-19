import React from 'react';
import Pagination from './pagination';
import ProductListContent from './ProductListContent';
import { getShopProductsUseCase } from '@/app/shop/use-cases';

interface Product {
  id: number;
  name: string;
  description: string;
  currentQuantity: number;
  price: number;
  category: string;
  cover: string;
  author: {
    name: string;
  }
}
export default async function ProductList({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 6;
  const search = searchParams.search as string | undefined;
  const category = searchParams.category as string | undefined;
  const minPrice = Number(searchParams.minPrice) || undefined;
  const maxPrice = Number(searchParams.maxPrice) || undefined;

  const { products, totalProducts } = await getShopProductsUseCase({ page, pageSize, search, category, minPrice, maxPrice });
  console.log('products', products);
  // await n0ew Promise(resolve => setTimeout(resolve, 2000));
  return (
    <>
      {products.length > 0 ? (
        <>
          <ProductListContent products={products} />
          <Pagination
            currentPage={page}
            totalPages={Math.max(1, Math.ceil(Number(totalProducts) / pageSize))}
          />
        </>
      ) : (
        <p className="text-center text-gray-500">No products found.</p>
      )}
    </>
  );
}


