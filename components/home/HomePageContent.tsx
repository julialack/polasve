'use client'

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
import DonationCard from "@/components/ui/DonationCard";
import AdBox from "@/components/ads/AdBox";
import QuickCategoryNavigation from "@/components/home/QuickCategoryNavigation";
import MobileDonationBanner from "@/components/home/MobileDonationBanner";
import { useTranslation } from "@/utils/translations";

interface HomePageContentProps {
  featuredAds: any[]
  news: any[]
}

export default function HomePageContent({ featuredAds, news }: HomePageContentProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-left font-sans">
      <HomeHero />
      <InfoBar />

      <div className="bg-zinc-50 border-b border-zinc-100 py-4 md:py-6 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <SearchBar />

          <QuickCategoryNavigation />
        </div>
      </div>

      <MobileDonationBanner />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-6 py-4 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-4 gap-3 md:gap-6">

          {/* LEFT SIDEBAR */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-1 space-y-6">
            <SidebarNav />

            {/* AD BOXES LEFT */}
            <div className="space-y-4 pt-2">
              <AdBox title={t.advertiseBtn} variant="gold" href="/reklam" />
              <AdBox title={t.advertiseBtn} href="/reklam" />
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="col-span-1 md:col-span-9 lg:col-span-2 space-y-6">

            {/* Bazar - Premium (Mobile: Horizontal Scroll, Desktop: Grid) */}
            <section className="bg-white border-y md:border border-zinc-200 shadow-sm overflow-hidden rounded-sm text-left">
              <div className="bg-[#a11a2d] text-white px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex justify-between items-center gap-2">
                <span>{t.bazarTitle}</span>
                <Link href="/annonser" className="text-[9px] sm:text-[10px] font-bold hover:underline">{t.seeAll}</Link>
              </div>

              <div className="grid grid-rows-2 grid-flow-col md:grid-cols-2 md:grid-rows-none md:grid-flow-row overflow-x-auto md:overflow-x-visible gap-3 md:gap-4 p-3 sm:p-4 scrollbar-hide snap-x scroll-smooth pb-5 md:pb-4 text-left">
                {featuredAds.map((ad) => (
                  <Link
                    href={`/annonser/${ad.id}`}
                    key={ad.id}
                    className={`min-w-[160px] md:min-w-0 snap-center block group border border-zinc-100 p-2.5 md:p-4 rounded-sm hover:shadow-md transition-all ${ad.status === 'finished' ? 'opacity-60' : ''} bg-white text-left`}
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
                            <span className="text-[7px] font-black text-white uppercase tracking-widest rotate-[-15deg] border border-white px-1 py-0.5">{t.sold}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <h4 className={`font-bold italic leading-tight truncate text-[10px] md:text-[11px] ${ad.status === 'finished' ? 'text-zinc-500 line-through' : 'text-sve-blue'}`}>{ad.title}</h4>
                        <p className={`text-[9px] font-black mt-1 md:mt-2 ${ad.status === 'finished' ? 'text-zinc-400' : 'text-premium-gold'}`}>{ad.status === 'finished' ? t.finished : (ad.price || t.auction)}</p>
                        <p className="text-[8px] text-zinc-500 font-bold uppercase mt-0.5 italic">{ad.location}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/annonser" className="block text-center py-3 bg-zinc-50 text-[9px] sm:text-[10px] font-black text-zinc-500 hover:text-red-800 uppercase tracking-widest border-t transition-colors italic">{t.seeWholeBazar}</Link>
            </section>

            {/* Community Feed */}
            <section className="bg-white border border-zinc-200 shadow-sm overflow-hidden text-left">
              <div className="bg-[#003366] text-white px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex justify-between items-center gap-2">
                <span>{t.communityFeed}</span>
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              </div>
              <div className="p-3 sm:p-4 md:p-6 text-left">
                <PostBox />

                {/* Mobile Ad Injector */}
                <div className="md:hidden mb-6">
                   <AdBox title={t.advertiseBtn} variant="gold" href="/reklam" />
                </div>

                <FeedList />
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6 text-left">
            {/* Voluntary Donation / Support Community Card */}
            <DonationCard />

            {/* Live Poland News */}
            <ExternalNewsSidebar />

            {/* Toppnyheter */}
            <section className="bg-white border border-zinc-200 shadow-sm overflow-hidden text-left">
              <div className="bg-[#a11a2d] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider">{t.topNews}</div>
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
                ) : <p className="text-center py-4 text-zinc-400 italic text-[10px]">{t.noNews}</p>}
              </div>
              <Link href="/nyheter" className="block text-center py-3 bg-zinc-50 text-[10px] font-black text-zinc-500 hover:text-[#003366] uppercase tracking-widest border-t transition-colors italic">{t.seeMoreNews}</Link>
            </section>

            <section className="bg-white border border-zinc-200 overflow-hidden shadow-sm text-left">
                <div className="bg-[#003366] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider">{t.swedenMapTitle}</div>
               <SwedenMap />
            </section>

            {/* AD BOXES RIGHT */}
            <div className="space-y-4">
              <AdBox title={t.advertiseBtn} href="/reklam" />
              <AdBox title="Polasve Reklama" href="/reklam" />
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
