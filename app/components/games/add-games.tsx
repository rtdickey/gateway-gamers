import { getGamesFromBgg } from "@/app/games/actions"

const AddGames = () => {
  const handleOpenModal = () => {
    const modal = document.getElementById("addGamesModal") as HTMLDialogElement
    modal.showModal()
  }

  const handleCloseModal = () => {
    const modal = document.getElementById("addGamesModal") as HTMLDialogElement
    modal.close()
  }

  const handleAddGames = async (formData: FormData) => {
    await getGamesFromBgg(formData)
    handleCloseModal()
  }

  return (
    <>
      <button className='btn btn-primary' onClick={handleOpenModal}>
        Search by BGG ID
      </button>
      <dialog id='addGamesModal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Hello!</h3>
          <p className='py-4'>Press ESC key or click the button below to close</p>
          <form action={handleAddGames}>
            <input type='text' name='gameId' placeholder='Game Id' />
            <button className='btn' type='submit'>
              View Game Details
            </button>
          </form>
          {/* <form action='addGames'>
            <input type='text' name='game' placeholder='Game Id' />
            <button className='btn' type='submit'>
              Add Game
            </button>
          </form> */}
          <div className='modal-action'>
            <button className='btn' onClick={handleCloseModal}>
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}

export default AddGames
