import { useCart } from "../context/CartContext";

/**
 * Step 4 — Full cart page
 * Quantity +/- , remove item, total price
 */
export default function CartPage({ onBack, onCheckout }) {
  const { cart, cartCount, cartTotal, updateCartQty, removeFromCart } = useCart();

  return (
    <div className="page-shell cart-page">
      <button type="button" className="back-link" onClick={onBack}>
        ← Continue shopping
      </button>

      <div className="page-head">
        <span className="eyebrow">Your bag</span>
        <h2>Cart ({cartCount} items)</h2>
      </div>

      {cart.length === 0 ? (
        <div className="page-card empty-page">
          <p>Your cart is empty.</p>
          <button type="button" className="btn-primary" onClick={onBack}>
            Shop now
          </button>
        </div>
      ) : (
        <div className="cart-page-layout">
          <ul className="cart-list cart-list-page">
            {cart.map((item) => (
              <li key={item.id} className="page-card cart-line-card">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <strong>{item.name}</strong>
                  <span>₹{item.price} each</span>
                  <div className="cart-qty">
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.id, -1)}
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <em>{item.qty}</em>
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.id, 1)}
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                  <span className="line-total">Line total: ₹{item.price * item.qty}</span>
                </div>
                <button
                  type="button"
                  className="cart-remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <aside className="page-card cart-summary">
            <h3>Order summary</h3>
            <p>
              Subtotal <strong>₹{cartTotal}</strong>
            </p>
            <p className="cart-summary-note">Shipping calculated at checkout</p>
            <button type="button" className="btn-primary full" onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
