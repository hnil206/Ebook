'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useState, useEffect, FormEvent } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const MIN_PRICE = 20000;
const MAX_PRICE = 100000; // Adjust this to your maximum product price

export default function PriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams() || new URLSearchParams();

  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setPriceRange([
      Number(searchParams.get('minPrice')) || MIN_PRICE,
      Number(searchParams.get('maxPrice')) || MAX_PRICE
    ]);
  }, [searchParams]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('minPrice', priceRange[0].toString());
    params.set('maxPrice', priceRange[1].toString());
    params.set('page', '1');
    router.push(`/shop?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          Giá: {priceRange[0]} đ - {priceRange[1]} đ
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold">Giá sản phẩm</h3>
          <Slider
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={5000}
            value={priceRange}
            onValueChange={setPriceRange}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Giá từ {priceRange[0]} đ</span>
            <span>Đến {priceRange[1]} đ</span>
          </div>
          <Button type="submit" className="w-full">
            Xác nhận
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}