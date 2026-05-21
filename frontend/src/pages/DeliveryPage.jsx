export default function DeliveryPage({ onBack, onTrack }) {
  return (
    <div className="page-shell static-page">
      <button type="button" className="back-link" onClick={onBack}>
        ← Home
      </button>
      <div className="page-card static-content">
        <span className="eyebrow">Shipping</span>
        <h1>Delivery & shipping</h1>

        <div className="info-cards">
          <article>
            <h3>🚚 Standard delivery</h3>
            <p>2–5 business days · ₹99 (free over ₹2,999)</p>
          </article>
          <article>
            <h3>⚡ Express delivery</h3>
            <p>1–2 business days in metros · ₹199</p>
          </article>
          <article>
            <h3>👟 Sneakers</h3>
            <p>3–5 business days · shipped in branded box</p>
          </article>
        </div>

        <h4>Order tracking</h4>
        <p>Once shipped, use your order ID on the Track Order page.</p>
        <button type="button" className="btn-primary" onClick={onTrack}>
          Track my order
        </button>

        <h4>Dispatch cut-off</h4>
        <p>Orders placed before 2:00 PM IST ship the same day (Mon–Sat).</p>
      </div>
    </div>
  );
}
