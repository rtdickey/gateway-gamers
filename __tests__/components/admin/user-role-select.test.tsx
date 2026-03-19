import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import UserRoleSelect from "@/app/admin/users/user-role-select"

const mockUpdateUserRole = jest.fn()

jest.mock("@/app/admin/actions", () => ({
  updateUserRole: (...args: unknown[]) => mockUpdateUserRole(...args),
}))

describe("UserRoleSelect", () => {
  beforeEach(() => {
    mockUpdateUserRole.mockResolvedValue(undefined)
  })

  afterEach(() => {
    mockUpdateUserRole.mockReset()
  })

  it("renders a select with the current role selected", () => {
    render(<UserRoleSelect userId='user-1' currentRole='user' />)
    const select = screen.getByRole("combobox")
    expect(select).toHaveValue("user")
  })

  it("renders all role options", () => {
    render(<UserRoleSelect userId='user-1' currentRole='user' />)
    expect(screen.getByRole("option", { name: /user/i })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: /contributor/i })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: /admin/i })).toBeInTheDocument()
  })

  it("calls updateUserRole with the selected role on change", async () => {
    const user = userEvent.setup()
    render(<UserRoleSelect userId='user-42' currentRole='user' />)
    await user.selectOptions(screen.getByRole("combobox"), "admin")
    await waitFor(() => {
      expect(mockUpdateUserRole).toHaveBeenCalledWith("user-42", "admin")
    })
  })

  it("disables select while loading", async () => {
    // Make the action wait indefinitely so we can observe the loading state
    mockUpdateUserRole.mockReturnValue(new Promise(() => {}))
    const user = userEvent.setup()
    render(<UserRoleSelect userId='user-1' currentRole='user' />)
    const select = screen.getByRole("combobox")
    await user.selectOptions(select, "admin")
    expect(select).toBeDisabled()
  })
})
