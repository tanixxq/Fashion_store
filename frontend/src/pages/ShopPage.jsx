import { motion } from "framer-motion";
import ProductCard from "../components/ui/ProductCard";
import { ProductGridSkeleton } from "../components/ui/ProductCardSkeleton";

export default function ShopPage({
  products,
  categories,
  selectedCategory,
  searchQuery,
  sortBy,
  loading,
  wishlist = [],
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onOpenProduct,
  onToggleWishlist,
  onAddToCart,
  onBack,
}) {
  let list = [...products];

  if (selectedCategory !== "All Categories") {
    list = list.filter((p) => p.category === selectedCategory);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }
  if (sortBy === "price-low") list.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-high") list.sort((a, b) => b.price - a.price);
  else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);

  return (
    <div className="page-shell shop-page">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button type="button" className="back-link" onClick={onBack}>
          ← Home
        </button>
        <div className="page-head">
          <span className="eyebrow">Shop</span>
          <h2>All products</h2>
          <p>{loading ? "Loading…" : `${list.length} styles available`}</p>
        </div>

        <div className="shop-toolbar page-card glass-card">
          <input
            type="search"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="rating">Top rated</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </div>

        <div className="shop-cats">
          <button
            type="button"
            className={selectedCategory === "All Categories" ? "active" : ""}
            onClick={() => onCategoryChange("All Categories")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={selectedCategory === cat ? "active" : ""}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : list.length === 0 ? (
          <p className="empty-state">No products found.</p>
        ) : (
          <div className="product-grid">
            {list.map((product, index) => (
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
