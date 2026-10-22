'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { Calendar, Users, MapPin } from 'lucide-react'
import SearchBar from '@/components/search/SearchBar'
import HomeHero from "@/components/HomeHero";
import SidebarNav from "@/components/layout/SidebarNav";
import PremiumAdsSidebar from "@/components/ads/PremiumAdsSidebar";
import { useTranslation } from "@/utils/translations";
import { getMenuPageCopy } from "@/utils/menu-page-copy";

interface EventItem {
  id: string
  image_url: string
  date: string
  title: string
  description: string
  location: string
}

export default function EvenemangPage() {
  const { lang } = useTranslation()
  const pageText = getMenuPageCopy(lang)
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const fetchData = async () => {
      const { data: eventsData } = await supabase.from('events').select('*').order('created_at', { ascending: false })
      if (eventsData) setEvents(eventsData as EventItem[])
      setLoading(false)
    }
    void fetchData()
  }, [supabase])

  const dateLocale = { pl: 'pl-PL', sv: 'sv-SE', ua: 'uk-UA', en: 'en-US' }[lang]
  const today = new Date().toLocaleDateString(dateLocale, {
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
            <span className="flex items-center gap-1"><Users size={12} /> 142 {pageText.common.online}</span>
            <span className="hidden sm:inline border-l pl-4 font-bold text-[#a11a2d]">{pageText.common.welcome}</span>
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

          <aside className="hidden md:block md:col-span-3 lg:col-span-1 space-y-6 text-left">
            <SidebarNav />
          </aside>

          <div className="col-span-1 md:col-span-9 lg:col-span-2 space-y-6 text-left">
            <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden rounded-sm text-left">
              <div className="bg-[#003366] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-left">
                {pageText.events.upcoming}
              </div>

              <div className="p-4 md:p-6 text-left">
                {loading ? (
                  <div className="space-y-6 text-left">
                    {[1, 2].map(i => <div key={i} className="h-48 bg-zinc-100 animate-pulse rounded-sm" />)}
                  </div>
                ) : (
                  <div className="space-y-8 text-left">
                    {events.length === 0 && <p className="text-center py-10 text-zinc-400">{pageText.events.empty}</p>}
                    {events.map((event) => (
                      <div key={event.id} className="bg-white border border-zinc-100 rounded-sm overflow-hidden shadow-sm flex flex-col sm:flex-row group hover:shadow-md transition-all text-left">
                        <div className="w-full sm:w-56 aspect-video sm:aspect-auto relative overflow-hidden flex-shrink-0">
                          <Image src={event.image_url} alt="" fill sizes="(max-width: 640px) 100vw, 224px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between text-left">
                          <div className="text-left">
                            <div className="flex items-center gap-2 mb-2 text-left">
                              <Calendar size={12} className="text-[#a11a2d]" />
                              <span className="text-[9px] font-black uppercase text-[#a11a2d] tracking-widest">{event.date}</span>
                            </div>
                            <h2 className="text-xl font-bold text-[#003366] mb-3 italic leading-tight group-hover:text-[#a11a2d] transition-colors text-left">{event.title}</h2>
                            <p className="text-xs text-zinc-500 font-medium leading-relaxed line-clamp-3 mb-4 text-left">{event.description}</p>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-widest border-t border-zinc-50 pt-4 text-left">
                            <MapPin size={14} className="text-zinc-300" /> {event.location}
                          </div>
                        </div>
                      </div>
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
