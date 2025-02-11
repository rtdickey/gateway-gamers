import { type UserGame } from "./Game"

export interface LoanedGame extends UserGame {
  loanId: string
  borrowerId: string
  borrower: string
  ownerId: string
  owner: string
  loanedDate: string
}
