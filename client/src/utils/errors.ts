export class PublicError extends Error {
    constructor(message: string) {
      super(message);
    }
  }

export const AUTHENTICATION_ERROR_MESSAGE =
  "You must be logged in to view this content";

export const PRIVATE_GROUP_ERROR_MESSAGE =
  "You do not have permission to view this group";

export const VNPAY_ERROR_MESSAGE =
  "Xác thực tính toàn vẹn dữ liệu không thành công";

export const PAYMENT_ERROR_MESSAGE =
  "Đơn hàng thanh toán không thành công";

export const INSUFFICIENT_PRODUCT_QUANTITY_ERROR_MESSAGE =
  "Sản phẩm hiện không có sẵn";

export const AuthenticationError = class AuthenticationError extends Error {
  constructor() {
    super(AUTHENTICATION_ERROR_MESSAGE);
    this.name = "AuthenticationError";
  }
};

export const InsufficientProductQuantityError = class InsufficientProductQuantityError extends Error {
  constructor() {
    super(INSUFFICIENT_PRODUCT_QUANTITY_ERROR_MESSAGE);
    this.name = "InsufficientProductQuantityError";
  }
};


export const VNPayError = class VNPayError extends Error {
  constructor() {
    super(VNPAY_ERROR_MESSAGE);
    this.name = "VNPayError";
  }
};

export const PaymentError = class PaymentError extends Error {
  constructor() {
    super(PAYMENT_ERROR_MESSAGE);
    this.name = "PaymentError";
  }
};