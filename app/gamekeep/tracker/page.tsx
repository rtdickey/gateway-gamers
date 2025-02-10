import Shelf from "@/app/components/gamekeep/shelf"
import { getLoanedGames } from "@/app/lib/actions"

const Page = async () => {
  const loanedGames = await getLoanedGames("1")
  const borrowedGames = loanedGames.filter(game => game.borrowerId === "1").map(info => info.game)
  const loanedOutGames = loanedGames.filter(game => game.ownerId === "1").map(info => info.game)

  return (
    <div className='flex gap-4'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-2xl font-semibold'>Borrowed Games</h1>
        <Shelf games={borrowedGames} />
      </div>
      <div className='flex flex-col gap-4'>
        <h1 className='text-2xl font-semibold'>Loaned Out Games</h1>
        <Shelf games={loanedOutGames} />
      </div>
    </div>
  )
}

export default Page
