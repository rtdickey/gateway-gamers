export interface BggSearchResult {
  bggId: number
  name: string
  yearPublished: number | null
  type: "boardgame" | "boardgameexpansion"
}

export interface BggGameDetail {
  bggId: number
  title: string
  thumbnail: string
  image: string
  yearPublished: number
  minPlayers: number
  maxPlayers: number
  playingTime: number
  age: number
  publisher: string
  isExpansion: boolean
}
