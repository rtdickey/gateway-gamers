"use client"

import Image from "next/image"

import { Game } from "@/app/lib/types/Game"
import { type Shelf as ShelfType } from "@/app/lib/types/Shelf"

import { useSearchParams } from "next/navigation"

interface ShelfProps {
  games: Game[]
}

const Shelf: React.FC<ShelfProps> = ({ games }) => {
  const params = useSearchParams()
  const shelfParam = params.get("shelf")
  const shelf = (shelfParam as ShelfType) ?? "All"

  const filterdGames = games.filter(game => shelf === "All" || game.shelf === shelf)

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
      {filterdGames.map(game => (
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

        // <div key={game.title} className='card card-compact bg-base-100 shadow-xl'>
        //   <figure>
        //     <Image src={game.thumbnail} alt={game.title} width={200} height={150} className='h-36' />
        //   </figure>
        //   <div className='card-body'>
        //     <h2 className='card-title'>{game.title}</h2>
        //     <p>Playing Time: {game.playingTime}m</p>
        //     <p>Player Count: {game.playerCount}</p>
        //     <p>Age: {game.age}</p>
        //     <div className='card-actions justify-end'>
        //       {game.isLoaned && <div className='badge badge-outline'>Loaned</div>}
        //       {shelfType === "All" && <div className='badge badge-outline'>{game.shelf}</div>}
        //     </div>
        //   </div>
        // </div>
      ))}
    </div>
  )
}

export default Shelf
