import { unstable_cache } from "next/cache"
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

/** Fetches full details (including thumbnails) for up to 20 BGG IDs in a single /thing request. */
async function getThingBatch(bggIds: number[]): Promise<BggGameDetail[]> {
  if (bggIds.length === 0) return []

  const url = `${BGG_API_BASE}/thing?id=${bggIds.join(",")}&stats=1`
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
  const items: any[] = parsed?.items?.item ?? []

  return items.map(item => {
    const names: any[] = item.name ?? []
    const primaryName = names.find((n: any) => n["@_type"] === "primary")?.["@_value"] ?? "Unknown"
    const links: any[] = item.link ?? []
    const publisherLink = links.find((l: any) => l["@_type"] === "boardgamepublisher")

    return {
      bggId: parseInt(item["@_id"]),
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
  })
}

const _getBggGameDetailsCached = unstable_cache(
  async (bggId: number): Promise<BggGameDetail> => {
    const results = await getThingBatch([bggId])
    if (!results.length) throw new Error("No game data returned from BGG")
    return results[0]
  },
  ["bgg-game-detail"],
  { revalidate: 86400 }, // 24 hours — game metadata rarely changes
)

export async function getBggGameDetails(bggId: number): Promise<BggGameDetail> {
  return _getBggGameDetailsCached(bggId)
}

const PAGE_SIZE = 20

/**
 * Cached search: stores the full /thing details for one page of results.
 * Cached per (query, page) for 1 hour so revisiting a page costs zero BGG calls.
 * Note: unstable_cache cannot be nested, so searchBggGames is called directly here.
 */
const _searchBggGamesPageCached = unstable_cache(
  async (
    normalizedQuery: string,
    page: number,
  ): Promise<{ items: BggGameDetail[]; totalCount: number; totalPages: number }> => {
    const allResults = await searchBggGames(normalizedQuery)
    const totalCount = allResults.length
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
    const pageResults = allResults.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
    const ids = pageResults.map(r => r.bggId)
    const details = await getThingBatch(ids)
    const detailMap = new Map(details.map(d => [d.bggId, d]))
    const items = ids.flatMap(id => {
      const d = detailMap.get(id)
      return d ? [d] : []
    })
    return { items, totalCount, totalPages }
  },
  ["bgg-search-page"],
  { revalidate: 3600 },
)

/**
 * Paginated two-step search. Returns one page of full game details
 * (including thumbnails) plus total result counts for pagination UI.
 */
export async function searchBggGamesPage(
  query: string,
  page: number,
): Promise<{ items: BggGameDetail[]; totalCount: number; totalPages: number }> {
  return _searchBggGamesPageCached(query.toLowerCase().trim(), page)
}
