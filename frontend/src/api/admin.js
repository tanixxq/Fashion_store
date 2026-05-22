import { apiFetch } from "./client.js";

export function fetchAdminStats() {
  return apiFetch("/admin/stats");
}

export function fetchAdminOrders(status) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch(`/admin/orders${qs}`);
}

export function updateOrderStatus(orderId, status) {
  return apiFetch(`/admin/orders/${encodeURIComponent(orderId)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function fetchAdminProducts() {
  return apiFetch("/admin/products");
}

export function createAdminProduct(product) {
  return apiFetch("/admin/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function updateAdminProduct(legacyId, updates) {
  return apiFetch(`/admin/products/${legacyId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export function deleteAdminProduct(legacyId) {
  return apiFetch(`/admin/products/${legacyId}`, { method: "DELETE" });
}

export function fetchAdminUsers() {
  return apiFetch("/admin/users");
}
