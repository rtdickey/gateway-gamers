"use client"

import { useState, useTransition } from "react"
import { useDebounce } from "use-debounce"
import { useEffect } from "react"
import { FriendProfile, searchUsers, sendFriendRequest } from "@/app/friends/actions"

const FindUsers: React.FC = () => {
  const [query, setQuery] = useState("")
  const [debouncedQuery] = useDebounce(query, 400)
  const [results, setResults] = useState<FriendProfile[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([])
      return
    }
    setIsSearching(true)
    searchUsers(debouncedQuery).then(users => {
      setResults(users)
      setIsSearching(false)
    })
  }, [debouncedQuery])

  const handleSendRequest = (addresseeId: string) => {
    startTransition(async () => {
      await sendFriendRequest(addresseeId)
      setSentIds(prev => new Set(prev).add(addresseeId))
    })
  }

  return (
    <div className='flex flex-col gap-4'>
      <label className='input input-bordered flex items-center gap-2'>
        <input
          type='text'
          className='grow'
          placeholder='Search by email or display name...'
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {isSearching && <span className='loading loading-spinner loading-xs' />}
      </label>
      {results.length > 0 && (
        <ul className='flex flex-col gap-2'>
          {results.map(user => (
            <li key={user.id} className='flex items-center justify-between bg-base-200 rounded-lg px-4 py-3'>
              <div>
                <p className='font-semibold'>{user.display_name ?? user.email}</p>
                {user.display_name && <p className='text-sm text-base-content/60'>{user.email}</p>}
              </div>
              <button
                className='btn btn-sm btn-primary'
                onClick={() => handleSendRequest(user.id)}
                disabled={isPending || sentIds.has(user.id)}
              >
                {sentIds.has(user.id) ? "Request Sent" : "Add Friend"}
              </button>
            </li>
          ))}
        </ul>
      )}
      {debouncedQuery.trim().length >= 2 && !isSearching && results.length === 0 && (
        <p className='text-base-content/40 italic'>No users found matching &quot;{debouncedQuery}&quot;.</p>
      )}
    </div>
  )
}

export default FindUsers
