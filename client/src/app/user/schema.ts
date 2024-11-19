"use client"

import * as z from 'zod';

const formSchema = z.object({
    username: z.string().min(2).max(50),
    avatar: z.string().url(),
    email: z.string().email(),
    _id: z.string(),
    role: z.array(z.string()),
    premiumStatus: z.object({
        isPremium: z.boolean(),
        expiresAt: z.date(),
    }),
});

export default formSchema;