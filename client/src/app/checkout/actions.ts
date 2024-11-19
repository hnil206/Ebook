"use server";

import { PaymentError, VNPayError } from "@/utils/errors";
import { calculateShippingFee } from "@/lib/ghn";
import vnpay from "@/lib/vnpay";
import { createOrderUseCase } from "@/app/shop/use-cases";
import moment from "moment";
import { revalidatePath } from "next/cache";
import { parse } from 'querystring';
import { ReturnQueryFromVNPay } from "vnpay";
import { z } from "zod";
import { authenticatedAction, unauthenticatedAction } from "../safe-action";
import { calculateTotal } from "@/utils";

const vnpayReturnSchema = z.object({
  vnp_Amount: z.string(),
  vnp_BankCode: z.string(),
  vnp_BankTranNo: z.string(),
  vnp_CardType: z.string(),
  vnp_OrderInfo: z.string(),
  vnp_PayDate: z.string(),
  vnp_ResponseCode: z.string(),
  vnp_TmnCode: z.string(),
  vnp_TransactionNo: z.string(),
  vnp_TransactionStatus: z.string(),
  vnp_TxnRef: z.string(),
  vnp_SecureHash: z.string(),
});



const checkoutFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  phone: z.string().trim().min(1, "Phone is required").regex(/^\d{10}$/, "Phone number is invalid"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  address: z.string().trim().min(1, "Address is required"),
  province: z.string().trim().min(1, "Province is required"),
  ward: z.string().trim().min(1, "Ward is required"),
  district: z.string().trim().min(1, "District is required"),
  fee: z.number(),
  orderItems: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
    subtotal: z.number(),
  })),
  // below use for createt ghn order
  districtId: z.number(),
  wardCode: z.string(),
  provinceId: z.number().optional(),
});

export const checkoutWithCOD = authenticatedAction
  .createServerAction()
  .input(checkoutFormSchema)
  .handler(async ({ input, ctx }) => {
    console.log(input, 'input');
    // await rateLimitByIp({key: 'order-cod', limit: 3, window: 30000});
    const {user} = ctx;
    const order = await createOrderUseCase({ orderData: input, user });
    return { success: true, redirectUrl: `/checkout/success?orderId=${order._id}` };
  });

export const checkoutWithVNPay = authenticatedAction
  .createServerAction()
  .input(checkoutFormSchema)
  .handler(async ({ input }) => {
    try {
      const totalAmount = calculateTotal(input.orderItems) + input.fee;
      if (totalAmount <= 0) {
        throw new Error("Total amount must be greater than zero");
      }
      console.log(input, 'input');
      const orderId = moment().format("DDHHmmss");
      const vnpayUrl = vnpay.buildPaymentUrl({
        vnp_Amount: totalAmount,
        vnp_IpAddr: getClientIp(),
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Payment for order ${orderId}`,
        vnp_ReturnUrl: `${process.env.NEXTAUTH_URL}/vnpay-return`,
      });

      return { success: true, redirectUrl: vnpayUrl };
    } catch (error) {
      console.error("VNPay checkout failed:", error);
      return { success: false, error: "Failed to initiate VNPay payment" };
    }
  });

function ensureString(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] || '' : value || '';
}

function getClientIp() {
  return '127.0.0.1'; // TODO: Get actual IP address
}


export const finalizeVNPayPaymentAction = authenticatedAction
  .createServerAction()
  .input(z.object({
    queryString: z.string(),
    checkoutData: checkoutFormSchema,
  }))
  .handler(async ({ input, ctx }) => {
    try {
      const {user} = ctx;
      const parsedQuery = parse(input.queryString);
      const vnpayReturn: ReturnQueryFromVNPay = Object.fromEntries(
        Object.entries(parsedQuery).map(([key, value]) => [key, ensureString(value)])
      ) as ReturnQueryFromVNPay;

      const paymentResult = vnpay.verifyReturnUrl(vnpayReturn);

      if (!paymentResult.isVerified) {
        throw new VNPayError();
      } else if (vnpayReturn.vnp_ResponseCode === '24') {
        return { success: false, redirectUrl: '/checkout' };
      } else if (!paymentResult.isSuccess) {
        throw new PaymentError();
      }


      const order = await createOrderUseCase({
        orderData: {
          ...input.checkoutData,
          // trackingNumber: vnpayReturn.vnp_TxnRef,
          paymentMethod: 'vnpay',
        },
        user
      });

      return order
        ? { success: true, redirectUrl: `/checkout/success?orderId=${order._id}` }
        : { success: false, error: "Failed to create order" };

    } catch (error) {
      console.error("Payment finalization failed:", error);
      return { success: false, error: error instanceof Error ? error.message : "Failed to finalize payment" };
    }
  });

export const calculateShippingFeeAction = unauthenticatedAction
  .createServerAction()
  .input(z.object({
    provinceId: z.number(),
    districtId: z.number(),
    wardCode: z.string(),
    weight: z.number(),
    length: z.number(),
    width: z.number(),
    height: z.number(),
  }))
  .handler(async ({ input }) => {
    const fee = await calculateShippingFee({
      to_district_id: input.districtId,
      to_ward_code: input.wardCode,
      to_province_id: input.provinceId,
      weight: input.weight,
      length: input.length,
      width: input.width,
      height: input.height,
      insurance_value: 100000, // Assuming default insurance value is 0 if not provided
    });
    revalidatePath('/checkout');
    console.log(fee, 'fee');
    return fee;
  });
