"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Game } from "../lib/types/Game"

export interface GetGamesProps {
  page?: number
  size?: number
  searchTitle?: string
}

export async function getGames({ page = 0, size = 100, searchTitle }: GetGamesProps) {
  const supabase = await createClient()
  const startIndex = page * size
  const endIndex = startIndex + size - 1

  let gamesQuery = supabase.from("games").select("*")

  if (searchTitle) {
    gamesQuery = gamesQuery.ilike("title", `%${searchTitle}%`)
  }

  gamesQuery = gamesQuery.order("title", { ascending: true }).range(startIndex, endIndex)

  const { data: games, error } = await gamesQuery.returns<Game[]>()

  if (error) {
    redirect("/error")
  }

  const totalGames = games.length
  const totalPages = games.length / size

  return { totalGames: totalGames, totalPages: totalPages, games: games }
}
