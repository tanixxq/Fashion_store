/**
 * Seed MongoDB with the 6 beginner dummy products.
 * Run: npm run seed:dummy
 */
import "dotenv/config";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";
import { dummyProducts } from "../data/dummyProducts.js";

async function seedDummy() {
  await connectDB();

  await Product.deleteMany({});
  const docs = dummyProducts.map((p) => ({
    legacyId: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.category,
    description: p.description,
    rating: p.rating,
    badge: p.badge,
  }));

  await Product.insertMany(docs);
  console.log(`✓ Seeded ${docs.length} products into MongoDB`);
  process.exit(0);
}

seedDummy().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
