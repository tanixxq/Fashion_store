export function ProductCardSkeleton() {
  return (
    <article className="product-card product-card-skeleton" aria-hidden>
      <div className="skeleton-block skeleton-media" />
      <div className="product-body">
        <div className="skeleton-line skeleton-sm" />
        <div className="skeleton-line skeleton-lg" />
        <div className="skeleton-line skeleton-md" />
        <div className="skeleton-line skeleton-btn" />
      </div>
    </article>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
