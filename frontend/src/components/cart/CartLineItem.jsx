import { motion } from "framer-motion";

export default function CartLineItem({ item, onUpdateQty, onRemove }) {
  const lineTotal = item.price * item.qty;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      className="flex gap-3 py-4 border-b border-white/10 last:border-0"
    >
      <img
        src={item.image}
        alt=""
        className="w-20 h-20 object-cover rounded-lg bg-neutral-800 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{item.name}</p>
        <p className="text-xs text-neutral-400 mt-0.5">₹{item.price} each</p>
        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            className="w-8 h-8 rounded-full border border-white/15 text-white hover:bg-white/10 transition"
            onClick={() => onUpdateQty(item.id, -1)}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="text-sm font-medium text-white w-6 text-center">{item.qty}</span>
          <button
            type="button"
            className="w-8 h-8 rounded-full border border-white/15 text-white hover:bg-white/10 transition"
            onClick={() => onUpdateQty(item.id, 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between shrink-0">
        <button
          type="button"
          className="text-xs text-neutral-500 hover:text-white transition"
          onClick={() => onRemove(item.id)}
        >
          Remove
        </button>
        <strong className="text-sm text-white">₹{lineTotal}</strong>
      </div>
    </motion.li>
  );
}
