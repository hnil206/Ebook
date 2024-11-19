'use client';

import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import React, { useState, useCallback } from 'react';

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams?.get('search') || '');

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams?.toString() || '');
        if (search) {
            params.set('search', search);
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        router.push(`/shop?${params.toString()}`, { scroll: false });
    }, [search, searchParams, router]);

    return (
        <form onSubmit={handleSearch} className="flex-grow max-w-md">
          <div className="flex items-center gap-1">
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nhập tên sản phẩm..."
              className="rounded-r-none"
            />
            <Button type="submit" className="rounded-l-none">
              Tìm kiếm
            </Button>
          </div>
        </form>
      );
}