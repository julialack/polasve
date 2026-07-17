'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    if (trimmedQuery) {
      // Trying the /search path which is more standard
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Sök jobb, hundvakt eller i flödet..."
        className="w-full bg-white border border-zinc-200 py-3.5 px-12 rounded-sm shadow-sm focus:outline-none focus:border-[#003366] text-sm font-bold text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal"
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#003366] text-white px-5 py-2 rounded-sm text-[11px] font-black uppercase tracking-widest hover:bg-[#a11a2d] transition-colors shadow-sm"
      >
        Sök
      </button>
    </form>
  )
}
