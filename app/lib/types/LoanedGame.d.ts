import { type UserGame } from "./UserGame"

export interface LoanedGame extends UserGame {
  loanId: string
  borrowerId: string
  borrower: string
  ownerId: string
  owner: string
  loanedDate: string
  title: string
  playingTime: number
  playerCount: string
  age: string
  thumbnail: string
  isPrivate: boolean
  isLoaned: boolean
  shelf: string | null
  isExpansion: boolean
  image: string | null
}
