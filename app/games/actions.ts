"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Game, GameBox, GameId } from "../lib/types/Game"
import { XMLParser } from "fast-xml-parser"
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

export async function getGamesFromBgg(formData: FormData) {
  const gameId = formData.get("gameId") as string
  const game = await fetch(`https://boardgamegeek.com/xmlapi/boardgame/${gameId}`)
  const gameData = convertResponseToJson(await game.text())

  const title = gameData.boardgames.boardgame.name
  const publisher = gameData.boardgames.boardgame.boardgamepublisher
  const bgg_id = parseInt(gameData.boardgames.boardgame["objectid"])
  const supabase = await createClient()

  const { data: existingGame, error: getError } = await supabase
    .from("games")
    .select<"id", string>("id")
    .eq("bgg_id", bgg_id)
    .single<GameId>()

  if (getError && getError.code !== "PGRST116") {
    console.log(getError)
    redirect("/error")
  }

  const newGame: GameBox = {
    title: Array.isArray(title) ? title[0]["#text"] : title["#text"],
    age: gameData.boardgames.boardgame.age,
    min_players: gameData.boardgames.boardgame.minplayers,
    max_players: gameData.boardgames.boardgame.maxplayers,
    is_expansion: gameData.boardgames.boardgame.expansion === "1",
    publisher: Array.isArray(publisher) ? publisher[0]["#text"] : publisher["#text"],
    playing_time: gameData.boardgames.boardgame.playingtime,
    image: gameData.boardgames.boardgame.image,
    thumbnail: gameData.boardgames.boardgame.thumbnail,
    year_published: gameData.boardgames.boardgame.yearpublished,
    bgg_id: bgg_id,
  }

  if (existingGame?.id) {
    newGame.id = existingGame.id
  }

  const { data, error } = await supabase.from("games").upsert(newGame)

  if (error) {
    redirect("/error")
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
