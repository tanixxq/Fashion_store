import { Router } from "express";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  baseStats,
  categories,
  outfitSetTypes,
  perks,
  styleInspiration,
  testimonials,
} from "../data/storeContent.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const productTotal = await Product.countDocuments();
    const stats = baseStats.map((s) =>
      s.label === "Curated Styles"
        ? { ...s, value: `${productTotal}+` }
        : s
    );

    res.json({
      categories,
      outfitSetTypes,
      styleInspiration,
      perks,
      testimonials,
      stats,
    });
  })
);

export default router;
