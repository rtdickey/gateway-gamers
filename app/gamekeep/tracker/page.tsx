import Shelf from "@/app/components/gamekeep/shelf"
import TrackerTable from "@/app/components/gamekeep/trackerTable"
import { getLoanedGames } from "@/app/lib/actions"

const Page = async () => {
  const loanedGames = await getLoanedGames("1")

  return (
    <>
      <h1 className='text-2xl font-semibold'>Track Your Games</h1>
      <TrackerTable loanedGames={loanedGames} />
    </>
  )
}

export default Page
