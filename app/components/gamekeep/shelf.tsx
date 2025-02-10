"use client"

import Image from "next/image"

import { useDebounce } from "use-debounce"

import { Game } from "@/app/lib/types/Game"
import { type Shelf as ShelfType } from "@/app/lib/types/Shelf"

import { useSearchParams } from "next/navigation"
import Search from "./search"
import { useEffect, useState } from "react"

interface ShelfProps {
  games: Game[]
}

const Shelf: React.FC<ShelfProps> = ({ games }) => {
  const params = useSearchParams()
  const shelfParam = params.get("shelf")
  const shelf = (shelfParam as ShelfType) ?? "All"
  const [filteredGames, setFilteredGames] = useState(games)
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch] = useDebounce(searchValue.toLowerCase(), 500)

  useEffect(() => {
    setFilteredGames(
      games.filter(
        game => (shelf === "All" || game.shelf === shelf) && game.title.toLowerCase().includes(debouncedSearch),
      ),
    )
  }, [games, shelf, debouncedSearch])

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  return (
    <>
      <Search onChange={handleOnChange} />
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {filteredGames.map(game => (
          <div key={game.title} className='card card-compact bg-base-100 shadow-xl'>
            <figure>
              <Image src={game.thumbnail} alt={game.title} width={200} height={150} className='h-40 w-full' />
            </figure>
            <div className='card-body'>
              <h2 className='card-title'>{game.title}</h2>
              <p>Playing Time: {game.playingTime}m</p>
              <p>Player Count: {game.playerCount}</p>
              <p>Age: {game.age}</p>
              <div className='card-actions justify-end'>
                {game.isLoaned && <div className='badge badge-outline'>Loaned</div>}
                {shelf === "All" && <div className='badge badge-outline'>{game.shelf}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Shelf
