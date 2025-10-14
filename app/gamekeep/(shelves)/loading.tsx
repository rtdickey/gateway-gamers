import ShelfSkeleton from "@/app/components/gamekeep/shelf-skeleton"

const Loading = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
      <ShelfSkeleton />
    </div>
  )
}

export default Loading
