import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchProduct } from "../api/client";
import { getProductDetails } from "../data/productDetails";
import {
  categorySizeChartMap,
  getSizesForCategory,
  sizeCharts,
} from "../data/sizeCharts";
import { useCart } from "../context/CartContext";
import AnimatedButton from "../components/ui/AnimatedButton";
import ProductCard from "../components/ui/ProductCard";

const ease = [0.22, 1, 0.36, 1];

const DELIVERY_BY_CATEGORY = {
  Sneakers: { standard: "3–5 business days", express: "1–2 business days" },
  Glasses: { standard: "2–4 business days", express: "Next day in metros" },
  Caps: { standard: "2–4 business days", express: "1–2 business days" },
  default: { standard: "2–4 business days", express: "1–2 business days" },
};

function getDeliveryInfo(category) {
  return DELIVERY_BY_CATEGORY[category] || DELIVERY_BY_CATEGORY.default;
}

function PdpSkeleton() {
  return (
    <div className="pdp-page">
      <div className="pdp-split">
        <div className="skeleton-block skeleton-media pdp-gallery-skeleton" />
        <div className="pdp-info" style={{ padding: "2rem" }}>
          <div className="skeleton-line skeleton-sm" />
          <div className="skeleton-line skeleton-lg" />
          <div className="skeleton-line skeleton-md" />
          <div className="skeleton-line skeleton-btn" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({
  productId,
  allProducts = [],
  onBack,
  onOpenProduct,
  onGoCart,
  onToggleWishlist,
  isFavourite,
  wishlist = [],
}) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setActiveTab("description");
    setQty(1);
    setSize("");

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchProduct(productId);
        if (!cancelled) setProduct(res.product);
      } catch {
        const local = allProducts.find((p) => String(p.id) === String(productId));
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
  }, [productId, allProducts]);

  const similarItems = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter(
        (p) =>
          p.category === product.category &&
          String(p.id) !== String(product.id)
      )
      .slice(0, 4);
  }, [product, allProducts]);

  if (loading) return <PdpSkeleton />;

  if (error || !product) {
    return (
      <div className="page-shell">
        <div className="page-card empty-page">
          <p>{error || "Product not found"}</p>
          <AnimatedButton onClick={onBack}>Back to shop</AnimatedButton>
        </div>
      </div>
    );
  }

  const info = getProductDetails(product);
  const sizes = getSizesForCategory(product.category);
  const activeSize = size || sizes[Math.floor(sizes.length / 2)] || sizes[0];
  const chartKey = categorySizeChartMap[product.category];
  const chart = chartKey ? sizeCharts[chartKey] : null;
  const delivery = getDeliveryInfo(product.category);

  const handleAdd = () => {
    addToCart(product, activeSize, qty);
    onGoCart?.();
  };

  return (
    <div className="pdp-page pdp-page-premium">
      <motion.header
        className="pdp-topbar"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
      >
        <button type="button" className="back-link" onClick={onBack}>
          ← Back
        </button>
        <nav className="pdp-breadcrumb">
          <button type="button" onClick={onBack}>Shop</button>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span>{product.name}</span>
        </nav>
      </motion.header>

      <div className="pdp-split">
        <section className="pdp-gallery" aria-label="Product image">
          <div className="pdp-gallery-inner">
            <AnimatePresence mode="wait">
              <motion.img
                key={product.image}
                src={product.image}
                alt={product.name}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease }}
              />
            </AnimatePresence>
            {product.badge && (
              <motion.span
                className={`badge badge-${product.badge.toLowerCase()}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {product.badge}
              </motion.span>
            )}
          </div>
        </section>

        <motion.section
          className="pdp-info"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
        >
          <span className="product-cat">{product.category}</span>
          <h1>{product.name}</h1>

          <div className="pdp-rating-row">
            <span className="pdp-stars">⭐ {product.rating ?? 4.5}</span>
            <span className="pdp-reviews">128 reviews</span>
            <span className="pdp-stock">In stock</span>
          </div>

          <div className="pdp-price-block">
            <strong className="pdp-price">₹{product.price}</strong>
            <span className="pdp-price-note">Inclusive of taxes</span>
          </div>

          <motion.div
            className="pdp-delivery-banner"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            <span className="pdp-delivery-icon">🚚</span>
            <div>
              <strong>Delivery in {delivery.standard}</strong>
              <p>Express: {delivery.express} · Free shipping over ₹2,999</p>
            </div>
          </motion.div>

          <div className="size-section">
            <div className="size-section-head">
              <h4>Select size</h4>
              {chart && (
                <button
                  type="button"
                  className="size-chart-toggle"
                  onClick={() => setActiveTab("size-chart")}
                >
                  Size chart
                </button>
              )}
            </div>
            <div className="size-options">
              {sizes.map((s) => (
                <motion.button
                  key={s}
                  type="button"
                  className={`size-option ${activeSize === s ? "active" : ""}`}
                  onClick={() => setSize(s)}
                  whileTap={{ scale: 0.94 }}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="pdp-qty-row">
            <label>Quantity</label>
            <div className="cart-qty">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <em>{qty}</em>
              <button type="button" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </div>
          </div>

          <div className="pdp-actions pdp-actions-desktop">
            <AnimatedButton className="btn-primary pdp-add-btn" full onClick={handleAdd}>
              Add to Cart — {activeSize}
            </AnimatedButton>
            <AnimatedButton
              className="btn-ghost pdp-wish-btn"
              variant="ghost"
              onClick={() => onToggleWishlist(product.id)}
            >
              {isFavourite ? "♥ Saved" : "♡ Save"}
            </AnimatedButton>
          </div>

          <div className="pdp-trust">
            <span>↩️ 7-day easy returns</span>
            <span>✓ Authentic streetwear</span>
            <span>🔒 Secure checkout</span>
          </div>

          <div className="pdp-tabs">
            {["description", "size-chart", "delivery"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`pdp-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "description" && "Description"}
                {tab === "size-chart" && "Size chart"}
                {tab === "delivery" && "Delivery & returns"}
              </button>
            ))}
          </div>

          <div className="pdp-tab-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="pdp-tab-panel-inner"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease }}
              >
                {activeTab === "description" && (
                  <div className="pdp-tab-content">
                    <p>{info.details}</p>
                    <dl className="product-specs">
                      <div>
                        <dt>Material</dt>
                        <dd>{info.material}</dd>
                      </div>
                      <div>
                        <dt>Fit</dt>
                        <dd>{info.fit}</dd>
                      </div>
                      <div>
                        <dt>Care</dt>
                        <dd>{info.care}</dd>
                      </div>
                    </dl>
                    <ul className="pdp-features">
                      {info.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "size-chart" && chart && (
                  <div className="pdp-tab-content">
                    <p className="size-chart-title">{chart.title}</p>
                    <table className="pdp-size-table">
                      <thead>
                        <tr>
                          {chart.headers.map((h) => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {chart.rows.map((row) => (
                          <tr key={row.join("-")}>
                            {row.map((cell) => (
                              <td key={cell}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "delivery" && (
                  <div className="pdp-tab-content">
                    <h4>Delivery</h4>
                    <ul>
                      <li>Standard: {delivery.standard}</li>
                      <li>Express: {delivery.express}</li>
                      <li>Order before 2 PM for same-day dispatch</li>
                    </ul>
                    <h4>Returns & exchange</h4>
                    <ul>
                      <li>7-day hassle-free exchange</li>
                      <li>Free pickup in major cities</li>
                    </ul>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.section>
      </div>

      {similarItems.length > 0 && (
        <motion.section
          className="pdp-similar section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-head">
            <span className="eyebrow">You may also like</span>
            <h2>Similar items</h2>
          </div>
          <div className="product-grid pdp-similar-grid">
            {similarItems.map((item, i) => (
              <ProductCard
                key={item.id}
                product={item}
                index={i}
                isFavourite={wishlist.some((id) => String(id) === String(item.id))}
                onOpen={onOpenProduct}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={(p) => addToCart(p)}
                showQuickAdd
              />
            ))}
          </div>
        </motion.section>
      )}

      <motion.div
        className="pdp-sticky-bar"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32, delay: 0.3 }}
      >
        <div className="pdp-sticky-inner">
          <div>
            <div className="pdp-sticky-price">₹{product.price}</div>
            <div className="pdp-sticky-size">Size {activeSize}</div>
          </div>
          <AnimatedButton className="btn-primary" onClick={handleAdd}>
            Add to Cart
          </AnimatedButton>
        </div>
      </motion.div>
    </div>
  );
}
