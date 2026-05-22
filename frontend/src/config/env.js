/**
 * Central environment config — no hardcoded API URLs in components.
 * Dev: use Vite proxy (/api) or set VITE_API_URL in .env
 * Prod: set VITE_API_URL=https://your-api.onrender.com/api on Vercel
 */
const viteApi = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export const API_BASE = viteApi || "/api";
export const IS_DEV = import.meta.env.DEV;
export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || "";
export const APP_NAME = import.meta.env.VITE_APP_NAME || "DripKart";
export const SITE_URL = import.meta.env.VITE_SITE_URL || "";

if (IS_DEV && !viteApi) {
  console.info("[DripKart] API → Vite proxy /api (see vite.config.js)");
}

if (!IS_DEV && !viteApi) {
  console.error(
    "[DripKart] VITE_API_URL is missing — set it in Vercel Environment Variables and redeploy"
  );
}
