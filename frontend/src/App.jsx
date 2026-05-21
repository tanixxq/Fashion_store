import { useEffect, useMemo, useState } from "react";
import QuickActions from "./components/QuickActions";
import InfoModal from "./components/InfoModal";
import ProtectedRoute from "./components/ProtectedRoute";
import Logo from "./components/Logo";
import ProductModal from "./components/ProductModal";
import PromoBanner from "./components/PromoBanner";
import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SignupPage from "./pages/SignupPage";
import {
  checkApiHealth,
  createOrder,
  fetchContent,
  fetchMe,
  fetchMyOrders,
  fetchOutfits,
  setToken,
  subscribeNewsletter,
  syncUserData,
  trackOrder,
} from "./api/client";
import { useProducts } from "./hooks/useProducts";
import {
  categories,
  outfitSetTypes,
  outfitSets as staticOutfitSets,
  perks,
  products as staticProducts,
  stats as staticStats,
  styleInspiration,
  testimonials,
} from "./data/products";
import CheckoutPage from "./pages/CheckoutPage";
import FavouritesPage from "./pages/FavouritesPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import { loadJson, saveJson } from "./utils/storage";

const menuHighlights = [
  "New Arrivals",
  "Complete Outfits",
  "Best Sellers",
  "Limited Drops",
];
const supportLinks = ["Track Order", "Size Guide", "Returns", "Help Desk"];

function App() {
  const [page, setPage] = useState("home");
  const [highlightOrderId, setHighlightOrderId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const {
    cart,
    setCart,
    cartCount,
    cartTotal,
    addToCart,
    addOutfitToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    toast,
    showToast,
  } = useCart();
  const { user, setUser, logout, syncUserData } = useAuth();

  const [wishlist, setWishlist] = useState(() =>
    loadJson("dripkart_favourites_products", [])
  );
  const [favouriteOutfits, setFavouriteOutfits] = useState(() =>
    loadJson("dripkart_favourites_outfits", [])
  );
  const [orders, setOrders] = useState(() => loadJson("dripkart_orders", []));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [detailProductId, setDetailProductId] = useState(null);
  const [outfitFilter, setOutfitFilter] = useState("All Sets");
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [outfitSizes, setOutfitSizes] = useState({});
  const [catalogFilter, setCatalogFilter] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [infoModal, setInfoModal] = useState(null);
  const [promoDismissed, setPromoDismissed] = useState(() =>
    loadJson("dripkart_promo_dismissed", false)
  );
  const {
    products: catalogProducts,
    setProducts: setCatalogProducts,
    loading: productsLoading,
    error: productsError,
    fromApi: useApi,
  } = useProducts(staticProducts);
  const [catalogOutfits, setCatalogOutfits] = useState(staticOutfitSets);
  const [storeContent, setStoreContent] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const online = await checkApiHealth();
      if (!online || cancelled) return;

      try {
        const [outfitRes, contentRes] = await Promise.all([
          fetchOutfits(),
          fetchContent(),
        ]);
        if (cancelled) return;
        setCatalogOutfits(outfitRes.outfits);
        setStoreContent(contentRes);

        const token = localStorage.getItem("dripkart_token");
        if (token) {
          const { user: sessionUser } = await fetchMe();
          if (!cancelled && sessionUser) {
            setUser({ name: sessionUser.name, email: sessionUser.email, role: sessionUser.role });
            if (sessionUser.cart?.length) setCart(sessionUser.cart);
            if (sessionUser.wishlist?.length) setWishlist(sessionUser.wishlist);
            if (sessionUser.favouriteOutfits?.length) {
              setFavouriteOutfits(sessionUser.favouriteOutfits);
            }
          }
          const { orders: serverOrders } = await fetchMyOrders();
          if (!cancelled && serverOrders?.length) setOrders(serverOrders);
        }
      } catch {
        /* outfits/content stay on static fallback */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => saveJson("dripkart_favourites_products", wishlist), [wishlist]);
  useEffect(
    () => saveJson("dripkart_favourites_outfits", favouriteOutfits),
    [favouriteOutfits]
  );
  useEffect(() => saveJson("dripkart_orders", orders), [orders]);
  useEffect(() => saveJson("dripkart_promo_dismissed", promoDismissed), [promoDismissed]);

  const scrollToSection = (sectionId, delay = 60) => {
    const run = () =>
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    if (page !== "home") {
      setPage("home");
      setTimeout(run, delay);
    } else {
      run();
    }
  };

  const goHome = () => {
    setPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goCheckout = () => {
    if (!user) {
      setPage("login");
      showToast("Please sign in to checkout");
      return;
    }
    setPage("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openProductDetail = (productId) => {
    setDetailProductId(productId);
    setPage("product-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOutfitAddToCart = (outfit) => {
    const size = outfitSizes[outfit.id] || outfit.sizes[1] || outfit.sizes[0];
    addOutfitToCart(outfit, size);
    setSelectedOutfit(null);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Removed from favourites");
        return prev.filter((id) => id !== productId);
      }
      showToast("Added to favourites");
      return [...prev, productId];
    });
  };

  const toggleFavouriteOutfit = (outfitId) => {
    setFavouriteOutfits((prev) => {
      const exists = prev.includes(outfitId);
      if (exists) {
        showToast("Outfit removed from favourites");
        return prev.filter((id) => id !== outfitId);
      }
      showToast("Outfit saved to favourites");
      return [...prev, outfitId];
    });
  };

  const placeOrder = async (order) => {
    try {
      let saved = order;
      if (useApi) {
        const res = await createOrder({
          items: order.items,
          total: order.total,
          payment: order.payment,
          shipping: order.shipping,
        });
        saved = res.order;
      }
      setOrders((prev) => [saved, ...prev]);
      clearCart();
      setHighlightOrderId(saved.id);
      setPage("track");
      showToast(`Order ${saved.id} placed successfully!`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      showToast(err.message || "Could not place order. Try again.");
    }
  };

  const favCount = wishlist.length + favouriteOutfits.length;

  const handleLogout = () => {
    logout();
    showToast("You have been logged out.");
  };

  useEffect(() => {
    if (!useApi || !user) return undefined;
    const timer = setTimeout(() => {
      syncUserData({ cart, wishlist, favouriteOutfits }).catch(() => {});
    }, 900);
    return () => clearTimeout(timer);
  }, [cart, wishlist, favouriteOutfits, user, useApi]);

  const displayStats = useMemo(() => {
    if (storeContent?.stats) return storeContent.stats;
    return staticStats.map((s) =>
      s.label === "Curated Styles"
        ? { ...s, value: `${catalogProducts.length}+` }
        : s
    );
  }, [storeContent, catalogProducts.length]);

  const displayInspiration = storeContent?.styleInspiration ?? styleInspiration;
  const displayPerks = storeContent?.perks ?? perks;
  const displayTestimonials = storeContent?.testimonials ?? testimonials;

  const categoryCounts = useMemo(
    () =>
      categories.reduce((acc, category) => {
        acc[category] = catalogProducts.filter((p) => p.category === category).length;
        return acc;
      }, {}),
    [catalogProducts]
  );

  const filteredOutfits = useMemo(() => {
    if (outfitFilter === "All Sets") return catalogOutfits;
    return catalogOutfits.filter((o) => o.type === outfitFilter);
  }, [outfitFilter, catalogOutfits]);

  const trendingProducts = useMemo(
    () =>
      [...catalogProducts]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3),
    [catalogProducts]
  );

  const filteredProducts = useMemo(() => {
    let list = [...catalogProducts];

    if (selectedCategory !== "All Categories") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (catalogFilter === "new") list = list.filter((p) => p.badge === "NEW");
    if (catalogFilter === "hot") list = list.filter((p) => p.badge === "HOT");

    if (sortBy === "price-low") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => (b.badge === "HOT" ? 1 : 0) - (a.badge === "HOT" ? 1 : 0));

    return list;
  }, [catalogProducts, selectedCategory, searchQuery, sortBy, catalogFilter]);

  const selectCategory = (cat) => {
    setSelectedCategory(cat);
    setCatalogFilter(null);
    setIsMenuOpen(false);
    scrollToSection("shop");
  };

  const handleMenuHighlight = (item) => {
    setIsMenuOpen(false);
    setPage("home");
    setTimeout(() => {
      if (item === "Complete Outfits") {
        scrollToSection("outfits", 0);
      } else if (item === "New Arrivals") {
        setCatalogFilter("new");
        setSelectedCategory("All Categories");
        scrollToSection("shop", 0);
        showToast("Showing new arrivals");
      } else if (item === "Best Sellers") {
        setCatalogFilter(null);
        setSortBy("rating");
        scrollToSection("shop", 0);
        showToast("Sorted by best sellers");
      } else if (item === "Limited Drops") {
        setCatalogFilter("hot");
        setOutfitFilter("All Sets");
        scrollToSection("trending", 0);
        showToast("Limited drops — hot picks");
      }
    }, 80);
  };

  const handleSupport = (item) => {
    setIsMenuOpen(false);
    if (item === "Track Order") {
      setPage("track");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (item === "Size Guide") {
      setInfoModal("size");
    } else if (item === "Returns") {
      setInfoModal("returns");
    } else if (item === "Help Desk") {
      setInfoModal("help");
    }
  };

  const handleShopSale = () => {
    setCatalogFilter("hot");
    setPage("home");
    setTimeout(() => scrollToSection("trending", 0), 80);
    showToast("FLASH20 applied to hot picks");
  };

  return (
    <div className="app">
      {toast && <div className="toast">{toast}</div>}

      {infoModal && <InfoModal type={infoModal} onClose={() => setInfoModal(null)} />}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          useApi={useApi}
          isFavourite={wishlist.includes(selectedProduct.id)}
          onClose={() => setSelectedProduct(null)}
          onToggleFavourite={() => toggleWishlist(selectedProduct.id)}
          onAddToCart={addToCart}
        />
      )}

      {isMenuOpen && (
        <>
          <button
            type="button"
            className="overlay"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
          />
          <aside className={`side-panel menu-panel ${isMenuOpen ? "open" : ""}`}>
            <div className="panel-head">
              <div>
                <span className="eyebrow">Navigation</span>
                <h3>Explore DripKart</h3>
              </div>
              <button type="button" className="icon-btn" onClick={() => setIsMenuOpen(false)}>
                ✕
              </button>
            </div>
            <p className="panel-note">Curated streetwear across every category.</p>
            <div className="menu-list">
              <button
                type="button"
                className={selectedCategory === "All Categories" ? "active" : ""}
                onClick={() => selectCategory("All Categories")}
              >
                <span>All Categories</span>
                <em>{catalogProducts.length}</em>
              </button>
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={selectedCategory === item ? "active" : ""}
                  onClick={() => selectCategory(item)}
                >
                  <span>{item}</span>
                  <em>{categoryCounts[item]}</em>
                </button>
              ))}
            </div>
            <div className="menu-block">
              <h4>Highlights</h4>
              <div className="chip-row">
                {menuHighlights.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="chip"
                    onClick={() => handleMenuHighlight(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="menu-block">
              <h4>Support</h4>
              <div className="link-stack">
                {supportLinks.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="drawer-link-btn"
                    onClick={() => handleSupport(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </>
      )}

      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <button
              type="button"
              className={`hamburger ${isMenuOpen ? "active" : ""}`}
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <span />
              <span />
              <span />
            </button>
            <Logo onClick={goHome} />
          </div>

          {page === "home" && (
            <div className="search-wrap">
              <input
                type="search"
                placeholder="Search tees, sneakers, jackets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          <nav className="header-actions">
            <button
              type="button"
              className={`nav-btn ${page === "favourites" ? "active" : ""}`}
              onClick={() => {
                setPage("favourites");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Favourites {favCount > 0 && <em>{favCount}</em>}
            </button>
            <button
              type="button"
              className={`nav-btn ${page === "track" ? "active" : ""}`}
              onClick={() => {
                setPage("track");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Track Order
            </button>
            {page === "home" && (
              <>
                <button type="button" className="nav-link" onClick={() => scrollToSection("outfits")}>
                  Outfit Sets
                </button>
                <button type="button" className="nav-link" onClick={() => scrollToSection("shop")}>
                  Shop
                </button>
                <button type="button" className="nav-link" onClick={() => scrollToSection("trending")}>
                  Trending
                </button>
              </>
            )}
            {user ? (
              <div className="user-menu">
                <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                <span className="user-name">Hi, {user.name.split(" ")[0]}</span>
                <button type="button" className="nav-btn logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={`login-btn ${page === "login" ? "active" : ""}`}
                onClick={() => {
                  setPage("login");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Login
              </button>
            )}
            <button
              type="button"
              className={`cart-trigger ${page === "cart" ? "active" : ""}`}
              onClick={() => {
                setPage("cart");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Bag <span>{cartCount}</span>
            </button>
          </nav>
        </div>
      </header>

      {page === "login" && (
        <LoginPage
          onBack={goHome}
          onGoSignup={() => setPage("signup")}
          onSuccess={() => {
            showToast("Welcome back!");
            setPage("home");
          }}
        />
      )}

      {page === "signup" && (
        <SignupPage
          onBack={goHome}
          onGoLogin={() => setPage("login")}
          onSuccess={() => {
            showToast("Account created!");
            setPage("home");
          }}
        />
      )}

      {page === "product-detail" && detailProductId && (
        <ProductDetailPage
          productId={detailProductId}
          fallbackProducts={catalogProducts}
          onBack={goHome}
          isFavourite={wishlist.includes(detailProductId)}
          onToggleWishlist={toggleWishlist}
        />
      )}

      {page === "cart" && (
        <CartPage onBack={goHome} onCheckout={goCheckout} />
      )}

      {page === "checkout" && (
        <ProtectedRoute user={user} onLogin={() => setPage("login")}>
          <CheckoutPage
            cart={cart}
            cartTotal={cartTotal}
            onBack={() => setPage("cart")}
            onPlaceOrder={placeOrder}
          />
        </ProtectedRoute>
      )}

      {page === "favourites" && (
        <FavouritesPage
          favouriteProducts={wishlist}
          favouriteOutfits={favouriteOutfits}
          onBack={goHome}
          onRemoveProduct={(id) => toggleWishlist(id)}
          onRemoveOutfit={(id) => toggleFavouriteOutfit(id)}
          onAddToCart={addToCart}
          onAddOutfitToCart={handleOutfitAddToCart}
        />
      )}

      {page === "track" && (
        <TrackOrderPage
          orders={orders}
          useApi={useApi}
          highlightOrderId={highlightOrderId}
          onBack={goHome}
          onTrackOrder={async (orderId) => {
            const res = await trackOrder(orderId);
            return res.order;
          }}
        />
      )}

      {page === "home" && (
      <main>
        {!promoDismissed && (
          <PromoBanner
            onShopSale={handleShopSale}
            onDismiss={() => setPromoDismissed(true)}
          />
        )}

        <section className="hero section">
          <div className="hero-copy">
            <span className="pill">Spring / Summer 2026</span>
            <h2>
              Elevated streetwear for people who dress with intention.
            </h2>
            <p>
              Discover premium fits, trending drops, and everyday essentials —
              built for comfort, confidence, and clean aesthetics.
            </p>
            <div className="hero-cta">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setCatalogFilter(null);
                  scrollToSection("shop");
                }}
              >
                Shop Collection
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => scrollToSection("outfits")}
              >
                Shop Full Outfits
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => scrollToSection("trending")}
              >
                See Trending
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
              alt="Fashion editorial"
            />
            <div className="hero-quote">
              <p>"Dress well. Feel powerful."</p>
            </div>
          </div>
        </section>

        <section className="stats section">
          {displayStats.map((item) => (
            <button
              type="button"
              key={item.label}
              className="stat-card"
              onClick={() => {
                if (item.label.includes("Delivery")) setPage("track");
                else if (item.label.includes("Rating")) {
                  setSortBy("rating");
                  scrollToSection("shop");
                } else scrollToSection("shop");
                showToast(`Exploring ${item.label.toLowerCase()}`);
              }}
            >
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </button>
          ))}
        </section>

        <QuickActions
          favCount={favCount}
          orderCount={orders.length}
          onFavourites={() => setPage("favourites")}
          onTrack={() => setPage("track")}
        />

        <section id="inspiration" className="inspiration section">
          <div className="section-head">
            <span className="eyebrow">Editorial</span>
            <h2>Style Inspiration</h2>
            <p>Mood-led looks before you browse the catalog.</p>
          </div>
          <div className="inspiration-grid">
            {displayInspiration.map((item, i) => (
              <article
                key={item.quote}
                className="inspire-card"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <img src={item.image} alt="" />
                <div className="inspire-overlay">
                  <p>{item.quote}</p>
                  <button
                    type="button"
                    className="inspire-btn"
                    onClick={() => {
                      scrollToSection("outfits");
                      showToast("Curating outfit sets for you");
                    }}
                  >
                    Shop This Vibe
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="outfits" className="outfit-inspiration section">
          <div className="section-head">
            <span className="eyebrow">Streetwear Inspiration</span>
            <h2>Complete Outfit Sets</h2>
            <p>
              Buy full costumes in one tap — tracksuits, co-ords, layered looks,
              and athleisure kits curated as ready-to-wear sets.
            </p>
          </div>

          <div className="perks-row">
            {displayPerks.map((perk) => (
              <button
                type="button"
                key={perk.title}
                className="perk-card"
                onClick={() => showToast(perk.detail)}
              >
                <span>{perk.icon}</span>
                <div>
                  <strong>{perk.title}</strong>
                  <p>{perk.detail}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="outfit-toolbar">
            {outfitSetTypes.map((type) => (
              <button
                key={type}
                type="button"
                className={outfitFilter === type ? "active" : ""}
                onClick={() => setOutfitFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="outfit-grid">
            {filteredOutfits.map((outfit) => {
              const savings = outfit.originalPrice - outfit.price;
              const size = outfitSizes[outfit.id] || outfit.sizes[1] || outfit.sizes[0];

              return (
                <article key={outfit.id} className="outfit-card">
                  <div className="outfit-media">
                    <img src={outfit.image} alt={outfit.name} />
                    {outfit.badge && (
                      <span className="outfit-badge">{outfit.badge}</span>
                    )}
                    <button
                      type="button"
                      className={`wish-btn outfit-fav ${favouriteOutfits.includes(outfit.id) ? "active" : ""}`}
                      onClick={() => toggleFavouriteOutfit(outfit.id)}
                      aria-label="Add outfit to favourites"
                    >
                      ♥
                    </button>
                    <span className="outfit-type">{outfit.type}</span>
                  </div>
                  <div className="outfit-body">
                    <p className="outfit-vibe">{outfit.vibe}</p>
                    <h3>{outfit.name}</h3>
                    <p className="outfit-desc">{outfit.description}</p>
                    <ul className="outfit-pieces">
                      {outfit.pieces.map((piece) => (
                        <li key={piece}>{piece}</li>
                      ))}
                    </ul>
                    <div className="outfit-size">
                      <label htmlFor={`size-${outfit.id}`}>Size</label>
                      <select
                        id={`size-${outfit.id}`}
                        value={size}
                        onChange={(e) =>
                          setOutfitSizes((prev) => ({
                            ...prev,
                            [outfit.id]: e.target.value,
                          }))
                        }
                      >
                        {outfit.sizes.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="outfit-pricing">
                      <div>
                        <strong>₹{outfit.price}</strong>
                        <del>₹{outfit.originalPrice}</del>
                      </div>
                      <span className="save-tag">Save ₹{savings}</span>
                    </div>
                    <div className="outfit-actions">
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => setSelectedOutfit(outfit)}
                      >
                        View Set
                      </button>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => handleOutfitAddToCart(outfit)}
                      >
                        Add Full Set
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {selectedOutfit && (
          <>
            <button
              type="button"
              className="overlay"
              aria-label="Close outfit details"
              onClick={() => setSelectedOutfit(null)}
            />
            <dialog className="outfit-modal open" open>
              <div className="modal-head">
                <h3>{selectedOutfit.name}</h3>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setSelectedOutfit(null)}
                >
                  ✕
                </button>
              </div>
              <img src={selectedOutfit.image} alt={selectedOutfit.name} />
              <p className="outfit-vibe">{selectedOutfit.vibe}</p>
              <p>{selectedOutfit.description}</p>
              <h4>What&apos;s in the set</h4>
              <ul className="modal-pieces">
                {selectedOutfit.pieces.map((piece) => (
                  <li key={piece}>{piece}</li>
                ))}
              </ul>
              <p className="modal-price">
                Bundle price <strong>₹{selectedOutfit.price}</strong>
                <del>₹{selectedOutfit.originalPrice}</del>
              </p>
              <button
                type="button"
                className="btn-primary full"
                onClick={() => handleOutfitAddToCart(selectedOutfit)}
              >
                Add Complete Outfit to Cart
              </button>
            </dialog>
          </>
        )}

        <section id="trending" className="trending section">
          <div className="section-head">
            <span className="eyebrow hot">Trending</span>
            <h2>Hot Right Now</h2>
            <p>Top-rated pieces shoppers are loving this week.</p>
          </div>
          <div className="trending-grid">
            {trendingProducts.map((product) => (
              <article key={product.id} className="trend-card">
                <img
                  src={product.image}
                  alt={product.name}
                  role="button"
                  tabIndex={0}
                  onClick={() => openProductDetail(product.id)}
                  onKeyDown={(e) => e.key === "Enter" && openProductDetail(product.id)}
                />
                <div>
                  <span>{product.category}</span>
                  <h4>{product.name}</h4>
                  <p>⭐ {product.rating}</p>
                  <div className="trend-actions">
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => openProductDetail(product.id)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className={`wish-btn-sm ${wishlist.includes(product.id) ? "active" : ""}`}
                      onClick={() => toggleWishlist(product.id)}
                    >
                      ♥
                    </button>
                    <button type="button" className="btn-primary" onClick={() => addToCart(product)}>
                      Quick Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="shop" className="shop section">
          <div className="section-head">
            <span className="eyebrow">Catalog</span>
            <h2>
              {selectedCategory === "All Categories"
                ? "All Products"
                : selectedCategory}
            </h2>
            <p>
              {filteredProducts.length} items available
              {catalogFilter && (
                <button
                  type="button"
                  className="clear-filter"
                  onClick={() => setCatalogFilter(null)}
                >
                  Clear filter
                </button>
              )}
            </p>
          </div>

          <div className="shop-toolbar">
            <div className="category-pills">
              <button
                type="button"
                className={selectedCategory === "All Categories" ? "active" : ""}
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setCatalogFilter(null);
                }}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={selectedCategory === cat ? "active" : ""}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCatalogFilter(null);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {productsLoading && (
            <p className="empty-state">Loading products from API…</p>
          )}
          {productsError && !productsLoading && (
            <p className="empty-state">API offline — showing saved catalog. ({productsError})</p>
          )}
          {!productsLoading && filteredProducts.length === 0 ? (
            <p className="empty-state">No products match your search. Try another keyword.</p>
          ) : !productsLoading ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article key={product.id} className="product-card">
                  <div
                    className="product-media"
                    role="button"
                    tabIndex={0}
                    onClick={() => openProductDetail(product.id)}
                    onKeyDown={(e) => e.key === "Enter" && openProductDetail(product.id)}
                  >
                    <img src={product.image} alt={product.name} />
                    {product.badge && (
                      <span className={`badge badge-${product.badge.toLowerCase()}`}>
                        {product.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      className={`wish-btn ${wishlist.includes(product.id) ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      aria-label="Add to favourites"
                    >
                      ♥
                    </button>
                  </div>
                  <div className="product-body">
                    <span className="product-cat">{product.category}</span>
                    <h4>
                      <button
                        type="button"
                        className="product-title-btn"
                        onClick={() => openProductDetail(product.id)}
                      >
                        {product.name}
                      </button>
                    </h4>
                    <p className="product-desc">{product.description}</p>
                    <div className="product-meta">
                      <strong>₹{product.price}</strong>
                      <span>⭐ {product.rating}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-primary full"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>

        <section className="testimonials section">
          <div className="section-head">
            <span className="eyebrow">Reviews</span>
            <h2>Loved by the Community</h2>
          </div>
          <div className="testimonial-grid">
            {displayTestimonials.map((t) => (
              <blockquote key={t.name}>
                <p>{t.text}</p>
                <footer>
                  — {t.name} · {"★".repeat(t.rating)}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="newsletter section">
          <div className="newsletter-inner">
            <h2>Join the Drip List</h2>
            <p>Get early access to drops, exclusive offers, and style edits.</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  if (useApi) {
                    const res = await subscribeNewsletter(newsletterEmail);
                    showToast(res.message || "You're on the list!");
                  } else {
                    showToast("You're on the list! Welcome to DripKart.");
                  }
                  setNewsletterEmail("");
                } catch (err) {
                  showToast(err.message || "Could not subscribe");
                }
              }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      )}

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <Logo />
            <p>Premium streetwear for the modern wardrobe.</p>
          </div>
          <div>
            <h4>Shop</h4>
            <button type="button" className="footer-link" onClick={() => { goHome(); scrollToSection("shop"); }}>
              All Products
            </button>
            <button type="button" className="footer-link" onClick={() => { goHome(); scrollToSection("outfits"); }}>
              Outfit Sets
            </button>
            <button type="button" className="footer-link" onClick={() => { goHome(); scrollToSection("trending"); }}>
              Trending
            </button>
          </div>
          <div>
            <h4>Account</h4>
            <button type="button" className="footer-link" onClick={() => setPage("login")}>
              {user ? "Account" : "Login"}
            </button>
            <button type="button" className="footer-link" onClick={() => setPage("favourites")}>
              Favourites
            </button>
            <button type="button" className="footer-link" onClick={() => setPage("track")}>
              Track Order
            </button>
            <button type="button" className="footer-link" onClick={goCheckout}>
              Checkout
            </button>
          </div>
        </div>
        <p className="footer-copy">© 2026 DripKart. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
