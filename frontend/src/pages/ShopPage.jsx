import { useMemo } from "react";
import { motion } from "framer-motion";
import ProductCard from "../components/ui/ProductCard";
import { ProductGridSkeleton } from "../components/ui/ProductCardSkeleton";
import SearchBar from "../components/shop/SearchBar";
import ErrorMessage from "../components/ui/ErrorMessage";

export default function ShopPage({
  products,
  categories,
  selectedCategory,
  selectedBrand,
  searchQuery,
  sortBy,
  loading,
  error,
  wishlist = [],
  onCategoryChange,
  onBrandChange,
  onSearchChange,
  onSortChange,
  onOpenProduct,
  onToggleWishlist,
  onAddToCart,
  onBack,
  onRetry,
}) {
  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand || p.category).filter(Boolean));
    return ["All Brands", ...Array.from(set).sort()];
  }, [products]);

  let list = [...products];

  if (selectedCategory !== "All Categories") {
    list = list.filter((p) => p.category === selectedCategory);
  }
  if (selectedBrand && selectedBrand !== "All Brands") {
    list = list.filter(
      (p) => (p.brand || p.category)?.toLowerCase() === selectedBrand.toLowerCase()
    );
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.brand || "").toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }
  if (sortBy === "price-low") list.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-high") list.sort((a, b) => b.price - a.price);
  else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);

  return (
    <div className="page-shell shop-page max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button type="button" className="back-link text-neutral-400 hover:text-white mb-6" onClick={onBack}>
          ← Home
        </button>
        <div className="page-head mb-6">
          <span className="eyebrow text-[10px] uppercase tracking-[0.2em] text-neutral-500">Shop</span>
          <h2 className="text-3xl font-bold text-white">All products</h2>
          <p className="text-neutral-400">{loading ? "Loading…" : `${list.length} styles`}</p>
        </div>

        <ErrorMessage message={error} onRetry={onRetry} />

        <div className="shop-toolbar flex flex-col md:flex-row gap-3 mb-4 p-4 rounded-2xl border border-white/10 bg-neutral-900/80">
          <SearchBar value={searchQuery} onChange={onSearchChange} products={products} />
          <select
            className="md:w-48 px-3 py-3 rounded-xl bg-neutral-800 border border-white/10 text-white"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="rating">Top rated</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
          <select
            className="md:w-44 px-3 py-3 rounded-xl bg-neutral-800 border border-white/10 text-white"
            value={selectedBrand || "All Brands"}
            onChange={(e) => onBrandChange?.(e.target.value)}
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="shop-cats flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wide border transition ${selectedCategory === "All Categories" ? "bg-white text-black border-white" : "border-white/15 text-neutral-400 hover:text-white"}`}
            onClick={() => onCategoryChange("All Categories")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wide border transition ${selectedCategory === cat ? "bg-white text-black border-white" : "border-white/15 text-neutral-400 hover:text-white"}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : list.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-white/10 bg-neutral-900">
            <p className="text-neutral-400">No products match your filters.</p>
          </div>
        ) : (
          <div className="product-grid">
            {list.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                isFavourite={wishlist.some((id) => String(id) === String(product.id))}
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
