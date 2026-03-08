import { Tables } from "@/database.types"
import { type UserGame } from "./user-game"

export interface LoanedGame extends Tables<"loans"> {
  user_game: UserGame
}
