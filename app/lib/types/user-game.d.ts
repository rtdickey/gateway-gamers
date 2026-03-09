import { Tables } from "@/database.types"

export interface UserGame extends Tables<"user_games"> {
  game: Tables<"games">
}
