import getUser from "../actions"
import BackToTop from "../components/common/top-button"
import Catalog from "../components/games/catalog"
import { getGames } from "./games-actions"

const Games = async () => {
  const pageCount = 100
  const { user } = await getUser()
  const { games } = await getGames({ page: 0, size: pageCount })
  return (
    <>
      <Catalog initialGames={games} pageCount={pageCount} />
      <BackToTop />
    </>
  )
}

export default Games
