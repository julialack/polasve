'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { Newspaper, Calendar, Box, Info, Users, ArrowRight, Clock } from 'lucide-react'
import SearchBar from '@/components/search/SearchBar'
import HomeHero from "@/components/HomeHero";
import SidebarNav from "@/components/layout/SidebarNav";
import PremiumAdsSidebar from "@/components/ads/PremiumAdsSidebar";

export default function NyheterPage() {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false })
      if (newsData) setNews(newsData)
      setLoading(false)
    }
    fetchData()
  }, [])

  const today = new Date().toLocaleDateString('sv-SE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-left">
      <HomeHero />

      {/* Top Portal Info Bar */}
      <div className="bg-white border-b border-zinc-200 py-2 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] md:text-xs text-zinc-500 font-medium">
          <div className="capitalize font-bold text-[#003366]">{today}</div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><Users size={12} /> 142 online</span>
            <span className="hidden sm:inline border-l pl-4 font-bold text-[#a11a2d]">Välkommen!</span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-50 border-b border-zinc-100 py-6 px-6">
        <div className="max-w-4xl mx-auto text-left">
          <SearchBar />
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8 text-left">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-4 gap-6 text-left">

          {/* LEFT SIDEBAR */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-1 space-y-6 text-left">
            <SidebarNav />
          </aside>

          {/* MAIN CONTENT - News Feed */}
          <div className="col-span-1 md:col-span-9 lg:col-span-2 space-y-6 text-left">
            <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden rounded-sm text-left">
              <div className="bg-[#003366] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-left">
                Officiella Uppdateringar
              </div>

              <div className="p-4 md:p-8 text-left">
                {loading ? (
                  <div className="space-y-8 text-left">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-zinc-100 animate-pulse rounded-sm" />)}
                  </div>
                ) : (
                  <div className="space-y-12 text-left">
                    {news.map((article) => (
                      <article key={article.id} className="group text-left">
                        <div className="aspect-video relative overflow-hidden rounded-sm border border-zinc-100 mb-6">
                          <Image src={article.image_url} alt="" fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="flex items-center gap-3 mb-3 text-left">
                          <span className="text-[9px] font-black uppercase text-[#a11a2d] bg-red-50 px-2 py-0.5 rounded-sm">Nyhet</span>
                          <span className="text-[9px] text-zinc-400 font-bold uppercase flex items-center gap-1"><Clock size={10} /> {article.date}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-[#003366] uppercase tracking-tighter italic mb-4 leading-tight group-hover:text-[#a11a2d] transition-colors text-left">
                          {article.title}
                        </h2>
                        <p className="text-sm md:text-base text-zinc-600 font-medium leading-relaxed mb-6 text-left">{article.description}</p>
                        <div className="h-px w-full bg-zinc-50"></div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <PremiumAdsSidebar />
        </div>
      </main>
    </div>
  )
}
