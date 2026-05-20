import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    productId: { type: Number },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    qty: { type: Number, required: true },
    size: { type: String },
    isSet: { type: Boolean },
    category: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    payment: { type: String, required: true },
    shipping: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      pincode: String,
    },
    status: {
      type: String,
      enum: ["placed", "processing", "shipped", "out_for_delivery", "delivered"],
      default: "placed",
    },
  },
  { timestamps: true }
);

orderSchema.methods.toClientJSON = function () {
  return {
    id: this.orderId,
    date: this.date.toISOString(),
    items: this.items,
    total: this.total,
    payment: this.payment,
    shipping: this.shipping,
    status: this.status,
  };
};

export default mongoose.model("Order", orderSchema);
