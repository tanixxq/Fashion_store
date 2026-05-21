import { useState } from "react";

export default function ContactPage({ onBack, onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="page-shell static-page">
      <button type="button" className="back-link" onClick={onBack}>
        ← Home
      </button>
      <div className="page-card static-content contact-page">
        <span className="eyebrow">Get in touch</span>
        <h1>Contact us</h1>
        <p>Questions about orders, sizing, or collaborations? We reply within 24 hours.</p>

        <div className="contact-grid">
          <div>
            <h4>Email</h4>
            <p>hello@superkicks.in</p>
            <h4>Phone</h4>
            <p>+91 98765 43210</p>
            <h4>Hours</h4>
            <p>Mon–Sat, 10 AM – 7 PM IST</p>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              required
              placeholder="Your name"
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
            <textarea
              required
              rows={5}
              placeholder="Your message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button type="submit" className="btn-primary">
              Send message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
