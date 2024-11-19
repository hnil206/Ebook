'use server';
import { authenticatedAction } from "@/app/safe-action";
import vnpay from "@/lib/vnpay";
import { ReturnQueryFromVNPay } from "vnpay";
import { z } from "zod";
import { updateUserPremium } from "@/app/services/premium";
function getClientIp() {
    return '127.0.0.1'; // TODO: Get actual IP address
  }

export const checkoutWithVNPay = authenticatedAction
  .createServerAction()
  .handler(async ({ input }) => {
    const totalAmount = 100000;
    const premiumExpiration = new Date();
    premiumExpiration.setDate(premiumExpiration.getDate() + 30);
    const vnpayUrl = vnpay.buildPaymentUrl({
      vnp_Amount: totalAmount,
      vnp_IpAddr: getClientIp(),
      vnp_OrderInfo: `Payment for premium user`,
      vnp_TxnRef: premiumExpiration.toISOString(),
      vnp_ReturnUrl: `${process.env.NEXTAUTH_URL}/vnpay-return-premium`,
    });
    return { success: true, redirectUrl: vnpayUrl };
  });
  

  export const finalizeVNPayPaymentAction = authenticatedAction
  .createServerAction()
  .handler(async ({ input, ctx }) => {
    console.log("finalizeVNPayPaymentAction");
    const token = ctx.user.accessToken; // Assuming user ID is available in the context
    const premiumExpiration = new Date();
    premiumExpiration.setDate(premiumExpiration.getDate() + 30); // Set premium expiration to 30 days from now

    try {
      // Update the user's premium status in the database
      await updateUserPremium(token);

      // Return a success response
      return {
        success: true,
        message: 'Upgrade to premium successful',
      };
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      throw new Error('Failed to upgrade to premium');
    }
  });