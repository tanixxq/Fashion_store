import { useEffect, useState } from "react";
import { fetchProduct } from "../api/client";
import { getProductDetails } from "../data/productDetails";
import { getSizesForCategory } from "../data/sizeCharts";
import { useCart } from "../context/CartContext";

/**
 * Step 2 — Product Details page
 * Loads single product from GET /api/products/:id
 */
export default function ProductDetailPage({
  productId,
  fallbackProducts = [],
  onBack,
  onToggleWishlist,
  isFavourite,
}) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [size, setSize] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchProduct(productId);
        if (!cancelled) setProduct(res.product);
      } catch {
        const local = fallbackProducts.find(
          (p) => String(p.id) === String(productId)
        );
        if (!cancelled) {
          if (local) setProduct(local);
          else setError("Product not found");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [productId, fallbackProducts]);

  if (loading) {
    return (
      <div className="page-shell">
        <p className="empty-state">Loading product…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-shell">
        <div className="page-card empty-page">
          <p>{error || "Product not found"}</p>
          <button type="button" className="btn-primary" onClick={onBack}>
            Back to shop
          </button>
        </div>
      </div>
    );
  }

  const info = getProductDetails(product);
  const sizes = getSizesForCategory(product.category);
  const activeSize = size || sizes[Math.floor(sizes.length / 2)] || sizes[0];

  return (
    <div className="page-shell product-detail-page">
      <button type="button" className="back-link" onClick={onBack}>
        ← Back to shop
      </button>

      <div className="product-detail-layout page-card">
        <div className="product-detail-media">
          <img src={product.image} alt={product.name} />
          {product.badge && (
            <span className={`badge badge-${product.badge.toLowerCase()}`}>
              {product.badge}
            </span>
          )}
        </div>

        <div className="product-detail-content">
          <span className="product-cat">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="product-meta">
            <strong>₹{product.price}</strong>
            <span>⭐ {product.rating ?? 4.5}</span>
          </div>

          <p className="product-detail-desc">{info.details}</p>

          <dl className="product-specs">
            <div>
              <dt>Material</dt>
              <dd>{info.material}</dd>
            </div>
            <div>
              <dt>Fit</dt>
              <dd>{info.fit}</dd>
            </div>
          </dl>

          <div className="size-section">
            <h4>Select size</h4>
            <div className="size-options">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`size-option ${activeSize === s ? "active" : ""}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={() => onToggleWishlist(product.id)}>
              {isFavourite ? "♥ Saved" : "♡ Save"}
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => addToCart(product, activeSize)}
            >
              Add to Cart — {activeSize}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
