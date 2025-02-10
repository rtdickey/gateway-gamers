import Game from "./Game"

export interface LoanedGame extends Game {
  borrowerId: string
  borrower: string
  ownerId: string
  owner: string
  loanedDate: string
  game: Game
}
