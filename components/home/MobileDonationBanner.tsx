'use client'

import Link from "next/link";
import { Heart } from "lucide-react";
import { useTranslation } from "@/utils/translations";

export default function MobileDonationBanner() {
  const { t } = useTranslation();

  return (
    <div className="lg:hidden max-w-7xl mx-auto w-full px-3 sm:px-4 pt-3 pb-1">
      <div className="bg-gradient-to-r from-amber-50 via-white to-red-50 border border-amber-200/80 p-3 rounded-lg flex items-center justify-between shadow-xs text-left">
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <div className="w-8 h-8 rounded-full bg-[#a11a2d] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Heart size={15} className="fill-white" />
          </div>
          <div className="min-w-0 text-left">
            <p className="font-black text-[10px] text-[#003366] uppercase tracking-wider leading-tight">
              {t.supportUsTitle} ❤️
            </p>
            <p className="text-[9px] text-zinc-500 font-medium truncate">
              {t.supportUsSubtitle}
            </p>
          </div>
        </div>
        <Link
          href="/stod-oss"
          className="bg-[#003366] hover:bg-[#a11a2d] text-white px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all shadow-xs shrink-0 whitespace-nowrap"
        >
          {t.supportUsBtn}
        </Link>
      </div>
    </div>
  );
}
