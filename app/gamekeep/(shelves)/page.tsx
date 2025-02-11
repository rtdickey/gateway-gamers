import Shelf from "@/app/components/gamekeep/shelf"
import { getUserGames } from "@/app/lib/actions"

const Page = async () => {
  const games = await getUserGames("1")
  return <Shelf games={games} />
}

export default Page
