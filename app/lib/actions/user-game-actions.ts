"use server"

import { createClient } from "@/utils/supabase/server"
import { UserGame } from "../types/user-game"
import { LoanedGame } from "../types/loaned-game"
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
  const userGamesQuery = supabase
    .from("user_games")
    .select(
      `
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
  `,
    )
    .eq("user_id", userId)

  const { data, error } = await userGamesQuery.returns<UserGame[]>()
  if (error) throw error
  return data
}

export const getLoanedGames = async (userId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("loans")
    .select(
      `
      id,
      created_at,
      user_game_id,
      borrower,
      loaned_at,
      returned_at,
      user_game:user_games (
        id,
        shelf,
        is_private,
        is_loaned,
        user_id,
        game_id,
        created_at,
        modified_at,
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
      )
    `,
    )
    .eq("user_game.user_id", userId)
    .is("returned_at", null)
    .order("loaned_at", { ascending: true })
    .returns<LoanedGame[]>()

  if (error) throw error
  return data
}
