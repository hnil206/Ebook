import mongoose, { Schema, Document } from 'mongoose';

// Define enums
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  COD = 'cod',
  VNPAY = 'vnpay'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum ShippingStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered'
}


// dto

export interface IOrderInput {
  name: string;
  phone: string;
  email: string;
  paymentMethod: PaymentMethod;
  address: string;
  province: string;
  ward: string;
  district: string;
  fee: number;
  orderItems: {
    productId: string;
    quantity: number;
    subtotal: number;
  }[];
  districtId: number;
  wardCode: string;
  provinceId: number;
}

// Define the interface for the Order document
export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  orderNumber: string;
  name: string;
  email: string;
  phone: string;
  shippingAddress: {
    address: string;
    ward: string;
    district: string;
    province: string;
  };
  orderItems: mongoose.Types.ObjectId[];
  shippingFee: number;
  total: number;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Order schema
const OrderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  shippingAddress: {
    address: { type: String, required: true },
    ward: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
  },
  orderItems: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }],
  shippingFee: { type: Number, required: true },
  total: { type: Number, required: true, default: 0 },
  orderStatus: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
  paymentMethod: { type: String, enum: Object.values(PaymentMethod), required: true },
  paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
  shippingStatus: { type: String, enum: Object.values(ShippingStatus), default: ShippingStatus.PENDING },
  trackingNumber: { type: String }
}, {
  timestamps: true
});

// Create and export the Order model
const Order = mongoose.model<IOrder>('Order', OrderSchema);
export default Order;