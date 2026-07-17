'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Search, Box, MessageSquare, ChevronRight, AlertCircle, Loader2 } from 'lucide-react'
import PostCard from '@/components/feed/PostCard'

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [ads, setAds] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const performSearch = async () => {
    if (!query || query.trim().length < 1) {
      setAds([])
      setPosts([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Search in Ads - Sorted by Premium first
      const { data: adsData, error: adsError } = await supabase
        .from('ads')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
        .order('is_premium', { ascending: false })
        .order('created_at', { ascending: false })

      if (adsError) throw adsError

      // 2. Search in Posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .ilike('content', `%${query}%`)
        .order('created_at', { ascending: false })

      if (postsError) throw postsError

      setAds(adsData || [])
      setPosts(postsData || [])
    } catch (err: any) {
      setError(err.message)
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
  }, [query])

  const handleDeletePost = async (id: string) => {
    if(confirm('Ta bort inlägget?')) {
      await supabase.from('posts').delete().eq('id', id)
      performSearch()
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-left">
          <h1 className="text-3xl font-bold text-[#003366] uppercase tracking-tight">
            Sökning: <span className="text-[#a11a2d] italic">"{query || '...'}"</span>
          </h1>
          <div className="h-1 w-20 bg-[#a11a2d] mt-4"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-12 h-12 text-[#003366] animate-spin" />
            <p className="font-serif italic text-zinc-400 text-lg">Söker igenom portalen...</p>
          </div>
        ) : (ads.length === 0 && posts.length === 0) ? (
          <div className="text-center py-20 bg-white border border-zinc-200 rounded-sm shadow-sm px-10">
            <Search className="mx-auto text-zinc-200 mb-6" size={48} />
            <h2 className="text-xl font-bold text-[#003366] mb-2">Inga träffar</h2>
            <p className="text-zinc-500 font-serif italic mb-8">Vi hittade inget som matchade din sökning.</p>
            <Link href="/" className="inline-block bg-[#003366] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#a11a2d] transition-all shadow-lg">
              Tillbaka till start
            </Link>
          </div>
        ) : (
          <div className="space-y-16 text-left">
            {/* Ads Results */}
            {ads.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-[#a11a2d] text-white px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] shadow-sm flex items-center gap-2">
                    <Box size={16} /> Bazar / Annonser ({ads.length})
                  </div>
                  <div className="h-px flex-1 bg-zinc-200"></div>
                </div>
                <div className="space-y-4">
                  {ads.map((ad) => (
                    <Link href={`/annonser/${ad.id}`} key={ad.id} className={`group bg-white p-5 border rounded-sm shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-center text-left ${ad.is_premium ? 'border-red-100 ring-1 ring-red-50' : 'border-zinc-200'}`}>
                      <div className="w-full md:w-20 md:h-20 bg-zinc-100 flex-shrink-0 rounded-sm overflow-hidden border border-zinc-100 relative">
                        {ad.image_url ? (
                          <img src={ad.image_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[8px] font-bold uppercase text-center px-1">Ingen bild</div>
                        )}
                        {ad.is_premium && <div className="absolute top-0 left-0 bg-[#a11a2d] text-white text-[6px] px-1 font-bold uppercase">Premium</div>}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#003366] group-hover:underline italic leading-tight mb-1">{ad.title}</h3>
                        <p className="text-xs text-zinc-400 font-medium">📍 {ad.location} • {ad.category}</p>
                        <p className="text-sm font-bold mt-2 text-red-800">{ad.price || 'Diskuteras'}</p>
                      </div>
                      <ChevronRight className={`hidden md:block transition-all ${ad.is_premium ? 'text-[#a11a2d]' : 'text-zinc-300'} group-hover:translate-x-1`} size={24} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Posts Results */}
            {posts.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-[#003366] text-white px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] shadow-sm flex items-center gap-2">
                    <MessageSquare size={16} /> Community Flöde ({posts.length})
                  </div>
                  <div className="h-px flex-1 bg-zinc-200"></div>
                </div>
                <div className="space-y-6">
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
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center italic text-zinc-400">Laddar sökresultat...</div>}>
      <SearchResultsContent />
    </Suspense>
  )
}
