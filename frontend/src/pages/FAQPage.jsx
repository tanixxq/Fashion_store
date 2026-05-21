const faqs = [
  {
    q: "How do I track my order?",
    a: "Go to Track Order and enter your order ID (e.g. DK-482910).",
  },
  {
    q: "What is your return policy?",
    a: "7-day exchange on unworn items with tags attached. Free pickup in select cities.",
  },
  {
    q: "How do I choose the right size?",
    a: "Use the Size chart on each product page or visit our full Size Guide.",
  },
  {
    q: "Do you offer Cash on Delivery?",
    a: "Yes, COD is available at checkout for orders under ₹10,000.",
  },
  {
    q: "Are products authentic?",
    a: "Every item is sourced from verified partners and quality-checked before dispatch.",
  },
];

export default function FAQPage({ onBack }) {
  return (
    <div className="page-shell static-page">
      <button type="button" className="back-link" onClick={onBack}>
        ← Home
      </button>
      <div className="page-head">
        <span className="eyebrow">Help</span>
        <h2>Frequently asked questions</h2>
      </div>
      <div className="faq-list">
        {faqs.map((item) => (
          <details key={item.q} className="page-card faq-item">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
