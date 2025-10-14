import getUser from "@/app/actions"
import TrackerTable from "@/app/components/gamekeep/tracker-table"
import { getLoanedGames } from "@/app/lib/actions/user-game-actions"

const Page = async () => {
  const { user } = await getUser()

  const loanedGames = await getLoanedGames("1")

  return (
    <>
      <TrackerTable loanedGames={loanedGames} />
    </>
  )
}

export default Page
