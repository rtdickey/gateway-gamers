"use client"

interface SearchProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Search: React.FC<SearchProps> = ({ onChange }) => {
  return (
    <label className='input input-bordered flex items-center gap-2'>
      <input type='text' className='grow' placeholder='Search...' onChange={onChange} />
    </label>
  )
}

export default Search
