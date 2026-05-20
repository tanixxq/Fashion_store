import { Router } from "express";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.put(
  "/cart",
  asyncHandler(async (req, res) => {
    const { cart } = req.body;
    if (!Array.isArray(cart)) {
      return res.status(400).json({ message: "Cart must be an array" });
    }
    req.user.cart = cart;
    await req.user.save();
    res.json({ cart: req.user.cart });
  })
);

router.put(
  "/wishlist/products",
  asyncHandler(async (req, res) => {
    const { wishlist } = req.body;
    if (!Array.isArray(wishlist)) {
      return res.status(400).json({ message: "Wishlist must be an array of product ids" });
    }
    req.user.wishlist = wishlist;
    await req.user.save();
    res.json({ wishlist: req.user.wishlist });
  })
);

router.put(
  "/wishlist/outfits",
  asyncHandler(async (req, res) => {
    const { favouriteOutfits } = req.body;
    if (!Array.isArray(favouriteOutfits)) {
      return res.status(400).json({ message: "favouriteOutfits must be an array" });
    }
    req.user.favouriteOutfits = favouriteOutfits;
    await req.user.save();
    res.json({ favouriteOutfits: req.user.favouriteOutfits });
  })
);

router.put(
  "/profile",
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (name?.trim()) req.user.name = name.trim();
    await req.user.save();
    res.json({ user: req.user.toPublicJSON() });
  })
);

export default router;
