'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { ChevronRight, MapPin, Tag } from 'lucide-react'

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
        .order('created_at', { ascending: false })

      if (filter !== 'Alla') {
        query = query.eq('category', filter)
      }

      const { data } = await query
      if (data) setAds(data)
      setLoading(false)
    }

    fetchAds()
  }, [filter])

  const premiumAds = ads.filter(ad => ad.is_premium)
  const standardAds = ads.filter(ad => !ad.is_premium)

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header Area */}
      <div className="bg-white border-b border-zinc-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#003366] uppercase">Bazar / <span className="text-[#a11a2d]">Forum</span></h1>
            <p className="text-zinc-500 mt-2 font-serif italic">Marknadsplatsen för det polska communityt i Sverige</p>
          </div>
          <Link
            href="/skapa-annons"
            className="bg-[#a11a2d] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-red-900 transition-all shadow-xl shadow-red-900/10 active:scale-95"
          >
            + Skapa ny annons
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* TOP: Horizontal Premium Section */}
        {premiumAds.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-[#a11a2d] text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                Premium Annonser
              </div>
              <div className="h-px flex-1 bg-zinc-200"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {premiumAds.map((ad) => (
                <Link href={`/annonser/${ad.id}`} key={ad.id} className="group bg-white border border-zinc-200 rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
                  <div className="aspect-video bg-zinc-100 relative overflow-hidden">
                    {ad.image_url ? (
                      <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[10px] font-bold uppercase tracking-widest italic">Ingen bild</div>
                    )}
                    <div className="absolute top-3 left-3 bg-[#a11a2d] text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-widest shadow-md">Premium</div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-bold text-[#a11a2d] uppercase tracking-wider">{ad.category}</span>
                      <span className="text-[9px] text-zinc-400 font-bold">{new Date(ad.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#003366] group-hover:underline mb-3 line-clamp-2 italic">{ad.title}</h3>
                    <div className="mt-auto pt-4 border-t border-zinc-50 flex justify-between items-center">
                      <span className="text-sm font-bold text-zinc-900">{ad.price || 'Diskuteras'}</span>
                      <span className="text-[9px] text-zinc-400 flex items-center gap-1 font-bold uppercase tracking-tighter italic">
                        <MapPin size={10} /> {ad.location}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="grid lg:grid-cols-4 gap-12">
          {/* LEFT: Categories Sidebar */}
          <aside className="space-y-10">
            <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden rounded-sm">
              <div className="bg-[#003366] text-white px-5 py-3 text-[10px] font-bold uppercase tracking-widest">
                Filtrera Bazar
              </div>
              <div className="p-2 space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`w-full flex items-center justify-between p-3 text-xs font-bold transition-all rounded-sm ${
                      filter === cat
                      ? "bg-zinc-50 text-[#a11a2d] border-l-4 border-[#a11a2d]"
                      : "text-zinc-500 hover:bg-zinc-50 border-l-4 border-transparent"
                    }`}
                  >
                    {cat}
                    <ChevronRight size={12} className={filter === cat ? "opacity-100" : "opacity-0"} />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 border border-zinc-200 shadow-sm rounded-sm italic">
               <h4 className="text-[10px] font-bold text-[#003366] uppercase mb-3 border-b pb-2 tracking-widest">Säker handel</h4>
               <p className="text-[11px] text-zinc-500 leading-relaxed">
                 Tänk på att alltid träffas på en offentlig plats när du genomför affärer i Bazaren.
               </p>
            </div>
          </aside>

          {/* MAIN: Vertical Standard Ads */}
          <main className="lg:col-span-3">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Senaste Annonserna</h2>
              <div className="h-px flex-1 bg-zinc-200 opacity-50"></div>
            </div>

            {loading ? (
              <div className="text-center py-20 font-serif italic text-zinc-400">Hämtar annonser...</div>
            ) : standardAds.length === 0 ? (
              <div className="text-center py-24 bg-white border border-zinc-200 rounded-sm">
                <p className="text-zinc-400 font-serif italic">Här var det tomt för tillfället.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {standardAds.map((ad) => (
                  <Link href={`/annonser/${ad.id}`} key={ad.id} className="group bg-white p-5 border border-zinc-200 rounded-sm shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-8">
                    {/* Standard Image Thumbnail */}
                    <div className="w-full md:w-56 h-40 bg-zinc-100 rounded-sm overflow-hidden flex-shrink-0">
                      {ad.image_url ? (
                        <img
                          src={ad.image_url}
                          alt={ad.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300 gap-2 bg-zinc-50">
                          <Tag size={20} className="opacity-30" />
                          <span className="text-[8px] font-bold uppercase tracking-widest">Ingen bild</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#a11a2d] border border-red-800/10 px-2 py-0.5 rounded-sm bg-red-50/30">
                            {ad.category}
                          </span>
                          <span className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest border-l pl-3">
                            {new Date(ad.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-[#003366] group-hover:text-blue-800 transition-colors tracking-tight italic mb-2">
                          {ad.title}
                        </h3>
                        <p className="text-xs text-zinc-400 font-serif italic mb-4 line-clamp-1">📍 {ad.location}</p>
                      </div>

                      <div className="flex items-end justify-between pt-4 border-t border-zinc-50">
                        <span className="text-lg font-bold text-zinc-900">{ad.price || 'Pris på förfrågan'}</span>
                        <div className="flex items-center gap-2 text-[#003366] font-bold text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                          Visa Info <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
