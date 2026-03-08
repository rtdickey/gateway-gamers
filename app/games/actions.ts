"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Game, GameBox } from "../lib/types/game"
import { revalidatePath } from "next/cache"

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
    gamesQuery = gamesQuery.textSearch("title", searchTitle, {
      config: "english",
      type: "websearch",
    })
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

export async function addGameManually(formData: FormData): Promise<{ error: string } | void> {
  const title = (formData.get("title") as string)?.trim()
  if (!title) return { error: "Title is required." }

  const newGame: GameBox = {
    title,
    bgg_id: null,
    year_published: parseInt(formData.get("year_published") as string) || 0,
    min_players: parseInt(formData.get("min_players") as string) || 0,
    max_players: parseInt(formData.get("max_players") as string) || 0,
    playing_time: parseInt(formData.get("playing_time") as string) || 0,
    age: parseInt(formData.get("age") as string) || 0,
    publisher: (formData.get("publisher") as string)?.trim() || "",
    is_expansion: formData.get("is_expansion") === "true",
    image: "",
    thumbnail: "",
  }

  const supabase = await createClient()
  const { error } = await supabase.from("games").insert(newGame)

  if (error) {
    console.error("[addGameManually] insert error:", error)
    return { error: error.message }
  }

  revalidatePath("/games")
}

export async function addGames(game: Game) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("games").upsert(game)

  if (error) {
    redirect("/error")
  }

  return data
}
