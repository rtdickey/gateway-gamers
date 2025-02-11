"use client"

import Image from "next/image"

import { useDebounce } from "use-debounce"

import { UserGame } from "@/app/lib/types/Game"
import { type Shelf as ShelfType } from "@/app/lib/types/Shelf"

import { useSearchParams } from "next/navigation"
import Search from "./search"
import { useEffect, useState } from "react"

interface ShelfProps {
  games: UserGame[]
}

const Shelf: React.FC<ShelfProps> = ({ games }) => {
  const params = useSearchParams()
  const shelfParam = params.get("shelf")
  const shelf = (shelfParam as ShelfType) ?? "All"
  const [filteredGames, setFilteredGames] = useState(games)
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch] = useDebounce(searchValue.toLowerCase(), 500)
  const [filterOwned, setFilterOwned] = useState(true)
  const [filterWant, setFilterWant] = useState(false)
  const [filterNotInterested, setFilterNotInterested] = useState(false)
  const [filterPrivate, setFilterPrivate] = useState(false)
  const [filterLoaned, setFilterLoaned] = useState(false)

  useEffect(() => {
    const filterGames = games.filter(game => {
      return (
        ((filterOwned && game.shelf === "Owned") ||
          (filterWant && game.shelf === "Want") ||
          (filterNotInterested && game.shelf === "Not Interested")) &&
        game.title.toLowerCase().includes(debouncedSearch) &&
        (filterPrivate ? game.isPrivate : true) &&
        (filterLoaned ? game.isLoaned : true)
      )
    })
    setFilteredGames(filterGames)
  }, [filterOwned, filterWant, filterNotInterested, filterPrivate, filterLoaned, debouncedSearch, setFilteredGames])

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  return (
    <>
      <Search onChange={handleOnChange} />
      <div className='flex justify-between gap-4'>
        <div className='flex justify-start gap-4'>
          <label className='swap'>
            <input type='checkbox' checked={filterOwned} onChange={e => setFilterOwned(!filterOwned)} />
            <div className='swap-on'>
              <div className='badge badge-primary'>Owned</div>
            </div>
            <div className='swap-off'>
              <div className='badge badge-outline'>Owned</div>
            </div>
          </label>
          <label className='swap'>
            <input type='checkbox' checked={filterWant} onChange={e => setFilterWant(!filterWant)} />
            <div className='swap-on'>
              <div className='badge badge-primary'>Want</div>
            </div>
            <div className='swap-off'>
              <div className='badge badge-outline'>Want</div>
            </div>
          </label>
          <label className='swap'>
            <input
              type='checkbox'
              checked={filterNotInterested}
              onChange={e => setFilterNotInterested(!filterNotInterested)}
            />
            <div className='swap-on'>
              <div className='badge badge-primary'>Not Interested</div>
            </div>
            <div className='swap-off'>
              <div className='badge badge-outline'>Not Interested</div>
            </div>
          </label>
        </div>
        <div className='flex justify-end gap-4'>
          <label className='swap'>
            <input type='checkbox' checked={filterPrivate} onChange={e => setFilterPrivate(!filterPrivate)} />
            <div className='swap-on'>
              <div className='badge badge-secondary'>Private</div>
            </div>
            <div className='swap-off'>
              <div className='badge badge-outline'>Private</div>
            </div>
          </label>
          <label className='swap'>
            <input type='checkbox' checked={filterLoaned} onChange={e => setFilterLoaned(!filterLoaned)} />
            <div className='swap-on'>
              <div className='badge badge-accent'>Loaned</div>
            </div>
            <div className='swap-off'>
              <div className='badge badge-outline'>Loaned</div>
            </div>
          </label>
        </div>
      </div>
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
                {game.isPrivate && <div className='badge badge-accent badge-sm'>Private</div>}
                {game.isLoaned && <div className='badge badge-secondary badge-sm'>Loaned</div>}
                {shelf === "All" && <div className='badge badge-sm font-bold'>{game.shelf}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Shelf
