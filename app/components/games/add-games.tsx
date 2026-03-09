"use client"

import { useState } from "react"
import { addGameManually } from "@/app/games/actions"

const AddGames = () => {
  const [loading, setLoading] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  const handleOpenModal = () => {
    const modal = document.getElementById("addGamesModal") as HTMLDialogElement
    modal.showModal()
  }

  const handleCloseModal = () => {
    const modal = document.getElementById("addGamesModal") as HTMLDialogElement
    modal.close()
    setAddError(null)
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setAddError(null)
    const result = await addGameManually(formData)
    setLoading(false)
    if (result?.error) {
      setAddError(result.error)
      return
    }
    handleCloseModal()
  }

  return (
    <>
      <button className='btn btn-primary' onClick={handleOpenModal}>
        Add Game
      </button>
      <dialog id='addGamesModal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Add Game Manually</h3>

          {addError && <div className='alert alert-error mt-3 text-sm'>{addError}</div>}

          <form action={handleSubmit} className='flex flex-col gap-3 mt-4'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>
                  Title <span className='text-error'>*</span>
                </span>
              </label>
              <input
                type='text'
                name='title'
                placeholder='Game title'
                className='input input-bordered w-full'
                required
              />
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Year Published</span>
                </label>
                <input
                  type='number'
                  name='year_published'
                  placeholder='e.g. 2019'
                  className='input input-bordered w-full'
                  min={1900}
                  max={2100}
                />
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Publisher</span>
                </label>
                <input
                  type='text'
                  name='publisher'
                  placeholder='Publisher name'
                  className='input input-bordered w-full'
                />
              </div>
            </div>

            <div className='grid grid-cols-3 gap-3'>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Min Players</span>
                </label>
                <input
                  type='number'
                  name='min_players'
                  placeholder='1'
                  className='input input-bordered w-full'
                  min={1}
                />
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Max Players</span>
                </label>
                <input
                  type='number'
                  name='max_players'
                  placeholder='4'
                  className='input input-bordered w-full'
                  min={1}
                />
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Playing Time (min)</span>
                </label>
                <input
                  type='number'
                  name='playing_time'
                  placeholder='60'
                  className='input input-bordered w-full'
                  min={0}
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Min Age</span>
                </label>
                <input type='number' name='age' placeholder='10' className='input input-bordered w-full' min={0} />
              </div>

              <div className='form-control justify-end'>
                <label className='label cursor-pointer gap-2'>
                  <span className='label-text'>Expansion?</span>
                  <input type='hidden' name='is_expansion' value='false' />
                  <input type='checkbox' name='is_expansion' value='true' className='checkbox' />
                </label>
              </div>
            </div>

            <div className='modal-action mt-2'>
              <button type='button' className='btn' onClick={handleCloseModal}>
                Cancel
              </button>
              <button className='btn btn-primary' type='submit' disabled={loading}>
                {loading ? <span className='loading loading-spinner loading-sm' /> : "Add Game"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  )
}

export default AddGames
