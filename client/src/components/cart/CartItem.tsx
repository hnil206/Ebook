import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/shop/use-cart-store";
import { ProductType } from "@/hooks/shop/use-cart-store";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Alert } from "@/components/Alert";
import Image from "next/image";
import { useTransition } from "react";
import { getProductByIdUseCase } from "@/app/shop/use-cases";

interface Props {
  item: ProductType;
}

export default function CartItem({ item }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const imgNotFoundUrl = process.env.NEXT_PUBLIC_IMG_NOTFOUND;
  const updateCartItem = useCartStore((state) => state.updateCartItem);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const handleRemove = () => {
    setIsAlertOpen(true);
  };

  const handleConfirm = () => {
    removeFromCart(item);
    setIsAlertOpen(false);
  };

  const handleCancel = () => {
    setIsAlertOpen(false);
  };

  const handleUpdateQuantity = async (change: number) => {
    if (change === -1 && item.quantity === 1) {
      handleRemove();
      return;
    }

    if (change === 1) {
      try {
        const product = await getProductByIdUseCase(item._id);
        if (item.quantity + change > product?.currentQuantity!) {
          setErrorMessage("Quantity exceeds available stock!");
          setTimeout(() => setErrorMessage(null), 3000);
          return;
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setErrorMessage("Error updating quantity. Please try again.");
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }
    }

    updateCartItem(item, change);
  };

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
      <Image
        alt={item.title}
        src={item.cover}
        width={64}
        height={64}
        className="rounded-md object-cover"
      />
      <div className="grid gap-1">
        <h4 className="font-medium">{item.title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {
            new Intl.NumberFormat("vi", {
              style: "currency",
              currency: "VND",
            }).format(item.price)
          }
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <Button
            className="text-red-500 dark:text-red-400"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
          <Alert
            title="Xóa sản phẩm khỏi giỏ hàng?"
            description="Hành động này không thể hoàn tác. Điều này sẽ xóa sản phẩm khỏi giỏ hàng của bạn."
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            open={isAlertOpen}
            setOpen={setIsAlertOpen}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => 
              item.quantity === 1 ? handleRemove() : handleUpdateQuantity(-1)
            }
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="font-medium w-3">{item.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleUpdateQuantity(1)}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="h-[1px] text-xs text-red-500">
          {errorMessage && (
            <p>{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}