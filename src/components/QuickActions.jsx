export default function QuickActions({
  favCount,
  orderCount,
  onFavourites,
  onTrack,
}) {
  return (
    <section className="quick-actions section">
      <button type="button" className="quick-card" onClick={onFavourites}>
        <span className="quick-icon">♥</span>
        <div>
          <strong>Favourites</strong>
          <p>{favCount} saved items</p>
        </div>
        <span className="quick-arrow">→</span>
      </button>
      <button type="button" className="quick-card" onClick={onTrack}>
        <span className="quick-icon">📦</span>
        <div>
          <strong>Track Order</strong>
          <p>
            {orderCount > 0
              ? `${orderCount} order${orderCount > 1 ? "s" : ""} to view`
              : "Check delivery status"}
          </p>
        </div>
        <span className="quick-arrow">→</span>
      </button>
    </section>
  );
}
