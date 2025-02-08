import { games } from "./tempGameData"

const getUserGames = async (userId: string, shelf: "All" | "Owned" | "Want" | "Not Interested") => {
  await new Promise(resolve => setTimeout(resolve, 100))
  if (shelf === "All") return games
  return games.filter(game => game.shelf === shelf)
}

export default getUserGames
