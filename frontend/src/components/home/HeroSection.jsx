import { motion } from "framer-motion";

export default function HeroSection({ onShop, onOutfits, onTrending }) {
  return (
    <section className="hero section hero-premium relative overflow-hidden min-h-[70vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 pointer-events-none" />
      <motion.div
        className="absolute -right-20 top-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="hero-inner relative z-10 grid md:grid-cols-2 gap-10 items-center w-full max-w-[var(--max)] mx-auto px-[var(--content-pad)]">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="pill inline-block mb-4 text-[10px] uppercase tracking-[0.25em] text-neutral-400 border border-white/10 px-3 py-1 rounded-full">
            Spring / Summer 2026
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
            Elevated streetwear for those who move different.
          </h2>
          <p className="mt-4 text-neutral-400 text-lg max-w-lg">
            Premium sneakers, curated fits, and limited drops — built for comfort,
            confidence, and clean aesthetics.
          </p>
          <div className="hero-cta flex flex-wrap gap-3 mt-8">
            <motion.button
              type="button"
              className="btn-primary px-8 py-3.5"
              onClick={onShop}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Shop Collection
            </motion.button>
            <button type="button" className="btn-ghost px-6 py-3" onClick={onOutfits}>
              Outfit Sets
            </button>
            <button type="button" className="btn-ghost px-6 py-3" onClick={onTrending}>
              Trending
            </button>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual relative"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
            alt="Premium sneaker editorial"
            className="w-full rounded-2xl object-cover aspect-[4/5] shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="hero-quote absolute bottom-6 left-6 right-6 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-white text-sm font-medium">&ldquo;Dress well. Feel powerful.&rdquo;</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
