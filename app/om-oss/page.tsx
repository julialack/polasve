'use client'

import { Briefcase, Calendar, Info, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import PremiumAdsSidebar from "@/components/ads/PremiumAdsSidebar";
import SidebarNav from "@/components/layout/SidebarNav";
import { useTranslation } from "@/utils/translations";
import { getMenuPageCopy } from "@/utils/menu-page-copy";

export default function OmOssPage() {
  const { lang } = useTranslation()
  const pageText = getMenuPageCopy(lang)
  const icons = [
    <Briefcase key="jobs" className="text-[#a11a2d]" size={24} />,
    <Calendar key="events" className="text-[#a11a2d]" size={24} />,
    <Info key="help" className="text-[#a11a2d]" size={24} />,
    <Users key="community" className="text-[#a11a2d]" size={24} />,
  ]
  const links = ["/jobb", "/evenemang", "/tips", "/community"]
  const features = pageText.about.features.map((feature, index) => ({
    ...feature,
    icon: icons[index],
    href: links[index],
  }))

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

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8 text-left">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-4 gap-6 text-left">

          <aside className="hidden md:block md:col-span-3 lg:col-span-1 space-y-6 text-left">
            <SidebarNav />
          </aside>

          <div className="col-span-1 md:col-span-9 lg:col-span-2 space-y-6 text-left">
            <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden rounded-sm text-left">
              <div className="bg-[#003366] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-left">
                {pageText.about.section}
              </div>

              <div className="p-4 md:p-8 text-left">
                <h1 className="text-3xl font-black text-[#003366] uppercase tracking-tighter italic mb-6">{pageText.about.heading}</h1>
                <p className="text-sm md:text-base text-zinc-600 leading-relaxed mb-10 font-medium">
                  {pageText.about.intro}
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
                          {pageText.about.visitPage}
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
