const INFO = {
  size: {
    title: "Size Guide",
    body: [
      "S — Chest 36–38\" · Waist 28–30\"",
      "M — Chest 38–40\" · Waist 30–32\"",
      "L — Chest 40–42\" · Waist 32–34\"",
      "XL — Chest 42–44\" · Waist 34–36\"",
      "Outfit sets include adjustable fits. When in doubt, size up for oversized streetwear looks.",
    ],
  },
  returns: {
    title: "Returns & Exchanges",
    body: [
      "7-day easy returns on unworn items with tags attached.",
      "Exchanges available for size swaps within 14 days.",
      "Outfit sets can be returned as a complete bundle only.",
      "Refunds process within 5–7 business days after inspection.",
    ],
  },
  help: {
    title: "Help Desk",
    body: [
      "Email: support@dripkart.com",
      "WhatsApp: +91 98765 43210",
      "Hours: Mon–Sat, 10am – 7pm IST",
      "Average response time: under 2 hours.",
    ],
  },
};

export default function InfoModal({ type, onClose }) {
  const content = INFO[type];
  if (!content) return null;

  return (
    <>
      <button type="button" className="overlay" aria-label="Close" onClick={onClose} />
      <dialog className="info-modal open" open>
        <button type="button" className="icon-btn modal-close" onClick={onClose}>
          ✕
        </button>
        <h3>{content.title}</h3>
        <ul>
          {content.body.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <button type="button" className="btn-primary full" onClick={onClose}>
          Got it
        </button>
      </dialog>
    </>
  );
}
