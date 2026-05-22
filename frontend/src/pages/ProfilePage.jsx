import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function ProfilePage({ onBack, onGoOrders, onLogout }) {
  const { user } = useAuth();
  const { cartCount } = useCart();

  return (
    <div className="page-shell">
      <button type="button" className="back-link" onClick={onBack}>
        ← Home
      </button>
      <div className="page-card profile-card">
        <span className="eyebrow">Account</span>
        <h2>Your profile</h2>
        <div className="profile-info">
          <p>
            <strong>Name</strong> {user?.name}
          </p>
          <p>
            <strong>Email</strong> {user?.email}
          </p>
          <p>
            <strong>Role</strong> {user?.role || "user"}
          </p>
          <p>
            <strong>Bag</strong> {cartCount} item{cartCount === 1 ? "" : "s"}
          </p>
        </div>
        <div className="profile-actions">
          <button type="button" className="btn-primary" onClick={onGoOrders}>
            Track orders
          </button>
          <button type="button" className="btn-ghost" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
