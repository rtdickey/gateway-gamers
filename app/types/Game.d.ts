export interface Game {
  title: string
  shelf: "Owned" | "Want" | "Not Interested"
  playingTime: number
  playerCount: string
  age: string
}
