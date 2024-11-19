import { CartItemType } from "@/hooks/shop/use-cart-store";

import { ProductType } from "@/hooks/shop/use-cart-store";

export const getItemList = (cart: ProductType[]): CartItemType[] => {
    return cart.map((item: ProductType) => ({
        productId: item._id,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
    }));
};

export function vietnamCurrency(price: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export function calculateTotal(orderItems?: {subtotal: number}[]): number {
    const itemsTotal = orderItems?.reduce((acc, item) => acc + item.subtotal, 0) ?? 0;
    return itemsTotal;
  }