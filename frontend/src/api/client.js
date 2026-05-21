const API_BASE = import.meta.env.VITE_API_URL || "/api";

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

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
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

export async function syncUserData({ cart, wishlist, favouriteOutfits }) {
  const tasks = [];
  if (cart !== undefined) {
    tasks.push(
      apiFetch("/users/cart", { method: "PUT", body: JSON.stringify({ cart }) })
    );
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
