import HomeHero from "@/components/HomeHero";
import InfoBar from "@/components/layout/InfoBar";
import SidebarNav from "@/components/layout/SidebarNav";
import SwedenMap from "@/components/map/SwedenMap";
import { Building2, Landmark, Library, GraduationCap, Church, MapPin, ExternalLink, Users } from "lucide-react";

const MYNDIGHETER = [
  {
    name: "Republiken Polens ambassad i Stockholm",
    href: "https://www.gov.pl/web/szwecja",
    desc: "Officiell representation för Republiken Polen i Sverige."
  },
  {
    name: "Polska institutet i Stockholm",
    href: "https://instytutpolski.pl/stockholm/pl/",
    desc: "Främjar polsk kultur, konst och historia i Sverige."
  },
  {
    name: "Republiken Polens honorärkonsulat i Halmstad",
    href: "https://www.gov.pl/web/szwecja/konsulaty-honorowe",
    desc: "Konsulär hjälp och representation i södra Sverige."
  },
  {
    name: "Konsulära avdelningen i Stockholm",
    href: "https://www.gov.pl/web/szwecja/informacje-konsularne",
    desc: "Passärenden, visum och juridisk hjälp för polska medborgare."
  },
];

const INSTITUTIONER = [
  { name: "Polska biblioteket i Stockholm", href: "https://biblioteket.stockholm.se/bibliotek/kungsholmens-bibliotek-internationella-biblioteket", icon: <Library size={20} /> },
  { name: "Göteborgs språkcenter", href: "https://sites.google.com/utb.goteborg.se/sprakcentrum-jezyk-polski/strona-g%C5%82%C3%B3wna", icon: <GraduationCap size={20} /> },
  { name: "Modersmålscenter - skola", href: "https://grundskola.stockholm/modersmal", icon: <GraduationCap size={20} /> },
  { name: "Ungdomscenter - Oratorium QUO VADIS", href: "http://www.pmk-stockholm.com/oratorium", icon: <Users size={20} /> },
  { name: "Kapucinerfädernas kloster i Stockholm", href: "https://kapucyni.pl/placowki/sztokholm/", icon: <Church size={20} /> },
  { name: "Polsk-katolska missionen i Göteborg", href: "http://pmk-goteborg.se/", icon: <Church size={20} /> },
  { name: "Polsk-katolska missionen i Malmö", href: "http://www.pmk-malmo.se/", icon: <Church size={20} /> },
  { name: "Polsk-katolska missionen i Stockholm", href: "http://www.pmk-stockholm.com/", icon: <Church size={20} /> },
  { name: "Polsk turistinformation i Stockholm", href: "https://www.polska.travel/pl", icon: <MapPin size={20} /> },
  { name: "Society of St. Francis de Sales", href: "http://pmk-goteborg.se/salezjanie/", icon: <Building2 size={20} /> },
  { name: "Polska lördagsskoleföreningen i Göteborg", href: "http://polskaszkola.se/", icon: <GraduationCap size={20} /> },
  { name: "Polsk skola i Stockholm", href: "http://www.szkolapolska.se/", icon: <GraduationCap size={20} /> },
];

export default function InstitutionerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <HomeHero />
      <InfoBar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-4 gap-6">

          {/* SIDEBAR */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-1">
            <SidebarNav />
          </aside>

          {/* MAIN CONTENT */}
          <div className="col-span-1 md:col-span-9 lg:col-span-2 space-y-8">
            <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden rounded-sm">
              <div className="bg-[#003366] text-white px-6 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-3">
                <Landmark size={18} /> Anläggningar & Institutioner
              </div>

              <div className="p-6 md:p-10">
                <h1 className="text-3xl font-black text-[#003366] uppercase tracking-tighter italic mb-4">Polska resurser <span className="text-[#a11a2d]">i Sverige</span></h1>
                <p className="text-zinc-500 font-medium mb-12 leading-relaxed">
                  Här har vi samlat viktiga länkar och information om polska myndigheter, skolor, kyrkor och föreningar runt om i landet. Allt för att underlätta din vardag och gemenskap i Sverige.
                </p>

                {/* Section: Myndigheter */}
                <div className="mb-16">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#a11a2d] mb-8 flex items-center gap-4">
                    Myndigheter & Diplomati <div className="h-px flex-1 bg-zinc-100"></div>
                  </h3>
                  <div className="grid gap-6">
                    {MYNDIGHETER.map((m) => (
                      <a
                        key={m.name}
                        href={m.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-zinc-50 hover:bg-white p-6 rounded-sm border border-zinc-100 hover:border-[#003366] transition-all flex justify-between items-center shadow-sm"
                      >
                        <div className="flex-1">
                          <h4 className="font-black text-[#003366] uppercase text-xs mb-1 group-hover:text-[#a11a2d] transition-colors">{m.name}</h4>
                          <p className="text-[10px] text-zinc-400 font-medium">{m.desc}</p>
                        </div>
                        <ExternalLink size={16} className="text-zinc-300 group-hover:text-[#003366] ml-4 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Section: Gemenskap */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#a11a2d] mb-8 flex items-center gap-4">
                    Institutioner & Gemenskap <div className="h-px flex-1 bg-zinc-100"></div>
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {INSTITUTIONER.map((inst) => (
                      <a
                        key={inst.name}
                        href={inst.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 p-4 border border-zinc-50 rounded-sm hover:border-[#003366] hover:bg-white transition-all shadow-sm"
                      >
                        <div className="bg-[#003366]/5 p-2 rounded-sm text-[#003366] group-hover:bg-[#a11a2d] group-hover:text-white transition-colors">
                          {inst.icon}
                        </div>
                        <span className="text-[11px] font-bold text-zinc-700 leading-tight group-hover:text-[#003366]">{inst.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <section className="bg-white border border-zinc-200 overflow-hidden shadow-sm">
                <div className="bg-[#003366] text-white px-4 py-2 text-[10px] font-black uppercase tracking-wider">Regioner</div>
                <SwedenMap />
            </section>

            <div className="bg-[#a11a2d] p-6 rounded-sm text-white shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                 <h4 className="font-black uppercase tracking-widest text-xs mb-4 italic">Saknas något?</h4>
                 <p className="text-[10px] opacity-90 leading-relaxed mb-6 font-medium">Vill du lägga till en förening eller institution i listan? Kontakta oss så lägger vi upp det kostnadsfritt.</p>
                 <a href="/om-oss" className="inline-block bg-white text-[#a11a2d] px-6 py-2 rounded-full font-black uppercase text-[9px] tracking-widest shadow-lg">Skicka info</a>
               </div>
               <Landmark className="absolute -bottom-4 -right-4 opacity-10 rotate-12" size={80} />
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
