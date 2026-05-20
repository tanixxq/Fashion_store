import { products, outfitSets } from "../data/products";

export default function FavouritesPage({
  favouriteProducts,
  favouriteOutfits,
  onBack,
  onRemoveProduct,
  onRemoveOutfit,
  onAddToCart,
  onAddOutfitToCart,
}) {
  const savedProducts = products.filter((p) => favouriteProducts.includes(p.id));
  const savedOutfits = outfitSets.filter((o) => favouriteOutfits.includes(o.id));
  const total = savedProducts.length + savedOutfits.length;

  return (
    <div className="page-shell">
      <button type="button" className="back-link" onClick={onBack}>
        ← Back to home
      </button>
      <div className="page-head">
        <span className="eyebrow">Favourites</span>
        <h2>Your Saved Items</h2>
        <p>{total} {total === 1 ? "item" : "items"} in your favourites</p>
      </div>

      {total === 0 ? (
        <div className="page-card empty-page">
          <p>♡ No favourites yet. Tap the heart on products or outfit sets.</p>
          <button type="button" className="btn-primary" onClick={onBack}>
            Explore Store
          </button>
        </div>
      ) : (
        <>
          {savedProducts.length > 0 && (
            <section className="fav-section">
              <h3>Products</h3>
              <div className="fav-grid">
                {savedProducts.map((product) => (
                  <article key={product.id} className="fav-card">
                    <img src={product.image} alt={product.name} />
                    <div>
                      <span>{product.category}</span>
                      <h4>{product.name}</h4>
                      <strong>₹{product.price}</strong>
                      <div className="fav-actions">
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => onRemoveProduct(product.id)}
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => onAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {savedOutfits.length > 0 && (
            <section className="fav-section">
              <h3>Outfit Sets</h3>
              <div className="fav-grid">
                {savedOutfits.map((outfit) => (
                  <article key={outfit.id} className="fav-card">
                    <img src={outfit.image} alt={outfit.name} />
                    <div>
                      <span>{outfit.type}</span>
                      <h4>{outfit.name}</h4>
                      <strong>₹{outfit.price}</strong>
                      <div className="fav-actions">
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => onRemoveOutfit(outfit.id)}
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => onAddOutfitToCart(outfit)}
                        >
                          Add Set
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
