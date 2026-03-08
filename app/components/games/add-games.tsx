"use client"

import { useState } from "react"
import { addGameByBggId, searchBggByTitle, BggSearchResult } from "@/app/games/actions"

const AddGames = () => {
  const [mode, setMode] = useState<"id" | "title">("id")
  const [searchResults, setSearchResults] = useState<BggSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [addingId, setAddingId] = useState<number | null>(null)
  const [addError, setAddError] = useState<string | null>(null)

  const handleOpenModal = () => {
    const modal = document.getElementById("addGamesModal") as HTMLDialogElement
    modal.showModal()
  }

  const handleCloseModal = () => {
    const modal = document.getElementById("addGamesModal") as HTMLDialogElement
    modal.close()
    setSearchResults([])
    setMode("id")
    setAddError(null)
  }

  const handleAddById = async (formData: FormData) => {
    const bggId = parseInt(formData.get("gameId") as string)
    if (isNaN(bggId)) return
    setLoading(true)
    setAddError(null)
    const result = await addGameByBggId(bggId)
    setLoading(false)
    if (result?.error) {
      setAddError(result.error)
      return
    }
    handleCloseModal()
  }

  const handleSearchByTitle = async (formData: FormData) => {
    const title = (formData.get("gameTitle") as string).trim()
    if (!title) return
    setLoading(true)
    const results = await searchBggByTitle(title)
    setSearchResults(results)
    setLoading(false)
  }

  const handleAddFromResults = async (bggId: number) => {
    setAddingId(bggId)
    setAddError(null)
    const result = await addGameByBggId(bggId)
    setAddingId(null)
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
          <h3 className='font-bold text-lg'>Add Game</h3>

          {addError && <div className='alert alert-error mt-3 text-sm'>{addError}</div>}

          <div className='tabs tabs-boxed my-4'>
            <button
              type='button'
              className={`tab ${mode === "id" ? "tab-active" : ""}`}
              onClick={() => {
                setMode("id")
                setSearchResults([])
              }}
            >
              By BGG ID
            </button>
            <button
              type='button'
              className={`tab ${mode === "title" ? "tab-active" : ""}`}
              onClick={() => {
                setMode("title")
                setSearchResults([])
              }}
            >
              By Title
            </button>
          </div>

          {mode === "id" ? (
            <form action={handleAddById} className='flex gap-2'>
              <input
                type='number'
                name='gameId'
                placeholder='BGG Game ID'
                className='input input-bordered flex-1'
                required
              />
              <button className='btn btn-primary' type='submit' disabled={loading}>
                {loading ? <span className='loading loading-spinner loading-sm' /> : "Add"}
              </button>
            </form>
          ) : (
            <>
              <form action={handleSearchByTitle} className='flex gap-2'>
                <input
                  type='text'
                  name='gameTitle'
                  placeholder='Search game title...'
                  className='input input-bordered flex-1'
                  required
                />
                <button className='btn btn-primary' type='submit' disabled={loading}>
                  {loading ? <span className='loading loading-spinner loading-sm' /> : "Search"}
                </button>
              </form>

              {searchResults.length > 0 && (
                <ul className='mt-4 max-h-64 overflow-y-auto flex flex-col gap-1'>
                  {searchResults.map(result => (
                    <li
                      key={result.bgg_id}
                      className='flex items-center justify-between px-3 py-2 rounded border border-base-300'
                    >
                      <span className='text-sm'>
                        {result.title}
                        {result.year_published && (
                          <span className='text-base-content/50 ml-2'>({result.year_published})</span>
                        )}
                      </span>
                      <button
                        type='button'
                        className='btn btn-xs btn-primary ml-3 shrink-0'
                        onClick={() => handleAddFromResults(result.bgg_id)}
                        disabled={addingId === result.bgg_id}
                      >
                        {addingId === result.bgg_id ? <span className='loading loading-spinner loading-xs' /> : "Add"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          <div className='modal-action'>
            <button type='button' className='btn' onClick={handleCloseModal}>
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}

export default AddGames
