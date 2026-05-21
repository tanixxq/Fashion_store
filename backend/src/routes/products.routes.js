import { Router } from "express";
import Product from "../models/Product.js";
import { dummyProducts } from "../data/dummyProducts.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { formatProduct } from "../utils/formatProduct.js";

const router = Router();

/**
 * Step 5 — GET /api/products
 *
 * 1. If MongoDB has products → return them
 * 2. If database is empty → return dummyProducts (so frontend always has data)
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    console.log("[HIT] GET /api/products");

    const count = await Product.countDocuments();

    if (count === 0) {
      console.log("  → No products in DB, sending dummy data");
      return res.json({
        success: true,
        source: "dummy",
        products: dummyProducts,
        total: dummyProducts.length,
      });
    }

    const docs = await Product.find().sort({ legacyId: 1, createdAt: 1 }).lean();
    const products = docs.map(formatProduct);

    res.json({
      success: true,
      source: "database",
      products,
      total: products.length,
    });
  })
);

/**
 * Step 1 — GET /api/products/:id
 * Finds product by numeric id, legacyId, or MongoDB _id
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(`[HIT] GET /api/products/${id}`);

    const numId = Number(id);
    if (!Number.isNaN(numId)) {
      const byLegacy = await Product.findOne({ legacyId: numId });
      if (byLegacy) {
        return res.json({ success: true, product: formatProduct(byLegacy) });
      }
    }

    if (id.match(/^[a-f\d]{24}$/i)) {
      const byMongoId = await Product.findById(id);
      if (byMongoId) {
        return res.json({ success: true, product: formatProduct(byMongoId) });
      }
    }

    const fromDummy = dummyProducts.find((p) => String(p.id) === String(id));
    if (fromDummy) {
      return res.json({ success: true, product: fromDummy, source: "dummy" });
    }

    res.status(404).json({ success: false, message: "Product not found" });
  })
);

export default router;
