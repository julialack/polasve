'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Search, Box, MessageSquare, ChevronRight, MapPin, Filter, X, Loader2 } from 'lucide-react'
import PostCard from '@/components/feed/PostCard'
import { capitalizeFirst } from '@/utils/capitalize'

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get('q') || ''
  const locationParam = searchParams.get('location') || ''

  const [query, setQuery] = useState(queryParam)
  const [location, setLocation] = useState(locationParam)
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const [ads, setAds] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setQuery(queryParam)
    if (locationParam) setLocation(locationParam)
  }, [queryParam, locationParam])

  const performSearch = async () => {
    setLoading(true)

    try {
      let adsQuery = supabase.from('ads').select('*').order('is_premium', { ascending: false }).order('created_at', { ascending: false })

      if (query.trim()) {
        adsQuery = adsQuery.or(`title.ilike.%${query.trim()}%,description.ilike.%${query.trim()}%,location.ilike.%${query.trim()}%`)
      }

      if (location.trim()) {
        adsQuery = adsQuery.ilike('location', `%${location.trim()}%`)
      }

      if (category) {
        adsQuery = adsQuery.eq('category', category)
      }

      const { data: adsData } = await adsQuery

      let filteredAds = adsData || []

      // Client side price filtering
      if (minPrice && !isNaN(Number(minPrice))) {
        filteredAds = filteredAds.filter(a => {
          const p = parseFloat(a.price?.replace(/[^0-9.]/g, '') || '0')
          return p >= Number(minPrice)
        })
      }

      if (maxPrice && !isNaN(Number(maxPrice))) {
        filteredAds = filteredAds.filter(a => {
          const p = parseFloat(a.price?.replace(/[^0-9.]/g, '') || '0')
          return p <= Number(maxPrice)
        })
      }

      // Search posts
      let postsData: any[] = []
      if (query.trim()) {
        const { data } = await supabase
          .from('posts')
          .select('*')
          .ilike('content', `%${query.trim()}%`)
          .order('created_at', { ascending: false })
        postsData = data || []
      }

      setAds(filteredAds)
      setPosts(postsData)
    } catch (err: any) {
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    getUser()
    performSearch()
  }, [query, location, category, minPrice, maxPrice])

  const handleDeletePost = async (id: string) => {
    if(confirm('Ta bort?')) {
      await supabase.from('posts').delete().eq('id', id)
      performSearch()
    }
  }

  const handleResetFilters = () => {
    setLocation('')
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 md:px-6 text-left">
      <div className="max-w-5xl mx-auto">
        {/* Search Header */}
        <div className="mb-8 text-left">
          <h1 className="text-2xl md:text-3xl font-black text-[#003366] uppercase tracking-tight">
            Sökresultat: <span className="text-[#a11a2d] italic">"{query || location || 'Alla Annonser'}"</span>
          </h1>
          <div className="h-1 w-20 bg-[#a11a2d] mt-3"></div>
        </div>

        {/* Filter Controls Box */}
        <div className="bg-white border border-zinc-200 rounded-sm shadow-sm p-4 md:p-6 mb-8 text-left space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#003366]">
              <Filter size={14} className="text-[#a11a2d]" /> Filtrera resultat
            </div>
            {(location || category || minPrice || maxPrice) && (
              <button
                onClick={handleResetFilters}
                className="text-[10px] font-black uppercase text-zinc-400 hover:text-[#a11a2d] transition-colors flex items-center gap-1"
              >
                Rensa filter <X size={12} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Plats / Stad */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Stad / Plats</label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="t.ex. Stockholm"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-sm text-xs font-bold text-zinc-900 outline-none focus:border-[#003366]"
                />
                <MapPin size={14} className="absolute right-2.5 top-3 text-zinc-300 pointer-events-none" />
              </div>
            </div>

            {/* Kategori */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-sm text-xs font-bold text-zinc-900 outline-none focus:border-[#003366]"
              >
                <option value="">Alla kategorier</option>
                <option value="Jobb">Jobb - Finns</option>
                <option value="Leta jobb">Jobb - Sökes</option>
                <option value="Bostad">Bostad</option>
                <option value="Hyra">Bostad - Hyra ut</option>
                <option value="Sökes">Bostad - Sökes</option>
                <option value="Köp / Acceptera">Marketplace - Köpes</option>
                <option value="Sälj / Bortskänkes">Marketplace - Säljes</option>
                <option value="Tjänster">Tjänster</option>
                <option value="Transport">Transport</option>
              </select>
            </div>

            {/* Min Pris */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Min Pris (kr)</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-sm text-xs font-bold text-zinc-900 outline-none focus:border-[#003366]"
              />
            </div>

            {/* Max Pris */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Max Pris (kr)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="t.ex. 10000"
                className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-sm text-xs font-bold text-zinc-900 outline-none focus:border-[#003366]"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-10 h-10 text-[#003366] animate-spin" />
            <p className="font-serif italic text-zinc-400 text-sm">Söker...</p>
          </div>
        ) : (ads.length === 0 && posts.length === 0) ? (
          <div className="text-center py-16 bg-white border border-zinc-200 rounded-sm shadow-sm px-8">
            <Search className="mx-auto text-zinc-200 mb-4" size={40} />
            <h2 className="text-lg font-bold text-[#003366] mb-1">Inga träffar hittades</h2>
            <p className="text-xs text-zinc-400 mb-4">Prova att ändra sökord eller rensa dina sökfilter.</p>
            <button onClick={handleResetFilters} className="inline-block text-xs font-bold text-[#003366] underline">Rensa filter</button>
          </div>
        ) : (
          <div className="space-y-12 text-left">
            {ads.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#a11a2d] text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm flex items-center gap-2">
                    <Box size={14} /> Annonser ({ads.length})
                  </div>
                  <div className="h-px flex-1 bg-zinc-200"></div>
                </div>
                <div className="space-y-3">
                  {ads.map((ad) => (
                    <Link href={`/annonser/${ad.id}`} key={ad.id} className={`group bg-white p-4 border rounded-sm shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-center text-left ${ad.is_premium ? 'border-amber-200 bg-amber-50/20' : 'border-zinc-200'}`}>
                      <div className="w-full sm:w-24 h-24 sm:h-20 bg-zinc-100 flex-shrink-0 rounded-sm overflow-hidden border border-zinc-100 relative">
                        {ad.image_url ? (
                          <img src={ad.image_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[8px] font-bold uppercase">Ingen bild</div>
                        )}
                        {ad.is_premium && <div className="absolute top-0 left-0 bg-amber-500 text-white text-[6px] px-1 font-bold uppercase">Premium</div>}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <h3 className="text-sm md:text-base font-bold text-[#003366] group-hover:underline italic leading-tight mb-1 truncate">{capitalizeFirst(ad.title)}</h3>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase">📍 {ad.location} • {ad.category}</p>
                        <p className="text-xs font-black mt-2 text-[#a11a2d]">{ad.price || 'Bud'}</p>
                      </div>
                      <ChevronRight className="hidden sm:block text-zinc-300 group-hover:text-[#a11a2d] transition-all group-hover:translate-x-1" size={20} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {posts.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#003366] text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm flex items-center gap-2">
                    <MessageSquare size={14} /> Community ({posts.length})
                  </div>
                  <div className="h-px flex-1 bg-zinc-200"></div>
                </div>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onDelete={handleDeletePost}
                      onUpdate={performSearch}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center italic text-zinc-400 text-sm">Laddar sökning...</div>}>
      <SearchResultsContent />
    </Suspense>
  )
}
