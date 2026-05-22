/** Base URL: .env VITE_API_URL or Vite proxy /api → backend (see vite.config.js) */
import { API_BASE, IS_DEV } from "../config/env.js";

const DEBUG_API = IS_DEV;

function getToken() {
  try {
    return localStorage.getItem("dripkart_token");
  } catch {
    return null;
  }
}

export function setToken(token) {
  if (token) localStorage.setItem("dripkart_token", token);
  else localStorage.removeItem("dripkart_token");
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `${API_BASE}${path}`;
  const method = options.method || "GET";

  if (DEBUG_API) {
    console.log(`[API] ${method} ${url}`);
  }

  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkErr) {
    console.error("[API] Network error:", networkErr.message, { url, method });
    throw new Error(
      `Cannot reach API at ${API_BASE}. Is the backend running on the correct port?`
    );
  }

  const data = await res.json().catch(() => ({}));

  if (DEBUG_API) {
    console.log(`[API] ${method} ${url} → ${res.status}`, data.message || data);
  }

  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    console.error("[API] Error:", res.status, url, data);
    throw err;
  }
  return data;
}

export async function checkApiHealth() {
  try {
    await apiFetch("/health");
    return true;
  } catch {
    return false;
  }
}

export async function fetchContent() {
  return apiFetch("/content");
}

/** Step 1 — GET /api/products/:id */
export async function fetchProduct(id) {
  return apiFetch(`/products/${id}`);
}

export async function fetchProducts(params = {}) {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.search) qs.set("search", params.search);
  if (params.sort) qs.set("sort", params.sort);
  if (params.filter) qs.set("filter", params.filter);
  const query = qs.toString();
  return apiFetch(`/products${query ? `?${query}` : ""}`);
}

export async function fetchProductDetails(productId) {
  return apiFetch(`/products/${productId}/details`);
}

export async function fetchOutfits(type) {
  const qs = type && type !== "All Sets" ? `?type=${encodeURIComponent(type)}` : "";
  return apiFetch(`/outfits${qs}`);
}

export async function fetchMe() {
  return apiFetch("/auth/me");
}

export async function loginUser(email, password) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(name, email, password) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function createOrder(orderPayload) {
  return apiFetch("/orders", {
    method: "POST",
    body: JSON.stringify(orderPayload),
  });
}

export async function fetchMyOrders() {
  return apiFetch("/orders");
}

export async function trackOrder(orderId, email) {
  const qs = new URLSearchParams({ orderId });
  if (email) qs.set("email", email);
  return apiFetch(`/orders/lookup?${qs}`);
}

export async function subscribeNewsletter(email) {
  return apiFetch("/newsletter", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/** GET /api/cart */
export async function fetchCart() {
  return apiFetch("/cart");
}

/** POST /api/cart — add or bump qty */
export async function addCartItem(item, qty = 1) {
  return apiFetch("/cart", {
    method: "POST",
    body: JSON.stringify({ item, qty }),
  });
}

/** PUT /api/cart — replace full cart */
export async function replaceCart(cart) {
  const payload = cart.map((line) => ({
    lineId: line.id,
    id: line.id,
    productId: line.productId,
    name: line.name,
    price: line.price,
    image: line.image,
    qty: line.qty,
    size: line.size,
    isSet: line.isSet,
  }));
  return apiFetch("/cart", {
    method: "PUT",
    body: JSON.stringify({ cart: payload }),
  });
}

/** PATCH /api/cart/:lineId */
export async function updateCartLine(lineId, qty) {
  return apiFetch(`/cart/${encodeURIComponent(lineId)}`, {
    method: "PATCH",
    body: JSON.stringify({ qty }),
  });
}

/** DELETE /api/cart/:lineId */
export async function removeCartLine(lineId) {
  return apiFetch(`/cart/${encodeURIComponent(lineId)}`, { method: "DELETE" });
}

export async function fetchPaymentConfig() {
  return apiFetch("/payments/config");
}

export async function createRazorpayOrder(amount) {
  return apiFetch("/payments/razorpay/create-order", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

export async function verifyRazorpayPayment(payload) {
  return apiFetch("/payments/razorpay/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function syncUserData({ cart, wishlist, favouriteOutfits }) {
  const tasks = [];
  if (cart !== undefined) {
    tasks.push(replaceCart(cart));
  }
  if (wishlist !== undefined) {
    tasks.push(
      apiFetch("/users/wishlist/products", {
        method: "PUT",
        body: JSON.stringify({ wishlist }),
      })
    );
  }
  if (favouriteOutfits !== undefined) {
    tasks.push(
      apiFetch("/users/wishlist/outfits", {
        method: "PUT",
        body: JSON.stringify({ favouriteOutfits }),
      })
    );
  }
  await Promise.all(tasks);
}
