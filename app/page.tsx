import Link from "next/link";
import PostBox from "@/components/feed/PostBox";
import FeedList from "@/components/feed/FeedList";
import SearchBar from "@/components/search/SearchBar";
import SwedenMap from "@/components/map/SwedenMap";
import { createClient } from "@/utils/supabase/server";
import { Newspaper, Calendar, Box, Info, Users, ArrowRight } from "lucide-react";

async function getFeaturedAds() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('ads')
    .select('*')
    .eq('is_premium', true)
    .order('created_at', { ascending: false })
    .limit(4)
  return data || []
}

export default async function Home() {
  const featuredAds = await getFeaturedAds();
  const today = new Date().toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      {/* Top Portal Info Bar */}
      <div className="bg-white border-b border-zinc-200 py-2 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] md:text-xs text-zinc-500 font-medium">
          <div className="capitalize font-bold text-[#003366]">{today}</div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><Users size={12} /> 142 online</span>
            <span className="hidden sm:inline border-l pl-4">Besökare idag: 4 021</span>
          </div>
        </div>
      </div>

      {/* Global Search Bar Section */}
      <div className="bg-zinc-50 border-b border-zinc-100 py-6 px-6">
        <div className="max-w-4xl mx-auto">
          <SearchBar />
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-4 gap-6">

          {/* LEFT SIDEBAR: Professional Links */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-1 space-y-6">
            {/* Section 1: Information */}
            <section className="bg-white shadow-sm overflow-hidden border border-zinc-200 rounded-sm">
              <div className="bg-[#a11a2d] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
                Information
              </div>
              <div className="p-5">
                <p className="text-[11px] text-zinc-600 leading-relaxed italic font-serif">
                  "Samlingsplatsen för polska nätverk i Sverige. Upptäck möjligheter och gemenskap."
                </p>
              </div>
            </section>

            {/* Section 2: Huvudmeny */}
            <section className="bg-white p-5 border border-zinc-200 shadow-sm relative overflow-hidden rounded-sm">
               <div className="absolute top-0 left-0 w-1 h-full bg-[#003366]"></div>
               <h4 className="text-[10px] font-black uppercase text-[#003366] mb-4 tracking-widest">Huvudmeny</h4>
               <nav className="flex flex-col space-y-1">
                {[
                  { name: "Forum / Bazar", href: "/annonser", icon: <Box size={14} /> },
                  { name: "Senaste Nyheterna", href: "/nyheter", icon: <Newspaper size={14} /> },
                  { name: "Event & Kultur", href: "/evenemang", icon: <Calendar size={14} /> },
                  { name: "Om oss / Kontakt", href: "/om-oss", icon: <Info size={14} /> },
                ].map((item) => (
                  <Link key={item.name} href={item.href} className="flex items-center justify-between py-2.5 hover:text-red-800 text-[11px] font-bold text-[#003366] border-b border-zinc-50 last:border-0 transition-colors group">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {item.name}
                    </div>
                    <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </nav>
            </section>

            {/* Ad Banner Placeholders */}
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-zinc-100 flex items-center justify-center text-zinc-400 text-[10px] font-bold uppercase border border-dashed border-zinc-300 text-center px-6">
                 Här kan ni annonsera ert företag
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="col-span-1 md:col-span-9 lg:col-span-2 space-y-6">

            {/* Top Featured Content */}
            {/* Mobile Only: Top Premium Ads */}
            <section className="block md:hidden bg-white border border-zinc-200 shadow-sm overflow-hidden">
              <div className="bg-[#a11a2d] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
                Toppannonser
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {featuredAds.length > 0 ? (
                    featuredAds.map((ad) => (
                      <Link href={`/annonser/${ad.id}`} key={ad.id} className="flex gap-4 items-center group border-b border-zinc-50 last:border-0 pb-4 last:pb-0">
                        <div className="w-20 h-20 bg-zinc-100 flex-shrink-0 rounded-sm overflow-hidden border border-zinc-100">
                          <img src={ad.image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200&auto=format&fit=crop"} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h4 className="text-sm font-bold text-[#003366] truncate italic">{ad.title}</h4>
                          <p className="text-[10px] text-[#a11a2d] font-bold mt-1">{ad.price || 'Diskuteras'}</p>
                          <p className="text-[9px] text-zinc-400 mt-1">📍 {ad.location}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-[10px] text-zinc-400 font-serif italic text-center">Inga premiumannonser just nu.</p>
                  )}
                </div>
              </div>
            </section>

            {/* Desktop Only: Top Featured News */}
            <section className="hidden md:block bg-white border border-zinc-200 shadow-sm overflow-hidden">
              <div className="bg-[#a11a2d] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
                Toppnyheter
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Link href="/nyheter" className="group">
                    <div className="aspect-video bg-zinc-100 mb-3 overflow-hidden rounded-sm border border-zinc-100">
                      <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="News" />
                    </div>
                    <h3 className="font-bold text-sm text-[#003366] group-hover:underline italic leading-snug">Polsk kulturvecka i Sverige 2026</h3>
                    <p className="text-[10px] text-zinc-500 mt-2 line-clamp-2 leading-relaxed">Upplev konst, musik och film i Stockholm. Läs mer om årets största händelse för communityt...</p>
                  </Link>
                  <div className="space-y-4">
                    {[
                      { title: "Nya jobbmöjligheter inom IT", img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=100&auto=format&fit=crop" },
                      { title: "Utställning i Göteborg nästa vecka", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=100&auto=format&fit=crop" },
                      { title: "Tips för dig som söker bostad", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=100&auto=format&fit=crop" },
                    ].map((news, i) => (
                      <Link key={i} href="/nyheter" className="flex gap-3 group border-b border-zinc-50 pb-2 last:border-0 last:pb-0">
                        <div className="w-12 h-12 bg-zinc-100 flex-shrink-0 rounded-sm overflow-hidden border border-zinc-100">
                           <img src={news.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                        </div>
                        <h4 className="text-[11px] font-bold text-zinc-800 leading-tight group-hover:text-blue-800 transition-colors italic">{news.title}</h4>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Community Feed */}
            <section className="bg-white border border-zinc-200 shadow-sm overflow-hidden">
              <div className="bg-[#003366] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                <span>Community Flöde - Realtid</span>
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              </div>
              <div className="p-4 md:p-6">
                <PostBox />
                <FeedList />
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <section className="bg-white shadow-sm overflow-hidden border border-zinc-200">
              <div className="bg-[#a11a2d] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
                Bazar - Premium
              </div>
              <div className="p-4 space-y-5">
                {featuredAds.length > 0 ? (
                  featuredAds.map((ad) => (
                    <Link href={`/annonser/${ad.id}`} key={ad.id} className="block group border-b border-zinc-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-zinc-100 flex-shrink-0 rounded-sm overflow-hidden border border-zinc-100">
                          <img src={ad.image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold text-[#003366] group-hover:underline leading-tight italic">{ad.title}</h4>
                          <p className="text-[10px] text-[#a11a2d] font-bold mt-1">{ad.price || 'Diskuteras'}</p>
                          <p className="text-[9px] text-zinc-400 uppercase tracking-tighter mt-0.5 font-bold">📍 {ad.location}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  [
                    { title: "Hantverkstjänster", img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=200&auto=format&fit=crop", price: "Fast pris" },
                    { title: "Bostad i Warszawa", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=200&auto=format&fit=crop", price: "7500 kr" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 border-b border-zinc-50 last:border-0 pb-4 last:pb-0 opacity-80">
                      <div className="w-16 h-16 bg-zinc-100 flex-shrink-0 rounded-sm overflow-hidden">
                        <img src={item.img} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-[#003366] leading-tight italic">{item.title}</h4>
                        <p className="text-[10px] text-[#a11a2d] font-bold mt-1">{item.price}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link href="/annonser" className="block text-center py-3 bg-zinc-50 text-[10px] font-black text-zinc-500 hover:text-red-800 uppercase tracking-[0.2em] border-t border-zinc-100 transition-colors">
                Visa Bazar &gt;&gt;
              </Link>
            </section>

            {/* Updated Section: Interactive Sweden Map */}
            <section className="bg-white border border-zinc-200 p-0 overflow-hidden shadow-sm">
                <div className="bg-[#003366] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider">Sverigekartan</div>
               <SwedenMap />
            </section>
          </aside>

        </div>
      </main>

      <footer className="bg-zinc-900 text-zinc-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 text-center md:text-left">
          <div className="max-w-xs">
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs italic">Polacker i Sverige</h4>
            <p className="text-[11px] leading-relaxed">Din officiella portal för nyheter, karriär och gemenskap. Vi sammanför det polska communityt i Sverige sedan 2026.</p>
          </div>
          <div className="flex gap-16 mx-auto md:mx-0 text-left">
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[10px]">Länkar</h4>
              <ul className="space-y-2 text-[10px]">
                <li><Link href="/nyheter" className="hover:text-white transition-colors">Nyhetsarkiv</Link></li>
                <li><Link href="/evenemang" className="hover:text-white transition-colors">Evenemang</Link></li>
                <li><Link href="/annonser" className="hover:text-white transition-colors">Bazar</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-white text-[11px] font-bold">© {new Date().getFullYear()} POLASVE</p>
            <p className="text-[10px] mt-2 uppercase tracking-widest">Gemenskap • Förtroende • Kvalitet</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
