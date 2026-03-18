"use client"

import { useCallback, useMemo, useState } from "react"
import Image from "next/image"
import { useDebounce } from "use-debounce"
import { UserGame } from "@/app/lib/types/user-game"
import { deleteGameFromShelf, toggleGamePrivacy } from "@/app/lib/actions/user-game-actions"
import BggGameSearch from "./bgg-game-search"

const SHELVES = ["All", "Owned", "Want", "Not Interested"] as const
type ShelfFilter = (typeof SHELVES)[number]

const SHELF_BADGE: Record<string, string> = {
  Owned: "badge-success",
  Want: "badge-info",
  "Not Interested": "badge-warning",
}

interface ShelfProps {
  games: UserGame[]
}

const TrashIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='w-4 h-4'>
    <path
      fillRule='evenodd'
      d='M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 3.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z'
      clipRule='evenodd'
    />
  </svg>
)

const LockIcon = ({ locked }: { locked: boolean }) =>
  locked ? (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor' className='w-3.5 h-3.5'>
      <path
        fillRule='evenodd'
        d='M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z'
        clipRule='evenodd'
      />
    </svg>
  ) : (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor' className='w-3.5 h-3.5'>
      <path d='M11.5 1A3.5 3.5 0 0 0 8 4.5V7H3.5A1.5 1.5 0 0 0 2 8.5v5A1.5 1.5 0 0 0 3.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 10.5 7H9.5V4.5a2 2 0 1 1 4 0v1a.75.75 0 0 0 1.5 0v-1A3.5 3.5 0 0 0 11.5 1Z' />
    </svg>
  )

const Shelf: React.FC<ShelfProps> = ({ games }) => {
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch] = useDebounce(searchValue.toLowerCase(), 300)
  const [filterShelf, setFilterShelf] = useState<ShelfFilter>("All")
  const [filterPrivate, setFilterPrivate] = useState(false)
  const [filterLoaned, setFilterLoaned] = useState(false)

  const filteredGames = useMemo(() => {
    return games
      .filter(ug => {
        const matchesSearch = ug.game.title?.toLowerCase().includes(debouncedSearch) ?? true
        const matchesShelf = filterShelf === "All" || ug.shelf === filterShelf
        const matchesPrivate = filterPrivate ? ug.is_private : true
        const matchesLoaned = filterLoaned ? ug.is_loaned : true
        return matchesSearch && matchesShelf && matchesPrivate && matchesLoaned
      })
      .sort((a, b) => (a.game.title ?? "").localeCompare(b.game.title ?? ""))
  }, [games, filterShelf, debouncedSearch, filterPrivate, filterLoaned])

  const handleDelete = useCallback(async (gameId: string) => {
    await deleteGameFromShelf(gameId)
  }, [])

  const handleTogglePrivacy = useCallback(async (userGameId: number, current: boolean) => {
    await toggleGamePrivacy(userGameId, !current)
  }, [])

  return (
    <div className='flex flex-col gap-5'>
      {/* Toolbar */}
      <div className='flex flex-col gap-2'>
        {/* Row 1: Search + Add */}
        <div className='flex gap-2'>
          <label className='input input-bordered input-sm flex items-center gap-2 flex-1'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='w-3.5 h-3.5 opacity-40 shrink-0'
            >
              <path
                fillRule='evenodd'
                d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
                clipRule='evenodd'
              />
            </svg>
            <input
              type='text'
              className='grow text-sm'
              placeholder='Search your keep…'
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <button
                className='btn btn-ghost btn-xs p-0 min-h-0 h-auto opacity-50 hover:opacity-100'
                onClick={() => setSearchValue("")}
              >
                ✕
              </button>
            )}
          </label>
          <BggGameSearch />
        </div>

        {/* Row 2: All filters in one line */}
        <div className='flex flex-wrap items-center gap-2'>
          {/* Shelf selector — scrollable on mobile */}
          <div className='flex gap-1 overflow-x-auto pb-0.5 flex-nowrap sm:flex-wrap'>
            {SHELVES.map(s => (
              <button
                key={s}
                className={`btn btn-xs shrink-0 ${filterShelf === s ? "btn-primary" : "btn-ghost border border-base-300"}`}
                onClick={() => setFilterShelf(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className='w-px h-4 bg-base-300' />

          {/* Flag toggles */}
          <button
            className={`btn btn-xs gap-1 ${filterPrivate ? "btn-secondary" : "btn-ghost border border-base-300"}`}
            onClick={() => setFilterPrivate(v => !v)}
            title='Show only private games'
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor' className='w-3 h-3'>
              <path
                fillRule='evenodd'
                d='M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z'
                clipRule='evenodd'
              />
            </svg>
            Private
          </button>

          <button
            className={`btn btn-xs gap-1 ${filterLoaned ? "btn-accent" : "btn-ghost border border-base-300"}`}
            onClick={() => setFilterLoaned(v => !v)}
            title='Show only loaned games'
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor' className='w-3 h-3'>
              <path d='M1 9.5A3.5 3.5 0 0 0 4.5 13H12a3 3 0 0 0 .917-5.857 2.503 2.503 0 0 0-3.198-3.019 3.5 3.5 0 0 0-6.628 2.171A3.5 3.5 0 0 0 1 9.5Z' />
            </svg>
            Loaned
          </button>

          {/* Spacer + game count */}
          <span className='ml-auto text-xs opacity-40 tabular-nums'>
            {filteredGames.length} {filteredGames.length === 1 ? "game" : "games"}
          </span>
        </div>
      </div>

      {/* Grid */}
      {filteredGames.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-24 gap-3 opacity-50'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-12 h-12'>
            <path d='M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z' />
            <path d='m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z' />
            <path d='m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z' />
          </svg>
          <p className='text-base font-medium'>No games found</p>
          <p className='text-sm'>Try adjusting your filters or add a game from BGG.</p>
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4'>
          {filteredGames.map(ug => (
            <div
              key={ug.game_id}
              className='group card card-compact bg-base-200 border border-base-300 shadow-sm hover:shadow-md hover:border-base-content/20 transition-all duration-200'
            >
              {/* Thumbnail */}
              <figure className='relative bg-base-200 h-36 overflow-hidden'>
                {ug.game.thumbnail ? (
                  <Image
                    src={ug.game.thumbnail}
                    alt={ug.game.title ?? "Board Game"}
                    fill
                    className='object-cover'
                    sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center opacity-30'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='w-10 h-10'
                    >
                      <path d='M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z' />
                    </svg>
                  </div>
                )}
                {/* Action buttons — always visible on touch, hover-only on pointer devices */}
                <div className='hover-reveal absolute top-1.5 right-1.5 flex gap-1'>
                  <button
                    className={`btn btn-xs ${ug.is_private ? "btn-secondary" : "btn-ghost bg-base-100/80"}`}
                    onClick={() => handleTogglePrivacy(ug.id, !!ug.is_private)}
                    title={ug.is_private ? "Make public" : "Make private"}
                  >
                    <LockIcon locked={!!ug.is_private} />
                  </button>
                  <button
                    className='btn btn-error btn-xs'
                    onClick={() => handleDelete(ug.game_id)}
                    title='Remove from keep'
                  >
                    <TrashIcon />
                  </button>
                </div>
                {/* Status badges */}
                <div className='absolute bottom-1.5 left-1.5 flex gap-1'>
                  {ug.is_private && <span className='badge badge-secondary badge-xs'>Private</span>}
                  {ug.is_loaned && <span className='badge badge-accent badge-xs'>Loaned</span>}
                </div>
              </figure>

              {/* Body */}
              <div className='card-body gap-1 p-3'>
                <h2 className='font-semibold text-sm leading-tight line-clamp-2'>{ug.game.title}</h2>
                <div className='flex flex-wrap gap-x-3 gap-y-0.5 text-xs opacity-60 mt-0.5'>
                  {ug.game.max_players != null && ug.game.max_players > 0 && (
                    <span>
                      👥 {ug.game.min_players}–{ug.game.max_players}
                    </span>
                  )}
                  {ug.game.playing_time != null && ug.game.playing_time > 0 && <span>⏱ {ug.game.playing_time}m</span>}
                  {ug.game.age != null && ug.game.age > 0 && <span>🎂 {ug.game.age}+</span>}
                </div>
                {ug.shelf && (
                  <div className='mt-1'>
                    <span className={`badge badge-xs font-medium ${SHELF_BADGE[ug.shelf] ?? "badge-ghost"}`}>
                      {ug.shelf}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Shelf
