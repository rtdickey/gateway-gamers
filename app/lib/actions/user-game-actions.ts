"use server"

import { createClient } from "@/utils/supabase/server"
import { UserGame } from "../types/user-game"
import { LoanedGame } from "../types/loaned-game"
import getUser from "../../actions"
import { revalidatePath } from "next/cache"
import { searchBggGames, getBggGameDetails, searchBggGamesPage } from "@/app/lib/bgg/api"
import type { BggSearchResult, BggGameDetail } from "@/app/lib/types/bgg"

export async function searchBggGamesAction(query: string): Promise<BggSearchResult[]> {
  return searchBggGames(query)
}

export async function getBggGameDetailsAction(bggId: number): Promise<BggGameDetail> {
  return getBggGameDetails(bggId)
}

/** Paginated two-step search returning one page of full details + pagination metadata. */
export async function searchBggGamesPageAction(
  query: string,
  page: number,
): Promise<{ items: BggGameDetail[]; totalCount: number; totalPages: number }> {
  return searchBggGamesPage(query, page)
}

/** Used when details have already been fetched client-side to avoid a second BGG request. */
export async function addBggGameDetailsToShelf(details: BggGameDetail, shelf: string): Promise<void> {
  const supabase = await createClient()
  const { user } = await getUser()

  const { data: existing } = await supabase.from("games").select("id").eq("bgg_id", details.bggId).maybeSingle()

  let gameId: string

  if (existing) {
    gameId = existing.id
  } else {
    const { data: inserted, error: insertError } = await supabase
      .from("games")
      .insert({
        bgg_id: details.bggId,
        title: details.title,
        thumbnail: details.thumbnail,
        image: details.image,
        year_published: details.yearPublished,
        playing_time: details.playingTime,
        min_players: details.minPlayers,
        max_players: details.maxPlayers,
        age: details.age,
        publisher: details.publisher,
        is_expansion: details.isExpansion,
      })
      .select("id")
      .single()

    if (insertError) throw insertError
    gameId = inserted.id
  }

  const { error } = await supabase.from("user_games").insert({
    user_id: user.id,
    game_id: gameId,
    shelf,
  })

  if (error) throw error
  revalidatePath("/gamekeep")
}

export async function addBggGameToShelf(bggId: number, shelf: string): Promise<void> {
  const supabase = await createClient()
  const { user } = await getUser()

  // Check whether this BGG game is already in the games table
  const { data: existing } = await supabase.from("games").select("id").eq("bgg_id", bggId).maybeSingle()

  let gameId: string

  if (existing) {
    gameId = existing.id
  } else {
    const details = await getBggGameDetails(bggId)
    const { data: inserted, error: insertError } = await supabase
      .from("games")
      .insert({
        bgg_id: details.bggId,
        title: details.title,
        thumbnail: details.thumbnail,
        image: details.image,
        year_published: details.yearPublished,
        playing_time: details.playingTime,
        min_players: details.minPlayers,
        max_players: details.maxPlayers,
        age: details.age,
        publisher: details.publisher,
        is_expansion: details.isExpansion,
      })
      .select("id")
      .single()

    if (insertError) throw insertError
    gameId = inserted.id
  }

  const { error } = await supabase.from("user_games").insert({
    user_id: user.id,
    game_id: gameId,
    shelf,
  })

  if (error) throw error
  revalidatePath("/gamekeep")
}

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

export const toggleGamePrivacy = async (userGameId: number, isPrivate: boolean) => {
  const supabase = await createClient()
  const { user } = await getUser()

  const { error } = await supabase
    .from("user_games")
    .update({ is_private: isPrivate })
    .eq("id", userGameId)
    .eq("user_id", user.id) // ownership enforced server-side

  if (error) throw error
  revalidatePath("/gamekeep")
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

  // Get the user's own user_game IDs so we can filter loans they created
  const { data: userGameIds, error: userGameError } = await supabase
    .from("user_games")
    .select("id")
    .eq("user_id", userId)

  if (userGameError) throw userGameError

  const ids = (userGameIds ?? []).map(ug => ug.id)

  const query = supabase
    .from("loans")
    .select(
      `
      id,
      created_at,
      user_game_id,
      borrower,
      borrower_id,
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
    .is("returned_at", null)
    .order("loaned_at", { ascending: true })

  const { data, error } =
    ids.length > 0
      ? await query.or(`user_game_id.in.(${ids.join(",")}),borrower_id.eq.${userId}`).returns<LoanedGame[]>()
      : await query.eq("borrower_id", userId).returns<LoanedGame[]>()

  if (error) throw error
  return data
}

export const returnGame = async (loanId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("loans")
    .update({ returned_at: new Date().toISOString() })
    .eq("id", loanId)

  revalidatePath("/gamekeep/tracker")
  if (error) throw error
  return data
}
