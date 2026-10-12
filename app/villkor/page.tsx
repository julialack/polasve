'use client'

import HomeHero from "@/components/HomeHero";
import InfoBar from "@/components/layout/InfoBar";
import SidebarNav from "@/components/layout/SidebarNav";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "@/utils/translations";
import { getMenuPageCopy } from "@/utils/menu-page-copy";

export default function VillkorPage() {
  const { lang } = useTranslation()
  const pageText = getMenuPageCopy(lang)
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <HomeHero />
      <InfoBar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-4 gap-6">

          <aside className="hidden md:block md:col-span-3 lg:col-span-1">
            <SidebarNav />
          </aside>

          <div className="col-span-1 md:col-span-9 lg:col-span-2 space-y-6">
            <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden rounded-sm">
              <div className="bg-[#003366] text-white px-6 py-4 flex items-center gap-3">
                <ShieldCheck size={18} />
                <span className="text-xs font-black uppercase tracking-widest">{pageText.terms.section}</span>
              </div>

              <div className="p-8 md:p-12 prose prose-zinc max-w-none">
                <h1 className="text-3xl font-black text-[#003366] uppercase tracking-tighter italic mb-8">{pageText.terms.heading}</h1>

                {pageText.terms.sections.map((section) => (
                  <section key={section.title} className="mb-10">
                    <h2 className="text-lg font-bold text-zinc-800 uppercase mb-4 border-b pb-2">{section.title}</h2>
                    <p className="text-zinc-600 text-sm leading-relaxed">{section.text}</p>
                  </section>
                ))}

                <p className="text-zinc-400 text-[10px] italic mt-20">{pageText.terms.updated}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
