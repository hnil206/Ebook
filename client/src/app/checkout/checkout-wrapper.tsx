'use client';

import { useCartStore } from "@/hooks/shop/use-cart-store";
import { useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import CheckoutForm from "./component/CheckoutForm";
import useAuth from "@/hooks/useAuth";

export default function CheckoutWrapper() {

  const {user} = useAuth();
  if (!user) {
    return notFound();
  }
  const { cart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/');
    }
  }, [cart, router]);

  if (cart.length === 0) {
    return null;
  }

  return <CheckoutForm user={user ?? undefined} />;
}