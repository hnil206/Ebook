// 'use client'
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { useForm } from "react-hook-form";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// interface Book {
//   _id: string;
//   title: string;
//   description: string;
//   cover: string;
//   status: string;
//   bookUrl: string;
// }

// export default function EditBook({ params }: { params: { id: string } }) {
//   const router = useRouter();
//   const [book, setBook] = useState<Book>({
//     _id: '',
//     title: '',
//     description: '',
//     cover: '',
//     status: '',
//     bookUrl: '',
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchBook();
//   }, []);

//   const fetchBook = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(`http://localhost:5000/api/books/${params.id}`);
//       setBook(response.data);
//     } catch (error) {
//       console.error('Error fetching book:', error);
//       setError('Failed to fetch book details. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setBook({ ...book, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'cover' | 'bookUrl') => {
//     const { files } = e.target;
//     if (files && files.length > 0) {
//       const file = files[0];
//       const fileUrl = URL.createObjectURL(file); // Create a URL for the uploaded file
//       setBook((prevBook) => ({ ...prevBook, [field]: fileUrl })); // Update the state with the file URL
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     try {
//       await axios.put(`http://localhost:5000/api/books/${params.id}`, book);
//       router.push('/admin/listbook');
//     } catch (error) {
//       console.error('Error updating book:', error);
//       setError('Failed to update book. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500 text-center mt-10">{error}</div>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
//       <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Book</h1>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={book.title}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <div>
//             <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
//             <input
//               type="file"
//               id="cover"
//               name="cover"
//               accept="image/*"
//               onChange={(e) => handleFileChange(e, 'cover')}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//         </div>
//         <div>
//           <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//           <textarea
//             id="description"
//             name="description"
//             value={book.description}
//             onChange={handleChange}
//             required
//             rows={4}
//             className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//           ></textarea>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select
//               id="status"
//               name="status"
//               value={book.status}
//               onChange={handleChange}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="ONGOING">Ongoing</option>
//               <option value="COMPLETED">Completed</option>
//               <option value="DISCONTINUED">Discontinued</option>
//             </select>
//           </div>
//           <div>
//             <label htmlFor="bookUrl" className="block text-sm font-medium text-gray-700 mb-1">Book URL (File)</label>
//             <input
//               type="file"
//               id="bookUrl"
//               name="bookUrl"
//               accept=".epub,.pdf"
//               onChange={(e) => handleFileChange(e, 'bookUrl')}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//         </div>
//         <div className="flex justify-between items-center mt-6">
//           <Link href="/admin/listbook" className="text-gray-600 hover:text-gray-800 transition duration-300">
//             Back to List
//           </Link>
//           <button 
//             type="submit" 
//             className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
//             disabled={isLoading}
//           >
//             {isLoading ? 'Updating...' : 'Update Book'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }