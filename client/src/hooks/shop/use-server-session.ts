import { getServerSession } from "next-auth/next";
import authOptions from "@/configs/nextauth.config";

export async function getServerAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      user: null,
      status: "unauthenticated",
    };
  }

  return {
    user: session.user,
    status: "authenticated",
  };
}