interface SkeletonShelfProps {
  shelfType: "Owned" | "Want" | "Not Interested" | "All"
}

const ShelfSkeleton: React.FC<SkeletonShelfProps> = ({ shelfType }) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='skeleton h-32 w-full'></div>
      <div className='skeleton h-4 w-full'></div>
      <div className='skeleton h-4 w-full'></div>
      <div className='skeleton h-4 w-full'></div>
      {shelfType === "All" && (
        <div className='card-actions justify-end'>
          <div className='skeleton h-4 w-16 rounded'></div>
        </div>
      )}
    </div>
  )
}

export default ShelfSkeleton
