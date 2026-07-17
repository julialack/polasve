'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Search, Box, MessageSquare, ChevronRight, AlertCircle, Loader2 } from 'lucide-react'

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [ads, setAds] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const performSearch = async () => {
      if (!query || query.length < 1) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Search in Ads
        const { data: adsData, error: adsError } = await supabase
          .from('ads')
          .select('*')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)

        if (adsError) throw adsError

        // Search in Posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .ilike('content', `%${query}%`)

        if (postsError) throw postsError

        setAds(adsData || [])
        setPosts(postsData || [])
      } catch (err: any) {
        console.error("Search error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [query])

  if (!query) return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
      <div className="text-center py-20 bg-white border border-zinc-100 rounded-sm shadow-sm px-10 max-w-lg">
        <Search className="mx-auto text-zinc-200 mb-4" size={40} />
        <p className="text-zinc-500 font-serif italic text-lg">Skriv något i sökfältet ovan för att börja leta.</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full p-10 bg-red-50 border border-red-100 rounded-sm text-center shadow-sm">
        <AlertCircle className="mx-auto text-red-800 mb-4" size={40} />
        <h2 className="text-lg font-bold text-red-900 mb-2">Ett fel uppstod vid sökningen</h2>
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-[#003366] uppercase tracking-tight">
            Sökresultat för: <span className="text-[#a11a2d] italic">"{query}"</span>
          </h1>
          <div className="h-1 w-20 bg-[#a11a2d] mt-4"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-[#003366] animate-spin" />
            <p className="font-serif italic text-zinc-400 text-lg">Söker igenom hela portalen...</p>
          </div>
        ) : (ads.length === 0 && posts.length === 0) ? (
          <div className="text-center py-20 bg-white border border-zinc-200 rounded-sm shadow-sm px-10">
            <Search className="mx-auto text-zinc-200 mb-6" size={48} />
            <h2 className="text-xl font-bold text-[#003366] mb-2">Inga träffar hittades</h2>
            <p className="text-zinc-500 font-serif italic">Vi hittade tyvärr inget som matchade din sökning på "{query}".</p>
            <Link href="/" className="inline-block mt-8 text-[10px] font-black uppercase tracking-widest text-[#003366] border-b-2 border-[#003366] pb-1">Tillbaka till start</Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Ads Results */}
            {ads.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#a11a2d] text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-2">
                    <Box size={14} /> Bazar / Annonser ({ads.length})
                  </div>
                  <div className="h-px flex-1 bg-zinc-200"></div>
                </div>
                <div className="space-y-4">
                  {ads.map((ad) => (
                    <Link href={`/annonser/${ad.id}`} key={ad.id} className="group bg-white p-5 border border-zinc-200 rounded-sm shadow-sm hover:shadow-md transition-all flex gap-6 items-center text-left">
                      <div className="w-16 h-16 bg-zinc-100 flex-shrink-0 rounded-sm overflow-hidden border border-zinc-100">
                        {ad.image_url ? (
                          <img src={ad.image_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[8px] font-bold uppercase">Ingen bild</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#003366] group-hover:underline italic leading-tight">{ad.title}</h3>
                        <p className="text-xs text-zinc-400 mt-1 italic">{ad.location} • {ad.category}</p>
                      </div>
                      <ChevronRight className="text-zinc-300 group-hover:text-[#a11a2d] transition-all" size={24} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Posts Results */}
            {posts.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#003366] text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-2">
                    <MessageSquare size={14} /> Community Flöde ({posts.length})
                  </div>
                  <div className="h-px flex-1 bg-zinc-200"></div>
                </div>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="bg-white p-6 border border-zinc-200 rounded-sm shadow-sm text-left">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-bold text-xs text-[#003366] uppercase tracking-wider">{post.user_name}</span>
                        <span className="text-[10px] text-zinc-400 font-bold">{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-zinc-600 font-medium leading-relaxed italic">"{post.content}"</p>
                    </div>
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

export default function SokPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center italic text-zinc-400">Laddar sökresultat...</div>}>
      <SearchResultsContent />
    </Suspense>
  )
}
