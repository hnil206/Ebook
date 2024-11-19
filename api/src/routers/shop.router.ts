import { NextFunction, Request, Response, Router } from 'express';
import { getShopProducts, getCategories, checkInefficient, createOrder, getOrderById } from '../controller/shop.controller';
import { authMiddleware } from '../configs/middleware.config';


const router = Router();

router.get('/products', getShopProducts);
router.get('/categories', getCategories);
router.get('/orders/:orderId', authMiddleware, getOrderById);

router.post('/check-inefficient', checkInefficient);
router.post('/orders', authMiddleware, createOrder);



export default router;
