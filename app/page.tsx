import Link from "next/link";
import PostBox from "@/components/feed/PostBox";
import FeedList from "@/components/feed/FeedList";
import SearchBar from "@/components/search/SearchBar";
import HomeHero from "@/components/HomeHero";
import InfoBar from "@/components/layout/InfoBar";
import SidebarNav from "@/components/layout/SidebarNav";
import SwedenMap from "@/components/map/SwedenMap";
import SafeImage from "@/components/ui/SafeImage";
import ExternalNewsSidebar from "@/components/layout/ExternalNewsSidebar";
import { createClient } from "@/utils/supabase/server";
import { Newspaper, Calendar, Box, Info, ArrowRight, ShieldCheck, ExternalLink, Briefcase, Home as HomeIcon, Tag, ShoppingCart, Wrench } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

const AdBox = ({ title, href, variant = 'gray' }: { title: string, href?: string, variant?: 'gray' | 'gold' }) => {
  const content = (
    <div className={`bg-zinc-50 rounded-sm flex flex-col items-center justify-center text-center p-3 border border-zinc-100 transition-all ${
      variant === 'gold' ? 'group-hover:border-premium-gold/30' : 'group-hover:border-pola-red/30'
    }`}>
      <ShieldCheck size={16} className={`mb-1.5 transition-colors ${
        variant === 'gold' ? 'text-premium-gold' : 'text-zinc-300 group-hover:text-pola-red/40'
      }`} />
      <p className={`text-[9px] font-black uppercase tracking-tight leading-tight ${
        variant === 'gold' ? 'text-premium-gold' : 'text-zinc-600'
      }`}>{title}</p>
      <p className={`text-[7px] font-bold mt-1 ${
        variant === 'gold' ? 'text-premium-gold/80' : 'text-zinc-400'
      }`}>Klicka för info</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block bg-white border-2 border-dashed border-zinc-200 p-1.5 rounded-sm transition-all hover:scale-[1.01] group cursor-pointer">
        {content}
      </Link>
    );
  }

  return (
    <div className="bg-white border-2 border-dashed border-zinc-200 p-1.5 rounded-sm transition-colors group">
      {content}
    </div>
  );
};

export default async function Home() {
  const supabase = await createClient();

  const [{ data: adsData }, { data: newsData }] = await Promise.all([
    supabase
      .from('ads')
      .select('*')
      .eq('is_premium', true)
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4)
  ]);

  const featuredAds = adsData || [];
  const news = newsData || [];

  const quickCategories = [
    { name: "Jobb", href: "/jobb", icon: <Briefcase size={20} />, color: "bg-blue-50 text-blue-600" },
    { name: "Bostad", href: "/bostad", icon: <HomeIcon size={20} />, color: "bg-green-50 text-green-600" },
    { name: "Säljes", href: "/marketplace/salj", icon: <Tag size={20} />, color: "bg-red-50 text-red-600" },
    { name: "Köpes", href: "/marketplace/kop", icon: <ShoppingCart size={20} />, color: "bg-amber-50 text-amber-600" },
    { name: "Tjänster", href: "/tjanster", icon: <Wrench size={20} />, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <HomeHero />
      <InfoBar />

      <div className="bg-zinc-50 border-b border-zinc-100 py-4 md:py-6 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <SearchBar />

          {/* Quick Category Navigation (Mobile Only) */}
          <div className="flex md:hidden overflow-x-auto gap-4 pb-2 scrollbar-hide">
            {quickCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="flex flex-col items-center gap-2 min-w-[70px] shrink-0 group"
              >
                <div className={`w-12 h-12 ${cat.color} rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-[#003366] transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-4 gap-4 md:gap-6">

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

            {/* Bazar - Premium (Mobile: Horizontal Scroll, Desktop: Grid) */}
            <section className="bg-white border-y md:border border-zinc-200 shadow-sm overflow-hidden rounded-sm">
              <div className="bg-[#a11a2d] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                <span>Bazar - Premium</span>
                <Link href="/annonser" className="text-[10px] font-bold hover:underline">Visa alla &raquo;</Link>
              </div>

              <div className="grid grid-rows-2 grid-flow-col md:grid-cols-2 md:grid-rows-none md:grid-flow-row overflow-x-auto md:overflow-x-visible gap-3 md:gap-4 p-4 scrollbar-hide snap-x scroll-smooth pb-6 md:pb-4">
                {featuredAds.map((ad) => (
                  <Link
                    href={`/annonser/${ad.id}`}
                    key={ad.id}
                    className={`min-w-[160px] md:min-w-0 snap-center block group border border-zinc-100 p-2.5 md:p-4 rounded-sm hover:shadow-md transition-all ${ad.status === 'finished' ? 'opacity-60' : ''} bg-white`}
                  >
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                      <div className="w-full md:w-20 h-24 md:h-20 bg-zinc-100 relative overflow-hidden border rounded-sm flex-shrink-0">
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
                        <h4 className={`font-bold italic leading-tight truncate text-[10px] md:text-[11px] ${ad.status === 'finished' ? 'text-zinc-500 line-through' : 'text-sve-blue'}`}>{ad.title}</h4>
                        <p className={`text-[9px] font-black mt-1 md:mt-2 ${ad.status === 'finished' ? 'text-zinc-400' : 'text-premium-gold'}`}>{ad.status === 'finished' ? 'Avslutad' : (ad.price || 'Bud')}</p>
                        <p className="text-[8px] text-zinc-500 font-bold uppercase mt-0.5 italic">{ad.location}</p>
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
              <div className="p-4 md:p-6">
                <PostBox />

                {/* Mobile Ad Injector (Visible only on mobile) */}
                <div className="md:hidden mb-6">
                   <AdBox title="Vill du synas här? Kontakta oss!" variant="gold" href="/reklam" />
                </div>

                <FeedList />
              </div>
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

            {/* Live Poland News */}
            <ExternalNewsSidebar />

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
