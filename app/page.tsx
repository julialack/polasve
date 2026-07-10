import Link from "next/link";
import PostBox from "@/components/feed/PostBox";
import FeedList from "@/components/feed/FeedList";
import { createClient } from "@/utils/supabase/server";

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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop"
              alt="Premium Architecture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white/90 md:bg-white/85 backdrop-blur-[1px]"></div>
          </div>

          <div className="max-w-6xl mx-auto px-6 relative z-10 text-center py-12 md:py-20">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-zinc-200 bg-white/50 text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] mb-6 md:mb-10 shadow-sm">
              Lorem ipsum dolor sit amet
            </div>
            <h1 className="text-4xl md:text-8xl font-light tracking-tight text-zinc-900 mb-6 md:mb-8 leading-tight">
              Lorem ipsum <br />
              <span className="font-serif italic text-red-800">dolor</span> & <span className="font-serif italic text-red-800">sit amet.</span>
            </h1>
            <p className="text-base md:text-xl text-zinc-600 mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto font-light">
              Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
              <Link href="/skapa-annons" className="bg-red-800 text-white px-8 md:px-10 py-3.5 md:py-4 rounded-full font-bold uppercase tracking-widest hover:bg-red-900 transition-all shadow-2xl shadow-red-900/20 active:scale-95 text-[10px] md:text-xs text-center">
                Publicera Annons
              </Link>
              <Link href="/annonser" className="bg-white border border-zinc-200 text-zinc-900 px-8 md:px-10 py-3.5 md:py-4 rounded-full font-bold uppercase tracking-widest hover:bg-zinc-50 transition-all active:scale-95 text-[10px] md:text-xs shadow-sm text-center">
                Utforska Marknad
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 md:h-24 bg-gradient-to-b from-zinc-300 to-transparent"></div>
        </section>

        {/* Latest Ads */}
        <section className="bg-zinc-50 py-16 md:py-32 border-y border-zinc-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16 text-center md:text-left gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight text-zinc-900 uppercase tracking-[0.1em]">Utvalda <span className="font-bold">Annonser</span></h2>
                <p className="text-zinc-500 mt-2 font-serif italic text-sm md:text-base">Kurerade för ditt intresse</p>
              </div>
              <Link href="/annonser" className="text-red-800 font-bold uppercase tracking-widest text-[10px] border-b border-red-800 pb-1 hover:text-red-600 hover:border-red-600 transition-colors">
                Se hela marknaden
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredAds.length > 0 ? (
                featuredAds.map((ad) => (
                  <Link href={`/annonser/${ad.id}`} key={ad.id} className="group bg-white rounded-sm overflow-hidden transition-all duration-500 hover:shadow-2xl">
                    <div className="h-64 bg-zinc-100 relative overflow-hidden">
                       <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-3 py-1 text-[9px] font-bold uppercase tracking-widest shadow-sm z-10">Premium</div>
                       <img
                        src={ad.image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                       />
                    </div>
                    <div className="p-8">
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mb-3">{ad.category} • Just nu</p>
                      <h4 className="font-bold text-lg mb-4 text-zinc-900 group-hover:text-red-800 transition-colors line-clamp-1">{ad.title}</h4>
                      <div className="font-serif italic text-red-800 border-t border-zinc-100 pt-4">{ad.price || 'Pris på förfrågan'}</div>
                    </div>
                  </Link>
                ))
              ) : (
                /* Fallback if no premium ads exist yet */
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="group bg-white rounded-sm overflow-hidden opacity-40">
                    <div className="h-64 bg-zinc-100 relative overflow-hidden flex items-center justify-center">
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-300 italic">Väntar på premium</span>
                    </div>
                    <div className="p-8">
                      <div className="h-2 w-20 bg-zinc-100 mb-4"></div>
                      <div className="h-4 w-full bg-zinc-100 mb-4"></div>
                      <div className="h-4 w-24 bg-zinc-50 border-t border-zinc-100 pt-4 mt-4"></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Feed & Sidebar Section */}
        <section className="bg-white py-16 md:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-light tracking-widest uppercase mb-4 text-zinc-900">Community <span className="font-bold">Flöde</span></h2>
              <div className="w-12 h-px bg-red-800 mx-auto mb-6"></div>
              <p className="text-zinc-500 font-serif italic text-sm md:text-base">Dela tankar och idéer med andra medlemmar.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2">
                <PostBox />
                <FeedList />
              </div>

              {/* Sidebar Ads Column */}
              <div className="lg:col-span-1 space-y-12">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300 mb-6">Utvalt för dig</h3>

                <div className="group cursor-pointer">
                  <div className="relative h-96 w-full overflow-hidden mb-6">
                    <img
                      src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop"
                      alt="Snickarjobb"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                    <div className="absolute top-6 right-6 bg-white px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest shadow-xl text-red-800">
                      Karriär
                    </div>
                  </div>
                  <h4 className="font-bold text-sm uppercase tracking-[0.2em] text-zinc-900 mb-2">Snickarjobb under semestertider</h4>
                  <p className="text-zinc-500 text-xs font-serif italic leading-relaxed mb-6">
                    Säkra ditt nästa projekt inför sommaren. Vi matchar erfarna hantverkare med exklusiva renoveringsuppdrag i hela landet.
                  </p>
                  <button className="text-[9px] font-bold uppercase tracking-widest text-red-800 border-b border-red-800 pb-1 hover:text-red-600 hover:border-red-600 transition-colors">
                    Visa uppdrag
                  </button>
                </div>

                <div className="bg-zinc-950 p-10 text-white shadow-2xl">
                  <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-red-500 mb-6 block">Kultur</span>
                  <h4 className="text-2xl font-light tracking-tight mb-6 italic font-serif leading-tight">Polsk konstvisning <br />i Malmö</h4>
                  <p className="text-zinc-400 text-xs font-light leading-relaxed mb-8">
                    En unik möjlighet att uppleva samtida polsk konst i hjärtat av Malmö. Exklusiv vernissage för POLASVE-medlemmar.
                  </p>
                  <button className="w-full py-4 border border-white/10 hover:border-white/40 transition-all text-[9px] font-bold uppercase tracking-widest">
                    Boka plats
                  </button>
                </div>

                <div className="pt-10">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6 border-b border-zinc-100 pb-4 text-zinc-300">Rekommenderade Tjänster</h4>
                  <ul className="space-y-6">
                    <li className="group cursor-pointer">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-800 group-hover:text-red-800 transition-colors">Polska Affärsjurister</span>
                        <span className="font-serif italic text-[10px] text-zinc-300">Premium</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-light">Specialister på internationell rätt.</p>
                    </li>
                    <li className="group cursor-pointer border-t border-zinc-50 pt-6">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-800 group-hover:text-red-800 transition-colors">Logistik SE - PL</span>
                        <span className="font-serif italic text-[10px] text-zinc-300">Veckovis</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-light">Säkra transporter med full försäkring.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-zinc-50 border-t border-zinc-100 py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-2xl font-light tracking-widest uppercase">
            POLA<span className="font-bold text-red-800">SVE</span>
          </div>
          <div className="flex gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            <Link href="#" className="hover:text-red-800 transition-colors">Lorem ipsum</Link>
            <Link href="#" className="hover:text-red-800 transition-colors">Dolor sit</Link>
            <Link href="#" className="hover:text-red-800 transition-colors">Consectetur</Link>
          </div>
          <div className="text-zinc-300 text-[10px] font-medium tracking-widest">
            &copy; {new Date().getFullYear()} POLASVE. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
