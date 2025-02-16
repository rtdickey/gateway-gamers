import getUser from "../actions"
import BackToTop from "../components/common/top_button"
import Shelf from "../components/games/shelf"
import { getGames, PaginationProps } from "./actions"

const Games = async () => {
  const { user } = await getUser()

  const pagination: PaginationProps = { page: 0, size: 100 }
  const { totalGames, totalPages, games } = await getGames(pagination)

  return (
    <>
      <Shelf />
      <BackToTop />
    </>
  )
}

export default Games
