/**
 * Splits cards into the design's rows: up to 4 fit on one row; otherwise the
 * first row holds 3 and the rest go on the next (5 → 3+2, 6 → 3+3, 7 → 3+4).
 */
export function splitRows<T>(items: T[]): T[][] {
  if (items.length <= 4) return [items];
  return [items.slice(0, 3), items.slice(3)];
}
