/** Normalize cart line for API responses (frontend uses `id`, DB uses `lineId`) */
export function toClientCartLine(item) {
  const plain = item?.toObject ? item.toObject() : { ...item };
  return {
    id: plain.lineId || plain.id,
    lineId: plain.lineId || plain.id,
    productId: plain.productId,
    name: plain.name,
    price: plain.price,
    image: plain.image,
    qty: plain.qty ?? 1,
    size: plain.size ?? null,
    isSet: plain.isSet ?? false,
  };
}

export function toDbCartLine(item) {
  const lineId = item.lineId || item.id;
  return {
    lineId: String(lineId),
    productId: item.productId ?? undefined,
    name: item.name,
    price: Number(item.price),
    image: item.image,
    qty: Math.max(1, Number(item.qty) || 1),
    size: item.size || undefined,
    isSet: Boolean(item.isSet),
  };
}

export function findLineIndex(cart, lineId) {
  return cart.findIndex((c) => String(c.lineId) === String(lineId));
}
