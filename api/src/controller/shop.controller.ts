import { Request, Response, NextFunction } from 'express';
import * as ShopService from '../services/shop.service';
import { z } from 'zod';
import { PaymentMethod } from '../models/order.model';


//get shop products
const querySchema = z.object({
    page: z.coerce.number().int().positive().default(1), //tu dong chuyen doi input thanh so
    pageSize: z.coerce.number().int().positive().default(10),
    search: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().positive().optional(),
});

//check inefficient
const checkInefficientSchema = z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive()
}));


//create order
const createOrderSchema = z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
    paymentMethod: z.nativeEnum(PaymentMethod),
    address: z.string().min(1),
    ward: z.string().min(1),
    district: z.string().min(1),
    province: z.string().min(1),
    fee: z.number().default(0),
    orderItems: z.array(z.object({
        productId: z.string(),
        quantity: z.number().positive(),
        subtotal: z.number().positive()
    })),
    districtId: z.number().positive(),
    wardCode: z.string().min(1),
    provinceId: z.number().positive()
})




export const getShopProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = querySchema.parse(req.query);

        const result = await ShopService.getShopProducts(
            query.page,
            query.pageSize,
            query.search,
            query.category,
            query.minPrice,
            query.maxPrice);

        res.status(200).json(result);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.issues });
        }
        next(error);
    }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await ShopService.getCategories();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};



export const checkInefficient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderItems = checkInefficientSchema.parse(req.body.cartItem);
        const insufficientProductIds = await ShopService.checkInefficient(orderItems);
        res.status(200).json({ insufficientProductIds });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            next(error);
        }
    }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId!;
        console.log(userId);
        console.log(req.body);
        console.log(req.body.orderData.orderItems);
        const orderData = createOrderSchema.parse(req.body.orderData);
        const result = await ShopService.createOrder(userId, orderData);
        res.status(201).json(result);

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log('validation error', error.issues);
            res.status(400).json({ error: error.issues });
        } else {
            next(error);
        }
    }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params.orderId;
        const order = await ShopService.getOrderById(orderId);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
}

