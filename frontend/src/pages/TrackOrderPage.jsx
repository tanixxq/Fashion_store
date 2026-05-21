import { useState } from "react";
import { getOrderStepIndex, ORDER_STEPS } from "../utils/storage";

export default function TrackOrderPage({
  orders,
  onBack,
  highlightOrderId,
  useApi,
  onTrackOrder,
}) {
  const [searchId, setSearchId] = useState(highlightOrderId || "");
  const [trackedOrders, setTrackedOrders] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [trackError, setTrackError] = useState("");

  const allOrders = [...orders];
  for (const o of trackedOrders) {
    if (!allOrders.some((x) => x.id === o.id)) allOrders.push(o);
  }

  const matched = searchId.trim()
    ? allOrders.filter((o) =>
        o.id.toLowerCase().includes(searchId.trim().toLowerCase())
      )
    : allOrders;

  const handleTrack = async () => {
    const id = searchId.trim();
    if (!id) return;
    setTrackError("");

    if (useApi && onTrackOrder) {
      setTracking(true);
      try {
        const order = await onTrackOrder(id);
        setTrackedOrders((prev) =>
          prev.some((o) => o.id === order.id) ? prev : [order, ...prev]
        );
      } catch (err) {
        setTrackError(err.message || "Order not found");
      } finally {
        setTracking(false);
      }
    }
  };

  return (
    <div className="page-shell">
      <button type="button" className="back-link" onClick={onBack}>
        ← Back to home
      </button>
      <div className="page-head">
        <span className="eyebrow">Track Order</span>
        <h2>Where is my package?</h2>
        <p>Enter your order ID to see live status updates.</p>
      </div>

      <div className="track-search page-card">
        <input
          type="text"
          placeholder="e.g. DK-482910"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button
          type="button"
          className="btn-primary"
          disabled={tracking}
          onClick={handleTrack}
        >
          {tracking ? "Searching…" : "Track"}
        </button>
      </div>

      {trackError && (
        <p className="empty-state" style={{ marginTop: "0.5rem" }}>
          {trackError}
        </p>
      )}

      {allOrders.length === 0 ? (
        <div className="page-card empty-page">
          <p>No orders yet. Place your first order from checkout.</p>
          <button type="button" className="btn-primary" onClick={onBack}>
            Start Shopping
          </button>
        </div>
      ) : matched.length === 0 ? (
        <div className="page-card empty-page">
          <p>No order found for &quot;{searchId}&quot;. Check the ID and try again.</p>
        </div>
      ) : (
        <div className="orders-list">
          {matched.map((order) => {
            const stepIndex = getOrderStepIndex(order.status);
            return (
              <article
                key={order.id}
                className={`order-card page-card ${highlightOrderId === order.id ? "highlight" : ""}`}
              >
                <div className="order-card-head">
                  <div>
                    <strong>{order.id}</strong>
                    <span>
                      {new Date(order.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <span className="order-total">₹{order.total}</span>
                </div>
                <p className="order-meta">
                  {order.items.length} items · {order.payment.toUpperCase()} ·{" "}
                  {order.shipping?.city}
                </p>
                <div className="timeline">
                  {ORDER_STEPS.map((step, i) => (
                    <div
                      key={step.key}
                      className={`timeline-step ${i <= stepIndex ? "done" : ""} ${i === stepIndex ? "current" : ""}`}
                    >
                      <span className="dot" />
                      <span>{step.label}</span>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
