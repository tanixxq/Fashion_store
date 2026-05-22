import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middleware/auth.js";
import {
  findLineIndex,
  toClientCartLine,
  toDbCartLine,
} from "../utils/cartHelpers.js";

const router = Router();

router.use(protect);

/** GET /api/cart — current user's cart */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json({ cart: req.user.cart.map(toClientCartLine) });
  })
);

/** POST /api/cart — add item or increase qty if line exists */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { item, qty = 1 } = req.body;
    if (!item?.name || item.price == null) {
      return res.status(400).json({ message: "Item name and price required" });
    }

    const line = toDbCartLine({ ...item, qty: qty || item.qty || 1 });
    const idx = findLineIndex(req.user.cart, line.lineId);

    if (idx >= 0) {
      req.user.cart[idx].qty += Number(qty) || 1;
    } else {
      req.user.cart.push(line);
    }

    await req.user.save();
    res.status(201).json({ cart: req.user.cart.map(toClientCartLine) });
  })
);

/** PUT /api/cart — replace entire cart (bulk sync) */
router.put(
  "/",
  asyncHandler(async (req, res) => {
    const { cart } = req.body;
    if (!Array.isArray(cart)) {
      return res.status(400).json({ message: "Cart must be an array" });
    }
    req.user.cart = cart.map(toDbCartLine);
    await req.user.save();
    res.json({ cart: req.user.cart.map(toClientCartLine) });
  })
);

/** PATCH /api/cart/:lineId — update quantity */
router.patch(
  "/:lineId",
  asyncHandler(async (req, res) => {
    const { qty } = req.body;
    const idx = findLineIndex(req.user.cart, req.params.lineId);
    if (idx < 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const nextQty = Number(qty);
    if (!Number.isFinite(nextQty) || nextQty < 1) {
      req.user.cart.splice(idx, 1);
    } else {
      req.user.cart[idx].qty = nextQty;
    }

    await req.user.save();
    res.json({ cart: req.user.cart.map(toClientCartLine) });
  })
);

/** DELETE /api/cart/:lineId — remove one line */
router.delete(
  "/:lineId",
  asyncHandler(async (req, res) => {
    const idx = findLineIndex(req.user.cart, req.params.lineId);
    if (idx < 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    req.user.cart.splice(idx, 1);
    await req.user.save();
    res.json({ cart: req.user.cart.map(toClientCartLine) });
  })
);

export default router;
