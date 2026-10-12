'use client'

import { Users } from "lucide-react";
import { useTranslation } from "@/utils/translations";

export default function InfoBar() {
  const { t, lang } = useTranslation();

  const localeMap: Record<string, string> = {
    pl: 'pl-PL',
    sv: 'sv-SE',
    ua: 'uk-UA',
    en: 'en-US',
  };

  const today = new Date().toLocaleDateString(localeMap[lang] || 'pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-gradient-to-b from-white to-[#f8f9fa] border-b border-zinc-200 py-3 px-6 text-left">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] md:text-xs text-zinc-500 font-medium">
        <div className="capitalize font-bold text-[#003366] text-left">{today}</div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><Users size={12} /> 142 online</span>
          <span className="hidden sm:inline border-l pl-4 font-bold text-[#a11a2d]">{t.welcomeMsg}</span>
        </div>
      </div>
    </div>
  );
}
