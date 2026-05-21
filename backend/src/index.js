/**
 * ============================================================
 * DRIPKART — Main Express server (backend/src/index.js)
 * MERN: MongoDB + Express + React
 * ============================================================
 */

// Step 3 — Load .env (PORT, MONGODB_URI, JWT_SECRET, …)
import "dotenv/config";

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import apiRoutes from "./routes/index.js";
import productRoutes from "./routes/products.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { ensureSeeded } from "./utils/autoSeed.js";

// Step 2 — Create Express app
const app = express();
const PORT = Number(process.env.PORT) || 5000;

// CORS — React dev server can call this API
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`→ ${req.method} ${req.originalUrl}`);
  next();
});

// Root + test (no database required)
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "API working successfully" });
});

// Step 5 — Products API (beginner route + full catalog under /api/products)
app.use("/api/products", productRoutes);

// Full DripKart API (auth, orders, outfits, admin, …)
app.use("/api", apiRoutes);

// Error handlers — always last
app.use(notFound);
app.use(errorHandler);

// Step 3 — Connect MongoDB, then listen
async function start() {
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "dripkart-dev-secret-change-in-production";
  }

  try {
    await connectDB();
    await ensureSeeded();
  } catch (err) {
    console.warn(`MongoDB: ${err.message} — /api/products still returns dummy data`);
  }

  app.listen(PORT, () => {
    console.log(`\n✓ DripKart API → http://localhost:${PORT}`);
    console.log(`  curl http://localhost:${PORT}/api/products\n`);
  });
}

start().catch((err) => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});
