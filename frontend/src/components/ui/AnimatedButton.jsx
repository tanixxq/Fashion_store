import { motion } from "framer-motion";

export default function AnimatedButton({
  children,
  className = "btn-primary",
  onClick,
  type = "button",
  disabled,
  full,
  variant = "primary",
}) {
  const cls = [className, full ? "full" : "", variant === "ghost" ? "btn-ghost" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.button
      type={type}
      className={cls}
      disabled={disabled}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      {children}
    </motion.button>
  );
}
