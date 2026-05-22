/**
 * Validate required environment variables at startup.
 */

const WEAK_JWT_PATTERNS = [/change-in-production/i, /dev-secret/i, /^secret$/i];

export function getRazorpaySecret() {
  return process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET || "";
}

export function validateEnv() {
  const isProd = process.env.NODE_ENV === "production";
  const warnings = [];
  const errors = [];

  if (!process.env.MONGODB_URI) {
    errors.push("MONGODB_URI is required");
  }

  if (isProd) {
    if (!process.env.JWT_SECRET) {
      errors.push("JWT_SECRET is required in production");
    } else if (WEAK_JWT_PATTERNS.some((p) => p.test(process.env.JWT_SECRET))) {
      errors.push("JWT_SECRET is too weak for production — use a long random string");
    }

    if (!process.env.CLIENT_ORIGIN) {
      warnings.push(
        "CLIENT_ORIGIN is empty — set your Vercel URL(s) comma-separated for CORS"
      );
    }
  }

  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "dripkart-dev-secret-change-in-production";
    warnings.push("Using default JWT_SECRET (development only)");
  }

  return { errors, warnings, isProd };
}

export function printEnvStatus() {
  const { errors, warnings, isProd } = validateEnv();

  warnings.forEach((w) => console.warn(`[ENV] ${w}`));
  errors.forEach((e) => console.error(`[ENV] ${e}`));

  if (errors.length && isProd) {
    console.error("[ENV] Fix environment variables on Render → Environment");
    process.exit(1);
  }

  if (getRazorpaySecret() && process.env.RAZORPAY_KEY_ID) {
    console.log("[ENV] Razorpay: configured");
  } else {
    console.log("[ENV] Razorpay: mock mode (keys not set)");
  }
}
