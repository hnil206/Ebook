'use client';
import BookPage from '@/components/ui.custom/home/bookpage';
import { useSearchParams } from 'next/navigation';

export default function Search({ params }: { params: { value: string } }) {
  const link = useSearchParams();
  const page = Number(link ? link.get('page') : 1);
  const query = `title=${params.value}`;
  const path = `/search/${params.value}`;
  return (
    <>
      <BookPage page={page} query={query} path={path} />
    </>
  );
}
