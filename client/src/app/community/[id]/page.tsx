import ListComment from '@/components/ui.custom/comment/listcomment';
import Post from '../components/DemoPost';

export default async function PostDetails({ params }: { params: { id: string } }) {
    return (
        <>
            <Post id={params.id} />
            <ListComment objectId={params.id} />
        </>
    );
};