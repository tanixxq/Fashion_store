import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

/** Step 6 — Signup page → POST /api/auth/register */
export default function SignupPage({ onBack, onGoLogin, onSuccess }) {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form.name, form.email, form.password);
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="page-shell auth-page">
      <button type="button" className="back-link" onClick={onBack}>
        ← Back
      </button>
      <div className="page-card auth-card">
        <Logo size="large" />
        <h2>Join Super Kicks</h2>
        <p className="login-sub">Create your account for drops, cart sync, and checkout.</p>

        <form onSubmit={handleSubmit}>
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <p className="login-switch">
          Already have an account?{" "}
          <button type="button" onClick={onGoLogin}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
