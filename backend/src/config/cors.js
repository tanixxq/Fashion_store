/**
 * Production CORS — allows CLIENT_ORIGIN list + Vercel preview deployments.
 */

function parseOrigins() {
  const raw = process.env.CLIENT_ORIGIN || "";
  return raw
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}

/** Match https://project-name.vercel.app and preview URLs */
function isVercelPreview(origin) {
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
}

export function createCorsOptions() {
  const allowedOrigins = parseOrigins();
  const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS !== "false";
  const isProd = process.env.NODE_ENV === "production";

  return {
    origin(origin, callback) {
      // Same-origin / curl / Postman
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (allowVercelPreviews && isVercelPreview(origin)) {
        return callback(null, true);
      }

      // Local dev
      if (
        !isProd &&
        (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:"))
      ) {
        return callback(null, true);
      }

      console.warn(`[CORS] Blocked origin: ${origin}`);
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
}

export function logCorsConfig() {
  const origins = parseOrigins();
  console.log(`[CORS] NODE_ENV=${process.env.NODE_ENV || "development"}`);
  console.log(`[CORS] Allowed origins: ${origins.length ? origins.join(", ") : "(none — set CLIENT_ORIGIN)"}`);
  if (process.env.ALLOW_VERCEL_PREVIEWS !== "false") {
    console.log("[CORS] Vercel preview URLs (*.vercel.app) allowed");
  }
}
