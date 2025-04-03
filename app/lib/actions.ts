"use server"

import { createClient } from "@/utils/supabase/server"
import { gameData, loanedGameData } from "../lib/placeholder-data"
import { QueryData } from "@supabase/supabase-js"
import { UserGame } from "./types/UserGame"

export const getUserGames = async (userId: string) => {
  const supabase = await createClient()
  const userGamesQuery = supabase.from("user_games").select(`
    id,
    shelf,
    is_private,
    is_loaned,
    user_id,
    game_id,
    created_at,
    game:games (
      id,
      title,
      age,
      min_players,
      max_players,
      is_expansion,
      publisher,
      playing_time,
      image,
      thumbnail,
      year_published,
      bgg_id
    )
  `)

  const { data, error } = await userGamesQuery.returns<UserGame[]>()
  if (error) throw error
  return data
}

export const getLoanedGames = async (userId: string) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return loanedGameData.filter(game => game.ownerId === userId).sort((a, b) => (a.loanedDate < b.loanedDate ? -1 : 1))
}
