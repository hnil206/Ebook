import { create } from "zustand";
import { persist } from "zustand/middleware";


export interface CheckoutPayload {
    id?: number; //order id
    userId?: number; //user id
    name: string;
    phone: string;
    email: string;
    paymentMethod: string;
    address: string;
    province: string;
    ward: string;
    district: string;
    orderItems: CartItem[];
    totalPrice?: number;
    trackingNumber?: string;
    fee: number;
    provinceId: number;
    districtId: number;
    wardCode: string;
};

export type CheckoutFormType = {
    name: string;
    phone: string;
    email: string;
    paymentMethod: string;
    ward: string; // Add this line if 'ward' is a field in your form
    province: string; // Add this line if 'province' is a field in your form
    district: string; // Add this line if 'district' is a field in your form
    address: string;
};

export interface CartItem {
    productId: string;
    quantity: number;
    subtotal: number;
}

export interface ProductType {
    _id: string;
    title: string;
    description: string;
    currentQuantity: number; //quantity in database
    price: number;
    category: string;
    quantity: number; //quantity in cart
    cover: string;
    author: {
        name: string;
    }
};

export interface addToCartProductType {
    _id: string;
    title: string;
    description: string;
    currentQuantity: number;
    price: number;
    category: string;
    cover: string;
    author: {
        name: string;
    }
}

export interface CartItemType {
    productId: string;
    quantity: number;
    subtotal: number;
};


export interface ProductCategoryType {
    id: string;
    name?: string;
    isActive?: boolean;
};


interface State {
    cart: ProductType[];
    totalItems: number;
    totalPrice: number;
    checkoutPayload: CheckoutPayload | null;
}

interface Actions {
    addToCart: (product: addToCartProductType, quantity: number) => void;
    removeFromCart: (product: ProductType) => void;
    updateCartItem: (product: ProductType, quantity: number) => void;
    clearCart: () => void;
    setCheckoutPayload: (payload: CheckoutPayload) => void;
    getCheckoutPayload: () => CheckoutPayload | null;
    clearCheckoutPayload: () => void;
}

type PersistedState = State & Partial<{ totalProducts: number }>;

const INITIAL_STATE: State = {
    cart: [],
    totalItems: 0,
    totalPrice: 0,
    checkoutPayload: null,
}

export const useCartStore = create(
    persist<State & Actions>(
        (set, get) => ({
            ...INITIAL_STATE,
            addToCart: (product, quantity: number = 1) => {
                const cart = get().cart;
                const cartItem = cart.find(item => item._id === product._id);
                if (cartItem) {
                    const updatedCart = cart.map(item =>
                        item._id === product._id
                            ? { ...item, quantity: (item.quantity as number) + quantity }
                            : item
                    );
                    set((state) => ({
                        cart: updatedCart,
                        totalItems: state.totalItems + quantity,
                        totalPrice: state.totalPrice + product.price * quantity,
                    }));
                } else {
                    const updatedCart = [...cart, { ...product, quantity }]
                    set((state) => ({
                        cart: updatedCart,
                        totalItems: state.totalItems + quantity,
                        totalPrice: state.totalPrice + product.price * quantity,
                    }));
                }
            },
            removeFromCart: (product: ProductType) => {
                const cart = get().cart;
                const cartItem = cart.find((item) => item._id === product._id);
                if (cartItem) {
                    const updatedCart = cart.filter((item) => item._id !== product._id);
                    set((state) => ({
                        cart: updatedCart,
                        totalItems: state.totalItems - cartItem.quantity,
                        totalPrice: state.totalPrice - cartItem.price * cartItem.quantity,
                    }));
                }
            },
            updateCartItem: (product: ProductType, quantityChange: number) =>
                set((state) => {
                    const cartItemIndex = state.cart.findIndex((item) => item._id === product._id);
                    if (cartItemIndex !== -1) {
                        const newQuantity = Math.max(1, state.cart[cartItemIndex].quantity + quantityChange);
                        const quantityDiff = newQuantity - state.cart[cartItemIndex].quantity;
                        return {
                            cart: [
                                ...state.cart.slice(0, cartItemIndex),
                                { ...state.cart[cartItemIndex], quantity: newQuantity },
                                ...state.cart.slice(cartItemIndex + 1)
                            ],
                            totalItems: state.totalItems + quantityDiff,
                            totalPrice: state.totalPrice + product.price * quantityDiff,
                        };
                    }
                    return state;
                }),
            clearCart: () => {
                set((state) => ({
                    cart: [],
                    totalItems: 0,
                    totalPrice: 0,
                    customBracelets: [],
                }));
            },
            setCheckoutPayload: (payload: CheckoutPayload) => {
                set({ checkoutPayload: payload });
            },
            getCheckoutPayload: () => {
                return get().checkoutPayload;
            },
            clearCheckoutPayload: () => {
                set({ checkoutPayload: null });
            }       
        }), {
        name: 'cart-store',
        version: 1,
        migrate: (persistedState: unknown, version: number) => {
            const state = persistedState as PersistedState;
            if (version === 0 && state.totalProducts !== undefined) {
                state.totalItems = state.totalProducts;
                delete state.totalProducts;
            }
            return state as State & Actions;
        },
    }
    )
)