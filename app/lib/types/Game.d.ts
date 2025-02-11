export interface UserGame {
  ownerId: string
  title: string
  shelf: "Owned" | "Want" | "Not Interested" | "Loaned" | null
  playingTime: number
  playerCount: string
  age: string
  thumbnail: string
  isPrivate: boolean
  isLoaned: boolean
}
