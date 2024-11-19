import useAuth from "@/hooks/useAuth";
import CheckoutWrapper from "./checkout-wrapper";
import { notFound } from "next/navigation";



export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  COD = 'cod',
  VNPAY = 'vnpay',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed'
}

export enum ShippingStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered'
}

export interface OrderType {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  total: number;
  orderStatus: OrderStatus; 
  shippingStatus: ShippingStatus;
  paymentStatus: PaymentStatus;
  shipAddress: string;
  shipDate: Date | null;
  paymentMethod: string; // cod, vnpay
  orderItems: {
      _id: string;
      quantity: number;
      subtotal: number;
      product?: {
          _id: string;
          title: string;
          price: number;
          cover: string;
      };
      isRated: boolean; // danh gia sp sau khi mua
  }[];
}

export interface OrderItemType {
  id: string;
  quantity: number;
  subtotal: number;
  productId: string;
  orderId: string;
}

export default async function CheckoutPage() {
  return (
    <main className="flex-1 py-8 px-4 md:px-8">
      <CheckoutWrapper />
    </main>
  );
}