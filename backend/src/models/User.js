import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    lineId: { type: String, required: true },
    productId: { type: Number },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    qty: { type: Number, default: 1 },
    size: { type: String },
    isSet: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 4 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    wishlist: [{ type: Number }],
    favouriteOutfits: [{ type: String }],
    cart: [cartItemSchema],
  },
  { timestamps: true }
);

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    wishlist: this.wishlist,
    favouriteOutfits: this.favouriteOutfits,
    cart: this.cart,
  };
};

export default mongoose.model("User", userSchema);
