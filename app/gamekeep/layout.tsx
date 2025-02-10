"use client"

import ShelfLinks from "../components/gamekeep/shelfLinks"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='flex w-full gap-4'>
      <ShelfLinks />
      <div className='flex-1'>
        {children}
        {/* {isFetching
            ? [...Array(10)].map((_, index) => <ShelfSkeleton key={index} shelfType={shelfType} />)
            : games.map(game => (
                <div className='card card-compact bg-base-100 shadow-xl'>
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
                      {shelfType === "All" && <div className='badge badge-outline'>{game.shelf}</div>}
                    </div>
                  </div>
                </div>
              ))} */}
      </div>
    </div>
  )
}

export default Layout
