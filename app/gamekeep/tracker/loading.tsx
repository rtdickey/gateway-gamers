import TrackerTableSkeleton from "@/app/components/gamekeep/tracker-table-skeleton"

const Loading = () => {
  return (
    <table className='table table-xs sm:table-sm'>
      {/* head */}
      <thead>
        <tr>
          <th>Game</th>
          <th>Borrower</th>
          <th>Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <TrackerTableSkeleton />
      </tbody>
    </table>
  )
}

export default Loading
