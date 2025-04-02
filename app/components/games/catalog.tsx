"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"

import { useDebounce } from "use-debounce"

import Search from "@/app/components/common/search"
import { Game } from "@/app/lib/types/Game"
import { createClient } from "@/utils/supabase/client"
import AddGames from "./addGames"

interface CatalogProps {
  initialGames: Game[]
  pageCount?: number
}

const Catalog: React.FC<CatalogProps> = ({ initialGames, pageCount = 100 }) => {
  const [loadedGames, setLoadedGames] = useState<Game[]>(initialGames)
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch] = useDebounce(searchValue.toLowerCase(), 500)
  const [isLast, setIsLast] = useState(false)
  const [offset, setOffset] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const loadMoreGames = async (offset: number, searchTitle?: string) => {
    setIsLoading(true)
    // Every time we fetch, we want to increase
    // the offset to load fresh tickets
    setOffset(prev => prev + 1)
    const newGames = await fetchGames(offset, searchTitle ?? "")

    if (newGames && newGames.length < pageCount) {
      setIsLast(true)
    } else {
      setIsLast(false)
    }

    // Merge new tickets with all previously loaded
    if (newGames) {
      setLoadedGames(prevGames => [...prevGames, ...newGames])
    }
    setIsLoading(false)
  }

  const fetchGames = async (offset: number, searchTitle: string) => {
    const supabase = createClient()
    const from = offset * pageCount
    const to = from + pageCount - 1

    let query = supabase!.from("games").select("*")

    if (searchTitle) {
      query = query.ilike("title", `%${searchTitle}%`)
    }

    query = query.range(from, to).order("title", { ascending: true })
    const { data } = await query.returns<Game[]>()
    return data
  }

  const handleApplyFilter = useCallback(() => {
    setLoadedGames([])
    setOffset(0)
    loadMoreGames(0, debouncedSearch)
  }, [debouncedSearch, offset])

  return (
    <>
      <AddGames />
      <Search onChange={handleOnChange} />
      <button className='btn btn-primary' onClick={handleApplyFilter}>
        Apply Filter
      </button>
      <div
        // ref={containerRef}
        className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4'
      >
        {loadedGames.map(game => (
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
      <div className='flex justify-center'>
        {!isLast && !isLoading && (
          <button
            className='btn btn-primary'
            onClick={() => loadMoreGames(offset, debouncedSearch)}
            disabled={isLoading}
          >
            Load More
          </button>
        )}
        {isLoading && <div>Loading more games...</div>}
        {isLast && (
          <div>All games have been loaded. Still haven't found what you were looking for? Add your game here!</div>
        )}
      </div>
    </>
  )
}

export default Catalog
