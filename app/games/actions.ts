"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Game } from "../lib/types/Game"

export interface PaginationProps {
  page?: number
  size?: number
}

export async function getGames({ page = 0, size = 100 }: PaginationProps) {
  const supabase = await createClient()
  const startIndex = page * size
  const endIndex = startIndex + size - 1
  const { data: games, error } = await supabase
    .from("games")
    .select("*")
    .order("title", { ascending: true })
    .range(startIndex, endIndex)
    .returns<Game[]>()

  if (error) {
    redirect("/error")
  }

  const totalGames = games.length
  const totalPages = games.length / size

  return { totalGames: totalGames, totalPages: totalPages, games: games }
}
