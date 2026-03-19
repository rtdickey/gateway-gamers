import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ShelfTab from "@/app/components/gamekeep/shelf-tab"

describe("ShelfTab", () => {
  const setFilterShelf = jest.fn()

  beforeEach(() => {
    setFilterShelf.mockClear()
  })

  it("renders the shelf name", () => {
    render(<ShelfTab shelf='Owned' isSelected={false} setFilterShelf={setFilterShelf} />)
    // The swap component renders the label in both swap-on and swap-off states
    expect(screen.getAllByText("Owned").length).toBeGreaterThan(0)
  })

  it("renders 'All' when shelf prop is null", () => {
    render(<ShelfTab shelf={null} isSelected={false} setFilterShelf={setFilterShelf} />)
    expect(screen.getAllByText("All").length).toBeGreaterThan(0)
  })

  it("checkbox is checked when isSelected is true", () => {
    render(<ShelfTab shelf='Want' isSelected={true} setFilterShelf={setFilterShelf} />)
    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toBeChecked()
  })

  it("checkbox is unchecked when isSelected is false", () => {
    render(<ShelfTab shelf='Want' isSelected={false} setFilterShelf={setFilterShelf} />)
    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).not.toBeChecked()
  })

  it("calls setFilterShelf with the shelf value when changed", async () => {
    const user = userEvent.setup()
    render(<ShelfTab shelf='Owned' isSelected={false} setFilterShelf={setFilterShelf} />)
    await user.click(screen.getByRole("checkbox"))
    expect(setFilterShelf).toHaveBeenCalledWith("Owned")
  })

  it("calls setFilterShelf with null when shelf is null", async () => {
    const user = userEvent.setup()
    render(<ShelfTab shelf={null} isSelected={false} setFilterShelf={setFilterShelf} />)
    await user.click(screen.getByRole("checkbox"))
    expect(setFilterShelf).toHaveBeenCalledWith(null)
  })
})
