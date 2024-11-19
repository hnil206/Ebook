"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { vietnamCurrency } from '@/utils';
import { useAddToCart } from '@/hooks/shop/use-add-to-cart';

interface Product {
  _id: string;
  title: string;
  description: string;
  currentQuantity: number;
  price: number;
  category: string;
  cover: string;
  author: {
    name: string;
  };
}

export default function ProductListContent({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductItem key={product._id} product={product} />
      ))}
    </div>
  );
}

function ProductItem({ product }: { product: Product }) {
  const { handleAddToCart, isAdding } = useAddToCart();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCart(1, product);
  };

  return (
    <div className="bg-white flex">
      <div className="relative aspect-[2/3] w-2/3">
        <Image
          src={product.cover}
          alt={product.title}
          layout="fill"
          objectFit="cover"
          className='shadow-md'
        />
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <Link href={`/products/${product._id}`} className="block mb-2">
            <h3 className="text-lg font-bold text-gray-900 hover:text-primary transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mb-2">by {product.author.name}</p>
          <p className="text-sm text-gray-700 mb-4 line-clamp-3">{product.description}</p>
        </div>
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-primary">
              {vietnamCurrency(product.price)}
            </span>
          </div>
          <Button 
            onClick={handleClick}
            disabled={isAdding}
            className="w-full bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}