'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useTranslation } from '@/utils/translations'

export default function SearchBar() {
  const { t } = useTranslation()
  const router = useRouter()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const syncQueryFromUrl = () => {
      const params = new URLSearchParams(window.location.search)
      setQuery(params.get('q') || '')
    }

    syncQueryFromUrl()
    window.addEventListener('popstate', syncQueryFromUrl)

    return () => {
      window.removeEventListener('popstate', syncQueryFromUrl)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = query.trim()

    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`)
      return
    }

    router.push('/search')
  }

  const clearQuery = () => {
    setQuery('')
    router.push('/search')
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-white border border-zinc-200 py-3.5 px-12 rounded-sm shadow-sm focus:outline-none focus:border-[#003366] text-sm font-bold text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal pr-10 md:pr-12 text-left"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
        {query && (
          <button
            type="button"
            aria-label={t.clearSearch}
            onClick={clearQuery}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#a11a2d] transition-colors"
          >
            <X size={16} />
          </button>
        )}
        <button
          type="submit"
          aria-label={t.searchBtn}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#003366] text-white p-2 rounded-sm hover:bg-[#a11a2d] transition-colors shadow-sm"
        >
          <Search size={16} className="text-white" />
        </button>
      </div>
    </form>
  )
}
