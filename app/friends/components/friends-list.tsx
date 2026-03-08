"use client"

import { useTransition } from "react"
import { Friendship, deleteFriendship } from "@/app/friends/actions"

interface FriendsListProps {
  friends: Friendship[]
}

const FriendsList: React.FC<FriendsListProps> = ({ friends }) => {
  const [isPending, startTransition] = useTransition()

  const handleUnfriend = (friendshipId: string) => {
    startTransition(() => {
      deleteFriendship(friendshipId)
    })
  }

  if (friends.length === 0) {
    return <p className='text-base-content/40 italic'>No friends yet. Search for users below to get started!</p>
  }

  return (
    <ul className='flex flex-col gap-2'>
      {friends.map(friendship => (
        <li key={friendship.id} className='flex items-center justify-between bg-base-200 rounded-lg px-4 py-3'>
          <div>
            <p className='font-semibold'>{friendship.friend.display_name ?? friendship.friend.email}</p>
            {friendship.friend.display_name && (
              <p className='text-sm text-base-content/60'>{friendship.friend.email}</p>
            )}
          </div>
          <button
            className='btn btn-sm btn-outline btn-error'
            onClick={() => handleUnfriend(friendship.id)}
            disabled={isPending}
          >
            Unfriend
          </button>
        </li>
      ))}
    </ul>
  )
}

export default FriendsList
