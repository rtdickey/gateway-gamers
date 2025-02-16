"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import { useDebounce } from "use-debounce"

import Search from "@/app/components/common/search"
import { Game } from "@/app/lib/types/Game"

interface ShelfProps {
  games: Game[]
}

const Shelf: React.FC<ShelfProps> = ({ games }) => {
  const [filteredGames, setFilteredGames] = useState(games)
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch] = useDebounce(searchValue.toLowerCase(), 500)

  useEffect(() => {
    const filterGames = games.filter(game => game.title.toLowerCase().includes(debouncedSearch))
    setFilteredGames(filterGames.sort((a, b) => a.title.localeCompare(b.title)))
  }, [debouncedSearch, setFilteredGames, games])

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  return (
    <>
      <Search onChange={handleOnChange} />
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4'>
        {filteredGames.map(game => (
          <div key={game.id} className='card card-compact bg-base-100 shadow-xl'>
            <figure>
              {game.thumbnail && (
                <Image src={game.thumbnail} alt={game.title} width={200} height={150} className='h-40 w-full' />
              )}
              {!game.thumbnail && (
                <div className='h-40 w-full bg-base-200 flex flex-col items-center justify-center text-2xl font-semibold'>
                  <span>IMAGE</span>
                  <span>NOT FOUND</span>
                </div>
              )}
            </figure>
            <div className='card-body'>
              <h2 className='card-title'>{game.title}</h2>
              <p>Playing Time: {game.playingTime}m</p>
              <p>Player Count: {game.playerCount}</p>
              <p>Age: {game.age}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Shelf
