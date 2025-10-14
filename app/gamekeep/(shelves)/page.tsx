import getUser from "@/app/actions"
import Shelf from "@/app/components/gamekeep/shelf"
import { getUserGames } from "@/app/lib/actions/user-game-actions"
import { signOut } from "@/app/actions"

const Page = async () => {
  const { user } = await getUser()

  const games = await getUserGames(user.id)

  return (
    <>
      <button onClick={signOut}>Sign Out</button>
      <Shelf games={games} />
    </>
  )
}

export default Page
