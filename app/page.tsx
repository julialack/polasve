'use client'

import { useEffect, useState } from 'react'
import Link from "next/link";
import Image from "next/image";
import PostBox from "@/components/feed/PostBox";
import FeedList from "@/components/feed/FeedList";
import SearchBar from "@/components/search/SearchBar";
import SwedenMap from "@/components/map/SwedenMap";
import HomeHero from "@/components/HomeHero";
import { createClient } from "@/utils/supabase/client";
import { Newspaper, Calendar, Box, Info, Users, ArrowRight } from "lucide-react";

export default function Home() {
  const [featuredAds, setFeaturedAds] = useState<any[]>([])
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const today = new Date().toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: adsData }, { data: newsData }] = await Promise.all([
        supabase.from('ads').select('*').eq('is_premium', true).order('created_at', { ascending: false }).limit(4),
        supabase.from('news').select('*').order('created_at', { ascending: false }).limit(4)
      ])
      if (adsData) setFeaturedAds(adsData)
      if (newsData) setNews(newsData)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <HomeHero />

      {/* Portal Info Bar - Now under Hero */}
      <div className="bg-white border-b border-zinc-200 py-3 px-6">
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
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-4 gap-6">

          {/* LEFT SIDEBAR */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-1 space-y-6">
            <section className="bg-white shadow-sm overflow-hidden border border-zinc-200 rounded-sm">
              <div className="bg-[#a11a2d] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-left">Information</div>
              <div className="p-5">
                <p className="text-[11px] text-zinc-600 leading-relaxed italic font-serif">"Samlingsplatsen för polska nätverk i Sverige. Upptäck möjligheter och gemenskap."</p>
              </div>
            </section>

            <section className="bg-white p-5 border border-zinc-200 shadow-sm relative overflow-hidden rounded-sm">
               <div className="absolute top-0 left-0 w-1 h-full bg-[#003366]"></div>
               <h4 className="text-[10px] font-black uppercase text-[#003366] mb-4 tracking-widest text-left">Huvudmeny</h4>
               <nav className="flex flex-col space-y-1">
                {[
                  { name: "Forum / Bazar", href: "/annonser", icon: <Box size={14} /> },
                  { name: "Senaste Nyheterna", href: "/nyheter", icon: <Newspaper size={14} /> },
                  { name: "Event", href: "/evenemang", icon: <Calendar size={14} /> },
                  { name: "Om oss", href: "/om-oss", icon: <Info size={14} /> },
                ].map((item) => (
                  <Link key={item.name} href={item.href} className="flex items-center justify-between py-2.5 hover:text-red-800 text-[11px] font-bold text-[#003366] border-b border-zinc-50 last:border-0 transition-colors group text-left">
                    <div className="flex items-center gap-3">{item.icon}{item.name}</div>
                    <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </nav>
            </section>
          </aside>

          {/* MAIN CONTENT */}
          <div className="col-span-1 md:col-span-9 lg:col-span-2 space-y-6">
            {/* Top Featured News */}
            <section className="bg-white border border-zinc-200 shadow-sm overflow-hidden text-left">
              <div className="bg-[#a11a2d] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-left">Toppnyheter</div>
              <div className="p-4 text-left">
                {news.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                    <Link href="/nyheter" className="group text-left block">
                      <div className="aspect-video relative overflow-hidden rounded-sm border">
                        <Image src={news[0].image_url || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop"} alt="" fill className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <h3 className="font-bold text-sm text-[#003366] mt-3 leading-snug italic group-hover:underline text-left">{news[0].title}</h3>
                      <p className="text-[10px] text-zinc-500 mt-2 line-clamp-2 text-left">{news[0].description}</p>
                    </Link>
                    <div className="space-y-4 text-left">
                      {news.slice(1).map((item, i) => (
                        <Link key={i} href="/nyheter" className="flex gap-3 group border-b border-zinc-50 pb-2 last:border-0 text-left">
                          <div className="w-12 h-12 relative flex-shrink-0 rounded-sm overflow-hidden border">
                            <Image src={item.image_url || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=200&auto=format&fit=crop"} alt="" fill className="object-cover" />
                          </div>
                          <h4 className="text-[11px] font-bold text-zinc-800 leading-tight group-hover:text-blue-800 transition-colors italic text-left">{item.title}</h4>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : <p className="text-center py-10 text-zinc-400 italic text-xs">Väntar på dagens nyheter...</p>}
              </div>
            </section>

            {/* Community Feed */}
            <section className="bg-white border border-zinc-200 shadow-sm overflow-hidden text-left">
              <div className="bg-[#003366] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex justify-between items-center text-left">
                <span>Community Flöde - Realtid</span>
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              </div>
              <div className="p-4 md:p-6 text-left"><PostBox /><FeedList /></div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6 text-left">
            <section className="bg-white shadow-sm overflow-hidden border border-zinc-200 text-left">
              <div className="bg-[#a11a2d] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-left">Bazar - Premium</div>
              <div className="p-4 space-y-5 text-left">
                {featuredAds.map((ad) => (
                  <Link href={`/annonser/${ad.id}`} key={ad.id} className="block group border-b border-zinc-100 last:border-0 pb-4 text-left">
                    <div className="flex gap-4 text-left">
                      <div className="w-16 h-16 bg-zinc-100 relative overflow-hidden border rounded-sm"><Image src={ad.image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200&auto=format&fit=crop"} alt="" fill className="object-cover" /></div>
                      <div className="text-left flex-1 min-w-0"><h4 className="text-[11px] font-bold text-[#003366] italic leading-tight text-left truncate">{ad.title}</h4><p className="text-[10px] text-red-800 font-bold mt-1 text-left">{ad.price}</p></div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/annonser" className="block text-center py-3 bg-zinc-50 text-[10px] font-black text-zinc-500 hover:text-red-800 uppercase tracking-widest border-t transition-colors text-center font-bold italic">Visa Bazar &gt;&gt;</Link>
            </section>
            <section className="bg-white border border-zinc-200 overflow-hidden shadow-sm text-left">
                <div className="bg-[#003366] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-left">Sverigekartan</div>
               <SwedenMap />
            </section>
          </aside>
        </div>
      </main>

      <footer className="bg-zinc-900 text-zinc-400 py-12 px-6 text-center md:text-left mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 text-center md:text-left">
          <div className="max-w-xs text-center md:text-left">
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs italic text-center md:text-left">Polacker i Sverige</h4>
            <p className="text-[11px] leading-relaxed text-center md:text-left">Din officiella portal för nyheter, karriär och gemenskap. Vi sammanför det polska communityt i Sverige sedan 2026.</p>
          </div>
          <div className="flex gap-16 mx-auto md:mx-0 text-left">
            <div className="text-left">
              <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[10px] text-left">Länkar</h4>
              <ul className="space-y-2 text-[10px] text-left">
                <li className="text-left"><Link href="/nyheter" className="hover:text-white transition-colors text-left">Nyhetsarkiv</Link></li>
                <li className="text-left"><Link href="/evenemang" className="hover:text-white transition-colors text-left">Evenemang</Link></li>
                <li className="text-left"><Link href="/annonser" className="hover:text-white transition-colors text-left">Bazar</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-white text-[11px] font-bold text-right">© {new Date().getFullYear()} POLASVE</p>
            <p className="text-[10px] mt-2 uppercase tracking-widest text-right">Gemenskap • Förtroende • Kvalitet</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
