interface SkeletonShelfProps {
  shelfType: "Owned" | "Want" | "Not Interested" | "All"
}

const ShelfSkeleton: React.FC<SkeletonShelfProps> = ({ shelfType }) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='skeleton h-32 w-full'></div>
      {shelfType === "All" && <div className='skeleton h-4 w-28'></div>}
      <div className='skeleton h-4 w-full'></div>
      <div className='skeleton h-4 w-full'></div>
      <div className='skeleton h-4 w-full'></div>
    </div>
  )
}

export default ShelfSkeleton
