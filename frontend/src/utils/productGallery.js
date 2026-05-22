/** Build gallery URLs from product (supports images[] or single image) */
export function getProductImages(product) {
  if (!product) return [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images.filter(Boolean);
  }
  if (product.image) return [product.image];
  return [];
}

export function getStockLabel(product) {
  if (product?.inStock === false) return { text: "Out of stock", available: false };
  const n = product?.stock;
  if (typeof n === "number" && n <= 5) {
    return { text: `Only ${n} left`, available: true };
  }
  return { text: "In stock", available: true };
}
