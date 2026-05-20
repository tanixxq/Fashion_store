import { Router } from "express";
import OutfitSet from "../models/OutfitSet.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { formatOutfit } from "../utils/formatProduct.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { type } = req.query;
    const query = type && type !== "All Sets" ? { type } : {};
    const docs = await OutfitSet.find(query).sort({ setId: 1 }).lean();
    res.json({
      outfits: docs.map(formatOutfit),
      total: docs.length,
    });
  })
);

router.get(
  "/:setId",
  asyncHandler(async (req, res) => {
    const doc = await OutfitSet.findOne({ setId: req.params.setId });
    if (!doc) {
      return res.status(404).json({ message: "Outfit set not found" });
    }
    res.json({ outfit: formatOutfit(doc) });
  })
);

export default router;
