import BookDetail from '@/components/ui.custom/home/bookdetail';
import ListComment from '@/components/ui.custom/comment/listcomment';
export default function BookDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <BookDetail id={params.id} />
      <ListComment objectId={params.id} />
    </>
  );
}
