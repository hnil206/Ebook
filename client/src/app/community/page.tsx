'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ListPost, { PostSkeleton } from './components/ListPost';
import { BreadcrumbCustom } from '@/components/ui.custom/Breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';

const DynamicCommunity = () => {
    const searchParams = useSearchParams();
    const page = Number(searchParams?.get('page') ?? 1);
    return <ListPost page={page} />;
};

const Community = () => {
    return (
        <main className="flex flex-col h-full ml-6">
            <BreadcrumbCustom name="Community" href="community" />
            <Suspense
                fallback={
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }, (_, i) => (
                            <PostSkeleton key={i} index={i} />
                        ))}
                    </div>
                }
            >
                <DynamicCommunity />
            </Suspense>
        </main>
    );
};

export default Community;