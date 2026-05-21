import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

export default function PageTransition({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease }}
    >
      {children}
    </motion.div>
  );
}
