import { motion } from "framer-motion";
import ProductCard from "../components/ui/ProductCard";
import { ProductGridSkeleton } from "../components/ui/ProductCardSkeleton";

export default function NewArrivalsPage({
  products,
  loading,
  wishlist = [],
  onOpenProduct,
  onToggleWishlist,
  onAddToCart,
  onBack,
}) {
  const items = products.filter((p) => p.badge === "NEW");

  return (
    <div className="page-shell">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button type="button" className="back-link" onClick={onBack}>
          ← Home
        </button>
        <div className="page-head">
          <span className="eyebrow">Just dropped</span>
          <h2>New arrivals</h2>
          <p>Fresh styles added this week</p>
        </div>
        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : items.length === 0 ? (
          <p className="empty-state">No new arrivals right now.</p>
        ) : (
          <div className="product-grid">
            {items.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                isFavourite={wishlist.includes(product.id)}
                onOpen={onOpenProduct}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
