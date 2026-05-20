import { Router } from "express";
import Order from "../models/Order.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { optionalAuth, protect } from "../middleware/auth.js";
import { generateOrderId } from "../utils/orderId.js";

const router = Router();

router.get(
  "/track/:orderId",
  asyncHandler(async (req, res) => {
    const doc = await Order.findOne({ orderId: req.params.orderId.toUpperCase() });
    if (!doc) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ order: doc.toClientJSON() });
  })
);

router.get(
  "/lookup",
  asyncHandler(async (req, res) => {
    const orderId = req.query.orderId?.trim().toUpperCase();
    const email = req.query.email?.trim().toLowerCase();

    if (!orderId) {
      return res.status(400).json({ message: "Order ID required" });
    }

    const query = { orderId };
    if (email) query["shipping.email"] = email;

    const doc = await Order.findOne(query);
    if (!doc) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ order: doc.toClientJSON() });
  })
);

router.post(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { items, total, payment, shipping } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must include at least one item" });
    }
    if (!payment || !shipping?.email || !shipping?.name) {
      return res.status(400).json({ message: "Payment method and shipping details required" });
    }

    const order = await Order.create({
      orderId: generateOrderId(),
      user: req.user?._id,
      items,
      total: Number(total),
      payment,
      shipping,
      status: "placed",
    });

    if (req.user) {
      req.user.cart = [];
      await req.user.save();
    }

    res.status(201).json({ order: order.toClientJSON() });
  })
);

router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const docs = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders: docs.map((o) => o.toClientJSON()) });
  })
);

export default router;
