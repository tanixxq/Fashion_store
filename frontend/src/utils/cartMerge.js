/** Merge guest cart lines with server cart (by line id) */
export function mergeCartLines(localCart = [], serverCart = []) {
  const map = new Map();

  for (const line of serverCart) {
    const id = line.id || line.lineId;
    if (!id) continue;
    map.set(String(id), normalizeLine(line));
  }

  for (const line of localCart) {
    const id = String(line.id);
    const existing = map.get(id);
    if (existing) {
      map.set(id, { ...existing, qty: existing.qty + (line.qty || 1) });
    } else {
      map.set(id, normalizeLine(line));
    }
  }

  return Array.from(map.values());
}

function normalizeLine(line) {
  return {
    ...line,
    id: line.id || line.lineId,
    qty: line.qty ?? 1,
  };
}
