'use server';
import axios, { axiosWithAuth } from "@/lib/axios";
import { OrderItemType, OrderStatus, OrderType, PaymentStatus, ShippingStatus } from "../checkout/page";
import { headers } from "next/headers";
import { CreateOrderInput } from "../shop/use-cases";
import { getServerAuth } from "@/hooks/shop/use-server-session";

export const checkIneficient = async (cartItem: {
    productId: string;
    quantity: number;
}[]) => {
    try {
        console.log('cartItem', cartItem);
        const response = await axios.post('/shop/check-inefficient', { cartItem });
        return response.data.insufficientProductIds;
    } catch (error) {
        console.log('Error checkIneficient', error);
        throw new Error('Error checkIneficient');
    }
}

export const getProductById = async (productId: string) => {
    try {
        const response = await axios.get(`/book/${productId}`);
        return response.data;
    } catch (error) {
        console.log('Error getProductById', error);
        throw new Error('Error getProductById');
    }
}

export const getShopProducts = async (page: number, pageSize: number, search?: string, category?: string, minPrice?: number, maxPrice?: number) => {
    try {
        const response = await axios.get(`/shop/products`, {
            params: { page, pageSize, search, category, minPrice, maxPrice }
        });
        return response.data.products;
    } catch (error) {
        console.log('Error getShopProducts', error);
        throw new Error('Error getShopProducts');
    }
}

export const getCategories = async () => {
    try {
        const response = await axios.get('/shop/categories');
        return response.data;
    } catch (error) {
        console.log('Error getCategories', error);
        throw new Error('Error getCategories');
    }
}

export const getOrderById = async (orderId: string) => {
    try {
        const {user} = await getServerAuth();
        if (!user) {
            throw new Error('User not found');
        }   
        const response = await axiosWithAuth(user.accessToken).get(`/shop/orders/${orderId}`);
        // const response = await axios.get(`/shop/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.log('Error getOrderById', error);
        throw new Error('Error getOrderById');
    }
}

export const createOrder = async ({
    orderData,
    token
}: {
    orderData: CreateOrderInput,
    token: string;
}) => {
    try {
        const response = await axios.post('/shop/orders', { orderData }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        return response.data;
    } catch (error) {
        console.log('Error createOrder', error);
        throw new Error('Error createOrder');
    }
}
