import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar({
  value,
  onChange,
  products = [],
  placeholder = "Search sneakers, tees, jackets…",
}) {
  const [focused, setFocused] = useState(false);

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (q.length < 2) return [];
    const seen = new Set();
    return products
      .filter((p) => {
        const match =
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q);
        if (!match || seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      })
      .slice(0, 6);
  }, [value, products]);

  return (
    <div className="relative w-full">
      <input
        type="search"
        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 180)}
        autoComplete="off"
      />
      <AnimatePresence>
        {focused && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute z-50 left-0 right-0 mt-1 py-2 rounded-xl border border-white/10 bg-neutral-900 shadow-2xl overflow-hidden"
          >
            {suggestions.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition text-sm"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onChange(p.name)}
                >
                  <img
                    src={p.image}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover bg-neutral-800"
                  />
                  <span>
                    <strong className="text-white block">{p.name}</strong>
                    <span className="text-neutral-500 text-xs">
                      {p.brand || p.category} · ₹{p.price}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
