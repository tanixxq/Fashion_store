import { Router } from "express";
import Newsletter from "../models/Newsletter.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email required" });
    }

    try {
      await Newsletter.create({ email });
      return res.status(201).json({ message: "Subscribed successfully" });
    } catch (err) {
      if (err.code === 11000) {
        return res.json({ message: "You are already on the list" });
      }
      throw err;
    }
  })
);

export default router;
