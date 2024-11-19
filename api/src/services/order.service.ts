import Order, { ShippingStatus } from '../models/order.model';
import { IOrder } from '../models/order.model';
import mongoose from 'mongoose';
// Fetch all orders
export const getAllOrders = async (): Promise<IOrder[]> => {
    return await Order.find().lean(); // Fetch all orders from the database
};

// Update shipping status
export const updateShippingStatus = async (orderId: string, status: ShippingStatus): Promise<IOrder | null> => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new Error('Invalid order ID');
    }
    return await Order.findByIdAndUpdate(orderId, { shippingStatus: status }, { new: true }).lean();
};
