export function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function generateOrderId() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `DK-${num}`;
}

export const ORDER_STEPS = [
  { key: "placed", label: "Order Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export function getOrderStepIndex(status) {
  return ORDER_STEPS.findIndex((s) => s.key === status);
}
