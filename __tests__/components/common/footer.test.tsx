import { render, screen } from "@testing-library/react"
import Footer from "@/app/components/common/footer"

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

jest.mock("@/app/components/common/gateway-gamers-logo", () => ({
  __esModule: true,
  default: ({ className }: { className?: string }) => <svg data-testid='gg-logo' className={className} />,
}))

describe("Footer", () => {
  it("renders the copyright notice with the current year", () => {
    render(<Footer />)
    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
  })

  it("renders the BoardGameGeek link", () => {
    render(<Footer />)
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "https://boardgamegeek.com/")
    expect(link).toHaveAttribute("target", "_blank")
  })

  it("renders the BGG logo image", () => {
    render(<Footer />)
    const img = screen.getByAltText(/board game geek/i)
    expect(img).toBeInTheDocument()
  })

  it("renders the Gateway Gamers logo", () => {
    render(<Footer />)
    expect(screen.getByTestId("gg-logo")).toBeInTheDocument()
  })
})
