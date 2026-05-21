export default function AboutPage({ onBack }) {
  return (
    <div className="page-shell static-page">
      <button type="button" className="back-link" onClick={onBack}>
        ← Home
      </button>
      <div className="page-card static-content">
        <span className="eyebrow">Our story</span>
        <h1>About Super Kicks</h1>
        <p>
          Super Kicks is a streetwear destination built for creators, skaters, and
          everyday style rebels. We curate premium tees, hoodies, sneakers, and
          accessories with clean fits and honest quality.
        </p>
        <p>
          Founded in 2024, we ship across India with fast delivery, easy returns,
          and a community-first approach to fashion.
        </p>
        <ul>
          <li>110+ curated products</li>
          <li>Sustainable packaging</li>
          <li>24/7 customer support</li>
        </ul>
      </div>
    </div>
  );
}
