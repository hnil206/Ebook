import BookDetail from '@/components/ui.custom/home/bookdetail';
export default function BookDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <BookDetail id={params.id} />
    </>
  );
}
