"use client"

export interface Game {
  title: string
  status: string
  playingTime: number
  playerCount: string
  age: string
}

interface ShelfProps {
  games: Game[]
}

const Shelf: React.FC<ShelfProps> = ({ games }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-6 gap-4'>
      {games.map(game =>
        games.map(game =>
          games && false ? (
            <div key={game.title}>
              <h2>{game.title}</h2>
              <p>Status: {game.status}</p>
              <p>Playing Time: {game.playingTime} minutes</p>
              <p>Player Count: {game.playerCount}</p>
              <p>Age: {game.age}</p>
            </div>
          ) : (
            <div key={game.title} className='flex flex-col gap-2'>
              <div className='skeleton h-32 w-full'></div>
              <div className='skeleton h-4 w-28'></div>
              <div className='skeleton h-4 w-full'></div>
              <div className='skeleton h-4 w-full'></div>
            </div>
          ),
        ),
      )}
    </div>
  )
}

export default Shelf
