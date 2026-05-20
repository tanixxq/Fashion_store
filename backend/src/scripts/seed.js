import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";
import OutfitSet from "../models/OutfitSet.js";
import User from "../models/User.js";
import { buildAllProducts } from "../data/buildProducts.js";
import { outfitSets } from "../data/outfitSets.js";

const force = process.argv.includes("--force");

async function seed() {
  await connectDB();

  const products = buildAllProducts();
  if (force) await Product.deleteMany({});
  const existing = await Product.countDocuments();
  if (existing === 0) {
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);
  } else {
    console.log(`Products already present (${existing}), skip. Use --force to reset.`);
  }

  if (force) await OutfitSet.deleteMany({});
  const outfitCount = await OutfitSet.countDocuments();
  if (outfitCount === 0) {
    await OutfitSet.insertMany(outfitSets);
    console.log(`Seeded ${outfitSets.length} outfit sets`);
  } else {
    console.log(`Outfit sets already present (${outfitCount}), skip.`);
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@dripkart.com").toLowerCase();
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: "DripKart Admin",
      email: adminEmail,
      password: await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10),
      role: "admin",
    });
    console.log(`Admin created: ${adminEmail} / ${process.env.ADMIN_PASSWORD || "admin123"}`);
  } else if (admin.role !== "admin") {
    admin.role = "admin";
    await admin.save();
    console.log(`Promoted ${adminEmail} to admin`);
  } else {
    console.log(`Admin already exists: ${adminEmail}`);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
