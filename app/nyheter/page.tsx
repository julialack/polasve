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
  const [polandNews, setPolandNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [polandLoading, setPolandLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false })
      if (newsData) setNews(newsData)
      setLoading(false)
    }

    const fetchPolandNews = async () => {
      setPolandLoading(true)
      try {
        const res = await fetch('/api/poland-news')
        const data = await res.json()
        if (Array.isArray(data)) setPolandNews(data)
      } catch (e) {
        console.error("Failed to fetch Poland news")
      } finally {
        setPolandLoading(false)
      }
    }

    fetchData()
    fetchPolandNews()
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
          <div className="col-span-1 md:col-span-9 lg:col-span-2 space-y-8 text-left">

            {/* Poland Real-time News Section */}
            <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden rounded-sm text-left">
              <div className="bg-[#a11a2d] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex justify-between items-center text-left">
                <span>Senaste nytt från Polen (Realtid)</span>
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              </div>
              <div className="p-4 md:p-6 text-left">
                {polandLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-zinc-50 animate-pulse rounded-sm" />)}
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {(() => {
                      // Filter to ensure variety: Keep max 3 from TVN24 if we have other sources
                      const tvn24 = polandNews.filter(n => n.source === 'TVN24');
                      const others = polandNews.filter(n => n.source !== 'TVN24');
                      const combined = [...others.slice(0, 4), ...tvn24.slice(0, 4)].sort((a, b) =>
                        new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
                      ).slice(0, 8);

                      return combined.map((item, idx) => (
                        <a
                          key={idx}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col bg-zinc-50 hover:bg-white p-3 rounded-sm border border-zinc-100 hover:border-sve-blue transition-all group shadow-sm"
                        >
                          <div className="aspect-video w-full relative mb-3 overflow-hidden rounded-sm bg-white border border-zinc-100">
                            {item.image ? (
                              <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase text-zinc-300 p-4 text-center leading-tight" style={{ color: item.color }}>
                                {item.source}
                              </div>
                            )}
                            <div className="absolute top-2 left-2">
                              <span
                                className="text-[7px] font-black uppercase px-2 py-0.5 rounded-sm text-white shadow-lg"
                                style={{ backgroundColor: item.color }}
                              >
                                {item.source}
                              </span>
                            </div>
                          </div>
                          <h3 className="text-[11px] font-bold text-sve-blue leading-tight group-hover:text-pola-red transition-colors line-clamp-3 italic">
                            {item.title}
                          </h3>
                          <div className="mt-auto pt-2 flex justify-between items-center">
                             <span className="text-[7px] text-zinc-400 font-bold uppercase">{new Date(item.pubDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                             <ArrowRight size={10} className="text-zinc-300 group-hover:text-pola-red transition-all group-hover:translate-x-1" />
                          </div>
                        </a>
                      ));
                    })()}
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-zinc-50">
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest italic text-center">
                    Automatiskt uppdaterat från TVN24, Rzeczpospolita, Interia & Onet
                  </p>
                </div>
              </div>
            </div>

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
