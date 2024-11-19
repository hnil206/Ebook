import { Router } from 'express';
import * as OrderController from '../controller/order.controller';
import roleRequire, { authMiddleware } from '../configs/middleware.config';
import Order from '../models/order.model';

const router = Router();

// Route to get all orders
router.get('/', OrderController.getAllOrders);

// Route to update shipping status
router.put('/shipping-status/:id', OrderController.updateShippingStatus);

// router.get('/your-orders/:id', OrderController.getUserOrders);   

router.get('/your-orders', roleRequire(), async (req, res) => {
    const userId = req.userId as string;
    const orders = await Order.find({ userId }).populate('orderItems');
    res.status(200).json(orders);
});

export default router;