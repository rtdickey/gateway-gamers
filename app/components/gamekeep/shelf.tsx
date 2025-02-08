"use client"

import { useEffect, useState } from "react"

import getUserGames from "@/app/actions/getUserGames"
import { Game } from "@/app/types/Game"

import ShelfSkeleton from "./shelfSkeleton"

const Shelf: React.FC = () => {
  const [shelfType, setShelfType] = useState<"All" | "Owned" | "Want" | "Not Interested">("Owned")
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    const fetchGames = async () => {
      const fetchedGames = await getUserGames("1", shelfType)
      setGames(fetchedGames)
    }
    fetchGames()
  }, [shelfType])

  const handleShelfSelect = (selectedShelf: "All" | "Owned" | "Want" | "Not Interested") => {
    setShelfType(selectedShelf)
  }

  return (
    <div className='flex w-full gap-4'>
      <ul className='menu bg-base-200 rounded-box w-36 md:w-56'>
        <li className='menu-title'>Game Keep</li>
        <li>
          <a className={shelfType === "All" ? "active" : ""} onClick={() => handleShelfSelect("All")}>
            All
          </a>
        </li>
        <li>
          <a className={shelfType === "Owned" ? "active" : ""} onClick={() => handleShelfSelect("Owned")}>
            Owned
          </a>
        </li>
        <li>
          <a className={shelfType === "Want" ? "active" : ""} onClick={() => handleShelfSelect("Want")}>
            Want
          </a>
        </li>
        <li>
          <a
            className={shelfType === "Not Interested" ? "active" : ""}
            onClick={() => handleShelfSelect("Not Interested")}
          >
            Not Interested
          </a>
        </li>
      </ul>
      <div className='flex-1'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {games.map(game =>
            games && false ? (
              <div key={game.title}>
                <h2>{game.title}</h2>
                {shelfType === "All" && <p>Shelf: {game.shelf}</p>}
                <p>Playing Time: {game.playingTime} minutes</p>
                <p>Player Count: {game.playerCount}</p>
                <p>Age: {game.age}</p>
              </div>
            ) : (
              <ShelfSkeleton key={game.title} shelfType={shelfType} />
            ),
          )}
        </div>
      </div>
    </div>
  )
}

export default Shelf
