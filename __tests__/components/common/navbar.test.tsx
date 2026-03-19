import { render, screen } from "@testing-library/react"
import Navbar from "@/app/components/common/navbar"

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

jest.mock("@/app/components/common/gateway-gamers-logo", () => ({
  __esModule: true,
  default: ({ className }: { className?: string }) => <svg data-testid='gg-logo' className={className} />,
}))

jest.mock("@/app/components/common/sign-out-button", () => ({
  __esModule: true,
  default: () => <button>Sign Out</button>,
}))

jest.mock("@/app/components/common/theme-toggle", () => ({
  __esModule: true,
  default: () => <button aria-label='Toggle theme'>Theme</button>,
}))

describe("Navbar", () => {
  it("renders main navigation links", () => {
    render(
      <Navbar isAdmin={false} isLoggedIn={false}>
        <div />
      </Navbar>,
    )
    // Links appear in both desktop nav and mobile drawer
    expect(screen.getAllByRole("link", { name: /game keep/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole("link", { name: /tracker/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole("link", { name: /friends/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole("link", { name: /about/i }).length).toBeGreaterThan(0)
  })

  it("shows Admin link when isAdmin is true", () => {
    render(
      <Navbar isAdmin={true} isLoggedIn={true}>
        <div />
      </Navbar>,
    )
    expect(screen.getAllByRole("link", { name: /admin/i }).length).toBeGreaterThan(0)
  })

  it("hides Admin link when isAdmin is false", () => {
    render(
      <Navbar isAdmin={false} isLoggedIn={false}>
        <div />
      </Navbar>,
    )
    expect(screen.queryAllByRole("link", { name: /admin/i })).toHaveLength(0)
  })

  it("shows Sign Out button when isLoggedIn is true", () => {
    render(
      <Navbar isAdmin={false} isLoggedIn={true}>
        <div />
      </Navbar>,
    )
    // Appears in both the dropdown and the mobile drawer
    expect(screen.getAllByRole("button", { name: /sign out/i }).length).toBeGreaterThan(0)
  })

  it("hides Sign Out button when isLoggedIn is false", () => {
    render(
      <Navbar isAdmin={false} isLoggedIn={false}>
        <div />
      </Navbar>,
    )
    expect(screen.queryAllByRole("button", { name: /sign out/i })).toHaveLength(0)
  })

  it("renders children", () => {
    render(
      <Navbar isAdmin={false} isLoggedIn={false}>
        <main data-testid='page-content'>Page Content</main>
      </Navbar>,
    )
    expect(screen.getByTestId("page-content")).toBeInTheDocument()
  })
})
