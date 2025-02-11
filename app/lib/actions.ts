"use server"

import { gameData, loanedGameData } from "../lib/placeholder-data"

export const getUserGames = async (userId: string) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return gameData
}

export const getLoanedGames = async (userId: string) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return loanedGameData.filter(game => game.ownerId === userId).sort((a, b) => (a.loanedDate < b.loanedDate ? -1 : 1))
}
