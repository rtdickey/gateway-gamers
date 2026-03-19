import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import FriendsList from "@/app/friends/components/friends-list"
import { Friendship } from "@/app/friends/actions"

const mockDeleteFriendship = jest.fn()

jest.mock("@/app/friends/actions", () => ({
  deleteFriendship: (...args: unknown[]) => mockDeleteFriendship(...args),
}))

const makeFriendship = (overrides: Partial<Friendship> = {}): Friendship => ({
  id: "friendship-1",
  created_at: "2026-01-01T00:00:00Z",
  requester_id: "user-1",
  addressee_id: "user-2",
  status: "accepted",
  friend: { id: "user-2", email: "friend@example.com", display_name: "Alice" },
  ...overrides,
})

describe("FriendsList", () => {
  beforeEach(() => {
    mockDeleteFriendship.mockResolvedValue(undefined)
  })

  afterEach(() => {
    mockDeleteFriendship.mockReset()
  })

  it("shows empty state when friends list is empty", () => {
    render(<FriendsList friends={[]} />)
    expect(screen.getByText(/no friends yet/i)).toBeInTheDocument()
  })

  it("renders each friend's display name", () => {
    const friends = [
      makeFriendship({ id: "f1", friend: { id: "u2", email: "a@a.com", display_name: "Alice" } }),
      makeFriendship({ id: "f2", friend: { id: "u3", email: "b@b.com", display_name: "Bob" } }),
    ]
    render(<FriendsList friends={friends} />)
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
  })

  it("renders the friend email when display_name is null", () => {
    const friends = [makeFriendship({ friend: { id: "u2", email: "only@email.com", display_name: null } })]
    render(<FriendsList friends={friends} />)
    expect(screen.getByText("only@email.com")).toBeInTheDocument()
  })

  it("renders an Unfriend button for each friend", () => {
    const friends = [
      makeFriendship({ id: "f1", friend: { id: "u2", email: "a@a.com", display_name: "Alice" } }),
      makeFriendship({ id: "f2", friend: { id: "u3", email: "b@b.com", display_name: "Bob" } }),
    ]
    render(<FriendsList friends={friends} />)
    expect(screen.getAllByRole("button", { name: /unfriend/i })).toHaveLength(2)
  })

  it("calls deleteFriendship with the friendship id when Unfriend is clicked", async () => {
    const user = userEvent.setup()
    const friends = [makeFriendship({ id: "friendship-99" })]
    render(<FriendsList friends={friends} />)
    await user.click(screen.getByRole("button", { name: /unfriend/i }))
    expect(mockDeleteFriendship).toHaveBeenCalledWith("friendship-99")
  })
})
