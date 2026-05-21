/**
 * Step 6 — Fetch products from Express API and use in React
 *
 * Usage in App.jsx:
 *   const { products, loading, error, fromApi } = useProducts(staticProducts);
 */
import { useEffect, useState } from "react";
import { checkApiHealth, fetchProducts } from "../api/client";

export function useProducts(fallbackProducts = []) {
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const online = await checkApiHealth();
        if (!online) {
          if (!cancelled) setLoading(false);
          return;
        }

        const data = await fetchProducts();
        if (!cancelled) {
          setProducts(data.products || []);
          setFromApi(true);
          console.log(
            `Products loaded from API (${data.source || "api"}):`,
            data.products?.length
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setProducts(fallbackProducts);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, setProducts, loading, error, fromApi };
}
