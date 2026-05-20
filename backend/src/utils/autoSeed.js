import bcrypt from "bcryptjs";
import Product from "../models/Product.js";
import OutfitSet from "../models/OutfitSet.js";
import User from "../models/User.js";
import { buildAllProducts } from "../data/buildProducts.js";
import { outfitSets } from "../data/outfitSets.js";

export async function ensureSeeded() {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const products = buildAllProducts();
    await Product.insertMany(products);
    console.log(`Auto-seeded ${products.length} products`);
  }

  const outfitCount = await OutfitSet.countDocuments();
  if (outfitCount === 0) {
    await OutfitSet.insertMany(outfitSets);
    console.log(`Auto-seeded ${outfitSets.length} outfit sets`);
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@dripkart.com").toLowerCase();
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const password = process.env.ADMIN_PASSWORD || "admin123";
    await User.create({
      name: "DripKart Admin",
      email: adminEmail,
      password: await bcrypt.hash(password, 10),
      role: "admin",
    });
    console.log(`Admin user created: ${adminEmail}`);
  }
}
