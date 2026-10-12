'use client'

import HomeHero from "@/components/HomeHero";
import InfoBar from "@/components/layout/InfoBar";
import SidebarNav from "@/components/layout/SidebarNav";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useTranslation } from "@/utils/translations";
import { getMenuPageCopy } from "@/utils/menu-page-copy";

export default function FAQPage() {
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
                <HelpCircle size={18} />
                <span className="text-xs font-black uppercase tracking-widest">{pageText.faq.section}</span>
              </div>

              <div className="p-8 md:p-12">
                <h1 className="text-3xl font-black text-[#003366] uppercase tracking-tighter italic mb-10 text-center">{pageText.faq.heading}</h1>

                <div className="space-y-4">
                  {pageText.faq.questions.map((faq, i) => (
                    <div key={i} className="border border-zinc-100 rounded-sm overflow-hidden">
                      <div className="bg-zinc-50 p-5 flex justify-between items-center cursor-pointer hover:bg-zinc-100 transition-colors">
                        <span className="font-bold text-zinc-800 text-sm">{faq.question}</span>
                        <ChevronDown size={16} className="text-zinc-400" />
                      </div>
                      <div className="p-5 bg-white">
                        <p className="text-zinc-600 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-16 p-8 bg-blue-50 border border-blue-100 text-center rounded-sm">
                    <p className="text-blue-800 font-bold text-sm mb-2">{pageText.faq.notFound}</p>
                    <p className="text-blue-600 text-xs mb-6">{pageText.faq.personalHelp}</p>
                    <a href="mailto:info@polasve.se" className="inline-block bg-[#003366] text-white px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest shadow-lg">{pageText.faq.contact}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
