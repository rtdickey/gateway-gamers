import { Tables } from "@/database.types"

export type Game = Tables<"games">

export interface GameId {
  id: string
}

export interface GameBox {
  id?: string
  bgg_id: number
  title: string
  thumbnail: string
  image: string
  year_published: number
  playing_time: number
  min_players: number
  max_players: number
  age: number
  publisher: string
  is_expansion: boolean
}
