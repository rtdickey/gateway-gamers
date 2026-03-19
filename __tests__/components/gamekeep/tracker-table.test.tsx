import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import TrackerTable from "@/app/components/gamekeep/tracker-table"
import { LoanedGame } from "@/app/lib/types/loaned-game"

const mockReturnGame = jest.fn()

jest.mock("@/app/lib/actions/user-game-actions", () => ({
  returnGame: (...args: unknown[]) => mockReturnGame(...args),
}))

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

const makeLoanedGame = (overrides: Partial<LoanedGame> = {}): LoanedGame =>
  ({
    id: "loan-1",
    created_at: "2026-01-01T00:00:00Z",
    user_game_id: 1,
    borrower: "John Doe",
    borrower_id: null,
    loaned_at: "2026-03-01T00:00:00Z",
    returned_at: null,
    user_game: {
      id: 1,
      shelf: "Owned",
      is_private: false,
      is_loaned: true,
      user_id: "user-1",
      game_id: "game-1",
      created_at: "2026-01-01T00:00:00Z",
      modified_at: null,
      game: {
        id: "game-1",
        title: "Catan",
        age: 10,
        min_players: 3,
        max_players: 4,
        is_expansion: false,
        publisher: "CATAN Studio",
        playing_time: 90,
        image: null,
        thumbnail: null,
        year_published: 1995,
        bgg_id: null,
        created_at: "2026-01-01T00:00:00Z",
      },
    },
    ...overrides,
  }) as LoanedGame

describe("TrackerTable", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-03-18T12:00:00Z"))
    mockReturnGame.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.useRealTimers()
    mockReturnGame.mockReset()
  })

  it("renders the table column headers", () => {
    render(<TrackerTable loanedGames={[]} />)
    expect(screen.getByText("Game")).toBeInTheDocument()
    expect(screen.getByText("Borrower")).toBeInTheDocument()
    expect(screen.getByText("Date")).toBeInTheDocument()
  })

  it("renders game titles and borrower names", () => {
    const games = [
      makeLoanedGame({ id: "loan-1", borrower: "Alice", loaned_at: "2026-03-01T00:00:00Z" }),
      makeLoanedGame({
        id: "loan-2",
        borrower: "Bob",
        loaned_at: "2026-03-05T00:00:00Z",
        user_game: {
          ...makeLoanedGame().user_game,
          game: { ...makeLoanedGame().user_game.game, title: "Pandemic" },
        },
      }),
    ]
    render(<TrackerTable loanedGames={games} />)
    expect(screen.getAllByText("Catan").length).toBeGreaterThan(0)
    expect(screen.getByText("Pandemic")).toBeInTheDocument()
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
  })

  it("shows the loaned date and days elapsed", () => {
    render(<TrackerTable loanedGames={[makeLoanedGame()]} />)
    expect(screen.getByText("2026-03-01")).toBeInTheDocument()
    // 17 days from 2026-03-01 to 2026-03-18
    expect(screen.getByText("(17 days)")).toBeInTheDocument()
  })

  it("renders a 'Returned?' button for each loan", () => {
    const games = [makeLoanedGame({ id: "l1" }), makeLoanedGame({ id: "l2" })]
    render(<TrackerTable loanedGames={games} />)
    expect(screen.getAllByRole("button", { name: /returned\?/i })).toHaveLength(2)
  })

  it("opens a confirmation modal when 'Returned?' is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<TrackerTable loanedGames={[makeLoanedGame()]} />)
    await user.click(screen.getByRole("button", { name: /returned\?/i }))
    await waitFor(() => {
      expect(screen.getByText(/has john doe returned catan/i)).toBeInTheDocument()
    })
  })

  it("calls returnGame when confirming return in the modal", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<TrackerTable loanedGames={[makeLoanedGame({ id: "loan-42" })]} />)
    await user.click(screen.getByRole("button", { name: /returned\?/i }))
    const confirmBtn = await screen.findByRole("button", { name: /yes, it.s back/i })
    await user.click(confirmBtn)
    await waitFor(() => {
      expect(mockReturnGame).toHaveBeenCalledWith("loan-42")
    })
  })
})
