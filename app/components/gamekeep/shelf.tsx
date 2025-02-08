"use client"

import { useEffect, useState } from "react"

import Image from "next/image"

import getUserGames from "@/app/actions/getUserGames"
import { Game } from "@/app/types/Game"

import ShelfSkeleton from "./shelfSkeleton"

const Shelf: React.FC = () => {
  const [shelfType, setShelfType] = useState<"All" | "Owned" | "Want" | "Not Interested">("Owned")
  const [games, setGames] = useState<Game[]>([])
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchGames = async () => {
      setIsFetching(true)
      const fetchedGames = await getUserGames("1", shelfType)
      setGames(fetchedGames)
      setIsFetching(false)
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
          {isFetching
            ? [...Array(10)].map((_, index) => <ShelfSkeleton key={index} shelfType={shelfType} />)
            : games.map(game => (
                <div key={game.title} className='card card-compact bg-base-100 shadow-xl'>
                  <figure>
                    <Image src={game.thumbnail} alt={game.title} width={200} height={150} className='h-36' />
                  </figure>
                  <div className='card-body'>
                    <h2 className='card-title'>{game.title}</h2>
                    <p>Playing Time: {game.playingTime}m</p>
                    <p>Player Count: {game.playerCount}</p>
                    <p>Age: {game.age}</p>
                    {shelfType === "All" && (
                      <div className='card-actions justify-end'>
                        <div className='badge badge-outline'>{game.shelf}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}

export default Shelf
