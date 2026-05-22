import { Router } from "express";
import authRoutes from "./auth.routes.js";
import outfitsRoutes from "./outfits.routes.js";
import ordersRoutes from "./orders.routes.js";
import userRoutes from "./user.routes.js";
import cartRoutes from "./cart.routes.js";
import contentRoutes from "./content.routes.js";
import newsletterRoutes from "./newsletter.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

// Primary test route is registered in src/index.js (no auth, no DB).
// Duplicate here for /api/health-style discovery only:
router.get("/test", (req, res) => {
  console.log("[HIT] GET /api/test (via router)");
  res.json({ success: true, message: "API working successfully" });
});

router.get("/health", (req, res) => {
  console.log("[HIT] GET /api/health");
  res.json({ ok: true, service: "dripkart-api", version: "1.0.0" });
});

router.use("/auth", authRoutes);
// Products mounted in index.js at /api/products (beginner + DB/dummy)
router.use("/outfits", outfitsRoutes);
router.use("/orders", ordersRoutes);
router.use("/users", userRoutes);
router.use("/cart", cartRoutes);
router.use("/content", contentRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/admin", adminRoutes);

export default router;
