"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import { useDebounce } from "use-debounce"

import Search from "@/app/components/common/search"
import { Game } from "@/app/lib/types/Game"
import { getGames } from "@/app/games/actions"

const Shelf: React.FC = () => {
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch] = useDebounce(searchValue.toLowerCase(), 500)

  useEffect(() => {
    const fetchData = async () => {
      const { totalGames, totalPages, games } = await getGames({ page: 0, size: 100, searchTitle: debouncedSearch })
      const filterGames = games.filter(game => game.title.toLowerCase().includes(debouncedSearch))
      setFilteredGames(filterGames.sort((a, b) => a.title.localeCompare(b.title)))
    }

    fetchData()
  }, [debouncedSearch, setFilteredGames])

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  return (
    <>
      <div>Total Games Displayed: {filteredGames.length}</div>
      <Search onChange={handleOnChange} />
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4'>
        {filteredGames.map(game => (
          <div
            key={game.id}
            className='card card-compact bg-base-100 shadow-xl hover:shadow-cyan-500/50 hover:ring-2 hover:bg-base-300 hover:cursor-pointer'
          >
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
