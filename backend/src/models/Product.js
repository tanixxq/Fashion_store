import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    legacyId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    badge: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
