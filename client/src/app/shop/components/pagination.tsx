'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCallback } from 'react';

export default function Pagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const handlePageChange = useCallback((page: number) => {
        if (searchParams) {
            const params = new URLSearchParams(searchParams);
            params.set('page', page.toString());
            router.push(`/shop?${params.toString()}`, { scroll: false });
        }
    }, [searchParams, router]);

    return (
        <div className="flex justify-center items-center mt-8 space-x-2">
            <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
            >
                Trước
            </Button>
            <span className="mx-4">
                Trang {currentPage} / {totalPages}
            </span>
            <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
            >
                Sau
            </Button>
        </div>
    );
}
