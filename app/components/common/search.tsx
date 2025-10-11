"use client"

interface SearchProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Search: React.FC<SearchProps> = ({ value, onChange }) => {
  return (
    <label className='input input-bordered flex items-center gap-2'>
      <input type='text' className='grow' placeholder='Search...' value={value} onChange={onChange} />
    </label>
  )
}

export default Search
