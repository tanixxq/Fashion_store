import { Router } from "express";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middleware/auth.js";

const router = Router();

function getRazorpayAuth() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret =
    process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;
  if (!keyId || !keySecret) return null;
  return { keyId, keySecret, auth: Buffer.from(`${keyId}:${keySecret}`).toString("base64") };
}

/** POST /api/payments/razorpay/create-order — amount in INR (rupees) */
router.post(
  "/razorpay/create-order",
  protect,
  asyncHandler(async (req, res) => {
    const amountInr = Number(req.body.amount);
    if (!amountInr || amountInr < 1) {
      return res.status(400).json({ message: "Valid amount required" });
    }

    const amountPaise = Math.round(amountInr * 100);
    const cfg = getRazorpayAuth();

    if (!cfg) {
      return res.json({
        mock: true,
        keyId: null,
        orderId: `mock_order_${Date.now()}`,
        amount: amountPaise,
        currency: "INR",
        message: "Razorpay keys not set — using mock payment for development",
      });
    }

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${cfg.auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt: `dripkart_${Date.now()}`,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        message: data.error?.description || "Razorpay order creation failed",
      });
    }

    res.json({
      mock: false,
      keyId: cfg.keyId,
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
    });
  })
);

/** POST /api/payments/razorpay/verify */
router.post(
  "/razorpay/verify",
  protect,
  asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const cfg = getRazorpayAuth();

    if (!cfg) {
      return res.json({
        verified: true,
        mock: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", cfg.keySecret)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    res.json({
      verified: true,
      mock: false,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  })
);

/** GET /api/payments/config — public key for checkout UI */
router.get(
  "/config",
  asyncHandler(async (req, res) => {
    const cfg = getRazorpayAuth();
    res.json({
      razorpayEnabled: Boolean(cfg),
      keyId: cfg?.keyId || null,
    });
  })
);

export default router;
