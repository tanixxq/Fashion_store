import { motion } from "framer-motion";
import AnimatedButton from "./AnimatedButton";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ProductCard({
  product,
  index = 0,
  isFavourite,
  onOpen,
  onToggleWishlist,
  onAddToCart,
  showQuickAdd = true,
}) {
  return (
    <motion.article
      className="product-card product-card-premium"
      variants={cardVariants}
      initial="hidden"
      animate="show"
      custom={index}
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div
        className="product-media"
        role="button"
        tabIndex={0}
        onClick={() => onOpen(product.id)}
        onKeyDown={(e) => e.key === "Enter" && onOpen(product.id)}
      >
        <motion.img
          src={product.image}
          alt={product.name}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        {product.badge && (
          <span className={`badge badge-${product.badge.toLowerCase()}`}>
            {product.badge}
          </span>
        )}
        <motion.button
          type="button"
          className={`wish-btn ${isFavourite ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          whileTap={{ scale: 0.88 }}
          aria-label="Add to favourites"
        >
          ♥
        </motion.button>
        {showQuickAdd && (
          <motion.div
            className="product-quick-actions"
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ opacity: 1, y: 0 }}
          >
            <button
              type="button"
              className="quick-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(product.id);
              }}
            >
              View
            </button>
            <button
              type="button"
              className="quick-action-btn quick-action-primary"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              + Bag
            </button>
          </motion.div>
        )}
      </div>
      <div className="product-body">
        <span className="product-cat">{product.category}</span>
        <h4>
          <button
            type="button"
            className="product-title-btn"
            onClick={() => onOpen(product.id)}
          >
            {product.name}
          </button>
        </h4>
        <p className="product-desc">{product.description}</p>
        <div className="product-meta">
          <strong>₹{product.price}</strong>
          <span>⭐ {product.rating}</span>
        </div>
        <AnimatedButton className="btn-primary" full onClick={() => onAddToCart(product)}>
          Add to Cart
        </AnimatedButton>
      </div>
    </motion.article>
  );
}
