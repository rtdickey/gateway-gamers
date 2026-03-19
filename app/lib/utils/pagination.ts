/**
 * Generates a smart page number list for pagination UI.
 * Always includes first/last page and pages adjacent to current.
 * Inserts "..." string for gaps.
 */
export function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)
  const near = new Set([0, total - 1, current - 1, current, current + 1].filter(p => p >= 0 && p < total))
  const sorted = Array.from(near).sort((a, b) => a - b)
  const result: (number | "...")[] = []
  let prev: number | null = null
  for (const p of sorted) {
    if (prev !== null && p - prev > 1) result.push("...")
    result.push(p)
    prev = p
  }
  return result
}
