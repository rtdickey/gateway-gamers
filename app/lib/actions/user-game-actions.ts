"use server"

import { createClient } from "@/utils/supabase/server"
import { loanedGameData } from "../placeholder-data"
import { UserGame } from "../types/user-game"
import getUser from "../../actions"
import { revalidatePath } from "next/cache"

export const addGameToShelf = async (gameId: string, shelf: string) => {
  const supabase = await createClient()

  const { user } = await getUser()

  const { data, error } = await supabase.from("user_games").insert({
    user_id: user.id,
    game_id: gameId,
    shelf,
  })

  if (error) throw error
  return data
}

export const deleteGameFromShelf = async (gameId: string) => {
  const supabase = await createClient()

  const { user } = await getUser()

  const { data, error } = await supabase.from("user_games").delete().match({
    user_id: user.id,
    game_id: gameId,
  })

  revalidatePath("/gamekeep/shelf")
  if (error) throw error
  return data
}

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
    ).eq("user_id", ${userId})
  `)

  const { data, error } = await userGamesQuery.returns<UserGame[]>()
  if (error) throw error
  return data
}

export const getLoanedGames = async (userId: string) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return loanedGameData.filter(game => game.ownerId === userId).sort((a, b) => (a.loanedDate < b.loanedDate ? -1 : 1))
}
