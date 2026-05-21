import { useState } from "react";
import Logo from "./Logo";

export default function LoginModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email.trim() || form.password.length < 4) return;

    onLogin({
      mode,
      name: mode === "signup" ? form.name.trim() || "Shopper" : form.email.split("@")[0],
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <>
      <button type="button" className="overlay" aria-label="Close login" onClick={onClose} />
      <dialog className="login-modal open" open>
        <button type="button" className="icon-btn modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="login-modal-brand">
          <Logo size="large" />
        </div>
        <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
        <p className="login-sub">
          {mode === "login"
            ? "Sign in to track orders, save favourites, and checkout faster."
            : "Join DripKart for a personalised streetwear experience."}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={update("name")}
            />
          )}
          <input
            required
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={update("email")}
          />
          <input
            required
            type="password"
            placeholder="Password (min. 4 characters)"
            minLength={4}
            value={form.password}
            onChange={update("password")}
          />
          <button type="submit" className="btn-primary full">
            {mode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="login-switch">
          {mode === "login" ? "New to DripKart?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </p>
      </dialog>
    </>
  );
}
