const TrackerTableSkeleton = () => {
  return [...Array(7)].map((_, index) => (
    <tr key={index}>
      <td>
        <div className='flex items-center gap-3'>
          <div className='avatar hidden sm:block'>
            <div className='mask mask-squircle h-12 w-12'>
              <div className='skeleton h-full w-full'></div>
            </div>
          </div>
          <div>
            <div className='font-bold'>
              <div className='skeleton h-12 w-32'></div>
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className='skeleton h-12 w-24'></div>
      </td>
      <td>
        <div className='skeleton h-12 w-24'></div>
      </td>
      <td>
        <div className='skeleton h-12 w-24'></div>
      </td>
    </tr>
  ))
}

export default TrackerTableSkeleton
