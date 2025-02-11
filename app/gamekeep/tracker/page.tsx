import Shelf from "@/app/components/gamekeep/shelf"
import TrackerTable from "@/app/components/gamekeep/trackerTable"
import { getLoanedGames } from "@/app/lib/actions"

const Page = async () => {
  const loanedGames = await getLoanedGames("1")

  return (
    <>
      <TrackerTable loanedGames={loanedGames} />
    </>
  )
}

export default Page
