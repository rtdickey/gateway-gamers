"use client"

import { ChangeEventHandler, useCallback, useRef, useState } from "react"
import Image from "next/image"
import { useDebounce } from "use-debounce"
import { Game } from "@/app/lib/types/game"
import { createClient } from "@/utils/supabase/client"
import AddGames from "./add-games"
import { addGameToShelf } from "@/app/lib/actions/user-game-actions"

interface CatalogProps {
  initialGames: Game[]
  pageCount?: number
}

const NoImagePlaceholder = () => (
  <div className='absolute inset-0 flex flex-col items-center justify-center bg-base-200 text-base-content/30 gap-2'>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='w-10 h-10'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={1}
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7' />
    </svg>
    <span className='text-xs font-medium tracking-wide uppercase'>No Image</span>
  </div>
)

const Catalog: React.FC<CatalogProps> = ({ initialGames, pageCount = 100 }) => {
  const [loadedGames, setLoadedGames] = useState<Game[]>(initialGames)
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch] = useDebounce(searchValue.toLowerCase(), 500)
  const [isLast, setIsLast] = useState(false)
  const [offset, setOffset] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [selectedShelf, setSelectedShelf] = useState<string | null>(null)

  const detailsRef = useRef<HTMLDialogElement>(null)

  const fetchGames = async (page: number, searchTitle: string) => {
    const supabase = createClient()
    const from = page * pageCount
    const to = from + pageCount - 1
    let query = supabase.from("games").select("*")
    if (searchTitle) {
      query = query.textSearch("title", searchTitle, { config: "english", type: "websearch" })
    }
    const { data } = await query.range(from, to).order("title", { ascending: true }).returns<Game[]>()
    return data
  }

  const loadGames = async (page: number, search: string, append: boolean) => {
    setIsLoading(true)
    const newGames = await fetchGames(page, search)
    setIsLast(!newGames || newGames.length < pageCount)
    if (newGames) {
      setLoadedGames(prev => (append ? [...prev, ...newGames] : newGames))
    }
    setIsLoading(false)
  }

  const handleSearch = useCallback(() => {
    setOffset(1)
    loadGames(0, debouncedSearch, false)
  }, [debouncedSearch])

  const handleClear = useCallback(() => {
    setSearchValue("")
    setOffset(1)
    loadGames(0, "", false)
  }, [])

  const handleLoadMore = useCallback(() => {
    loadGames(offset, debouncedSearch, true)
    setOffset(prev => prev + 1)
  }, [offset, debouncedSearch])

  const handleShowModal = useCallback((game: Game) => {
    setSelectedGame(game)
    setSelectedShelf(null)
    detailsRef.current?.showModal()
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedGame(null)
    setSelectedShelf(null)
    detailsRef.current?.close()
  }, [])

  const handleShelfSelect: ChangeEventHandler<HTMLSelectElement> = useCallback(e => {
    setSelectedShelf(e.target.value)
  }, [])

  const handleAddToShelf = useCallback(async () => {
    if (!selectedGame?.id || !selectedShelf) return
    await addGameToShelf(selectedGame.id, selectedShelf)
    handleCloseModal()
  }, [selectedGame, selectedShelf, handleCloseModal])

  const formatPlayers = (game: Game) => {
    if (!game.min_players && !game.max_players) return null
    if (game.min_players === game.max_players) return `${game.min_players}p`
    return `${game.min_players}–${game.max_players}p`
  }

  const formatPlayersLong = (game: Game) => {
    if (!game.min_players && !game.max_players) return "—"
    if (game.min_players === game.max_players) return `${game.min_players}`
    return `${game.min_players}–${game.max_players}`
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold'>Game Library</h1>
          <p className='text-base-content/50 text-sm mt-1'>
            {loadedGames.length} game{loadedGames.length !== 1 ? "s" : ""} loaded
          </p>
        </div>
        <AddGames />
      </div>

      {/* Search Bar */}
      <div className='flex gap-2'>
        <label className='input input-bordered flex items-center gap-2 flex-1'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 16 16'
            fill='currentColor'
            className='h-4 w-4 shrink-0 opacity-50'
          >
            <path
              fillRule='evenodd'
              d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
              clipRule='evenodd'
            />
          </svg>
          <input
            type='text'
            className='grow'
            placeholder='Search games...'
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
          {searchValue && (
            <button type='button' onClick={handleClear} className='opacity-40 hover:opacity-100 transition-opacity'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor' className='h-4 w-4'>
                <path d='M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z' />
              </svg>
            </button>
          )}
        </label>
        <button className='btn btn-primary' onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Game Grid */}
      {loadedGames.length === 0 && !isLoading ? (
        <div className='flex flex-col items-center justify-center py-24 text-center gap-3'>
          <span className='text-5xl'>🎲</span>
          <h3 className='text-xl font-semibold'>No games found</h3>
          <p className='text-base-content/50 text-sm max-w-sm'>
            {searchValue
              ? `No results for "${searchValue}". Try a different title or add the game manually.`
              : "The library is empty. Add the first game to get started!"}
          </p>
          {searchValue && (
            <button className='btn btn-ghost btn-sm mt-1' onClick={handleClear}>
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
          {loadedGames.map(game => (
            <div
              key={game.id}
              className='card bg-base-100 shadow hover:shadow-lg hover:shadow-primary/20 hover:ring-1 hover:ring-primary cursor-pointer transition-all duration-200 group overflow-hidden'
              onClick={() => handleShowModal(game)}
            >
              <figure className='relative aspect-[3/4] bg-base-200 overflow-hidden'>
                {game.thumbnail ? (
                  <Image
                    src={game.thumbnail}
                    alt={game.title ?? "Board Game"}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                ) : (
                  <NoImagePlaceholder />
                )}
                {game.is_expansion && (
                  <div className='absolute top-2 left-2'>
                    <span className='badge badge-secondary badge-sm shadow'>Expansion</span>
                  </div>
                )}
              </figure>
              <div className='card-body p-3 gap-0.5'>
                <h2 className='font-semibold text-sm leading-tight line-clamp-2'>{game.title}</h2>
                <p className='text-xs text-base-content/50 mt-1 flex flex-wrap gap-x-1.5'>
                  {formatPlayers(game) && <span>{formatPlayers(game)}</span>}
                  {game.playing_time > 0 && (
                    <span>
                      {formatPlayers(game) ? "·" : ""} {game.playing_time}m
                    </span>
                  )}
                  {game.year_published > 0 && <span>· {game.year_published}</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      <div className='flex flex-col items-center gap-2 py-4'>
        {isLoading && (
          <div className='flex items-center gap-2 text-base-content/50 text-sm'>
            <span className='loading loading-spinner loading-sm' />
            Loading games...
          </div>
        )}
        {!isLoading && !isLast && loadedGames.length > 0 && (
          <button className='btn btn-outline btn-wide' onClick={handleLoadMore}>
            Load More
          </button>
        )}
        {!isLoading && isLast && loadedGames.length > 0 && (
          <p className='text-base-content/40 text-sm'>All {loadedGames.length} games loaded</p>
        )}
      </div>

      {/* Game Detail Modal */}
      <dialog id='game_details_modal' className='modal modal-bottom sm:modal-middle' ref={detailsRef}>
        <div className='modal-box max-w-md'>
          {selectedGame && (
            <>
              <div className='flex gap-4 items-start'>
                <div className='relative w-28 h-36 shrink-0 rounded-xl overflow-hidden bg-base-200'>
                  {selectedGame.image ? (
                    <Image
                      src={selectedGame.image}
                      alt={selectedGame.title ?? "Board Game"}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <NoImagePlaceholder />
                  )}
                </div>
                <div className='flex-1 min-w-0 pt-1'>
                  <h3 className='font-bold text-lg leading-tight'>{selectedGame.title}</h3>
                  {selectedGame.publisher && (
                    <p className='text-sm mt-1 text-base-content/60'>{selectedGame.publisher}</p>
                  )}
                  {selectedGame.year_published > 0 && (
                    <p className='text-base-content/40 text-sm mt-0.5'>{selectedGame.year_published}</p>
                  )}
                  {selectedGame.is_expansion && <span className='badge badge-secondary badge-sm mt-2'>Expansion</span>}
                </div>
              </div>

              <div className='grid grid-cols-3 gap-3 mt-5 text-center'>
                <div className='bg-base-200 rounded-xl p-3'>
                  <p className='text-xs text-base-content/40 uppercase tracking-wide font-medium'>Players</p>
                  <p className='font-bold text-sm mt-1'>{formatPlayersLong(selectedGame)}</p>
                </div>
                <div className='bg-base-200 rounded-xl p-3'>
                  <p className='text-xs text-base-content/40 uppercase tracking-wide font-medium'>Time</p>
                  <p className='font-bold text-sm mt-1'>
                    {selectedGame.playing_time > 0 ? `${selectedGame.playing_time}m` : "—"}
                  </p>
                </div>
                <div className='bg-base-200 rounded-xl p-3'>
                  <p className='text-xs text-base-content/40 uppercase tracking-wide font-medium'>Min Age</p>
                  <p className='font-bold text-sm mt-1'>{selectedGame.age > 0 ? `${selectedGame.age}+` : "—"}</p>
                </div>
              </div>
            </>
          )}

          <div className='modal-action justify-between mt-5 items-center'>
            <select
              value={selectedShelf ?? ""}
              className='select select-bordered select-sm'
              onChange={handleShelfSelect}
            >
              <option disabled value=''>
                Add to shelf…
              </option>
              <option value='Owned'>Owned</option>
              <option value='Want'>Want</option>
              <option value='Not Interested'>Not Interested</option>
            </select>
            <div className='flex gap-2'>
              <button className='btn btn-primary btn-sm' onClick={handleAddToShelf} disabled={!selectedShelf}>
                Add to Shelf
              </button>
              <button className='btn btn-sm' onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
        <div className='modal-backdrop' onClick={handleCloseModal} />
      </dialog>
    </div>
  )
}

export default Catalog
