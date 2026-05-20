export default function Logo({ onClick, size = "default" }) {
  const Tag = onClick ? "button" : "div";
  const props = onClick
    ? { type: "button", className: `logo-mark logo-${size}`, onClick }
    : { className: `logo-mark logo-${size}` };

  return (
    <Tag {...props} aria-label={onClick ? "DripKart home" : undefined}>
      <span className="logo-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="14" fill="url(#logoGrad)" />
          <path
            d="M14 32V16h8.2c4.4 0 7.2 2.4 7.2 6.2 0 2.4-1.2 4.2-3.2 5.2L30 32h-4.6l-3.4-4.8H18.2V32H14zm4.2-8.4h3.6c1.8 0 2.8-.9 2.8-2.4s-1-2.4-2.8-2.4h-3.6v4.8zM32 32V16h6v16h-6z"
            fill="#fffaf2"
          />
          <defs>
            <linearGradient id="logoGrad" x1="4" y1="4" x2="44" y2="44">
              <stop stopColor="#c9a06a" />
              <stop offset="1" stopColor="#7a5530" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      <span className="logo-text">
        <strong>DripKart</strong>
        <em>Streetwear</em>
      </span>
    </Tag>
  );
}
