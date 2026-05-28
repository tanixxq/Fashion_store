import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Must match backend PORT (default 5001 — macOS often blocks 5000 with 403)
  const apiTarget = env.VITE_API_PROXY_TARGET || "https://fashion-store-5.onrender.com";

  return {
    plugins: [react(), tailwindcss()],
    build: {
      chunkSizeWarningLimit: 600,
    },
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
