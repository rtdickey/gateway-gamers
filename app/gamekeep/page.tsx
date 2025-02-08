import Shelf from "@/app/components/gamekeep/shelf"

const games = [
  {
    title: "Space Base",
    status: "owned",
    playingTime: 60,
    playerCount: "2-5",
    age: "14+",
  },
  {
    title: "Wingspan",
    status: "owned",
    playingTime: 70,
    playerCount: "1-5",
    age: "10+",
  },
  {
    title: "Everdell",
    status: "owned",
    playingTime: 80,
    playerCount: "1-4",
    age: "13+",
  },
  {
    title: "Terraforming Mars",
    status: "owned",
    playingTime: 120,
    playerCount: "1-5",
    age: "12+",
  },
]

const GameKeep = () => {
  return (
    <div>
      <h1>GameKeep</h1>
      <p>
        GameKeep is a game library management system that allows users to keep track of their games, including the games
        they own, the games they want to buy, and the games they have played.
      </p>
      <Shelf games={games} />
    </div>
  )
}

export default GameKeep
