import Game from "./Game"

export interface LoanedGame extends Game {
  borrower: string
  owner: string
  loanedDate: string
  game: Game
}
