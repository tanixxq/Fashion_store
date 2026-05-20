export function formatProduct(doc) {
  if (!doc) return null;
  const p = doc.toObject ? doc.toObject() : doc;
  return {
    id: p.legacyId,
    name: p.name,
    category: p.category,
    price: p.price,
    rating: p.rating,
    description: p.description,
    image: p.image,
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
