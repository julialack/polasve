'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import HomeHero from "@/components/HomeHero";
import InfoBar from "@/components/layout/InfoBar";
import SidebarNav from "@/components/layout/SidebarNav";
import DonationCard from "@/components/ui/DonationCard";
import ExternalNewsSidebar from "@/components/layout/ExternalNewsSidebar";
import SafeImage from "@/components/ui/SafeImage";
import { createClient } from '@/utils/supabase/client';
import { Heart, ShieldCheck, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

function StodOssContent() {
  const searchParams = useSearchParams()
  const isSuccess = searchParams.get('donation') === 'success'
  const amount = searchParams.get('amount')

  const [news, setNews] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4)
      if (data) setNews(data)
    }
    fetchNews()
  }, [supabase])

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-left font-sans">
      <HomeHero />
      <InfoBar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-6 md:py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#003366] transition-colors mb-6 text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft size={14} /> Tillbaka till startsidan
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-4 gap-6">

          {/* LEFT SIDEBAR */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-1">
            <SidebarNav />
          </aside>

          {/* MAIN CONTENT */}
          <div className="col-span-1 md:col-span-9 lg:col-span-2 space-y-6 md:space-y-8 text-left">

            {/* Thank You Banner on Success */}
            {isSuccess && (
              <div className="bg-emerald-50 border-2 border-emerald-500 p-6 md:p-8 rounded-sm shadow-xl text-center animate-in zoom-in-95 duration-300">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart size={32} className="fill-white" />
                </div>
                <h2 className="text-xl md:text-3xl font-black text-emerald-950 uppercase italic mb-2">
                  Tack för ditt bidrag! 🎉
                </h2>
                <p className="text-emerald-900 font-bold text-xs md:text-base max-w-lg mx-auto leading-relaxed">
                  Ditt stöd på <span className="underline font-black">{amount ? `${amount} kr` : 'frivilligt belopp'}</span> betyder oerhört mycket för oss och hjälper till att driva och utveckla Polasve community vidare! ❤️
                </p>
              </div>
            )}

            <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden rounded-sm">
              <div className="bg-[#a11a2d] text-white px-4 md:px-6 py-3.5 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Heart size={16} className="fill-white" /> Stöd Polasve Community
              </div>

              <div className="p-4 md:p-10 text-left">
                <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-[#003366] uppercase tracking-tighter italic mb-4 leading-tight">
                  Hjälp oss bygga den bästa <span className="text-[#a11a2d]">portalen för polacker i Sverige</span>
                </h1>

                <p className="text-xs md:text-base text-zinc-600 font-medium leading-relaxed mb-6 md:mb-8">
                  Polasve skapades för att göra det lättare för polacker i Sverige att hitta jobb, bostäder, köpa & sälja prylar, hålla sig uppdaterade med nyheter och lära känna varandra.
                </p>

                {/* Donation Card */}
                <div className="mb-8 md:mb-10">
                  <DonationCard />
                </div>

                {/* What donations fund */}
                <div className="bg-zinc-50 border border-zinc-100 p-4 md:p-6 rounded-sm space-y-3 md:space-y-4">
                  <h3 className="text-[11px] md:text-xs font-black uppercase tracking-widest text-[#003366] flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#a11a2d]" /> Vad går bidragen till?
                  </h3>
                  <ul className="space-y-2.5 text-xs text-zinc-600 font-medium">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>Drift, servrar och snabb prestanda för alla besökare.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>Utveckling av nya funktioner (t.ex. bättre sökfilter, direktchatt och evenemang).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>Modereringsverktyg och säkerhet så att alla kan känna sig trygga.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR (Standard Homepage Sidebar) */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6 text-left">
            {/* Live Poland News */}
            <ExternalNewsSidebar />

            {/* Toppnyheter */}
            <section className="bg-white border border-zinc-200 shadow-sm overflow-hidden text-left">
              <div className="bg-[#a11a2d] text-white px-4 py-2 text-[10px] font-black uppercase tracking-wider">Toppnyheter</div>
              <div className="p-4 space-y-4 text-left">
                {news.length > 0 ? (
                  news.map((item) => (
                    <Link key={item.id} href="/nyheter" className="flex gap-3 group border-b border-zinc-50 pb-3 last:border-0 text-left">
                      <div className="w-12 h-12 relative flex-shrink-0 rounded-sm overflow-hidden border">
                        <SafeImage
                          src={item.image_url || ""}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <h4 className="text-[10px] font-bold text-zinc-800 leading-tight group-hover:text-blue-800 transition-colors italic line-clamp-2 text-left">{item.title}</h4>
                    </Link>
                  ))
                ) : <p className="text-center py-4 text-zinc-400 italic text-[10px]">Inga nyheter...</p>}
              </div>
              <Link href="/nyheter" className="block text-center py-3 bg-zinc-50 text-[10px] font-black text-zinc-500 hover:text-[#003366] uppercase tracking-widest border-t transition-colors italic">Läs alla nyheter &raquo;</Link>
            </section>
          </aside>

        </div>
      </main>
    </div>
  );
}

export default function StodOssPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center italic text-zinc-400 text-sm">Laddar sida...</div>}>
      <StodOssContent />
    </Suspense>
  )
}
