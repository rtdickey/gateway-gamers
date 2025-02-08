import { games } from "./tempGameData"

const getUserGames = async (userId: string, shelf: "All" | "Owned" | "Want" | "Not Interested" | "Loaned") => {
  await new Promise(resolve => setTimeout(resolve, 500))
  if (shelf === "All") return games
  if (shelf === "Loaned") return games.filter(game => game.isLoaned)
  return games.filter(game => game.shelf === shelf)
}

export default getUserGames
