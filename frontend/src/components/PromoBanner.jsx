export default function PromoBanner({ onShopSale, onDismiss }) {
  return (
    <div className="promo-banner">
      <p>
        <strong>FLASH20</strong> — Extra 20% off trending picks & outfit sets today only
      </p>
      <div className="promo-actions">
        <button type="button" className="btn-primary" onClick={onShopSale}>
          Shop Sale
        </button>
        <button type="button" className="promo-dismiss" onClick={onDismiss} aria-label="Dismiss">
          ✕
        </button>
      </div>
    </div>
  );
}
