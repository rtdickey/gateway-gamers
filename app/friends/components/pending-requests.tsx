"use client"

import { useTransition } from "react"
import { Friendship, respondToRequest, deleteFriendship } from "@/app/friends/actions"

interface PendingRequestsProps {
  incoming: Friendship[]
  outgoing: Friendship[]
}

const PendingRequests: React.FC<PendingRequestsProps> = ({ incoming, outgoing }) => {
  const [isPending, startTransition] = useTransition()

  const handleAccept = (friendshipId: string) => {
    startTransition(() => {
      respondToRequest(friendshipId, "accepted")
    })
  }

  const handleDecline = (friendshipId: string) => {
    startTransition(() => {
      respondToRequest(friendshipId, "declined")
    })
  }

  const handleWithdraw = (friendshipId: string) => {
    startTransition(() => {
      deleteFriendship(friendshipId)
    })
  }

  if (incoming.length === 0 && outgoing.length === 0) {
    return <p className='text-base-content/40 italic'>No pending requests.</p>
  }

  return (
    <div className='flex flex-col gap-6'>
      {incoming.length > 0 && (
        <div>
          <h3 className='font-semibold text-sm text-base-content/60 uppercase mb-2'>Incoming</h3>
          <ul className='flex flex-col gap-2'>
            {incoming.map(request => (
              <li key={request.id} className='flex items-center justify-between bg-base-200 rounded-lg px-4 py-3'>
                <div>
                  <p className='font-semibold'>{request.friend.display_name ?? request.friend.email}</p>
                  {request.friend.display_name && (
                    <p className='text-sm text-base-content/60'>{request.friend.email}</p>
                  )}
                </div>
                <div className='flex gap-2'>
                  <button
                    className='btn btn-sm btn-primary'
                    onClick={() => handleAccept(request.id)}
                    disabled={isPending}
                  >
                    Accept
                  </button>
                  <button
                    className='btn btn-sm btn-outline'
                    onClick={() => handleDecline(request.id)}
                    disabled={isPending}
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {outgoing.length > 0 && (
        <div>
          <h3 className='font-semibold text-sm text-base-content/60 uppercase mb-2'>Sent</h3>
          <ul className='flex flex-col gap-2'>
            {outgoing.map(request => (
              <li key={request.id} className='flex items-center justify-between bg-base-200 rounded-lg px-4 py-3'>
                <div>
                  <p className='font-semibold'>{request.friend.display_name ?? request.friend.email}</p>
                  {request.friend.display_name && (
                    <p className='text-sm text-base-content/60'>{request.friend.email}</p>
                  )}
                </div>
                <button
                  className='btn btn-sm btn-outline btn-warning'
                  onClick={() => handleWithdraw(request.id)}
                  disabled={isPending}
                >
                  Withdraw
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default PendingRequests
