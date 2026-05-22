/**
 * DripKart API — Express + MongoDB (production-ready)
 */
import "dotenv/config";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { createCorsOptions, logCorsConfig } from "./config/cors.js";
import { printEnvStatus } from "./config/env.js";
import apiRoutes from "./routes/index.js";
import productRoutes from "./routes/products.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { ensureSeeded } from "./utils/autoSeed.js";

const app = express();
app.locals.mongoose = mongoose;

const PORT = Number(process.env.PORT) || 5001;
const HOST = process.env.HOST || "0.0.0.0";

printEnvStatus();
logCorsConfig();

app.use(cors(createCorsOptions()));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`→ ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.json({
    service: "DripKart API",
    health: "/api/health",
    docs: "See docs/DEPLOYMENT.md",
  });
});

app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "API working successfully" });
});

app.use("/api/products", productRoutes);
app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    await ensureSeeded();
  } catch (err) {
    console.warn(`[DB] ${err.message}`);
    if (process.env.NODE_ENV === "production") {
      console.error("[DB] MongoDB required in production — check MONGODB_URI & Atlas IP allowlist");
      process.exit(1);
    }
  }

  app.listen(PORT, HOST, () => {
    console.log(`\n✓ DripKart API listening on ${HOST}:${PORT}`);
    console.log(`  Health: http://localhost:${PORT}/api/health\n`);
  });
}

start().catch((err) => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});
