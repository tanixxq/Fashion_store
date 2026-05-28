import { Router } from "express";
import Product from "../models/Product.js";
import { dummyProducts } from "../data/dummyProducts.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { formatProduct } from "../utils/formatProduct.js";
import { isDbConnected } from "../utils/dbState.js";

const router = Router();

function filterProducts(list, query) {
  let result = [...list];
  const { category, search, brand, sort, filter } = query;

  if (category && category !== "All Categories") {
    result = result.filter((p) => p.category === category);
  }
  if (brand && brand !== "All Brands") {
    result = result.filter(
      (p) => (p.brand || p.category || "").toLowerCase() === brand.toLowerCase()
    );
  }
  if (search?.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }
  if (filter === "new") result = result.filter((p) => p.badge === "NEW");
  if (filter === "hot") result = result.filter((p) => p.badge === "HOT");

  if (sort === "price-low") result.sort((a, b) => a.price - b.price);
  else if (sort === "price-high") result.sort((a, b) => b.price - a.price);
  else if (sort === "rating") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return result;
}

function enrichDummy(p) {
  return {
    ...p,
    brand: p.brand || p.category,
    images: p.images || (p.image ? [p.image] : []),
    stock: p.stock ?? 50,
    inStock: p.inStock !== false,
  };
}

/**
 * GET /api/products — search, category, brand, sort query params
 */
function dummyProductsResponse(req, res) {
  const products = filterProducts(dummyProducts.map(enrichDummy), req.query);
  return res.json({
    success: true,
    source: "dummy",
    products,
    total: products.length,
    brands: [...new Set(dummyProducts.map((p) => p.category))],
  });
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    if (!isDbConnected()) {
      return dummyProductsResponse(req, res);
    }

    const count = await Product.countDocuments();

    if (count === 0) {
      const products = filterProducts(dummyProducts.map(enrichDummy), req.query);
      return res.json({
        success: true,
        source: "dummy",
        products,
        total: products.length,
        brands: [...new Set(dummyProducts.map((p) => p.category))],
      });
    }

    const query = {};
    if (req.query.category && req.query.category !== "All Categories") {
      query.category = req.query.category;
    }
    if (req.query.brand && req.query.brand !== "All Brands") {
      query.brand = new RegExp(`^${req.query.brand}$`, "i");
    }
    if (req.query.search?.trim()) {
      const q = req.query.search.trim();
      query.$or = [
        { name: new RegExp(q, "i") },
        { category: new RegExp(q, "i") },
        { brand: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
      ];
    }

    let docs = await Product.find(query).sort({ legacyId: 1, createdAt: 1 }).lean();
    let products = docs.map(formatProduct);
    products = filterProducts(products, req.query);

    const brands = await Product.distinct("brand");

    res.json({
      success: true,
      source: "database",
      products,
      total: products.length,
      brands: brands.filter(Boolean),
    });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isDbConnected()) {
      const fromDummy = dummyProducts.find((p) => String(p.id) === String(id));
      if (fromDummy) {
        return res.json({ success: true, product: enrichDummy(fromDummy), source: "dummy" });
      }
      return res.status(404).json({ success: false, message: "Product not found" });
    }

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
      return res.json({ success: true, product: enrichDummy(fromDummy), source: "dummy" });
    }

    res.status(404).json({ success: false, message: "Product not found" });
  })
);

export default router;
