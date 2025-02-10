export interface Game {
  title: string
  shelf: "Owned" | "Want" | "Not Interested" | "Loaned" | null
  playingTime: number
  playerCount: string
  age: string
  thumbnail: string
  isLoaned?: boolean
}
