import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import PendingRequests from "@/app/friends/components/pending-requests"
import { Friendship } from "@/app/friends/actions"

const mockRespondToRequest = jest.fn()
const mockDeleteFriendship = jest.fn()

jest.mock("@/app/friends/actions", () => ({
  respondToRequest: (...args: unknown[]) => mockRespondToRequest(...args),
  deleteFriendship: (...args: unknown[]) => mockDeleteFriendship(...args),
}))

const makeFriendship = (id: string, displayName: string | null, email: string): Friendship => ({
  id,
  created_at: "2026-01-01T00:00:00Z",
  requester_id: "requester-1",
  addressee_id: "addressee-1",
  status: "pending",
  friend: { id: "friend-1", email, display_name: displayName },
})

describe("PendingRequests", () => {
  beforeEach(() => {
    mockRespondToRequest.mockResolvedValue(undefined)
    mockDeleteFriendship.mockResolvedValue(undefined)
  })

  afterEach(() => {
    mockRespondToRequest.mockReset()
    mockDeleteFriendship.mockReset()
  })

  it("shows a 'no pending requests' message when both lists are empty", () => {
    render(<PendingRequests incoming={[]} outgoing={[]} />)
    expect(screen.getByText(/no pending requests/i)).toBeInTheDocument()
  })

  it("renders incoming requests with Accept and Decline buttons", () => {
    const incoming = [makeFriendship("req-1", "Charlie", "charlie@example.com")]
    render(<PendingRequests incoming={incoming} outgoing={[]} />)
    expect(screen.getByText("Charlie")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /accept/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /decline/i })).toBeInTheDocument()
  })

  it("renders outgoing requests with a Withdraw button", () => {
    const outgoing = [makeFriendship("req-2", "Dana", "dana@example.com")]
    render(<PendingRequests incoming={[]} outgoing={outgoing} />)
    expect(screen.getByText("Dana")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /withdraw/i })).toBeInTheDocument()
  })

  it("calls respondToRequest with 'accepted' when Accept is clicked", async () => {
    const user = userEvent.setup()
    const incoming = [makeFriendship("req-accept", "Eve", "eve@example.com")]
    render(<PendingRequests incoming={incoming} outgoing={[]} />)
    await user.click(screen.getByRole("button", { name: /accept/i }))
    expect(mockRespondToRequest).toHaveBeenCalledWith("req-accept", "accepted")
  })

  it("calls respondToRequest with 'declined' when Decline is clicked", async () => {
    const user = userEvent.setup()
    const incoming = [makeFriendship("req-decline", "Frank", "frank@example.com")]
    render(<PendingRequests incoming={incoming} outgoing={[]} />)
    await user.click(screen.getByRole("button", { name: /decline/i }))
    expect(mockRespondToRequest).toHaveBeenCalledWith("req-decline", "declined")
  })

  it("calls deleteFriendship when Withdraw is clicked", async () => {
    const user = userEvent.setup()
    const outgoing = [makeFriendship("req-withdraw", "Grace", "grace@example.com")]
    render(<PendingRequests incoming={[]} outgoing={outgoing} />)
    await user.click(screen.getByRole("button", { name: /withdraw/i }))
    expect(mockDeleteFriendship).toHaveBeenCalledWith("req-withdraw")
  })

  it("renders friend email when display_name is null", () => {
    const incoming = [makeFriendship("req-3", null, "nondisplay@example.com")]
    render(<PendingRequests incoming={incoming} outgoing={[]} />)
    expect(screen.getByText("nondisplay@example.com")).toBeInTheDocument()
  })

  it("shows heading sections for incoming and outgoing", () => {
    const incoming = [makeFriendship("req-4", "Hank", "hank@example.com")]
    const outgoing = [makeFriendship("req-5", "Iris", "iris@example.com")]
    render(<PendingRequests incoming={incoming} outgoing={outgoing} />)
    expect(screen.getByText(/incoming/i)).toBeInTheDocument()
    expect(screen.getByText(/sent/i)).toBeInTheDocument()
  })
})
