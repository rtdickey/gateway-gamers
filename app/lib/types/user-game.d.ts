import { Tables } from "@/database.types"

export interface UserGame extends Tables<"user_games"> {
  game: Tables<"games">
}

// export interface UserGame {
//   ownerId: string
//   title: string
//   shelf: "Owned" | "Want" | "Not Interested" | "Loaned" | null
//   playingTime: number
//   playerCount: string
//   age: string
//   thumbnail: string
//   isPrivate: boolean
//   isLoaned: boolean
// }
