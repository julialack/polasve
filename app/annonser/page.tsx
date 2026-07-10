'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

const CATEGORIES = ["Alla", "Jobb", "Bostad", "Event", "Tjänster", "Övrigt"]

export default function AnnonserPage() {
  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Alla')
  const supabase = createClient()

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true)
      let query = supabase
        .from('ads')
        .select('*')
        .order('is_premium', { ascending: false })
        .order('created_at', { ascending: false })

      if (filter !== 'Alla') {
        query = query.eq('category', filter)
      }

      const { data, error } = await query
      if (data) setAds(data)
      setLoading(false)
    }

    fetchAds()
  }, [filter])

  return (
    <div className="min-h-screen bg-white">
      {/* Header Area */}
      <div className="bg-zinc-50/50 border-b border-zinc-100 py-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
          <div>
            <h1 className="text-4xl font-light uppercase tracking-[0.2em] text-zinc-900">Marknads<span className="font-bold">plats</span></h1>
            <p className="text-zinc-400 mt-2 font-serif italic">Upptäck kurerade annonser för vårt community</p>
          </div>
          <Link
            href="/skapa-annons"
            className="bg-red-800 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-red-900 transition-all shadow-xl shadow-red-900/10"
          >
            + Skapa ny annons
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-4 gap-16">
          {/* Filters */}
          <aside className="space-y-12">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300 mb-6">Kategorier</h3>
              <div className="flex lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`whitespace-nowrap text-left text-xs font-bold uppercase tracking-widest transition-all ${
                      filter === cat
                      ? "text-red-800 border-l-2 border-red-800 pl-4"
                      : "text-zinc-400 hover:text-zinc-900 lg:pl-4 lg:border-l-2 lg:border-transparent"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* List */}
          <main className="lg:col-span-3 space-y-12">
            {loading ? (
              <div className="text-center py-20 font-serif italic text-zinc-400">Laddar annonser...</div>
            ) : ads.length === 0 ? (
              <div className="text-center py-20 font-serif italic text-zinc-400">Inga annonser hittades i denna kategori.</div>
            ) : (
              ads.map((ad) => (
                <div
                  key={ad.id}
                  className={`group relative pb-12 border-b border-zinc-50 last:border-0 ${ad.is_premium ? 'pt-8' : ''}`}
                >
                  {ad.is_premium && (
                    <span className="absolute -top-2 left-0 bg-red-800 text-white text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg z-10">
                      Premium
                    </span>
                  )}
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Ad Image Thumbnail */}
                    <div className="w-full md:w-48 h-48 bg-zinc-100 rounded-sm overflow-hidden flex-shrink-0">
                      {ad.image_url ? (
                        <img
                          src={ad.image_url}
                          alt={ad.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[10px] font-bold uppercase tracking-widest">
                          Ingen bild
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-800 border border-red-800/20 px-3 py-1 rounded-full">
                            {ad.category}
                          </span>
                          <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
                            {new Date(ad.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-2xl font-light text-zinc-900 group-hover:text-red-800 transition-colors tracking-tight mb-2">
                          {ad.title}
                        </h3>
                        <p className="text-sm text-zinc-400 font-serif italic">📍 {ad.location}</p>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 gap-4">
                        <span className="text-xl font-bold text-zinc-900">{ad.price || 'Pris på förfrågan'}</span>
                        <Link
                          href={`/annonser/${ad.id}`}
                          className="text-[10px] font-bold uppercase tracking-[0.2em] border-2 border-zinc-900 px-6 py-2.5 hover:bg-zinc-900 hover:text-white transition-all text-center"
                        >
                          Visa Detaljer
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
