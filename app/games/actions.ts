"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Game, GameBox, GameId } from "../lib/types/game"
import { XMLParser } from "fast-xml-parser"
import { revalidatePath } from "next/cache"

export interface BggSearchResult {
  bgg_id: number
  title: string
  year_published: number | null
}

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

const bggHeaders = (): HeadersInit =>
  process.env.BGG_BEARER_TOKEN ? { Authorization: `Bearer ${process.env.BGG_BEARER_TOKEN}` } : {}

export async function searchBggByTitle(title: string): Promise<BggSearchResult[]> {
  const response = await fetch(
    `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(title)}&type=boardgame`,
    { headers: bggHeaders() },
  )
  const data = convertResponseToJson(await response.text())

  const items = data.items?.item
  if (!items) return []

  const itemsArray = Array.isArray(items) ? items : [items]

  return itemsArray.map((item: any) => {
    const names = Array.isArray(item.name) ? item.name : [item.name]
    const primary = names.find((n: any) => n.type === "primary") ?? names[0]
    return {
      bgg_id: parseInt(item.id),
      title: primary?.value ?? "Unknown",
      year_published: item.yearpublished?.value ? parseInt(item.yearpublished.value) : null,
    }
  })
}

export async function addGameByBggId(bggId: number): Promise<{ error: string } | void> {
  let data: any = null

  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${bggId}`, { headers: bggHeaders() })
    if (response.status === 401 || response.status === 403) {
      return { error: `BGG API authentication failed (${response.status}). Set BGG_BEARER_TOKEN in your environment.` }
    }
    data = convertResponseToJson(await response.text())
    if (data.items?.item) break
    if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 2000))
  }

  const item = data?.items?.item
  if (!item) return { error: `No game found on BGG for ID ${bggId}` }

  const names = Array.isArray(item.name) ? item.name : [item.name]
  const primaryName = names.find((n: any) => n.type === "primary") ?? names[0]
  const title = primaryName?.value ?? "Unknown"

  const links = Array.isArray(item.link) ? item.link : item.link ? [item.link] : []
  const publisherLink = links.find((l: any) => l.type === "boardgamepublisher")
  const publisher = publisherLink?.value ?? "Unknown"

  const bgg_id = parseInt(item.id)
  const supabase = await createClient()

  const { data: existingGame, error: getError } = await supabase
    .from("games")
    .select<"id", string>("id")
    .eq("bgg_id", bgg_id)
    .single<GameId>()

  if (getError && getError.code !== "PGRST116") {
    console.error("[addGameByBggId] select error:", getError)
    return { error: getError.message }
  }

  const newGame: GameBox = {
    title,
    age: parseInt(item.minage?.value ?? "0"),
    min_players: parseInt(item.minplayers?.value ?? "0"),
    max_players: parseInt(item.maxplayers?.value ?? "0"),
    is_expansion: item.type === "boardgameexpansion",
    publisher,
    playing_time: parseInt(item.playingtime?.value ?? "0"),
    image: item.image ?? "",
    thumbnail: item.thumbnail ?? "",
    year_published: parseInt(item.yearpublished?.value ?? "0"),
    bgg_id,
  }

  if (existingGame?.id) {
    newGame.id = existingGame.id
  }

  const { error } = await supabase.from("games").upsert(newGame)

  if (error) {
    console.error("[addGameByBggId] upsert error:", error)
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

const convertResponseToJson = (response: any) => {
  const options = {
    ignoreAttributes: false,
    attributeNamePrefix: "",
  }
  const parser = new XMLParser(options)

  const responseJson = parser.parse(response)

  return responseJson
}
