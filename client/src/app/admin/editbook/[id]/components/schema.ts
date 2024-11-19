"use client"

import * as z from 'zod';

const formSchema = z.object({
  title: z.string().min(2, {message: "Title must be at least 2 characters long"}).max(50, {message: "Title must be at most 50 characters long"}),
  description: z.string().min(2).max(2000),
  status: z.string().min(2).max(50),
//   author: z.object({
//     name: z.string().min(2).max(50),
//     description: z.string().min(2).max(2000),
//   }),
    author_name: z.string().min(2).max(50),
    author_description: z.string().min(2).max(2000),
  category: z.array(z.object({ name: z.string().min(2).max(50) })),
  cover: z.string().url(),
  bookUrl: z.string().url({message: "Please enter a valid URL"}),
  price: z.number().min(1000).max(1000000),
  currentQuantity: z.number().min(0).max(1000000),
  forPremium: z.string(),
})
export default formSchema