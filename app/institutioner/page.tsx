'use client'

import HomeHero from "@/components/HomeHero";
import InfoBar from "@/components/layout/InfoBar";
import SidebarNav from "@/components/layout/SidebarNav";
import SwedenMap from "@/components/map/SwedenMap";
import Link from "next/link";
import { Building2, Landmark, Library, GraduationCap, Church, MapPin, ExternalLink, Users, Wrench, Truck, Phone, Mail, ShieldCheck, PlusCircle, ArrowRight } from "lucide-react";
import { useTranslation } from "@/utils/translations";
import { getMenuPageCopy } from "@/utils/menu-page-copy";

const FORETAG_SERVICES = [
  {
    name: "PolBygg & Renovering AB",
    category: "Bygg & Renovering",
    city: "Stockholm / Mälardalen",
    desc: "Totalentreprenad, badrumsrenovering, kakel & klinker samt snickeri.",
    phone: "070-123 45 67",
    email: "kontakt@polbygg.se",
    verified: true
  },
  {
    name: "Szybki Transport & Flytt",
    category: "Transport & Flytt",
    city: "Göteborg / Västra Götaland",
    desc: "Inrikesflytt, godstransport Sverige–Polen samt bärhjälp.",
    phone: "073-987 65 43",
    email: "info@szybkitransport.se",
    verified: true
  },
  {
    name: "Czysto Hemservice & Städ",
    category: "Städ & Hemservice",
    city: "Malmö / Skåne",
    desc: "Hemstädning, flyttstädning, kontorsstädning med RUT-avdrag.",
    phone: "076-555 44 33",
    email: "kontakt@czystohand.se",
    verified: true
  },
  {
    name: "Målarmästare PolArt",
    category: "Måleri & Tapet",
    city: "Stockholm",
    desc: "Inomhus- och utomhusmåleri, spackling, fasadtvätt.",
    phone: "070-888 99 00",
    email: "info@polartmaleri.se",
    verified: true
  },
  {
    name: "Svensk-Polska Tolk & Juridik",
    category: "Juridik & Tolkning",
    city: "Hela Sverige (Online)",
    desc: "Auktoriserad tolkning, översättning av dokument, juridisk rådgivning.",
    phone: "08-123 99 88",
    email: "tolk@polasve-juridik.se",
    verified: true
  },
  {
    name: "AutoService PolAuto",
    category: "Bilverkstad & Däck",
    city: "Örebro",
    desc: "Bilreparationer, service, däckbyte och felkodsläsning.",
    phone: "072-444 33 22",
    email: "service@polauto.se",
    verified: true
  }
];

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
  const { lang } = useTranslation()
  const pageText = getMenuPageCopy(lang)
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-left font-sans">
      <HomeHero />
      <InfoBar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-4 gap-6">

          {/* SIDEBAR */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-1">
            <SidebarNav />
          </aside>

          {/* MAIN CONTENT */}
          <div className="col-span-1 md:col-span-9 lg:col-span-2 space-y-8 text-left">
            <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden rounded-sm">
              <div className="bg-[#003366] text-white px-6 py-4 text-xs font-black uppercase tracking-widest flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Landmark size={18} /> {pageText.directory.heading}
                </div>
                <span className="text-[9px] font-bold opacity-80 italic">{pageText.directory.tagline}</span>
              </div>

              <div className="p-4 md:p-8 text-left">
                <h1 className="text-2xl md:text-3xl font-black text-[#003366] uppercase tracking-tighter italic mb-3">
                  {pageText.directory.title}
                </h1>
                <p className="text-sm md:text-base text-zinc-500 font-medium mb-8 leading-relaxed">
                  {pageText.directory.intro}
                </p>

                {/* Section 1: Företagskatalog ("Gula Sidorna") */}
                <div className="mb-12 border-b pb-12">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#a11a2d] flex items-center gap-2">
                      <Building2 size={16} /> {pageText.directory.businessList}
                    </h3>
                    <Link
                      href="/reklam"
                      className="bg-[#003366] hover:bg-[#a11a2d] text-white px-4 py-2 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5 w-fit"
                    >
                      <PlusCircle size={12} /> {pageText.directory.register} <ArrowRight size={10} />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {FORETAG_SERVICES.map((item, idx) => (
                      <div key={idx} className="bg-zinc-50 border border-zinc-100 p-4 rounded-sm hover:border-[#003366]/30 transition-all shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[8px] font-black uppercase text-[#a11a2d] tracking-widest bg-red-50 px-2 py-0.5 rounded-sm">
                              {item.category}
                            </span>
                            {item.verified && (
                              <span className="text-[7px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm flex items-center gap-1">
                                <ShieldCheck size={10} /> {pageText.directory.verified}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-[#003366] mb-1">{item.name}</h4>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase mb-2">📍 {item.city}</p>
                          <p className="text-xs text-zinc-600 font-medium leading-relaxed mb-4 italic">&quot;{item.desc}&quot;</p>
                        </div>

                        <div className="pt-3 border-t border-zinc-200/50 flex flex-wrap justify-between gap-2 text-[10px] font-bold text-zinc-700">
                          <span className="flex items-center gap-1.5"><Phone size={12} className="text-[#003366]" /> {item.phone}</span>
                          <span className="flex items-center gap-1.5"><Mail size={12} className="text-[#a11a2d]" /> {item.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Myndigheter */}
                <div className="mb-12 border-b pb-12">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#a11a2d] mb-6 flex items-center gap-4">
                    {pageText.directory.authorities} <div className="h-px flex-1 bg-zinc-100"></div>
                  </h3>
                  <div className="grid gap-4">
                    {MYNDIGHETER.map((m) => (
                      <a
                        key={m.name}
                        href={m.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-zinc-50 hover:bg-white p-4 rounded-sm border border-zinc-100 hover:border-[#003366] transition-all flex justify-between items-center shadow-sm"
                      >
                        <div className="flex-1">
                          <h4 className="font-black text-[#003366] uppercase text-[11px] md:text-xs mb-1 group-hover:text-[#a11a2d] transition-colors leading-tight">{m.name}</h4>
                          <p className="text-[9px] md:text-[10px] text-zinc-400 font-medium leading-tight">{m.desc}</p>
                        </div>
                        <ExternalLink size={14} className="text-zinc-300 group-hover:text-[#003366] ml-4 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Section 3: Institutioner & Föreningar */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#a11a2d] mb-6 flex items-center gap-4">
                    {pageText.directory.schools} <div className="h-px flex-1 bg-zinc-100"></div>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {INSTITUTIONER.map((inst) => (
                      <a
                        key={inst.name}
                        href={inst.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-3 border border-zinc-50 rounded-sm hover:border-[#003366] hover:bg-white transition-all shadow-sm"
                      >
                        <div className="bg-[#003366]/5 p-2 rounded-sm text-[#003366] group-hover:bg-[#a11a2d] group-hover:text-white transition-colors">
                          {inst.icon}
                        </div>
                        <span className="text-[10px] md:text-[11px] font-bold text-zinc-700 leading-tight group-hover:text-[#003366]">{inst.name}</span>
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
                <div className="bg-[#003366] text-white px-4 py-2 text-[10px] font-black uppercase tracking-wider">{pageText.directory.regions}</div>
                <SwedenMap />
            </section>

            <div className="bg-[#a11a2d] p-6 rounded-sm text-white shadow-xl relative overflow-hidden text-left">
               <div className="relative z-10">
                 <h4 className="font-black uppercase tracking-widest text-xs mb-3 italic">{pageText.directory.promoteHeading}</h4>
                 <p className="text-[10px] opacity-90 leading-relaxed mb-6 font-medium">{pageText.directory.promoteText}</p>
                 <Link href="/reklam" className="inline-block bg-white text-[#a11a2d] px-6 py-2.5 rounded-full font-black uppercase text-[9px] tracking-widest shadow-lg hover:bg-zinc-100 transition-colors">{pageText.directory.promoteAction}</Link>
               </div>
               <Landmark className="absolute -bottom-4 -right-4 opacity-10 rotate-12" size={80} />
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
