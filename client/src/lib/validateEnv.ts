import { createEnv } from '@t3-oss/env-nextjs';
import { config } from 'dotenv';
import { z } from 'zod';
config();
export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:5000/api'),
  },
  server: {
    VNPAY_TMN_CODE: z.string(),
    VNPAY_SECURE_SECRET: z.string(),
    VNPAY_HOST: z.string(),
    NODE_ENV: z.string().default('development'),
    NEXTAUTH_SECRET: z.string().default('secret'),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NODE_ENV: process.env.NODE_ENV,
    VNPAY_TMN_CODE: process.env.VNPAY_TMN_CODE,
    VNPAY_SECURE_SECRET: process.env.VNPAY_SECURE_SECRET,
    VNPAY_HOST: process.env.VNPAY_HOST,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
});
