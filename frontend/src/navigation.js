/** URL paths for React Router (Super Kicks) */
export const PATHS = {
  home: "/",
  shop: "/shop",
  product: (id) => `/product/${id}`,
  cart: "/cart",
  checkout: "/checkout",
  login: "/login",
  signup: "/signup",
  profile: "/profile",
  favourites: "/favourites",
  track: "/track",
  newArrivals: "/new-arrivals",
  about: "/about",
  contact: "/contact",
  sizeGuide: "/size-guide",
  delivery: "/delivery",
  faq: "/faq",
};

const PAGE_TO_PATH = {
  home: PATHS.home,
  shop: PATHS.shop,
  cart: PATHS.cart,
  checkout: PATHS.checkout,
  login: PATHS.login,
  signup: PATHS.signup,
  profile: PATHS.profile,
  favourites: PATHS.favourites,
  track: PATHS.track,
  "new-arrivals": PATHS.newArrivals,
  about: PATHS.about,
  contact: PATHS.contact,
  "size-guide": PATHS.sizeGuide,
  delivery: PATHS.delivery,
  faq: PATHS.faq,
};

export function pageToPath(page) {
  return PAGE_TO_PATH[page] || `/${page}`;
}

export function pathToPage(pathname) {
  if (pathname === "/" || pathname === "") return "home";
  if (pathname.startsWith("/product/")) return "product-detail";
  const slug = pathname.replace(/^\//, "");
  const map = {
    shop: "shop",
    cart: "cart",
    checkout: "checkout",
    login: "login",
    signup: "signup",
    profile: "profile",
    favourites: "favourites",
    track: "track",
    "new-arrivals": "new-arrivals",
    about: "about",
    contact: "contact",
    "size-guide": "size-guide",
    delivery: "delivery",
    faq: "faq",
  };
  return map[slug] || "home";
}

export function productIdFromPath(pathname) {
  const m = pathname.match(/^\/product\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

/** Routes that require authentication */
export const PROTECTED_PAGES = new Set(["cart", "checkout", "profile"]);
