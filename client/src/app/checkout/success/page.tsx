import { redirect } from 'next/navigation';
import { getOrderByIdUseCase } from '@/app/shop/use-cases';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, CheckCircle } from "lucide-react";
import Link from 'next/link';
import { vietnamCurrency } from '@/utils';
import ClearCart from './clear-cart';

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: { orderId: string } }) {
  const { orderId } = searchParams;

  if (!orderId || typeof orderId !== 'string') {
    redirect('/');
  }

  const order = await getOrderByIdUseCase(orderId);

  if (!order) {
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <ClearCart />
      <Card className="max-w-2xl mx-auto dark:bg-slate-900">
        <CardHeader className="text-center">
          <CheckCircle className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">Đặt hàng thành công!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Cảm ơn bạn đã mua hàng tại <span className="font-bold text-secondary-400">EBook</span>. Mã đơn hàng của bạn là:
            </p>
            <p className="text-center font-semibold text-xl">{order.id}</p>
            <div className="border-t border-b py-4">
              <h3 className="font-semibold mb-2">Chi tiết đơn hàng:</h3>
              <ul className="space-y-2">
                {order.orderItems.map((item: any) => (
                  <li key={item._id} className="flex justify-between">
                    <span>{item.product?.title} x {item.quantity}</span>
                    <span>{vietnamCurrency(item.subTotal)}</span> 
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Tổng cộng:</span>
              <span>{vietnamCurrency(order.total)}</span>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <Button asChild>
                <Link href="/shop">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Tiếp tục mua sắm
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/purchase">
                  Xem đơn hàng
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}