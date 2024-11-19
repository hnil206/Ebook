import { ShoppingBagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyCartProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function EmptyCart({ setIsOpen }: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <ShoppingBagIcon className="h-16 w-16 text-primary-400 dark:text-primary-300" />
      <h2 className="text-xl font-semibold text-secondary-400 dark:text-secondary-300 mt-4">
        Giỏ hàng của bạn đang trống
      </h2>
      <p className="text-gray-500 mt-2">
        Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.
      </p>
      <Button
        variant="outline"
        className="mt-6 px-6 py-3 rounded-full transition-colors hover:text-primary-600 hover:bg-secondary-100"
        onClick={() => setIsOpen(false)}
      >
        Bắt đầu mua sắm
      </Button>
    </div>
  );
}