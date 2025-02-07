const GameKeep = () => {
  return (
    <div>
      <h1>GameKeep</h1>
      <p>
        GameKeep is a game library management system that allows users to keep track of their games, including the games
        they own, the games they want to buy, and the games they have played.
      </p>
      <div className='flex w-52 flex-col gap-4'>
        <div className='skeleton h-32 w-full'></div>
        <div className='skeleton h-4 w-28'></div>
        <div className='skeleton h-4 w-full'></div>
        <div className='skeleton h-4 w-full'></div>
      </div>
    </div>
  )
}

export default GameKeep
