import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import FindUsers from "@/app/friends/components/find-users"
import { FriendProfile } from "@/app/friends/actions"

const mockSearchUsers = jest.fn()
const mockSendFriendRequest = jest.fn()

jest.mock("@/app/friends/actions", () => ({
  searchUsers: (...args: unknown[]) => mockSearchUsers(...args),
  sendFriendRequest: (...args: unknown[]) => mockSendFriendRequest(...args),
}))

jest.mock("use-debounce", () => ({
  useDebounce: (value: unknown) => [value],
}))

const makeUser = (id: string, email: string, displayName: string | null = null): FriendProfile => ({
  id,
  email,
  display_name: displayName,
})

describe("FindUsers", () => {
  beforeEach(() => {
    mockSearchUsers.mockResolvedValue([])
    mockSendFriendRequest.mockResolvedValue(undefined)
  })

  afterEach(() => {
    mockSearchUsers.mockReset()
    mockSendFriendRequest.mockReset()
  })

  it("renders the search input", () => {
    render(<FindUsers />)
    expect(screen.getByPlaceholderText(/search by email or display name/i)).toBeInTheDocument()
  })

  it("does not search when query is shorter than 2 characters", async () => {
    const user = userEvent.setup()
    render(<FindUsers />)
    await user.type(screen.getByPlaceholderText(/search by email or display name/i), "a")
    expect(mockSearchUsers).not.toHaveBeenCalled()
  })

  it("calls searchUsers when query is at least 2 characters", async () => {
    const user = userEvent.setup()
    render(<FindUsers />)
    await user.type(screen.getByPlaceholderText(/search by email or display name/i), "al")
    await waitFor(() => {
      expect(mockSearchUsers).toHaveBeenCalledWith("al")
    })
  })

  it("renders each search result", async () => {
    mockSearchUsers.mockResolvedValue([
      makeUser("u1", "alice@example.com", "Alice"),
      makeUser("u2", "bob@example.com", "Bob"),
    ])
    const user = userEvent.setup()
    render(<FindUsers />)
    await user.type(screen.getByPlaceholderText(/search by email or display name/i), "ali")
    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument()
      expect(screen.getByText("Bob")).toBeInTheDocument()
    })
  })

  it("shows 'no users found' message when search yields no results", async () => {
    mockSearchUsers.mockResolvedValue([])
    const user = userEvent.setup()
    render(<FindUsers />)
    await user.type(screen.getByPlaceholderText(/search by email or display name/i), "xyz")
    await waitFor(() => {
      expect(screen.getByText(/no users found matching/i)).toBeInTheDocument()
    })
  })

  it("calls sendFriendRequest with the user id when Add Friend is clicked", async () => {
    mockSearchUsers.mockResolvedValue([makeUser("u99", "friend@example.com", "Friend")])
    const user = userEvent.setup()
    render(<FindUsers />)
    await user.type(screen.getByPlaceholderText(/search by email or display name/i), "fri")
    await waitFor(() => screen.getByRole("button", { name: /add friend/i }))
    await user.click(screen.getByRole("button", { name: /add friend/i }))
    await waitFor(() => {
      expect(mockSendFriendRequest).toHaveBeenCalledWith("u99")
    })
  })

  it("changes the button to 'Request Sent' after sending a request", async () => {
    mockSearchUsers.mockResolvedValue([makeUser("u99", "friend@example.com", "Friend")])
    const user = userEvent.setup()
    render(<FindUsers />)
    await user.type(screen.getByPlaceholderText(/search by email or display name/i), "fri")
    await waitFor(() => screen.getByRole("button", { name: /add friend/i }))
    await user.click(screen.getByRole("button", { name: /add friend/i }))
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /request sent/i })).toBeInTheDocument()
    })
  })
})
