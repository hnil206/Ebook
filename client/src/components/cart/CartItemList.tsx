'use client';
import { ProductType} from '@/hooks/shop/use-cart-store'
import CartItem from "./CartItem";

interface CartItemListProps {
  cart: ProductType[];
  insufficientList: string[];
}

export default function CartItemList({ cart, insufficientList }: CartItemListProps) {
  return (
    <ul className="grid gap-4 px-6">
      {cart.map((product: ProductType) => (
        <li
          key={product._id}
          className={`relative ${
            insufficientList.includes(product._id as never)
              ? "border-2 border-red-500 rounded-lg p-2"
              : ""
          }`}
        >
          <CartItem item={product} />
          {insufficientList.includes(product._id as never) && (
            <span className="absolute top-0 right-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded-b-md">
              Insufficient Stock
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}