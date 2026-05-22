import { useCart } from "../context/CartContext";
import CartSummary from "../components/cart/CartSummary";

export default function CartPage({ onBack, onCheckout }) {
  const {
    cart,
    cartCount,
    cartSubtotal,
    shipping,
    orderTotal,
    updateCartQty,
    removeFromCart,
  } = useCart();

  return (
    <div className="page-shell cart-page max-w-5xl mx-auto px-4 py-8">
      <button
        type="button"
        className="back-link text-neutral-400 hover:text-white mb-6"
        onClick={onBack}
      >
        ← Continue shopping
      </button>

      <div className="page-head mb-8">
        <span className="eyebrow text-[10px] uppercase tracking-[0.2em] text-neutral-500">
          Your bag
        </span>
        <h2 className="text-3xl font-bold text-white">Cart ({cartCount} items)</h2>
      </div>

      {cart.length === 0 ? (
        <div className="page-card empty-page text-center py-16 rounded-2xl border border-white/10 bg-neutral-900">
          <p className="text-neutral-400">Your cart is empty.</p>
          <button type="button" className="btn-primary mt-6" onClick={onBack}>
            Shop now
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex gap-4 p-4 rounded-2xl border border-white/10 bg-neutral-900"
              >
                <img
                  src={item.image}
                  alt=""
                  className="w-24 h-24 object-cover rounded-xl bg-neutral-800"
                />
                <div className="flex-1 min-w-0">
                  <strong className="text-white block truncate">{item.name}</strong>
                  <span className="text-sm text-neutral-400">₹{item.price} each</span>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      className="w-9 h-9 rounded-full border border-white/15 text-white"
                      onClick={() => updateCartQty(item.id, -1)}
                    >
                      −
                    </button>
                    <em className="text-white not-italic w-6 text-center">{item.qty}</em>
                    <button
                      type="button"
                      className="w-9 h-9 rounded-full border border-white/15 text-white"
                      onClick={() => updateCartQty(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-neutral-300 mt-2 block">
                    Line total: ₹{item.price * item.qty}
                  </span>
                </div>
                <button
                  type="button"
                  className="text-xs text-neutral-500 hover:text-white self-start"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <aside className="page-card rounded-2xl border border-white/10 bg-neutral-900 overflow-hidden h-fit sticky top-24">
            <div className="p-5">
              <h3 className="text-white font-bold mb-4">Order summary</h3>
            </div>
            <CartSummary
              subtotal={cartSubtotal}
              shipping={shipping}
              total={orderTotal}
              itemCount={cartCount}
              onCheckout={onCheckout}
            />
          </aside>
        </div>
      )}
    </div>
  );
}
