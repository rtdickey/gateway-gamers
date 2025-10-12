"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"

import { useDebounce } from "use-debounce"

import { UserGame } from "@/app/lib/types/user-game"
import Search from "@/app/components/common/search"
import { deleteGameFromShelf } from "@/app/lib/actions/user-game-actions"
import ShelfTab from "./shelf-tab"

interface ShelfProps {
  games: UserGame[]
}

const Shelf: React.FC<ShelfProps> = ({ games }) => {
  //const [filteredGames, setFilteredGames] = useState(games)
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch] = useDebounce(searchValue.toLowerCase(), 500)

  const [filterShelf, setFilterShelf] = useState<string | null>(null)
  //const [filterOwned, setFilterOwned] = useState(true)
  //const [filterWant, setFilterWant] = useState(false)
  //const [filterNotInterested, setFilterNotInterested] = useState(false)
  const [filteredShelfCount, setFilteredShelfCount] = useState(1)

  const [filterPrivate, setFilterPrivate] = useState(false)
  const [filterLoaned, setFilterLoaned] = useState(false)

  const filteredGames = useMemo(() => {
    let filterGames = games.filter(userGame => {
      return (
        userGame.game.title?.toLowerCase().includes(debouncedSearch) &&
        (filterPrivate ? userGame.is_private : true) &&
        (filterLoaned ? userGame.is_loaned : true)
      )
    })
    if (filterShelf) {
      filterGames = filterGames.filter(userGame => userGame.shelf === filterShelf)
    }
    return filterGames.sort((a, b) => {
      const titleA = a.game.title || ""
      const titleB = b.game.title || ""
      return titleA.localeCompare(titleB)
    })
  }, [games, filterShelf, debouncedSearch, filterPrivate, filterLoaned])

  // useEffect(() => {
  //   const filterGames = games.filter(userGame => {
  //     return (
  //       ((filterOwned && userGame.shelf === "Owned") ||
  //         (filterWant && userGame.shelf === "Want") ||
  //         (filterNotInterested && userGame.shelf === "Not Interested")) &&
  //       userGame.game.title?.toLowerCase().includes(debouncedSearch) &&
  //       (filterPrivate ? userGame.is_private : true) &&
  //       (filterLoaned ? userGame.is_loaned : true)
  //     )
  //   })
  //   setFilteredGames(
  //     filterGames.sort((a, b) => {
  //       const titleA = a.game.title || ""
  //       const titleB = b.game.title || ""
  //       return titleA.localeCompare(titleB)
  //     }),
  //   )
  // }, [
  //   filterOwned,
  //   filterWant,
  //   filterNotInterested,
  //   filterPrivate,
  //   filterLoaned,
  //   debouncedSearch,
  //   setFilteredGames,
  //   games,
  // ])

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  // const handleFilterOwned = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (filterOwned && filteredShelfCount === 1) return
  //   setFilteredShelfCount(filteredShelfCount + (filterOwned ? -1 : 1))
  //   setFilterOwned(!filterOwned)
  // }

  // const handleFilterWant = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (filterWant && filteredShelfCount === 1) return
  //   setFilteredShelfCount(filteredShelfCount + (filterWant ? -1 : 1))
  //   setFilterWant(!filterWant)
  // }

  // const handleFilterNotInterested = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (filterNotInterested && filteredShelfCount === 1) return
  //   setFilteredShelfCount(filteredShelfCount + (filterNotInterested ? -1 : 1))
  //   setFilterNotInterested(!filterNotInterested)
  // }

  const handleDeleteGameFromShelf = useCallback(
    async (gameId: string) => {
      await deleteGameFromShelf(gameId)
    },
    [deleteGameFromShelf],
  )

  return (
    <>
      <Search onChange={handleOnChange} value={searchValue} />
      <div className='flex flex-col justify-start md:flex-row md:justify-between gap-4'>
        <div className='flex justify-start gap-4'>
          <ShelfTab shelf={null} isSelected={filterShelf === null} setFilterShelf={setFilterShelf} />
          <ShelfTab shelf='Owned' isSelected={filterShelf === "Owned"} setFilterShelf={setFilterShelf} />
          <ShelfTab shelf='Want' isSelected={filterShelf === "Want"} setFilterShelf={setFilterShelf} />
          <ShelfTab
            shelf='Not Interested'
            isSelected={filterShelf === "Not Interested"}
            setFilterShelf={setFilterShelf}
          />
        </div>
        <div className='flex justify-start md:justify-end gap-4'>
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
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4'>
        {filteredGames.map(userGame => (
          <div key={userGame.game_id} className='card card-compact bg-base-100 shadow-xl'>
            <figure>
              {userGame.game.thumbnail && (
                <Image
                  src={userGame.game.thumbnail}
                  alt={userGame.game.title ?? "Board Game Thumbnail"}
                  width={200}
                  height={150}
                  className='h-40 w-full'
                />
              )}
            </figure>
            <div className='card-body'>
              <h2 className='card-title'>{userGame.game.title}</h2>
              <p>Playing Time: {userGame.game.playing_time}m</p>
              <p>Player Count: {userGame.game.max_players}</p>
              <p>Age: {userGame.game.age}</p>
              <div className='card-actions justify-end'>
                {userGame.is_private && <div className='badge badge-accent badge-sm'>Private</div>}
                {userGame.is_loaned && <div className='badge badge-secondary badge-sm'>Loaned</div>}
                <div className='badge badge-sm font-bold'>{userGame.shelf}</div>
              </div>
              <div className='card-footer'>
                <button className='btn btn-danger btn-sm' onClick={() => handleDeleteGameFromShelf(userGame.game_id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Shelf
