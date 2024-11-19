import '@/app/globals.css';
import SessionWrapper from '@/components/SessionWrapper';
import EbookViewer from '@/components/ui.custom/ebook';
import UserWrapper from '@/components/UserWrapper';
import axios from '@/lib/axios';
import axiosDefault from 'axios';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ThemeProvider } from 'next-themes';
export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch all book IDs or a subset of book IDs
  const res = await axios.get('/book');
  const books = await res.data.books;

  // Generate the paths
  const paths = books.map((book: any) => ({
    params: { id: book._id.toString() },
  }));

  return {
    paths,
    fallback: 'blocking', // or false if you want 404 for non-existent paths
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id;
  try {
    const res = await axios.get(`/book/${id}`);
    const book = res.data;

    return {
      props: { book },
      revalidate: 60,
    };
  } catch (error) {
    if (axiosDefault.isAxiosError(error) && error.response?.status === 404) {
      return {
        notFound: true, // This will render the 404 page
      };
    }
    // For other errors, you might want to log them and still return a 404
    console.error('Error fetching book:', error);
    return {
      notFound: true,
    };
  }
};
export default function Ebook({ book }: { book: any }) {
  if (!book) return null;
  else
    return (
      <>
        <SessionWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <UserWrapper>
              <EbookViewer book={book} />
            </UserWrapper>
          </ThemeProvider>
        </SessionWrapper>
      </>
    );
}
