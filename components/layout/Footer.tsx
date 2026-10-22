'use client'

import Link from "next/link";
import { useTranslation } from "@/utils/translations";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-zinc-900 text-zinc-400 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 text-center md:text-left">
        <div className="max-w-xs text-center md:text-left">
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs italic">{t.footerTitle}</h4>
          <p className="text-[11px] leading-relaxed">{t.footerDesc}</p>
        </div>
        <div className="flex gap-16 mx-auto md:mx-0">
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[10px]">{t.footerLinks}</h4>
            <ul className="space-y-2 text-[10px]">
              <li><Link href="/nyheter" className="hover:text-white transition-colors">{t.newsArchive}</Link></li>
              <li><Link href="/evenemang" className="hover:text-white transition-colors">{t.navEvents}</Link></li>
              <li><Link href="/annonser" className="hover:text-white transition-colors">{t.bazarTitle}</Link></li>
              <li><Link href="/villkor" className="hover:text-white transition-colors">{t.terms}</Link></li>
              <li><Link href="/integritetspolicy" className="hover:text-white transition-colors">Integritetspolicy</Link></li>
              <li><Link href="/cookiepolicy" className="hover:text-white transition-colors">Cookiepolicy</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-white text-[11px] font-bold">© {new Date().getFullYear()} POLASVE</p>
          <p className="text-[10px] mt-2 uppercase tracking-widest">{t.communityTrustQuality}</p>
        </div>
      </div>
    </footer>
  );
}
