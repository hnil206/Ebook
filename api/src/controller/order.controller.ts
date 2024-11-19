import { Request, Response, NextFunction } from 'express';
import * as OrderService from '../services/order.service';
import { ShippingStatus } from '../models/order.model';

// Get all orders
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await OrderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

// Update shipping status
export const updateShippingStatus = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id; // Extracting orderId from the request parameters
    const { status } = req.body; // Expecting status in the request body
    try {
        const updatedOrder = await OrderService.updateShippingStatus(orderId, status);
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        next(error);
    }
};
