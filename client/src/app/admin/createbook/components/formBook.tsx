"use client";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "@/lib/axios";
import FormSchema from "./schema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileUploadDropzone from "@/components/ui.custom/FileUploads";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { env } from "@/lib/validateEnv";
import { Trash2, Plus } from "lucide-react";
import useAuth from "@/hooks/useAuth";

export default function FormBook() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  // Check if the user is an admin
  useEffect(() => {
    if (!user || !user.role.includes("admin")) {
      setMessage("You are not authorized to access this page");
      router.push("/"); // Redirect to home or another page if not admin
    }
  }, [user, router]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "",
      author_name: "",
      author_description: "",
      category: [{ name: "" }],
      cover: "",
      bookUrl: "",
      price: "",
      currentQuantity: "",
      forPremium: "", // Default value for forPremium
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "category",
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    setMessage("");
    try {
      const submissionData = {
        ...data,
        price: parseFloat(data.price as unknown as string) || 0,
        currentQuantity:
          parseInt(data.currentQuantity as unknown as string) || 0,
      };
      console.log("lol", submissionData);
      const response = await axios.post("/book", submissionData);
      setMessage("Book created successfully!");
      router.push("/admin/listbook");
    } catch (error) {
      setMessage("Failed to create book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (urls: string[] | string) => {
    form.setValue("bookUrl", Array.isArray(urls) ? urls[0] : urls);
  };

  const handleCoverUpload = (urls: string[] | string) => {
    form.setValue("cover", Array.isArray(urls) ? urls[0] : urls);
  };

  return (
    <div className="max-w-xl mx-auto p-6 shadow-lg rounded-lg bg-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {message && (
            <div
              className={`text-center ${
                message.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter book title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter book description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormLabel>Category</FormLabel>
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name={`category.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Enter category name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={() => remove(index)}
                variant="destructive"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => append({ name: "" })}>
            <Plus />
          </Button>
          <FormField
            control={form.control}
            name="author_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter author name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter author description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    <option value="">Select Status</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="DISCONTINUED">Discontinued</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter book price"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Quantity</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter current quantity"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
         
          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? <Spinner className="mr-2" /> : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}