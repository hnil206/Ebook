"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormSchema from "./components/schema";
import * as z from "zod";
import FileUploadDropzone from "@/components/ui.custom/FileUploads";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EditBook({ params }: { params: { id: string } }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "ONGOING", // Default status
      author_name: "",
      author_description: "",
      category: [{ name: "" }],
      cover: "",
      bookUrl: "",
      price: 0,
      currentQuantity: 0,
      forPremium: "",
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [book, setBook] = useState<z.infer<typeof FormSchema> | null>(null);
  const [categories, setCategories] = useState<{ name: string }[]>([]);

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = async () => {
    console.log("fetching book");
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/book/${params.id}`);
      setBook(response.data);
      form.reset(response.data); // Reset form with fetched book data
    } catch (error) {
      console.error("Error fetching book:", error);
      setError("Failed to fetch book details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (urls: string[] | string) => {
    form.setValue("bookUrl", Array.isArray(urls) ? urls[0] : urls);
  };

  const handleCoverUpload = (urls: string[] | string) => {
    form.setValue("cover", Array.isArray(urls) ? urls[0] : urls);
  };

  const handleCategoryChange = (value: string, index: number) => {
    // const updatedCategories = form.getValues("category") || [];
    // updatedCategories[index] = { name: value };
    // form.setValue("category", updatedCategories);
    const updatedCategories = [...categories]; // Tạo một bản sao của mảng categories
    updatedCategories[index] = { name: value }; // Cập nhật giá trị mới
    setCategories(updatedCategories); // Cập nhật state với mảng mới
    form.setValue("category", updatedCategories);
  };

  const addCategory = () => {
    // const updatedCategories = form.getValues("category") || [];
    // updatedCategories.push({ name: "" });
    // form.setValue("category", updatedCategories);
    setCategories([...categories, { name: "" }]);
    form.setValue("category", categories);
  };

  const removeCategory = (index: number) => {
    // const updatedCategories = form.getValues("category") || [];
    // updatedCategories.splice(index, 1); // Remove the category at the specified index
    // form.setValue("category", updatedCategories);
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
    console.log(updatedCategories);
    form.setValue("category", updatedCategories);
  };

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("Submitting data:", data); // Kiểm tra dữ liệu gửi đi
    setIsLoading(true);
    setError(null);
    try {
      const submissionData = {
        ...data,
        price: parseFloat(data.price as unknown as string) || 0,
        currentQuantity:
          parseInt(data.currentQuantity as unknown as string) || 0,
      };
      const response = await axios.put(`/book/${params.id}`, submissionData);
      console.log("Response from API:", response.data); // Kiểm tra phản hồi từ API
      router.push("/admin/listbook");
    } catch (error) {
      console.error("Error updating book:", error);
      setError("Failed to update book. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setCategories(book?.category || []);
  }, [book]);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Edit Book
      </h1>
      <Form {...form}>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        {...field}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="cover"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <FileUploadDropzone
                        onFileUploads={handleCoverUpload}
                        maxFiles={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      required
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ONGOING">Ongoing</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="DISCONTINUED">Discontinued</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="bookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File ebook</FormLabel>
                    <FormControl>
                      <FileUploadDropzone
                        onFileUploads={handleFileUpload}
                        maxFiles={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        {...field}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="currentQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Quantity</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        {...field}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div>
            <FormLabel>Categories</FormLabel>
            {categories?.map((cat, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => handleCategoryChange(e.target.value, index)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Category Name"
                />
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addCategory}
              className="text-blue-500 hover:text-blue-700"
            >
              Add Category
            </button>
          </div>
          <div>
          <FormField
            control={form.control}
            name="forPremium"
            render={({ field }) => (
              <FormItem>
                <FormLabel>For Premium Users</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="user">User</option>
                    <option value="premium">Premium</option>
                  </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-between items-center mt-6">
            <Link
              href="/admin/listbook"
              className="text-gray-600 hover:text-gray-800 transition duration-300"
            >
              Back to List
            </Link>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              disabled={isLoading}
              onClick={() => handleSubmit(form.getValues())}
            >
              Update
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
