"use client"

import { useState } from "react"
import Image from "next/image"
import type { BggGameDetail } from "@/app/lib/types/bgg"
import {
  searchBggGamesPageAction,
  getBggGameDetailsAction,
  addBggGameDetailsToShelf,
} from "@/app/lib/actions/user-game-actions"
import { getPageNumbers } from "@/app/lib/utils/pagination"

const SHELVES = ["Owned", "Want", "Not Interested"]
const MODAL_ID = "bggSearchModal"

type Tab = "search" | "id"

const BggGameSearch: React.FC = () => {
  const [tab, setTab] = useState<Tab>("search")

  // Search tab state
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<BggGameDetail[]>([])
  const [searching, setSearching] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  // ID tab state
  const [bggIdInput, setBggIdInput] = useState("")
  const [lookingUp, setLookingUp] = useState(false)

  // Shared state
  const [selected, setSelected] = useState<{
    bggId: number
    name: string
    yearPublished: number | null
    type: "boardgame" | "boardgameexpansion"
  } | null>(null)
  const [details, setDetails] = useState<BggGameDetail | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [shelf, setShelf] = useState<string>("Owned")
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openModal = () => {
    const modal = document.getElementById(MODAL_ID) as HTMLDialogElement
    modal?.showModal()
  }

  const closeModal = () => {
    const modal = document.getElementById(MODAL_ID) as HTMLDialogElement
    modal?.close()
    setTab("search")
    setQuery("")
    setResults([])
    setPage(0)
    setTotalPages(0)
    setTotalCount(0)
    setBggIdInput("")
    setSelected(null)
    setDetails(null)
    setShelf("Owned")
    setError(null)
  }

  const switchTab = (t: Tab) => {
    setTab(t)
    setSelected(null)
    setDetails(null)
    setResults([])
    setPage(0)
    setTotalPages(0)
    setTotalCount(0)
    setError(null)
  }

  const fetchPage = (q: string, p: number) => {
    setSearching(true)
    searchBggGamesPageAction(q, p)
      .then(({ items, totalCount: tc, totalPages: tp }) => {
        setResults(items)
        setTotalCount(tc)
        setTotalPages(tp)
        setPage(p)
      })
      .catch(() => setResults([]))
      .finally(() => setSearching(false))
  }

  const handleSearch = () => {
    if (!query.trim()) return
    setResults([])
    setSelected(null)
    setDetails(null)
    setPage(0)
    setTotalPages(0)
    setTotalCount(0)
    fetchPage(query.trim(), 0)
  }

  const handlePageChange = (p: number) => {
    if (p < 0 || p >= totalPages || searching) return
    setSelected(null)
    setDetails(null)
    fetchPage(query, p)
  }

  const loadDetails = (bggId: number) => {
    setDetails(null)
    setLoadingDetails(true)
    getBggGameDetailsAction(bggId)
      .then(d => {
        setDetails(d)
        setSelected({
          bggId: d.bggId,
          name: d.title,
          yearPublished: d.yearPublished || null,
          type: d.isExpansion ? "boardgameexpansion" : "boardgame",
        })
      })
      .catch(() => {
        setDetails(null)
        setSelected(null)
      })
      .finally(() => setLoadingDetails(false))
  }

  const handleSelect = (result: BggGameDetail) => {
    setSelected({
      bggId: result.bggId,
      name: result.title,
      yearPublished: result.yearPublished || null,
      type: result.isExpansion ? "boardgameexpansion" : "boardgame",
    })
    setDetails(result)
  }

  const handleIdLookup = () => {
    const id = parseInt(bggIdInput.trim())
    if (isNaN(id) || id <= 0) {
      setError("Enter a valid BGG ID (positive number)")
      return
    }
    setError(null)
    setLookingUp(true)
    loadDetails(id)
    setLookingUp(false)
  }

  const handleAdd = async () => {
    if (!details) return
    setAdding(true)
    setError(null)
    try {
      await addBggGameDetailsToShelf(details, shelf)
      closeModal()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to add game")
    } finally {
      setAdding(false)
    }
  }

  return (
    <>
      <button className='btn btn-secondary btn-sm' onClick={openModal}>
        Add from BGG
      </button>

      <dialog id={MODAL_ID} className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box w-11/12 max-w-2xl'>
          <h3 className='font-bold text-lg mb-4'>Add Game from BoardGameGeek</h3>

          <div className='tabs tabs-bordered mb-4'>
            <button className={`tab ${tab === "search" ? "tab-active" : ""}`} onClick={() => switchTab("search")}>
              Search
            </button>
            <button className={`tab ${tab === "id" ? "tab-active" : ""}`} onClick={() => switchTab("id")}>
              By BGG ID
            </button>
          </div>

          {tab === "search" && (
            <>
              <div className='flex gap-2'>
                <input
                  type='text'
                  placeholder='Search for a game…'
                  className='input input-bordered flex-1'
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                />
                <button className='btn btn-secondary' onClick={handleSearch} disabled={searching || !query.trim()}>
                  {searching ? <span className='loading loading-spinner loading-sm' /> : "Search"}
                </button>
              </div>
            </>
          )}

          {tab === "id" && !selected && (
            <div className='flex gap-2'>
              <input
                type='number'
                placeholder='e.g. 174430'
                className='input input-bordered flex-1'
                value={bggIdInput}
                onChange={e => {
                  setBggIdInput(e.target.value)
                  setError(null)
                }}
                onKeyDown={e => e.key === "Enter" && handleIdLookup()}
              />
              <button
                className='btn btn-secondary'
                onClick={handleIdLookup}
                disabled={lookingUp || loadingDetails || !bggIdInput.trim()}
              >
                {loadingDetails ? <span className='loading loading-spinner loading-sm' /> : "Look Up"}
              </button>
            </div>
          )}

          {!selected && results.length > 0 && (
            <>
              <ul className='mt-3 border border-base-300 rounded-box max-h-96 overflow-y-auto'>
                {results.map(r => (
                  <li
                    key={r.bggId}
                    className='px-3 py-2 hover:bg-base-200 cursor-pointer flex items-center gap-3'
                    onClick={() => handleSelect(r)}
                  >
                    {r.thumbnail ? (
                      <Image
                        src={r.thumbnail}
                        alt={r.title}
                        width={40}
                        height={48}
                        className='rounded object-contain shrink-0 h-12 w-10'
                      />
                    ) : (
                      <div className='w-10 h-12 bg-base-300 rounded shrink-0' />
                    )}
                    <span className='flex-1 truncate'>{r.title}</span>
                    <span className='text-sm opacity-50 shrink-0'>
                      {r.yearPublished || "?"}
                      {r.isExpansion ? " · Expansion" : ""}
                    </span>
                  </li>
                ))}
              </ul>

              {totalPages > 1 && (
                <div className='flex items-center justify-center gap-1 mt-2 flex-wrap'>
                  <button
                    className='btn btn-xs btn-ghost'
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0 || searching}
                  >
                    «
                  </button>
                  {getPageNumbers(page, totalPages).map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className='px-1 opacity-50 text-sm select-none'>
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        className={`btn btn-xs ${page === p ? "btn-primary" : "btn-ghost"}`}
                        onClick={() => handlePageChange(p as number)}
                        disabled={searching}
                      >
                        {(p as number) + 1}
                      </button>
                    ),
                  )}
                  <button
                    className='btn btn-xs btn-ghost'
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages - 1 || searching}
                  >
                    »
                  </button>
                </div>
              )}
              <p className='text-xs opacity-40 text-center mt-1'>
                {totalCount} result{totalCount !== 1 ? "s" : ""} · page {page + 1} of {totalPages}
              </p>
            </>
          )}

          {selected && (
            <div className='mt-4 border border-base-300 rounded-box p-4'>
              <div className='flex justify-between items-start gap-3'>
                {loadingDetails && <div className='h-24 w-20 shrink-0 rounded bg-base-300 animate-pulse' />}
                {!loadingDetails && details?.thumbnail && (
                  <Image
                    src={details.thumbnail}
                    alt={details.title}
                    width={80}
                    height={96}
                    className='rounded object-contain shrink-0 h-24 w-20'
                  />
                )}
                <div className='flex-1 min-w-0'>
                  <div className='flex justify-between items-start gap-2'>
                    <p className='font-semibold leading-tight'>{selected.name}</p>
                    <button
                      className='btn btn-ghost btn-xs shrink-0'
                      onClick={() => {
                        setSelected(null)
                        setDetails(null)
                        setBggIdInput("")
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <p className='text-sm opacity-60 mt-0.5'>
                    {selected.yearPublished ?? "Unknown year"}
                    {selected.type === "boardgameexpansion" ? " · Expansion" : ""}
                  </p>
                  {details && (
                    <div className='flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm opacity-70'>
                      <span>
                        👥 {details.minPlayers}–{details.maxPlayers} players
                      </span>
                      <span>⏱ {details.playingTime} min</span>
                      <span>🎂 Age {details.age}+</span>
                      {details.publisher && <span>🏢 {details.publisher}</span>}
                    </div>
                  )}
                </div>
              </div>

              <div className='mt-4'>
                <p className='text-sm font-medium mb-2'>Add to shelf</p>
                <div className='flex flex-wrap gap-2'>
                  {SHELVES.map(s => (
                    <button
                      key={s}
                      className={`btn btn-sm ${shelf === s ? "btn-primary" : "btn-outline"}`}
                      onClick={() => setShelf(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && <div className='alert alert-error mt-3 text-sm'>{error}</div>}

          <div className='modal-action'>
            <button className='btn btn-ghost' onClick={closeModal} disabled={adding}>
              Cancel
            </button>
            <button className='btn btn-primary' onClick={handleAdd} disabled={!details || adding || loadingDetails}>
              {adding ? <span className='loading loading-spinner loading-sm' /> : "Add to Keep"}
            </button>
          </div>
        </div>

        <form method='dialog' className='modal-backdrop'>
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>
    </>
  )
}

export default BggGameSearch
