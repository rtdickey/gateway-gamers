"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { BggGameDetail } from "@/app/lib/types/bgg"
import {
  searchBggGamesPageAction,
  getBggGameDetailsAction,
  addBggGameDetailsToShelf,
} from "@/app/lib/actions/user-game-actions"
import { getPageNumbers } from "@/app/lib/utils/pagination"

const SHELVES = ["Owned", "Want", "Not Interested"]

type Tab = "search" | "id"

const BggGameSearch: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [isWide, setIsWide] = useState(false)
  const [tab, setTab] = useState<Tab>("search")

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)")
    setIsWide(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsWide(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  // Lock page scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  // Search tab state
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<BggGameDetail[]>([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  // ID tab state
  const [bggIdInput, setBggIdInput] = useState("")

  // Shared state
  const [selectedBggId, setSelectedBggId] = useState<number | null>(null)
  const [details, setDetails] = useState<BggGameDetail | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [shelf, setShelf] = useState<string>("Owned")
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetAll = () => {
    setTab("search")
    setQuery("")
    setResults([])
    setSearched(false)
    setPage(0)
    setTotalPages(0)
    setTotalCount(0)
    setBggIdInput("")
    setSelectedBggId(null)
    setDetails(null)
    setShelf("Owned")
    setError(null)
  }

  const close = () => {
    setOpen(false)
    resetAll()
  }

  const switchTab = (t: Tab) => {
    setTab(t)
    setSelectedBggId(null)
    setDetails(null)
    setResults([])
    setSearched(false)
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
        setSearched(true)
      })
      .catch(() => {
        setResults([])
        setSearched(true)
      })
      .finally(() => setSearching(false))
  }

  const handleSearch = () => {
    if (!query.trim()) return
    setResults([])
    setSelectedBggId(null)
    setDetails(null)
    setSearched(false)
    setPage(0)
    setTotalPages(0)
    setTotalCount(0)
    fetchPage(query.trim(), 0)
  }

  const handlePageChange = (p: number) => {
    if (p < 0 || p >= totalPages || searching) return
    setSelectedBggId(null)
    setDetails(null)
    fetchPage(query, p)
  }

  const handleSelect = (result: BggGameDetail) => {
    setSelectedBggId(result.bggId)
    setDetails(result)
    setError(null)
  }

  const handleIdLookup = () => {
    const id = parseInt(bggIdInput.trim())
    if (isNaN(id) || id <= 0) {
      setError("Enter a valid BGG ID (positive number)")
      return
    }
    setError(null)
    setDetails(null)
    setSelectedBggId(null)
    setLoadingDetails(true)
    getBggGameDetailsAction(id)
      .then(d => {
        setDetails(d)
        setSelectedBggId(d.bggId)
      })
      .catch(() => {
        setError("Game not found. Check the BGG ID and try again.")
      })
      .finally(() => setLoadingDetails(false))
  }

  const handleAdd = async () => {
    if (!details) return
    setAdding(true)
    setError(null)
    try {
      await addBggGameDetailsToShelf(details, shelf)
      close()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to add game")
    } finally {
      setAdding(false)
    }
  }

  const hasDetail = details !== null || loadingDetails
  const showSideBySide = isWide && tab === "search" && results.length > 0 && hasDetail
  // Stacked detail view: narrow screen + game selected + there's a list to go back to
  const stackedDetailView = !showSideBySide && hasDetail && results.length > 0

  const resultsList = (
    <ul className='border border-base-300 rounded-box divide-y divide-base-200 overflow-y-auto flex-1 min-h-0'>
      {results.map(r => (
        <li
          key={r.bggId}
          className={`px-3 py-2 cursor-pointer flex items-center gap-3 transition-colors ${
            selectedBggId === r.bggId
              ? "bg-primary/10 border-l-2 border-l-primary"
              : "hover:bg-base-200 border-l-2 border-l-transparent"
          }`}
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
          <span className='flex-1 truncate text-sm'>{r.title}</span>
          <span className='text-xs opacity-50 shrink-0'>
            {r.yearPublished || "?"}
            {r.isExpansion ? " · Exp" : ""}
          </span>
        </li>
      ))}
    </ul>
  )

  const pagination =
    totalPages > 1 ? (
      <div className='shrink-0 flex items-center justify-center gap-1 mt-2 flex-wrap'>
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
    ) : null

  const resultCount = (
    <p className='shrink-0 text-xs opacity-40 text-center mt-1'>
      {totalCount} result{totalCount !== 1 ? "s" : ""} · page {page + 1} of {totalPages}
    </p>
  )

  const detailContent = hasDetail ? (
    <div className='border border-base-300 rounded-box p-4'>
      {loadingDetails ? (
        <div className='flex flex-col gap-3 animate-pulse'>
          <div className='flex gap-3'>
            <div className='h-24 w-20 rounded bg-base-300 shrink-0' />
            <div className='flex-1 space-y-2 pt-1'>
              <div className='h-4 bg-base-300 rounded w-3/4' />
              <div className='h-3 bg-base-300 rounded w-1/2' />
              <div className='h-3 bg-base-300 rounded w-2/3' />
            </div>
          </div>
          <div className='h-3 bg-base-300 rounded w-full mt-2' />
          <div className='h-8 bg-base-300 rounded w-1/3' />
        </div>
      ) : details ? (
        <>
          <div className='flex gap-3 items-start'>
            {details.thumbnail && (
              <Image
                src={details.thumbnail}
                alt={details.title}
                width={80}
                height={96}
                className='rounded object-contain shrink-0 h-24 w-20'
              />
            )}
            <div className='flex-1 min-w-0'>
              <p className='font-semibold leading-tight'>{details.title}</p>
              <p className='text-sm opacity-60 mt-0.5'>
                {details.yearPublished || "Unknown year"}
                {details.isExpansion ? " · Expansion" : ""}
              </p>
              <div className='flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm opacity-70'>
                <span>
                  👥 {details.minPlayers}–{details.maxPlayers} players
                </span>
                <span>⏱ {details.playingTime} min</span>
                <span>🎂 Age {details.age}+</span>
                {details.publisher && <span>🏢 {details.publisher}</span>}
              </div>
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
        </>
      ) : null}
    </div>
  ) : null

  const controls = (
    <div className='shrink-0 px-5 pt-4 flex flex-col gap-3'>
      <div className='tabs tabs-bordered'>
        <button className={`tab ${tab === "search" ? "tab-active" : ""}`} onClick={() => switchTab("search")}>
          Search
        </button>
        <button className={`tab ${tab === "id" ? "tab-active" : ""}`} onClick={() => switchTab("id")}>
          By BGG ID
        </button>
      </div>
      {tab === "search" && (
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
      )}
      {tab === "id" && (
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
            disabled={loadingDetails || !bggIdInput.trim()}
          >
            {loadingDetails ? <span className='loading loading-spinner loading-sm' /> : "Look Up"}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <>
      <button className='btn btn-secondary btn-sm' onClick={() => setOpen(true)}>
        Add from BGG
      </button>

      {/* Backdrop */}
      <div
        aria-hidden='true'
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
      />

      {/* Fly-in drawer */}
      <div
        role='dialog'
        aria-modal='true'
        aria-label='Add Game from BoardGameGeek'
        className={`fixed right-0 top-0 bottom-0 z-50 bg-base-100 shadow-2xl flex flex-col overflow-hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          width: showSideBySide ? "min(92vw, 860px)" : isWide ? "min(100vw, 480px)" : "100vw",
          transition: "transform 300ms ease-in-out, width 250ms ease-in-out",
        }}
      >
        {/* Header */}
        <div className='shrink-0 flex items-center justify-between px-5 py-4 border-b border-base-300'>
          {stackedDetailView ? (
            <button
              className='btn btn-ghost btn-sm gap-2 -ml-2'
              onClick={() => {
                setSelectedBggId(null)
                setDetails(null)
                setError(null)
              }}
            >
              ← Back to results
            </button>
          ) : (
            <h3 className='font-bold text-lg'>Add Game from BoardGameGeek</h3>
          )}
          <button className='btn btn-ghost btn-sm btn-circle' onClick={close} aria-label='Close'>
            ✕
          </button>
        </div>

        {/* Tabs + inputs — hidden when in stacked detail view */}
        {!stackedDetailView && controls}

        {/* Content — fills remaining height, one scroll per column */}
        {showSideBySide ? (
          // Side-by-side: each column independently scrollable, no nested overflow
          <div className='flex-1 min-h-0 flex gap-4 px-5 py-4 overflow-hidden'>
            {/* Results column */}
            {tab === "search" && (results.length > 0 || searching) && (
              <div className='w-[44%] shrink-0 flex flex-col min-h-0'>
                {searching ? (
                  <div className='flex items-center justify-center flex-1 opacity-50'>
                    <span className='loading loading-spinner loading-md' />
                  </div>
                ) : (
                  <>
                    {resultsList}
                    {pagination}
                    {resultCount}
                  </>
                )}
              </div>
            )}
            {/* Detail column */}
            {hasDetail && (
              <div className='flex-1 min-h-0 overflow-y-auto'>
                {detailContent}
                {error && <div className='alert alert-error text-sm mt-3'>{error}</div>}
              </div>
            )}
          </div>
        ) : stackedDetailView ? (
          // Stacked detail view: full-height, no list visible
          <div className='flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-4'>
            {detailContent}
            {error && <div className='alert alert-error text-sm'>{error}</div>}
          </div>
        ) : (
          // Stacked list view: controls already rendered above, show results + (for ID tab) detail
          <div className='flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-4'>
            {/* ID tab: detail appears inline below the input (no list to navigate to) */}
            {tab === "id" && detailContent}
            {tab === "id" && error && <div className='alert alert-error text-sm'>{error}</div>}

            {tab === "search" && searching && (
              <div className='flex items-center justify-center h-24 opacity-50'>
                <span className='loading loading-spinner loading-md' />
              </div>
            )}
            {tab === "search" && !searching && results.length > 0 && (
              <div className='flex flex-col gap-0'>
                <ul className='border border-base-300 rounded-box divide-y divide-base-200'>
                  {results.map(r => (
                    <li
                      key={r.bggId}
                      className='px-3 py-2 cursor-pointer flex items-center gap-3 hover:bg-base-200 border-l-2 border-l-transparent transition-colors'
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
                      <span className='flex-1 truncate text-sm'>{r.title}</span>
                      <span className='text-xs opacity-50 shrink-0'>
                        {r.yearPublished || "?"}
                        {r.isExpansion ? " · Exp" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
                {pagination}
                {resultCount}
              </div>
            )}
            {tab === "search" && searched && !searching && results.length === 0 && (
              <p className='text-sm opacity-50 text-center w-full py-8'>No results found for &ldquo;{query}&rdquo;</p>
            )}
            {tab === "search" && error && <div className='alert alert-error text-sm'>{error}</div>}
          </div>
        )}

        {/* Sticky footer — only show Add button when detail is visible */}
        {(showSideBySide || stackedDetailView || (tab === "id" && hasDetail)) && (
          <div className='shrink-0 flex justify-end gap-2 px-5 py-4 border-t border-base-300'>
            <button className='btn btn-ghost' onClick={close} disabled={adding}>
              Cancel
            </button>
            <button className='btn btn-primary' onClick={handleAdd} disabled={!details || adding || loadingDetails}>
              {adding ? <span className='loading loading-spinner loading-sm' /> : "Add to Keep"}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default BggGameSearch
