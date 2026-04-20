import axios from "axios";
import prisma from "../../config/prisma.js";
import {
  SSL_STORE_ID,
  SSL_STORE_PASS,
  SSL_IS_SANDBOX,
  SSL_SUCCESS_URL,
  SSL_FAIL_URL,
  SSL_CANCEL_URL,
} from "../../config/env.js";

const PLAN_PRICING = {
  THREE_MONTHS: 500,
  SIX_MONTHS: 900,
  ONE_YEAR: 1600,
};

const PLAN_DURATION_MONTHS = {
  THREE_MONTHS: 3,
  SIX_MONTHS: 6,
  ONE_YEAR: 12,
};

class PaymentService {
  async initPayment({ userId, planType }) {
    if (!PLAN_PRICING[planType]) {
      throw { status: 400, message: "Invalid plan type" };
    }

    const amount = PLAN_PRICING[planType];
    const transactionId = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    // Create a Payment record in DB with PENDING status
    const payment = await prisma.payment.create({
      data: {
        amount,
        status: "PENDING",
        transactionId,
        paymentMethod: "SSLCommerz",
        userId,
      },
    });

    const apiUrl = SSL_IS_SANDBOX
      ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
      : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

    const payload = {
      store_id: SSL_STORE_ID,
      store_passwd: SSL_STORE_PASS,
      total_amount: amount,
      currency: "BDT",
      tran_id: transactionId,
      success_url: SSL_SUCCESS_URL,
      fail_url: SSL_FAIL_URL,
      cancel_url: SSL_CANCEL_URL,
      emi_option: 0,
      cus_name: user.name,
      cus_email: user.email,
      cus_phone: "01700000000", // Required by SSLCommerz
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      shipping_method: "NO",
      product_name: `Subscription Plan - ${planType}`,
      product_category: "Subscription",
      product_profile: "non-physical-goods",
      value_a: planType,
    };

    const response = await axios.post(apiUrl, payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.data && response.data.status === "SUCCESS") {
      return {
        GatewayPageURL: response.data.GatewayPageURL,
        transactionId: transactionId,
      };
    } else {
      throw { status: 500, message: "Failed to initiate payment gateway", errorDetails: response.data };
    }
  }

  async handleSuccess(transactionId) {
    if (!transactionId) {
      throw { status: 400, message: "Transaction ID is missing" };
    }

    const payment = await prisma.payment.findUnique({
      where: { transactionId },
      include: { user: true },
    });

    if (!payment) {
      throw { status: 404, message: "Payment record not found" };
    }

    if (payment.status === "COMPLETED") {
      return { message: "Payment already processed", payment };
    }

    let planType = "THREE_MONTHS";
    if (payment.amount === PLAN_PRICING.THREE_MONTHS) planType = "THREE_MONTHS";
    else if (payment.amount === PLAN_PRICING.SIX_MONTHS) planType = "SIX_MONTHS";
    else if (payment.amount === PLAN_PRICING.ONE_YEAR) planType = "ONE_YEAR";

    const durationMonths = PLAN_DURATION_MONTHS[planType];

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Payment status
      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: { status: "COMPLETED" },
      });

      // 2. Create an Invoice
      const invoiceNumber = `INV_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          buyerName: payment.user.name,
          productType: "PREMIUM_PLAN",
          planDetails: planType,
          paymentAmount: payment.amount,
          paymentMethod: payment.paymentMethod,
          userId: payment.userId,
          paymentId: payment.id,
        },
      });

      // 3. Update or Create Subscription
      const existingSub = await tx.subscription.findFirst({
        where: { userId: payment.userId },
        orderBy: { endDate: 'desc' }
      });

      let startDate = new Date();
      if (existingSub && existingSub.endDate > new Date()) {
        startDate = existingSub.endDate;
      }

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + durationMonths);

      let subscription;
      if (existingSub) {
        subscription = await tx.subscription.update({
          where: { id: existingSub.id },
          data: {
            planType,
            endDate,
            isActive: true,
          },
        });
      } else {
        subscription = await tx.subscription.create({
          data: {
            planType,
            startDate: new Date(),
            endDate,
            isActive: true,
            userId: payment.userId,
          },
        });
      }

      return { payment: updatedPayment, invoice, subscription };
    });

    return result;
  }

  async handleFailOrCancel(transactionId, statusReason) {
    if (!transactionId) {
      throw { status: 400, message: "Transaction ID is missing" };
    }

    const payment = await prisma.payment.findUnique({
      where: { transactionId },
    });

    if (!payment) {
      throw { status: 404, message: "Payment record not found" };
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });

    return updatedPayment;
  }
}

export default new PaymentService();
