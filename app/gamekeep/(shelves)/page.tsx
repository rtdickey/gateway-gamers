import getUser from "@/app/actions"
import Shelf from "@/app/components/gamekeep/shelf"
import { getUserGames } from "@/app/lib/actions/user-game-actions"

const Page = async () => {
  const { user } = await getUser()
  const games = await getUserGames(user.id)

  return (
    <>
      <Shelf games={games} />
    </>
  )
}

export default Page
