import { Shelf } from "@/app/lib/types/shelf"

interface ShelfTabProps {
  shelf: Shelf | null
  isSelected: boolean
  setFilterShelf: (shelf: string | null) => void
}

const ShelfTab: React.FC<ShelfTabProps> = ({ shelf, isSelected, setFilterShelf }) => {
  const shelfName = shelf ?? "All"
  return (
    <label className='swap'>
      <input type='checkbox' checked={isSelected} onChange={() => setFilterShelf(shelf)} />
      <div className='swap-on'>
        <div className='badge text-white underline decoration-2 decoration-primary'>{shelfName}</div>
      </div>
      <div className='swap-off'>
        <div className='badge'>{shelfName}</div>
      </div>
    </label>
  )
}

export default ShelfTab
