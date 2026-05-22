/** Convert a MongoDB product document → JSON for React */
export function formatProduct(doc) {
  if (!doc) return null;
  const p = doc.toObject ? doc.toObject() : doc;
  const images =
    Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : p.image
        ? [p.image]
        : [];

  return {
    id: p.legacyId ?? p._id?.toString(),
    name: p.name,
    price: p.price,
    image: p.image || images[0],
    images,
    category: p.category,
    description: p.description,
    brand: p.brand || p.category || "DripKart",
    rating: p.rating ?? 4.5,
    stock: p.stock ?? 50,
    inStock: p.inStock !== false && (p.stock == null || p.stock > 0),
    ...(p.badge ? { badge: p.badge } : {}),
  };
}

export function formatOutfit(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: o.setId,
    name: o.name,
    type: o.type,
    vibe: o.vibe,
    price: o.price,
    originalPrice: o.originalPrice,
    rating: o.rating,
    image: o.image,
    description: o.description,
    pieces: o.pieces,
    sizes: o.sizes,
    ...(o.badge ? { badge: o.badge } : {}),
  };
}
