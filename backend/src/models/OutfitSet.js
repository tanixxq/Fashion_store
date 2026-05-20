import mongoose from "mongoose";

const outfitSetSchema = new mongoose.Schema(
  {
    setId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true, index: true },
    vibe: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    pieces: [{ type: String }],
    sizes: [{ type: String }],
    badge: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("OutfitSet", outfitSetSchema);
