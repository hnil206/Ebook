'use client'
import { useEffect, useMemo, useState } from "react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {  ShoppingBasket } from "lucide-react";
import useFromStore from "@/hooks/shop/use-from-store";
import { useCartStore } from "@/hooks/shop/use-cart-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { checkIneficientUseCase } from "@/app/shop/use-cases";
import useCartCalculations, { useTotalCalculation } from "@/hooks/shop/use-cart-calculation";
import CartItemList from "./CartItemList";
import EmptyCart from "./EmptyCart";
import InsufficientStockWarning from "./InsufficientStockWarning";
import { useTransition } from "react";
import CheckoutButton from "./CheckoutButton";
import { useRouter } from "next/navigation";
import { getItemList } from "@/utils";

export default function Cart() {
  // const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [insufficientList, setInsufficientList] = useState<string[]>([]);
  
  const cart = useFromStore(useCartStore, (state) => state.cart);

  const cartItems = useMemo(() => cart ? getItemList(cart) : [], [cart]);
  const { total } = useTotalCalculation(cart || []);

  useEffect(() => {
    const fetchInefficientItems = async () => {
      if (cart && cart.length > 0) {
        try {
          const result = await checkIneficientUseCase(cartItems);
          setInsufficientList(result || []);
        } catch (error) {
          console.error("Error checking inefficient items:", error);
          // Handle error (e.g., show a toast notification)
        }
      }
    };

    fetchInefficientItems();
  }, [cart, cartItems]);
  const hasItems = (cart && cart.length > 0);

  return (
    <Drawer direction="bottom" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-full bg-secondary-300 hover:bg-secondary-300 shadow-lg transition-transform hover:scale-105 active:scale-95 dark:bg-secondary-300 dark:text-white"
        >
          <ShoppingBasket className="h-5 w-5 text-primary-900 dark:text-primary-700" />
          <span className="font-semibold text-primary-900 dark:text-primary-700">
            ({cartItems.length})
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full inset-x-21 mx-4 max-w-md right-0 bg-white rounded-t-2xl shadow-xl dark:bg-gray-900">
        <DrawerHeader className="px-6 py-4 border-b">
          <DrawerTitle className="text-xl text-center font-semibold text-gray-800 dark:text-white">
            Giỏ hàng
          </DrawerTitle>
          <DrawerDescription className="text-center text-gray-500">
            Xem lại và thanh toán đơn hàng của bạn.
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="flex-1 overflow-auto py-4 max-h-[250px]">
          {hasItems ? (
            <>
              <CartItemList cart={cart || []} insufficientList={insufficientList} />
            </>
          ) : (
            <EmptyCart setIsOpen={setIsOpen} />
          )}
        </ScrollArea>
        {hasItems && (
          <DrawerFooter className="border-t px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium text-gray-800 dark:text-white">Tổng tiền</p>
              <p className="font-semibold text-xl text-primary-600 dark:text-primary-400">
                {new Intl.NumberFormat('vi', { style: 'currency', currency: 'VND' }).format(total)}
              </p>
            </div>
            <InsufficientStockWarning insufficientList={insufficientList} />
            <CheckoutButton
              insufficientList={insufficientList}
              onCheckout={() => router.push('/checkout')}
            />
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
