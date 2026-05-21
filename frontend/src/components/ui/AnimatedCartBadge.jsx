import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedCartBadge({ count, className = "" }) {
  return (
    <span className={`cart-badge-wrap ${className}`}>
      <AnimatePresence mode="popLayout">
        {count > 0 && (
          <motion.span
            key={count}
            className="cart-badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
