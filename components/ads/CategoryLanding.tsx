'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { MapPin, Box, X, ArrowRight } from 'lucide-react'
import SearchBar from '@/components/search/SearchBar'
import HomeHero from "@/components/HomeHero";
import InfoBar from "@/components/layout/InfoBar";
import SidebarNav from "@/components/layout/SidebarNav";
import SafeImage from "@/components/ui/SafeImage";
import PremiumAdsSidebar from "@/components/ads/PremiumAdsSidebar";

interface Ad {
  id: string
  title: string
  image_url: string | null
  category: string
  location: string
  price: string | null
  created_at: string
  is_premium: boolean
}

interface CategoryLandingProps {
  title: string
  description: string
  categoryFilter: string | string[]
  icon?: React.ReactNode
}

function LandingContent({ title, description, categoryFilter, icon }: CategoryLandingProps) {
  const searchParams = useSearchParams()
  const locationFilter = searchParams.get('location')

  const [ads, setAds] = useState<Ad[]>([])
  const [featuredAds, setFeaturedAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    setLoading(true)

    // Build Query for main ads
    let query = supabase.from('ads').select('*').order('created_at', { ascending: false })

    // Apply category filter
    if (Array.isArray(categoryFilter)) {
        query = query.in('category', categoryFilter)
    } else {
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

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] font-sans">
      <HomeHero />
      <InfoBar />

      <div className="bg-zinc-50 border-b border-zinc-100 py-6 px-6">
        <div className="max-w-4xl mx-auto">
          <SearchBar />
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-4 gap-6">

          <aside className="hidden md:block md:col-span-3 lg:col-span-1">
            <SidebarNav />
          </aside>

          <div className="col-span-1 md:col-span-9 lg:col-span-2 space-y-6">
            <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden rounded-sm">
              <div className="bg-[#003366] text-white px-6 py-4 flex items-center gap-3">
                {icon || <Box size={18} />}
                <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-widest">{title}</span>
                    <span className="text-[9px] font-bold opacity-70 italic">{description}</span>
                </div>
              </div>

              <div className="p-4 md:p-6">
                {locationFilter && (
                   <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-100 p-3 rounded-sm">
                      <span className="text-[10px] font-black uppercase text-amber-800 tracking-widest flex items-center gap-2">
                        <MapPin size={14} /> Region: {locationFilter}
                      </span>
                      <Link href={window.location.pathname} className="ml-auto text-[8px] font-black uppercase bg-amber-200 text-amber-900 px-2 py-1 rounded-sm flex items-center gap-1 hover:bg-amber-300 transition-colors">
                        Rensa <X size={10} />
                      </Link>
                   </div>
                )}

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-zinc-100 animate-pulse rounded-sm" />)}
                  </div>
                ) : ads.length === 0 ? (
                  <div className="text-center py-20 italic text-zinc-400">
                    Inga annonser hittades i denna kategori ännu.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {ads.map((ad) => (
                      <Link href={`/annonser/${ad.id}`} key={ad.id} className="group bg-white p-4 border border-zinc-100 rounded-sm shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6">
                        <div className="w-full sm:w-40 h-32 bg-zinc-100 rounded-sm overflow-hidden flex-shrink-0">
                          <SafeImage
                            src={ad.image_url || ""}
                            alt={ad.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            fallbackSrc="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200&auto=format&fit=crop"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[9px] font-black uppercase text-[#a11a2d]">{ad.category}</span>
                              <span className="text-[8px] text-zinc-400 font-bold border-l pl-2">{new Date(ad.created_at).toLocaleDateString()}</span>
                            </div>
                            <h3 className={`text-lg font-bold italic group-hover:underline leading-tight mb-2 text-[#003366]`}>
                              {ad.title}
                            </h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter flex items-center gap-1"><MapPin size={10} /> {ad.location}</p>
                          </div>
                          <div className="flex justify-between items-end mt-4 pt-4 border-t border-zinc-50">
                            <span className={`text-sm font-black ${ad.is_premium ? 'text-[#D4AF37]' : 'text-zinc-900'}`}>
                              {ad.price || 'Bud'}
                            </span>
                            <span className="text-[9px] font-black text-[#003366] uppercase tracking-widest">Visa info &raquo;</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <PremiumAdsSidebar />
        </div>
      </main>
    </div>
  )
}

export default function CategoryLanding(props: CategoryLandingProps) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center italic text-zinc-400">Laddar sida...</div>}>
            <LandingContent {...props} />
        </Suspense>
    )
}
