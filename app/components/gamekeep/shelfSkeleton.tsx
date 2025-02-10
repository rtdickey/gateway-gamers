const ShelfSkeleton = () => {
  return [...Array(5)].map((_, index) => (
    <div className='flex flex-col gap-2'>
      <div className='skeleton h-32 w-full'></div>
      <div className='skeleton h-4 w-full'></div>
      <div className='skeleton h-4 w-full'></div>
      <div className='skeleton h-4 w-full'></div>
      <div className='card-actions justify-end'>
        <div className='skeleton h-4 w-16 rounded'></div>
      </div>
    </div>
  ))
}

export default ShelfSkeleton
