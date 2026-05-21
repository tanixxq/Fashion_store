import { useEffect, useState } from "react";
import { fetchProductDetails } from "../api/client";
import { getProductDetails } from "../data/productDetails";
import {
  categorySizeChartMap,
  getSizesForCategory,
  sizeCharts,
} from "../data/sizeCharts";

export default function ProductModal({
  product,
  isFavourite,
  useApi,
  onClose,
  onToggleFavourite,
  onAddToCart,
}) {
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!product) return undefined;
    setInfo(getProductDetails(product));

    if (!useApi) return undefined;

    let cancelled = false;
    fetchProductDetails(product.id)
      .then((res) => {
        if (!cancelled) setInfo(res.details);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [product, useApi]);

  if (!product) return null;

  const details = info || getProductDetails(product);
  const sizes = getSizesForCategory(product.category);
  const chartKey = categorySizeChartMap[product.category];
  const chart = chartKey ? sizeCharts[chartKey] : null;
  const defaultSize = sizes[Math.floor(sizes.length / 2)] || sizes[0];
  const activeSize = selectedSize || defaultSize;

  const handleAdd = () => {
    onAddToCart(product, activeSize);
    onClose();
  };

  return (
    <>
      <button type="button" className="overlay" aria-label="Close" onClick={onClose} />
      <dialog className="product-modal product-detail-modal open" open>
        <button type="button" className="icon-btn modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="product-detail-layout">
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
            <h3>{product.name}</h3>
            <div className="product-meta">
              <strong>₹{product.price}</strong>
              <span>⭐ {product.rating}</span>
            </div>

            <p className="product-detail-desc">{details.details}</p>

            <dl className="product-specs">
              <div>
                <dt>Material</dt>
                <dd>{details.material}</dd>
              </div>
              <div>
                <dt>Fit</dt>
                <dd>{details.fit}</dd>
              </div>
              <div>
                <dt>Care</dt>
                <dd>{details.care}</dd>
              </div>
            </dl>

            <div className="product-features">
              <h4>Features</h4>
              <ul>
                {details.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="size-section">
              <div className="size-section-head">
                <h4>Select Size</h4>
                {chart && (
                  <button
                    type="button"
                    className="size-chart-toggle"
                    onClick={() => setShowSizeChart((v) => !v)}
                  >
                    {showSizeChart ? "Hide Size Chart" : "Size Chart"}
                  </button>
                )}
              </div>

              <div className="size-options">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-option ${activeSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {showSizeChart && chart && (
                <div className="size-chart-panel">
                  <p className="size-chart-title">{chart.title}</p>
                  <table>
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
                  <p className="size-chart-tip">
                    Tip: If you are between sizes, we recommend sizing up for oversized
                    fits.
                  </p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-ghost" onClick={onToggleFavourite}>
                {isFavourite ? "♥ Saved" : "♡ Save to Favourites"}
              </button>
              <button type="button" className="btn-primary" onClick={handleAdd}>
                Add to Cart — {activeSize}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
