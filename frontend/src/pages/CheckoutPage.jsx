import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRazorpayCheckout } from "../hooks/useRazorpayCheckout";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import { generateOrderId } from "../utils/storage";

const PAYMENT_METHODS = [
  { id: "razorpay", label: "Razorpay", hint: "UPI, cards, wallets (recommended)" },
  { id: "cod", label: "Cash on Delivery", hint: "Pay when you receive" },
  { id: "upi", label: "Manual UPI", hint: "Pay via UPI ID (demo)" },
];

export default function CheckoutPage({
  cart,
  cartTotal,
  onBack,
  onPlaceOrder,
}) {
  const { user } = useAuth();
  const { config: payConfig, paying, pay } = useRazorpayCheckout();
  const [payment, setPayment] = useState("razorpay");
  const [checkoutError, setCheckoutError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || user.name || "",
      email: prev.email || user.email || "",
    }));
  }, [user]);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const buildOrder = (paymentMeta = {}) => ({
    id: generateOrderId(),
    date: new Date().toISOString(),
    items: cart,
    total: cartTotal,
    payment: { method: payment, ...paymentMeta },
    shipping: form,
    status: "placed",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setCheckoutError("");

    try {
      if (payment === "razorpay") {
        await pay({
          amount: cartTotal,
          user,
          onSuccess: (meta) => onPlaceOrder(buildOrder(meta)),
          onError: (err) => setCheckoutError(err.message || "Payment failed"),
        });
        return;
      }

      onPlaceOrder(buildOrder());
    } catch (err) {
      setCheckoutError(err.message || "Checkout failed");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page-shell">
        <div className="page-card empty-page">
          <h2>Your bag is empty</h2>
          <p>Add items before checkout.</p>
          <button type="button" className="btn-primary" onClick={onBack}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell checkout-page">
      <button type="button" className="back-link" onClick={onBack}>
        ← Back to shop
      </button>
      <div className="checkout-layout">
        <form className="checkout-form page-card" onSubmit={handleSubmit}>
          <span className="eyebrow">Secure Checkout</span>
          <h2>Payment & Delivery</h2>
          <ErrorMessage message={checkoutError} />
          {!payConfig.razorpayEnabled && payment === "razorpay" && (
            <p className="checkout-hint">Razorpay mock mode — add keys in backend .env for live payments.</p>
          )}

          <fieldset>
            <legend>Contact</legend>
            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={update("name")}
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={update("email")}
            />
            <input
              required
              type="tel"
              placeholder="Phone number"
              value={form.phone}
              onChange={update("phone")}
            />
          </fieldset>

          <fieldset>
            <legend>Shipping address</legend>
            <textarea
              required
              rows={3}
              placeholder="Street address, apartment, landmark"
              value={form.address}
              onChange={update("address")}
            />
            <div className="field-row">
              <input
                required
                placeholder="City"
                value={form.city}
                onChange={update("city")}
              />
              <input
                required
                placeholder="PIN code"
                value={form.pincode}
                onChange={update("pincode")}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Payment method</legend>
            <div className="payment-options">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={`payment-option ${payment === method.id ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={payment === method.id}
                    onChange={() => setPayment(method.id)}
                  />
                  <div>
                    <strong>{method.label}</strong>
                    <span>{method.hint}</span>
                  </div>
                </label>
              ))}
            </div>
            {payment === "card" && (
              <div className="card-fields">
                <input placeholder="Card number" required />
                <div className="field-row">
                  <input placeholder="MM/YY" required />
                  <input placeholder="CVV" required />
                </div>
              </div>
            )}
            {payment === "upi" && (
              <input placeholder="UPI ID (e.g. name@upi)" required />
            )}
          </fieldset>

          <button type="submit" className="btn-primary full pay-btn" disabled={paying}>
            {paying ? "Processing…" : `Pay ₹${cartTotal} & Place Order`}
          </button>
          {paying && <LoadingSpinner label="Opening payment…" className="checkout-spinner" />}
        </form>

        <aside className="checkout-summary page-card">
          <h3>Order Summary</h3>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                <img src={item.image} alt="" />
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    ₹{item.price} × {item.qty}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="summary-line">
            <span>Subtotal</span>
            <strong>₹{cartTotal}</strong>
          </div>
          <div className="summary-line">
            <span>Shipping</span>
            <strong>Free</strong>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>₹{cartTotal}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}
