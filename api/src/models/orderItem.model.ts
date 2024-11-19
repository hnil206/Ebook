import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem extends Document {
  orderId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  price: number;
  subTotal: number;
}

const OrderItemSchema: Schema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  productName: { type: String, required: true },
  productImage: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  subTotal: { type: Number, required: true },
});

const OrderItem = mongoose.model<IOrderItem>('OrderItem', OrderItemSchema);
export default OrderItem;
