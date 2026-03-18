import { XMLParser } from "fast-xml-parser"
import type { BggSearchResult, BggGameDetail } from "@/app/lib/types/bgg"

const BGG_API_BASE = "https://boardgamegeek.com/xmlapi2"

function authHeader(): Record<string, string> {
  const token = process.env.BGG_BEARER_TOKEN
  if (!token) throw new Error("BGG_BEARER_TOKEN is not configured")
  return { Authorization: `Bearer ${token}` }
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  isArray: name => ["item", "name", "link"].includes(name),
})

export async function searchBggGames(query: string): Promise<BggSearchResult[]> {
  const url = `${BGG_API_BASE}/search?query=${encodeURIComponent(query)}&type=boardgame,boardgameexpansion`
  const res = await fetch(url, {
    headers: authHeader(),
    cache: "no-store",
  })

  if (!res.ok) throw new Error(`BGG search failed with status ${res.status}`)

  const xml = await res.text()
  const parsed = parser.parse(xml)
  const items: any[] = parsed?.items?.item ?? []

  const seen = new Set<number>()
  const mapped: BggSearchResult[] = []

  for (const item of items) {
    const bggId = parseInt(item["@_id"])
    if (seen.has(bggId)) continue
    seen.add(bggId)

    const names: any[] = item.name ?? []
    const primary = names.find(n => n["@_type"] === "primary")
    mapped.push({
      bggId,
      name: primary?.["@_value"] ?? "Unknown",
      yearPublished: item.yearpublished?.["@_value"] ? parseInt(item.yearpublished["@_value"]) : null,
      type: item["@_type"] as "boardgame" | "boardgameexpansion",
    })
  }

  return mapped
}

export async function getBggGameDetails(bggId: number): Promise<BggGameDetail> {
  const url = `${BGG_API_BASE}/thing?id=${bggId}&stats=1`
  let xml = ""

  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      headers: authHeader(),
      cache: "no-store",
    })

    if (res.status === 202) {
      await new Promise(r => setTimeout(r, 2000))
      continue
    }

    if (!res.ok) throw new Error(`BGG thing request failed with status ${res.status}`)
    xml = await res.text()
    break
  }

  if (!xml) throw new Error("BGG did not return game details after multiple attempts")

  const parsed = parser.parse(xml)
  const item = (parsed?.items?.item ?? [])[0]
  if (!item) throw new Error("No game data returned from BGG")

  const names: any[] = item.name ?? []
  const primaryName = names.find(n => n["@_type"] === "primary")?.["@_value"] ?? "Unknown"
  const links: any[] = item.link ?? []
  const publisherLink = links.find(l => l["@_type"] === "boardgamepublisher")

  return {
    bggId,
    title: primaryName,
    thumbnail: item.thumbnail ?? "",
    image: item.image ?? "",
    yearPublished: item.yearpublished?.["@_value"] ? parseInt(item.yearpublished["@_value"]) : 0,
    minPlayers: item.minplayers?.["@_value"] ? parseInt(item.minplayers["@_value"]) : 0,
    maxPlayers: item.maxplayers?.["@_value"] ? parseInt(item.maxplayers["@_value"]) : 0,
    playingTime: item.playingtime?.["@_value"] ? parseInt(item.playingtime["@_value"]) : 0,
    age: item.minage?.["@_value"] ? parseInt(item.minage["@_value"]) : 0,
    publisher: publisherLink?.["@_value"] ?? "",
    isExpansion: item["@_type"] === "boardgameexpansion",
  }
}
