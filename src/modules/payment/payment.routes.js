import express from "express";
import authMiddleware from "../../middleware/auth.js";
import {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
} from "./payment.controller.js";

const router = express.Router();

// Secure initialization
router.post("/init", authMiddleware, initiatePayment);

// Open callbacks from SSLCommerz
router.post("/success", paymentSuccess);
router.post("/fail", paymentFail);
router.post("/cancel", paymentCancel);

export default router;
