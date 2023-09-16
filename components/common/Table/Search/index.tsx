import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchProps {
  onSearchChange: (query: string) => void
}

export function Search({ onSearchChange }: SearchProps) {
  return (
    <div className="relative w-56 ">
      <MagnifyingGlassIcon className="absolute top-1.5 left-2  w-6 h-6 text-gray-400" />
      <input
        className="w-full h-9 rounded-md px-8  bg-gray-200 hover:bg-gray-300"
        type="text"
        placeholder="Procurar"
        onChange={e => onSearchChange(e.target.value)}
      />
    </div>
  )
}
