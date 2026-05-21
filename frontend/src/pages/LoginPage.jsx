import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

/** Step 6 — Login page (saves JWT via AuthContext) */
export default function LoginPage({ onBack, onGoSignup, onSuccess }) {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="page-shell auth-page">
      <button type="button" className="back-link" onClick={onBack}>
        ← Back
      </button>
      <div className="page-card auth-card">
        <Logo size="large" />
        <h2>Sign in to Super Kicks</h2>
        <p className="login-sub">Welcome back — track orders and checkout faster.</p>

        <form onSubmit={handleSubmit}>
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            required
            type="password"
            placeholder="Password (min. 4 characters)"
            minLength={4}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-primary full" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="login-switch">
          New here?{" "}
          <button type="button" onClick={onGoSignup}>
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}
