'use client'

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import SwedenMap from "@/components/map/SwedenMap";

interface Ad {
  id: string
  title: string
  image_url: string | null
  price: string | null
  location: string
}

export default function PremiumAdsSidebar() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchPremiumAds = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('ads')
        .select('id, title, image_url, price, location')
        .eq('is_premium', true)
        .order('created_at', { ascending: false })
        .limit(5)

      if (data) setAds(data)
      setLoading(false)
    }

    fetchPremiumAds()
  }, [supabase])

  return (
    <aside className="hidden lg:block lg:col-span-1 space-y-6">
      <section className="bg-white shadow-sm overflow-hidden border border-zinc-200">
        <div className="bg-[#a11a2d] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">Bazar - Premium</div>
        <div className="p-4 space-y-5">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-16 h-16 bg-zinc-100 rounded-sm"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-2 bg-zinc-100 rounded w-3/4"></div>
                    <div className="h-2 bg-zinc-100 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : ads.length > 0 ? (
            ads.map((ad) => (
              <Link
                href={`/annonser/${ad.id}`}
                key={ad.id}
                className="block group p-4 border border-zinc-100 rounded-sm bg-white hover:bg-red-50/40 hover:border-red-100 hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95 cursor-pointer relative z-30 mb-2"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-zinc-100 relative overflow-hidden border border-zinc-200 rounded-sm flex-shrink-0">
                    <img src={ad.image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200&auto=format&fit=crop"} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12px] font-black text-[#003366] italic leading-tight truncate group-hover:text-[#a11a2d] transition-colors">{ad.title}</h4>
                    <p className="text-[11px] text-[#D4AF37] font-black mt-2">{ad.price || 'Bud'}</p>
                    <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a11a2d] opacity-50"></span> {ad.location}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-[10px] text-zinc-400 italic text-center py-4">Inga premiumannonser just nu.</p>
          )}
        </div>
        <Link href="/annonser" className="block text-center py-3 bg-zinc-50 text-[10px] font-black text-zinc-500 hover:text-red-800 uppercase tracking-widest border-t transition-colors italic text-center">Visa Bazar &gt;&gt;</Link>
      </section>
      <section className="bg-white border border-zinc-200 overflow-hidden shadow-sm">
        <div className="bg-[#003366] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider">Sverigekartan</div>
        <SwedenMap />
      </section>
    </aside>
  );
}
