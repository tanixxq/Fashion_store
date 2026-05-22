import mongoose from "mongoose";

/**
 * Step 4 — Product schema (Mongoose)
 *
 * Core fields (your assignment):
 *   name, price, image, category, description
 *
 * Extra fields (optional — used by full DripKart catalog):
 *   legacyId, rating, badge
 */
const productSchema = new mongoose.Schema(
  {
    // Core — required for every product
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },

    // Optional extras
    legacyId: { type: Number, unique: true, sparse: true },
    rating: { type: Number, default: 4.5 },
    badge: { type: String },
    brand: { type: String, trim: true, index: true },
    images: [{ type: String }],
    stock: { type: Number, default: 50, min: 0 },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
