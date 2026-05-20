import { Router } from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Newsletter from "../models/Newsletter.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { formatProduct } from "../utils/formatProduct.js";

const router = Router();
const VALID_STATUSES = [
  "placed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

router.use(protect, requireAdmin);

router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const [productCount, orderCount, userCount, subscriberCount, revenueAgg] =
      await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        User.countDocuments({ role: "user" }),
        Newsletter.countDocuments(),
        Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
      ]);

    const revenue = revenueAgg[0]?.total || 0;
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      products: productCount,
      orders: orderCount,
      users: userCount,
      subscribers: subscriberCount,
      revenue,
      recentOrders: recentOrders.map((o) => ({
        id: o.orderId,
        total: o.total,
        status: o.status,
        date: o.date,
        email: o.shipping?.email,
      })),
    });
  })
);

router.get(
  "/orders",
  asyncHandler(async (req, res) => {
    const { status } = req.query;
    const query = status ? { status } : {};
    const docs = await Order.find(query).sort({ createdAt: -1 }).limit(100);
    res.json({ orders: docs.map((o) => o.toClientJSON()) });
  })
);

router.patch(
  "/orders/:orderId/status",
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ order: order.toClientJSON() });
  })
);

router.get(
  "/products",
  asyncHandler(async (req, res) => {
    const docs = await Product.find().sort({ legacyId: 1 }).lean();
    res.json({ products: docs.map(formatProduct), total: docs.length });
  })
);

router.post(
  "/products",
  asyncHandler(async (req, res) => {
    const { name, category, price, rating, description, image, badge } = req.body;
    if (!name || !category || !price || !description || !image) {
      return res.status(400).json({ message: "Missing required product fields" });
    }

    const maxDoc = await Product.findOne().sort({ legacyId: -1 }).select("legacyId");
    const legacyId = (maxDoc?.legacyId || 0) + 1;

    const doc = await Product.create({
      legacyId,
      name,
      category,
      price: Number(price),
      rating: Number(rating) || 4.5,
      description,
      image,
      badge,
    });

    res.status(201).json({ product: formatProduct(doc) });
  })
);

router.patch(
  "/products/:legacyId",
  asyncHandler(async (req, res) => {
    const legacyId = Number(req.params.legacyId);
    const allowed = ["name", "category", "price", "rating", "description", "image", "badge"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const doc = await Product.findOneAndUpdate({ legacyId }, updates, { new: true });
    if (!doc) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ product: formatProduct(doc) });
  })
);

router.delete(
  "/products/:legacyId",
  asyncHandler(async (req, res) => {
    const legacyId = Number(req.params.legacyId);
    const doc = await Product.findOneAndDelete({ legacyId });
    if (!doc) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted", id: legacyId });
  })
);

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await User.find({ role: "user" })
      .select("name email createdAt")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({
      users: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        joined: u.createdAt,
      })),
    });
  })
);

export default router;
