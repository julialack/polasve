'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/sok?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Sök jobb, bostad eller i flödet..."
        className="w-full bg-white border border-zinc-200 py-3 px-12 rounded-sm shadow-sm focus:outline-none focus:border-[#003366] text-sm font-bold text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal"
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#003366] text-white px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-[#a11a2d] transition-colors"
      >
        Sök
      </button>
    </form>
  )
}
