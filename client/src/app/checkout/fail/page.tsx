import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, XCircle } from "lucide-react";
import Link from 'next/link';

export default function CheckoutFailPage({ searchParams }: { searchParams: { error?: string } }) {
  const { error } = searchParams;

  if (!error) {
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <Card className="max-w-2xl mx-auto dark:bg-slate-900">
        <CardHeader className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">Đặt hàng không thành công!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Rất tiếc, đã xảy ra lỗi trong quá trình đặt hàng tại <span className="font-bold text-secondary-400">Ebook</span>.
            </p>
            <p className="text-center font-semibold text-xl text-red-500">{error}</p>
            <div className="border-t border-b py-4">
              <h3 className="font-semibold mb-2">Bạn có thể thử:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Kiểm tra lại thông tin thanh toán</li>
                <li>Đảm bảo kết nối internet ổn định</li>
                <li>Thử lại sau vài phút</li>
              </ul>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <Button asChild>
                <Link href="/cart">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Quay lại giỏ hàng
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/shop">
                  Tiếp tục mua sắm
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}