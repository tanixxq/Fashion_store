import { Router } from "express";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { formatProduct } from "../utils/formatProduct.js";
import { getProductDetails } from "../data/productDetails.js";

const router = Router();
const CATEGORIES = [
  "T-Shirts",
  "Hoodies",
  "Sweatshirts",
  "Bottoms",
  "Caps",
  "Jackets",
  "Sneakers",
  "Glasses",
];

function resolveSort(sort) {
  switch (sort) {
    case "price-asc":
    case "price-low":
      return { price: 1 };
    case "price-desc":
    case "price-high":
      return { price: -1 };
    case "rating":
      return { rating: -1 };
    default:
      return { legacyId: 1 };
  }
}

router.get(
  "/categories",
  asyncHandler(async (req, res) => {
    const counts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const map = Object.fromEntries(counts.map((c) => [c._id, c.count]));
    const byCategory = CATEGORIES.reduce((acc, cat) => {
      acc[cat] = map[cat] || 0;
      return acc;
    }, {});
    const total = await Product.countDocuments();
    res.json({ categories: CATEGORIES, counts: { ...byCategory, total } });
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { category, search, sort, filter } = req.query;
    const query = {};

    if (category && category !== "All Categories") {
      query.category = category;
    }

    if (filter === "new") query.badge = "NEW";
    if (filter === "hot") query.badge = "HOT";

    if (search?.trim()) {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
        { category: { $regex: term, $options: "i" } },
      ];
    }

    const docs = await Product.find(query).sort(resolveSort(sort)).lean();
    res.json({
      products: docs.map(formatProduct),
      total: docs.length,
    });
  })
);

router.get(
  "/:legacyId/details",
  asyncHandler(async (req, res) => {
    const legacyId = Number(req.params.legacyId);
    const doc = await Product.findOne({ legacyId }).lean();
    if (!doc) {
      return res.status(404).json({ message: "Product not found" });
    }
    const product = formatProduct(doc);
    res.json({ product, details: getProductDetails(product) });
  })
);

router.get(
  "/:legacyId",
  asyncHandler(async (req, res) => {
    const legacyId = Number(req.params.legacyId);
    const doc = await Product.findOne({ legacyId });
    if (!doc) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ product: formatProduct(doc) });
  })
);

export default router;
