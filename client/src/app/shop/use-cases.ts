// import { useTotalCalculation } from "@/hooks/shop/use-cart-calculation";

// import useCartCalculations from "@/hooks/shop/use-cart-calculation";
import { ProductType } from "@/hooks/shop/use-cart-store";
// import { getItemList } from "@/utils";
import { checkIneficient, getProductById, getShopProducts, getOrderById, createOrder } from "../services/shop";
import { InsufficientProductQuantityError } from "@/utils/errors";
import { PaymentMethod, PaymentStatus, ShippingStatus } from "../checkout/page";
// import { createOrderGHN } from "@/lib/ghn";
import moment from "moment";


export interface CreateOrderInput {
    name: string;
    email: string;
    phone: string;
    address: string;
    province: string;
    district: string;
    ward: string;
    paymentMethod: string;
    orderItems: OrderItem[];
    fee?: number;
    districtId: number;
    wardCode: string;
    provinceId?: number;
}

interface OrderItem {
    productId: string;
    quantity: number;
    subtotal: number;
}

interface Order {
    _id: string;
    orderNumber?: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    total: number;
    shipAddress: string;
    trackingNumber: string;
    paymentMethod: string;
    paymentStatus: string;
    shippingStatus: string;
    createdAt: Date;
    shipDate: Date;

}


export const checkIneficientUseCase = async (cartItem: {
    productId: string;
    quantity: number;
}[]): Promise<string[]> => {
    const insufficientList = await checkIneficient(cartItem);
    return insufficientList;
}

export const getProductByIdUseCase = async (productId: string): Promise<ProductType> => {
    const product = await getProductById(productId);
    return product;
}

export const getShopProductsUseCase = async ({
    page, pageSize, search, category, minPrice, maxPrice
}: {
    page: number,
    pageSize: number,
    search?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number
}): Promise<{ products: ProductType[], totalProducts: number }> => {
    const products = await getShopProducts(page, pageSize, search, category, minPrice, maxPrice);
    return { products, totalProducts: products.length };
}


export async function createOrderUseCase({
    orderData,
    user
}: {
    orderData: CreateOrderInput,
    user: {
        accessToken: string;
    }
}): Promise<Order> {
    try {
        const insufficientProducts = orderData.orderItems?.length ? await checkIneficient(orderData.orderItems) : [];

        if (insufficientProducts.length > 0) {
            throw new InsufficientProductQuantityError();
        }

        const order = await createOrder({
            orderData,
            token: user.accessToken
        });

        // Promise.all([
        //     sendEmail(
        //         order.email,
        //         `Order Confirmation for Order #${order.id}`,
        //         <OrderConfirmationEmail order={order as any} />
        //     ),
        //     createOrderGHN({
        //         order,
        //         districtId: orderData.districtId,
        //         wardCode: orderData.wardCode,
        //     })
        // ]).catch(error => console.error('Error in background tasks:', error));

        return order;
    } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order', { cause: error });
    }
}




export const getOrderByIdUseCase = getOrderById;
// export const updateOrderUseCase = updateOrder;
// export const getOrdersUseCase = getOrders;
// export const getOrdersByUserUseCase = getOrdersByUser;

function generateUserId(): number {
    return parseInt(moment().format("DDHHmmss"));
}

function calculateTotal(orderItems?: OrderItem[]): number {
    const itemsTotal = orderItems?.reduce((acc, item) => acc + item.subtotal, 0) ?? 0;
    return itemsTotal;
}

function formatShipAddress({ address, district, ward }: CreateOrderInput): string {
    return `${address}, ${district}, ${ward}`;
}

function determinePaymentStatus(paymentMethod: string): PaymentStatus {
    return paymentMethod === PaymentMethod.COD ? PaymentStatus.PENDING : PaymentStatus.PAID;
}