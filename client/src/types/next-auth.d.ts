import NextAuth from "next-auth/next";
import { Session as NextAuthSession } from 'next-auth';
declare module "next-auth" {
  interface User extends User {
    role: string[];
  }
  // interface JWT extends JWT {
  //   userId: string;
  //   role: string[];
  // }
  interface Session extends NextAuthSession {
    user: {
      // id: string;
      name: string;
      username: string;
      email:string;
      image:string;
      role: string[];
      accessToken: string;
    }
  }
}