export interface Game {
  title: string
  shelf: "Owned" | "Want" | "Not Interested" | "Loaned"
  playingTime: number
  playerCount: string
  age: string
  thumbnail: string
  isLoaned?: boolean
}
