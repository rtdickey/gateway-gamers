import getUser from "@/app/actions"
import { getFriends, getPendingRequests, getSentRequests } from "@/app/friends/actions"
import FriendsList from "./components/friends-list"
import PendingRequests from "./components/pending-requests"
import FindUsers from "./components/find-users"

const FriendsPage = async () => {
  const { user } = await getUser()

  const [friends, incoming, outgoing] = await Promise.all([
    getFriends(user.id),
    getPendingRequests(user.id),
    getSentRequests(user.id),
  ])

  const pendingCount = incoming.length

  return (
    <div className='flex flex-col gap-8 max-w-2xl'>
      <h1 className='text-2xl font-bold'>Friends</h1>

      {/* Pending Requests */}
      {(incoming.length > 0 || outgoing.length > 0) && (
        <section className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <h2 className='text-lg font-semibold'>Pending Requests</h2>
            {pendingCount > 0 && <div className='badge badge-primary'>{pendingCount}</div>}
          </div>
          <PendingRequests incoming={incoming} outgoing={outgoing} />
        </section>
      )}

      {/* My Friends */}
      <section className='flex flex-col gap-3'>
        <h2 className='text-lg font-semibold'>
          My Friends
          <span className='text-base-content/40 font-normal text-sm ml-2'>({friends.length})</span>
        </h2>
        <FriendsList friends={friends} />
      </section>

      {/* Find Users */}
      <section className='flex flex-col gap-3'>
        <h2 className='text-lg font-semibold'>Find Users</h2>
        <FindUsers />
      </section>
    </div>
  )
}

export default FriendsPage
