import { useEffect } from "react";
import { APP_NAME } from "../config/env";

const DEFAULT_DESC =
  "DripKart — premium streetwear, sneakers, and curated fashion. Shop limited drops with secure checkout.";

export default function SEO({ title, description = DEFAULT_DESC }) {
  const fullTitle = title ? `${title} | ${APP_NAME}` : `${APP_NAME} | Premium Streetwear`;

  useEffect(() => {
    document.title = fullTitle;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [fullTitle, description]);

  return null;
}
