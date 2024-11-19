'use client';
import BookPage from '@/components/ui.custom/home/bookpage';
import { useSearchParams } from 'next/navigation';

export default function Category({ params }: { params: { name: string } }) {
  const link = useSearchParams();
  const page = Number(link ? link.get('page') : 1); // Check if link is not null
  const query = `category=${params.name}`
  const path = `/category/${params.name}`
  return (
    <>
      <BookPage page={page} query={query} path={path}/>
    </>
  );
}
