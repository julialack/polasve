'use client'

import { useEffect, useState, Suspense, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { MapPin, Box, Users, ArrowRight, X } from 'lucide-react'
import SearchBar from '@/components/search/SearchBar'
import SwedenMap from "@/components/map/SwedenMap";
import HomeHero from "@/components/HomeHero";

const CATEGORIES = ["Alla", "Jobb", "Bostad", "Event", "Tjänster", "Övrigt"]

interface Ad {
  id: string
  title: string
  image_url: string | null
  category: string
  location: string
  price: string | null
  created_at: string
}

function AnnonserList() {
  const searchParams = useSearchParams()
  const locationFilter = searchParams.get('location')

  const [ads, setAds] = useState<Ad[]>([])
  const [featuredAds, setFeaturedAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('Alla')
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    setLoading(true)

    // 1. Fetch Premium Ads
    const { data: premData } = await supabase.from('ads').select('*').eq('is_premium', true).order('created_at', { ascending: false }).limit(4)
    if (premData) setFeaturedAds(premData)

    // 2. Build Query for main ads
    let query = supabase.from('ads').select('*').order('created_at', { ascending: false })

    // Apply category filter
    if (categoryFilter !== 'Alla') {
      query = query.eq('category', categoryFilter)
    }

    // Apply location filter (from the map)
    if (locationFilter) {
      query = query.ilike('location', `%${locationFilter}%`)
    }

    const { data } = await query
    if (data) setAds(data)
    setLoading(false)
  }, [categoryFilter, locationFilter, supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const today = new Date().toLocaleDateString('sv-SE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-left font-sans">
      <HomeHero />

      <div className="bg-white border-b border-zinc-200 py-2 px-6 text-left">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] md:text-xs text-zinc-500 font-medium">
          <div className="capitalize font-bold text-[#003366] text-left">{today}</div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1 text-left"><Users size={12} /> 142 online</span>
            <span className="hidden sm:inline border-l pl-4 font-bold text-[#a11a2d] text-left">Välkommen!</span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-50 border-b border-zinc-100 py-6 px-6 text-left">
        <div className="max-w-4xl mx-auto text-left">
          <SearchBar />
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8 text-left">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-4 gap-6 text-left">

          <aside className="hidden md:block md:col-span-3 lg:col-span-1 space-y-6 text-left">
            <section className="bg-white p-5 border border-zinc-200 shadow-sm relative overflow-hidden rounded-sm text-left">
               <div className="absolute top-0 left-0 w-1 h-full bg-[#003366]"></div>
               <h4 className="text-[10px] font-black uppercase text-[#003366] mb-4 tracking-widest text-left">Kategorier</h4>
               <nav className="flex flex-col space-y-1 text-left">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`flex items-center justify-between py-2.5 text-[11px] font-bold border-b border-zinc-50 last:border-0 transition-all group text-left ${
                      categoryFilter === cat ? "text-[#a11a2d]" : "text-[#003366] hover:text-[#a11a2d]"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-left">{cat}</div>
                    <ArrowRight size={10} className={categoryFilter === cat ? "opacity-100" : "opacity-0"} />
                  </button>
                ))}
              </nav>
            </section>
          </aside>

          <div className="col-span-1 md:col-span-9 lg:col-span-2 space-y-6 text-left">
            <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden rounded-sm text-left">
              <div className="bg-[#003366] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex justify-between items-center text-left">
                <span className="text-left">{categoryFilter === 'Alla' ? 'Bazar / Forum - Alla annonser' : `Bazar - ${categoryFilter}`}</span>
              </div>

              <div className="p-4 md:p-6 text-left">
                {locationFilter && (
                   <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 p-3 rounded-sm text-left">
                      <span className="text-[10px] font-black uppercase text-[#a11a2d] tracking-widest flex items-center gap-2">
                        <MapPin size={14} /> Filtrerat på: {locationFilter}
                      </span>
                      <Link href="/annonser" className="ml-auto text-[8px] font-black uppercase bg-[#a11a2d] text-white px-2 py-1 rounded-sm flex items-center gap-1 hover:bg-[#003366] transition-colors">
                        Rensa <X size={10} />
                      </Link>
                   </div>
                )}

                {loading ? (
                  <div className="space-y-4 text-left">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-zinc-100 animate-pulse rounded-sm text-left" />)}
                  </div>
                ) : ads.length === 0 ? (
                  <div className="text-center py-20 italic text-zinc-400 text-center">
                    Inga annonser hittades i {locationFilter ? locationFilter : 'denna kategori'}.
                  </div>
                ) : (
                  <div className="space-y-6 text-left">
                    {ads.map((ad) => (
                      <Link href={`/annonser/${ad.id}`} key={ad.id} className="group bg-white p-4 border border-zinc-100 rounded-sm shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 text-left">
                        <div className="w-full sm:w-40 h-32 bg-zinc-100 rounded-sm overflow-hidden flex-shrink-0 text-left">
                          {ad.image_url ? (
                            <img src={ad.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[8px] font-bold uppercase text-left">Ingen bild</div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1 text-left">
                          <div className="text-left">
                            <div className="flex items-center gap-2 mb-2 text-left">
                              <span className="text-[9px] font-black uppercase text-[#a11a2d] text-left">{ad.category}</span>
                              <span className="text-[8px] text-zinc-300 font-bold border-l pl-2 text-left">{new Date(ad.created_at).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#003366] italic group-hover:underline leading-tight mb-2 text-left">{ad.title}</h3>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter flex items-center gap-1 text-left"><MapPin size={10} /> {ad.location}</p>
                          </div>
                          <div className="flex justify-between items-end mt-4 pt-4 border-t border-zinc-50 text-left">
                            <span className="text-sm font-black text-zinc-900 text-left">{ad.price || 'Bud'}</span>
                            <span className="text-[9px] font-black text-[#003366] uppercase tracking-widest text-left">Visa info &raquo;</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="hidden lg:block lg:col-span-1 space-y-6 text-left">
            <section className="bg-white shadow-sm overflow-hidden border border-zinc-200 text-left">
              <div className="bg-[#a11a2d] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-left">Bazar - Premium</div>
              <div className="p-4 space-y-5 text-left">
                {featuredAds.map((ad) => (
                  <Link href={`/annonser/${ad.id}`} key={ad.id} className="block group border-b border-zinc-100 last:border-0 pb-4 text-left">
                    <div className="flex gap-4 text-left">
                      <div className="w-16 h-16 bg-zinc-100 relative overflow-hidden border rounded-sm text-left">
                        <img src={ad.image_url || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <h4 className="text-[11px] font-bold text-[#003366] italic leading-tight truncate text-left">{ad.title}</h4>
                        <p className="text-[10px] text-red-800 font-bold mt-1 text-left">{ad.price}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/annonser" className="block text-center py-3 bg-zinc-50 text-[10px] font-black text-zinc-500 hover:text-red-800 uppercase tracking-widest border-t transition-colors italic text-center">Alla annonser &gt;&gt;</Link>
            </section>

            <section className="bg-white border border-zinc-200 overflow-hidden shadow-sm text-left">
                <div className="bg-[#003366] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-left text-left">Välj region på kartan</div>
                <SwedenMap />
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default function AnnonserPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center italic text-zinc-400 font-sans">Laddar Bazar...</div>}>
      <AnnonserList />
    </Suspense>
  )
}
