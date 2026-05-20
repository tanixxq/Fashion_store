export function generateOrderId() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `DK-${num}`;
}
