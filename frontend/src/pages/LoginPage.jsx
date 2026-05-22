import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import { PATHS } from "../navigation";

/** Login — JWT stored via AuthContext; redirects to prior page if protected */
export default function LoginPage({ onBack, onGoSignup, onSuccess }) {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const redirectTo = location.state?.from || PATHS.home;
  const gateMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(form.email, form.password);
      onSuccess?.(res);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.status === 403) {
        setError(
          "API returned 403 — check that the frontend points to port 5001 (not 5000). Restart Vite after changing .env."
        );
      } else {
        setError(err.message || "Login failed");
      }
      if (import.meta.env.DEV) console.error("[Login]", err);
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
        <p className="login-sub">
          {gateMessage || "Welcome back — track orders and checkout faster."}
        </p>

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
