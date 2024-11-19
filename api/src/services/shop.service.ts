import Book from '../models/book.model';
import Category from '../models/catagory.model';
import mongoose from 'mongoose';
import Order, { IOrderInput, OrderStatus, PaymentMethod, PaymentStatus, ShippingStatus } from '../models/order.model';
import { IOrder } from '../models/order.model';
import OrderItem from '../models/orderItem.model';
import { generateOrderNumber } from '../utils';

interface ShopProductsResult {
    products: any[];
    totalPages: number;
    currentPage: number;
    totalProducts: number;
}

export const getShopProducts = async (
    page: number,
    pageSize: number,
    search?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number
): Promise<ShopProductsResult> => {
    const query: any = {};

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { 'author.name': { $regex: search, $options: 'i' } }
        ];
    }

    if (category) {
        if (mongoose.Types.ObjectId.isValid(category)) {
            query.category = new mongoose.Types.ObjectId(category);
        } else {
            query.category = null;
        }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) query.price.$gte = minPrice;
        if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    const skip = (page - 1) * pageSize;


    const [products, totalProducts] = await Promise.all([
        Book.find(query)
            .skip(skip)
            .limit(pageSize)
            .populate('author', 'name')
            .populate('category', 'name')
            .lean(),
        Book.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalProducts / pageSize);

    return {
        products,
        totalPages,
        currentPage: page,
        totalProducts
    };
};

export const getCategories = async () => {
    /*
    when use lean
        - The result will be a plain JavaScript object instead of a Mongoose document.
        - When just query data, not use any middleware or virtuals, we can use lean() for better performance
    */

    return Category.find({}).lean();
};


export const checkInefficient = async (orderItems: {
    productId: string;
    quantity: number;
}[]) => {
    const productIds = orderItems.map((item) => item.productId);

    const productsCheck = await Book.find({ _id: { $in: productIds } }).lean();

    const insufficientProductIds = productsCheck.filter((product) => {
        const orderItem = orderItems.find(
            (item) => item.productId === product._id.toString()
        );
        return !orderItem || product.currentQuantity < orderItem.quantity;
    }).map((product) => product._id);

    return insufficientProductIds;
};


export const createOrder = async (userId: string, orderData: IOrderInput): Promise<IOrder> => {

    try {
        const productIds = orderData.orderItems.map((item) => item.productId);
        const products = await Book.find({ _id: { $in: productIds } }).lean();

        // Create and save the order first
        const newOrder = new Order({
            userId,
            orderNumber: generateOrderNumber(),
            name: orderData.name,
            email: orderData.email,
            phone: orderData.phone,
            shippingAddress: {
                address: orderData.address,
                ward: orderData.ward,
                district: orderData.district,
                province: orderData.provinceId.toString(),
            },
            shippingFee: orderData.fee,
            paymentMethod: orderData.paymentMethod,
            paymentStatus: orderData.paymentMethod === PaymentMethod.COD ? PaymentStatus.PENDING : PaymentStatus.PAID
        });

        await newOrder.save();

        // Now create order items with the saved order's ID
        const orderItems = await Promise.all(orderData.orderItems.map(async (item) => {
            const product = products.find((p) => p._id.toString() === item.productId);
            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }

            if (product.currentQuantity < item.quantity) {
                throw new Error(`Insufficient quantity for product: ${product.title}`);
            }

            await Book.findByIdAndUpdate(item.productId, {
                $inc: { currentQuantity: -item.quantity }
            });

            return new OrderItem({
                orderId: newOrder._id,
                productId: item.productId,
                productName: product.title,
                productImage: product.cover,
                quantity: item.quantity,
                price: product.price,
                subTotal: product.price * item.quantity
            }).save();
        }));

        const sumSubTotal = orderItems.reduce((sum, item) => sum + item.subTotal, 0);
        const total = sumSubTotal + orderData.fee;

        // Update the order with order items and total
        newOrder.orderItems = orderItems.map(item => new mongoose.Types.ObjectId(item._id as string));
        newOrder.total = total;
        await newOrder.save();

        return newOrder;

    } catch (error) {
        throw error;
    }
}


export const getOrderById = async (orderId: string): Promise<IOrder | null> => {
    return Order.findById(orderId).populate('orderItems').lean();
}


// export const createOrder = async (userId: string, orderData: IOrderInput): Promise<IOrder> => {
//     const session = await mongoose.startSession();

//     session.startTransaction();

//     try {
//         const productIds = orderData.orderItems.map((item) => item.productId);
//         const products = await Book.find({ _id: { $in: productIds } }).lean();

//         const orderItems = await Promise.all(orderData.orderItems.
//             map(async (item) => {
//                 const product = products.find((p) => p._id.toString() === item.productId);
//                 if (!product) {
//                     throw new Error(`Product not found: ${item.productId}`);
//                 }

//                 if (product.currentQuantity < item.quantity) {
//                     throw new Error(`Insufficient quantity for product: ${product.title}`);
//                 }

//                 await Book.findByIdAndUpdate(item.productId, {
//                     $inc: { currentQuantity: -item.quantity }
//                 }, { session });

//                 return new OrderItem({
//                     productId: item.productId,
//                     productName: product.title,
//                     productImage: product.cover, // Assuming 'cover' is the image field
//                     quantity: item.quantity,
//                     price: product.price,
//                     subTotal: product.price * item.quantity
//                 }).save({ session });
//             }));

//         const sumSubTotal = orderItems.reduce((sum, item) => sum + item.subTotal, 0);
//         const total = sumSubTotal + orderData.fee;

//         const newOrder = new Order({
//             userId,
//             orderNumber: generateOrderNumber(),
//             name: orderData.name,
//             email: orderData.email,
//             phone: orderData.phone,
//             shippingAddress: {
//                 address: orderData.address,
//                 ward: orderData.ward,
//                 district: orderData.district,
//                 province: orderData.provinceId.toString(),
//             },
//             orderItems: orderItems.map(item => item._id),
//             shippingFee: orderData.fee,
//             total,
//             paymentMethod: orderData.paymentMethod,
//         })

//         await newOrder.save({ session });

//         await session.commitTransaction(); // Commit transaction

//         return newOrder;
//     } catch (error) {
//         await session.abortTransaction(); // Rollback transaction
//         session.endSession(); // End session
//         throw error;
//     }

// };


