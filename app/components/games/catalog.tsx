"use client"

import { ChangeEventHandler, useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"

import { useDebounce } from "use-debounce"

import Search from "@/app/components/common/search"
import { Game } from "@/app/lib/types/Game"
import { createClient } from "@/utils/supabase/client"
import AddGames from "./addGames"
import { addGameToShelf } from "@/app/lib/actions"

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
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [selectedShelf, setSelectedShelf] = useState<string | null>(null)

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const loadMoreGames = async (offset: number, searchTitle?: string) => {
    setIsLoading(true)
    setOffset(prev => prev + 1)
    const newGames = await fetchGames(offset, searchTitle ?? "")

    if (newGames && newGames.length < pageCount) {
      setIsLast(true)
    } else {
      setIsLast(false)
    }

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
      query = query.textSearch("title", searchTitle, {
        config: "english",
        type: "websearch",
      })
    }

    query = query.range(from, to).order("title", { ascending: true })
    const { data } = await query.returns<Game[]>()
    return data
  }

  const ref = useRef<HTMLDialogElement>(null)

  const handleShowModal = useCallback(
    (game: Game) => {
      setSelectedGame(game)
      ref.current?.showModal()
    },
    [ref, setSelectedGame],
  )

  const handleCloseModal = useCallback(() => {
    setSelectedGame(null)
    setSelectedShelf(null)
    ref.current?.close()
  }, [ref, setSelectedGame])

  const handleShelfSelect: ChangeEventHandler<HTMLSelectElement> = useCallback(
    e => {
      setSelectedShelf(e.target.value)
    },
    [setSelectedShelf],
  )

  const handleAddToShelf = useCallback(async () => {
    if (selectedGame?.id === undefined) return
    if (selectedShelf === null) return
    await addGameToShelf(selectedGame.id, selectedShelf)
    handleCloseModal()
  }, [selectedGame, selectedShelf, addGameToShelf, handleCloseModal])

  // const handleApplyFilter = useCallback(() => {
  //   setLoadedGames([])
  //   setOffset(0)
  //   loadMoreGames(0, debouncedSearch)
  // }, [debouncedSearch, offset])

  useEffect(() => {
    setLoadedGames([])
    setOffset(0)
    loadMoreGames(0, debouncedSearch)
  }, [debouncedSearch, offset])

  return (
    <>
      <AddGames />
      <Search onChange={handleOnChange} />
      {/* <button className='btn btn-primary' onClick={handleApplyFilter}>
        Apply Filter
      </button> */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4'>
        {loadedGames.map(game => (
          <div
            key={game.id}
            className='card card-compact bg-base-100 shadow-xl hover:shadow-cyan-500/50 hover:ring-2 hover:bg-base-300 hover:cursor-pointer'
            onClick={() => handleShowModal(game)}
          >
            <figure>
              {game.thumbnail && (
                <Image
                  src={game.thumbnail}
                  alt={game.title ?? "Board Game Thumbnail"}
                  width={200}
                  height={150}
                  className='h-40 w-full'
                />
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
              <p>Playing Time: {game.playing_time}m</p>
              <p>Player Count: {game.max_players}</p>
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
      <dialog id='game_details_modal' className='modal modal-bottom sm:modal-middle' ref={ref}>
        <div className='modal-box'>
          <figure style={{ width: "100%", height: "250px" }} className='flex justify-center'>
            {selectedGame?.image && (
              <Image
                src={selectedGame.image}
                alt={selectedGame.title ?? "Board Game Image"}
                className='w-auto h-60'
                width={200}
                height={150}
              />
            )}
            {!selectedGame?.image && (
              <div className='h-40 w-full bg-base-200 flex flex-col items-center justify-center text-2xl font-semibold'>
                <span>IMAGE</span>
                <span>NOT FOUND</span>
              </div>
            )}
          </figure>
          <div className='py-4'>
            <h2 className='font-bold'>{selectedGame?.title}</h2>
            <p>Playing Time: {selectedGame?.playing_time}m</p>
            <p>Player Count: {selectedGame?.max_players}</p>
            <p>Age: {selectedGame?.age}</p>
          </div>
          <div className='modal-action justify-between'>
            <select value={selectedShelf ?? ""} className='select' onChange={e => handleShelfSelect(e)}>
              <option disabled={true} value=''>
                Select a shelf
              </option>
              <option value='Owned'>Owned</option>
              <option value='Want'>Want</option>
              <option value='Not Interested'>Not Interested</option>
            </select>
            <div>
              <button className='btn btn-primary' onClick={handleAddToShelf} disabled={!selectedShelf}>
                Add
              </button>
              <button className='btn' onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
        <div className='modal-backdrop' onClick={handleCloseModal} />
      </dialog>
    </>
  )
}

export default Catalog
