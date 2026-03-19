import { render, screen } from "@testing-library/react"
import ShelfSkeleton from "@/app/components/gamekeep/shelf-skeleton"
import TrackerTableSkeleton from "@/app/components/gamekeep/tracker-table-skeleton"

describe("ShelfSkeleton", () => {
  it("renders 5 skeleton card placeholders", () => {
    const { container } = render(<ShelfSkeleton />)
    // Each skeleton has a top-level flex div; we look for the skeleton divs
    const skeletonItems = container.querySelectorAll(".skeleton")
    // Each card has 4 skeleton elements (image + 3 text rows + action)
    // 5 cards × 4 = 20 total, plus the action div
    expect(skeletonItems.length).toBe(25)
  })
})

describe("TrackerTableSkeleton", () => {
  it("renders 7 skeleton table rows", () => {
    const { container } = render(
      <table>
        <tbody>
          <TrackerTableSkeleton />
        </tbody>
      </table>,
    )
    const rows = container.querySelectorAll("tr")
    expect(rows.length).toBe(7)
  })
})
