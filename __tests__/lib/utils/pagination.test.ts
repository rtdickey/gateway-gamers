import { getPageNumbers } from "@/app/lib/utils/pagination"

describe("getPageNumbers", () => {
  it("returns all pages when total <= 7", () => {
    expect(getPageNumbers(0, 5)).toEqual([0, 1, 2, 3, 4])
    expect(getPageNumbers(3, 7)).toEqual([0, 1, 2, 3, 4, 5, 6])
  })

  it("includes first, last, and current page neighbours", () => {
    const result = getPageNumbers(5, 20)
    expect(result).toContain(0)
    expect(result).toContain(19)
    expect(result).toContain(4)
    expect(result).toContain(5)
    expect(result).toContain(6)
  })

  it("inserts ellipsis for gaps", () => {
    const result = getPageNumbers(5, 20)
    // Gap between 0 and 4 => "..."
    expect(result).toContain("...")
  })

  it("no ellipsis when pages are adjacent to first page", () => {
    const result = getPageNumbers(1, 20)
    // pages 0,1,2 are contiguous with no gap after 0
    const firstEllipsisIndex = result.indexOf("...")
    // There should only be one ellipsis on the right side
    expect(result[0]).toBe(0)
    expect(result[1]).toBe(1)
    expect(result[2]).toBe(2)
    // There is a gap before the last page
    expect(firstEllipsisIndex).toBeGreaterThan(2)
  })

  it("no ellipsis when pages are adjacent to last page", () => {
    const total = 20
    const result = getPageNumbers(18, total)
    expect(result[result.length - 1]).toBe(19)
    expect(result[result.length - 2]).toBe(18)
    expect(result[result.length - 3]).toBe(17)
    // First entry is always 0
    expect(result[0]).toBe(0)
  })

  it("returns single page for total of 1", () => {
    expect(getPageNumbers(0, 1)).toEqual([0])
  })
})
