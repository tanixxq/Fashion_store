/**
 * DripKart — Main Express server (entry: backend/src/index.js)
 * MERN stack: MongoDB + Express + React (Vite)
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import apiRoutes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { ensureSeeded } from "./utils/autoSeed.js";

// ---------------------------------------------------------------------------
// 1. Create Express app
// ---------------------------------------------------------------------------
const app = express();
const PORT = Number(process.env.PORT) || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// ---------------------------------------------------------------------------
// 2. CORS — allow React dev server, Postman, and curl (no Origin header)
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin(origin, callback) {
      // curl / Postman send no Origin — must allow or requests appear to "hang"
      if (!origin) return callback(null, true);
      if (origin === CLIENT_ORIGIN || origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      return callback(null, true); // dev: permissive; tighten in production
    },
    credentials: true,
  })
);

// ---------------------------------------------------------------------------
// 3. JSON body parser
// ---------------------------------------------------------------------------
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------------
// 4. Request logger — verify each hit in the terminal
// ---------------------------------------------------------------------------
app.use((req, res, next) => {
  console.log(`→ ${req.method} ${req.originalUrl}`);
  next();
});

// ---------------------------------------------------------------------------
// 5. Test routes (NO auth, NO database) — register BEFORE /api router
// ---------------------------------------------------------------------------
app.get("/", (req, res) => {
  console.log("[HIT] GET /");
  res.type("text").send("Backend is running successfully");
});

app.get("/api/test", (req, res) => {
  console.log("[HIT] GET /api/test");
  res.json({ success: true, message: "API working successfully" });
});

// ---------------------------------------------------------------------------
// 6. Main API routes (auth required only on protected sub-routes)
// ---------------------------------------------------------------------------
app.use("/api", apiRoutes);

// ---------------------------------------------------------------------------
// 7. Error handlers — MUST be last (after all routes)
// ---------------------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

// ---------------------------------------------------------------------------
// 8. Start listening immediately (do not wait for MongoDB)
//    Fixes "hanging" curl when DB is slow or unavailable
// ---------------------------------------------------------------------------
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n✓ Express server listening on http://localhost:${PORT}`);
  console.log(`  Test:  curl http://localhost:${PORT}/api/test`);
  console.log(`  Root:  curl http://localhost:${PORT}/\n`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `\n✗ Port ${PORT} is already in use.\n` +
        `  On macOS, disable AirPlay Receiver (System Settings → General → AirDrop & Handoff)\n` +
        `  or set PORT=5001 in backend/.env\n`
    );
  } else {
    console.error("Server error:", err.message);
  }
  process.exit(1);
});

// ---------------------------------------------------------------------------
// 9. MongoDB — connect in background (catalog/auth routes need DB)
// ---------------------------------------------------------------------------
(async () => {
  try {
    await connectDB();
    await ensureSeeded();
  } catch (err) {
    console.warn(
      `⚠ MongoDB not ready (${err.message}) — GET / and GET /api/test still work`
    );
  }
})();
