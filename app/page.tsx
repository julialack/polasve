import Link from "next/link";
import PostBox from "@/components/feed/PostBox";
import FeedList from "@/components/feed/FeedList";
import SearchBar from "@/components/search/SearchBar";
import HomeHero from "@/components/HomeHero";
import InfoBar from "@/components/layout/InfoBar";
import SidebarNav from "@/components/layout/SidebarNav";
import SwedenMap from "@/components/map/SwedenMap";
import SafeImage from "@/components/ui/SafeImage";
import { createClient } from "@/utils/supabase/server";
import { Newspaper, Calendar, Box, Info, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";

const AdBox = ({ title, href, variant = 'gray' }: { title: string, href?: string, variant?: 'gray' | 'gold' }) => {
  const content = (
    <div className="aspect-[4/3] bg-zinc-50 rounded-sm flex flex-col items-center justify-center text-center p-4 border border-zinc-100 group-hover:border-[#a11a2d]/30 transition-all">
      <ShieldCheck size={20} className={`mb-2 transition-colors ${
        variant === 'gold' ? 'text-[#D4AF37]' : 'text-zinc-200 group-hover:text-[#a11a2d]/40'
      }`} />
      <p className={`text-[10px] font-black uppercase tracking-widest leading-tight ${
        variant === 'gold' ? 'text-[#D4AF37]' : 'text-zinc-500'
      }`}>{title}</p>
      <p className={`text-[8px] font-bold mt-1 ${
        variant === 'gold' ? 'text-[#D4AF37]/80' : 'text-zinc-400'
      }`}>Kontakta oss för info</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block bg-white border-2 border-dashed border-zinc-200 p-2 rounded-sm transition-all hover:scale-[1.02] group cursor-pointer">
        {content}
      </Link>
    );
  }

  return (
    <div className="bg-white border-2 border-dashed border-zinc-200 p-2 rounded-sm transition-colors group">
      {content}
    </div>
  );
};

export default async function Home() {
  const supabase = await createClient();

  const [{ data: adsData }, { data: newsData }] = await Promise.all([
    supabase.from('ads').select('*').eq('is_premium', true).order('created_at', { ascending: false }).limit(4),
    supabase.from('news').select('*').order('created_at', { ascending: false }).limit(4)
  ]);

  const featuredAds = adsData || [];
  const news = newsData || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <HomeHero />
      <InfoBar />

      <div className="bg-zinc-50 border-b border-zinc-100 py-6 px-6">
        <div className="max-w-4xl mx-auto">
          <SearchBar />
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-4 gap-6">

          {/* LEFT SIDEBAR */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-1 space-y-6">
            <SidebarNav />

            {/* AD BOXES LEFT */}
            <div className="space-y-4 pt-2">
              <AdBox title="Gör reklam för ditt företag" variant="gold" href="/reklam" />
              <AdBox title="Din logotyp här?" href="/reklam" />
              <AdBox title="Nå 1000-tals polacker" href="/reklam" />
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="col-span-1 md:col-span-9 lg:col-span-2 space-y-6">

            {/* Bazar - Premium (Moved to center) */}
            <section className="bg-white border border-zinc-200 shadow-sm overflow-hidden">
              <div className="bg-[#a11a2d] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">Bazar - Premium</div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featuredAds.map((ad) => (
                  <Link href={`/annonser/${ad.id}`} key={ad.id} className={`block group border border-zinc-100 p-3 rounded-sm hover:shadow-md transition-all ${ad.status === 'finished' ? 'opacity-60' : ''}`}>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-zinc-100 relative overflow-hidden border rounded-sm flex-shrink-0">
                        <SafeImage
                          src={ad.image_url || ""}
                          alt={ad.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          fallbackSrc="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200&auto=format&fit=crop"
                        />
                        {ad.status === 'finished' && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-[7px] font-black text-white uppercase tracking-widest rotate-[-15deg] border border-white px-1 py-0.5">SÅLD</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold italic leading-tight truncate text-[11px] ${ad.status === 'finished' ? 'text-zinc-500 line-through' : 'text-[#003366]'}`}>{ad.title}</h4>
                        <p className={`text-[10px] font-black mt-2 ${ad.status === 'finished' ? 'text-zinc-400' : 'text-[#D4AF37]'}`}>{ad.status === 'finished' ? 'Avslutad' : (ad.price || 'Bud')}</p>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1 italic">{ad.location}</p>
                        <span className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest mt-1 block">Visa annons &raquo;</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/annonser" className="block text-center py-3 bg-zinc-50 text-[10px] font-black text-zinc-500 hover:text-red-800 uppercase tracking-widest border-t transition-colors italic">Visa hela bazaren &gt;&gt;</Link>
            </section>

            {/* Community Feed */}
            <section className="bg-white border border-zinc-200 shadow-sm overflow-hidden">
              <div className="bg-[#003366] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                <span>Community Flöde - Realtid</span>
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              </div>
              <div className="p-4 md:p-6"><PostBox /><FeedList /></div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Toppnyheter (Moved to right sidebar) */}
            <section className="bg-white border border-zinc-200 shadow-sm overflow-hidden">
              <div className="bg-[#a11a2d] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider">Toppnyheter</div>
              <div className="p-4 space-y-4">
                {news.length > 0 ? (
                  news.map((item) => (
                    <Link key={item.id} href="/nyheter" className="flex gap-3 group border-b border-zinc-50 pb-3 last:border-0">
                      <div className="w-12 h-12 relative flex-shrink-0 rounded-sm overflow-hidden border">
                        <SafeImage
                          src={item.image_url || ""}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <h4 className="text-[10px] font-bold text-zinc-800 leading-tight group-hover:text-blue-800 transition-colors italic line-clamp-2">{item.title}</h4>
                    </Link>
                  ))
                ) : <p className="text-center py-4 text-zinc-400 italic text-[10px]">Inga nyheter...</p>}
              </div>
              <Link href="/nyheter" className="block text-center py-3 bg-zinc-50 text-[10px] font-black text-zinc-500 hover:text-[#003366] uppercase tracking-widest border-t transition-colors italic">Läs alla nyheter &raquo;</Link>
            </section>

            {/* External News Sources (Compact) */}
            <section className="bg-white border border-zinc-200 shadow-sm overflow-hidden rounded-sm">
              <div className="bg-zinc-800 text-white px-4 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Newspaper size={10} /> Polska Medier
              </div>
              <div className="p-2 grid grid-cols-2 gap-2">
                <a
                  href="https://tvn24.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-zinc-50 hover:bg-[#005bbb] hover:text-white transition-all border border-zinc-100 rounded-sm group"
                >
                  <span className="text-[9px] font-black italic tracking-tighter">TVN24</span>
                  <ExternalLink size={10} className="opacity-30 group-hover:opacity-100" />
                </a>
                <a
                  href="https://www.onet.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-zinc-50 hover:bg-[#f7d117] hover:text-black transition-all border border-zinc-100 rounded-sm group"
                >
                  <span className="text-[9px] font-black italic tracking-tighter">ONET</span>
                  <ExternalLink size={10} className="opacity-30 group-hover:opacity-100" />
                </a>
              </div>
            </section>

            <section className="bg-white border border-zinc-200 overflow-hidden shadow-sm">
                <div className="bg-[#003366] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider">Sverigekartan</div>
               <SwedenMap />
            </section>

            {/* AD BOXES RIGHT */}
            <div className="space-y-4">
              <AdBox title="Annonsera här" href="/reklam" />
              <AdBox title="Ditt meddelande" href="/reklam" />
              <AdBox title="Support Polasve" href="/reklam" />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
