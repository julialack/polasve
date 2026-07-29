'use client'

import { Briefcase, Calendar, Info, Languages, Users, ArrowRight, Box, Newspaper } from "lucide-react";
import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import PremiumAdsSidebar from "@/components/ads/PremiumAdsSidebar";
import SidebarNav from "@/components/layout/SidebarNav";

export default function OmOssPage() {
  const features = [
    {
      title: "Jobbannonser & rekrytering",
      description: "Arbetsgivare kan lägga upp annonser och hitta polska talanger. Medlemmar kan söka jobb, visa sin profil och komma i kontakt med företag.",
      icon: <Briefcase className="text-[#a11a2d]" size={24} />,
      href: "/jobb"
    },
    {
      title: "Event, utställningar & meet-and-greet",
      description: "Upptäck lokala evenemang, kulturträffar, workshops och sociala möten för polacker runt om i Sverige.",
      icon: <Calendar className="text-[#a11a2d]" size={24} />,
      href: "/evenemang"
    },
    {
      title: "Praktisk hjälp i vardagen",
      description: "Information och guider om allt från försäkringsärenden till myndighetskontakter.",
      icon: <Info className="text-[#a11a2d]" size={24} />,
      href: "/tips"
    },
    {
      title: "Community & meddelanden",
      description: "Skapa din egen profil, chatta med andra medlemmar och bygg ett nätverk.",
      icon: <Users className="text-[#a11a2d]" size={24} />,
      href: "/community"
    }
  ];

  const today = new Date().toLocaleDateString('sv-SE', {
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
            <span className="flex items-center gap-1"><Users size={12} /> 142 online</span>
            <span className="hidden sm:inline border-l pl-4 font-bold text-[#a11a2d]">Välkommen!</span>
          </div>
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
                Information om Polacker i Sverige
              </div>

              <div className="p-4 md:p-8 text-left">
                <h1 className="text-3xl font-black text-[#003366] uppercase tracking-tighter italic mb-6">Din community, <span className="text-[#a11a2d]">ditt nätverk</span></h1>
                <p className="text-sm md:text-base text-zinc-600 leading-relaxed mb-10 font-medium">
                  Polacker i Sverige är en samlingsplats för alla polacker som bor, arbetar eller planerar att flytta till Sverige.
                  Här möts människor, företag och föreningar i en trygg och aktiv community där vi hjälper varandra att hitta rätt.
                </p>

                <div className="grid gap-6">
                  {features.map((feature, index) => (
                    <Link
                      key={index}
                      href={feature.href}
                      className="flex gap-4 p-5 border border-zinc-100 rounded-sm hover:bg-white hover:shadow-xl hover:border-[#a11a2d]/20 transition-all text-left group bg-zinc-50/50"
                    >
                      <div className="shrink-0 mt-1 transition-transform group-hover:scale-110 duration-300">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-[#003366] uppercase text-sm italic group-hover:text-[#a11a2d] transition-colors">
                            {feature.title}
                          </h3>
                          <ArrowRight size={14} className="text-zinc-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                          {feature.description}
                        </p>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#a11a2d] mt-3 block opacity-0 group-hover:opacity-100 transition-opacity">
                          Gå till sida &raquo;
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <PremiumAdsSidebar />
        </div>
      </main>
    </div>
  );
}
