'use client'

import Link from "next/link";
import { Briefcase, Heart, Home as HomeIcon, ShoppingCart, Tag, Wrench } from "lucide-react";
import { useTranslation } from "@/utils/translations";

export default function QuickCategoryNavigation() {
  const { t } = useTranslation();

  const quickCategories = [
    { name: t.catJobs, href: "/jobb", icon: <Briefcase size={20} />, color: "bg-blue-50 text-blue-600" },
    { name: t.catHousing, href: "/bostad", icon: <HomeIcon size={20} />, color: "bg-green-50 text-green-600" },
    { name: t.catSell, href: "/marketplace/salj", icon: <Tag size={20} />, color: "bg-red-50 text-red-600" },
    { name: t.catBuy, href: "/marketplace/kop", icon: <ShoppingCart size={20} />, color: "bg-amber-50 text-amber-600" },
    { name: t.catServices, href: "/tjanster", icon: <Wrench size={20} />, color: "bg-purple-50 text-purple-600" },
    {
      name: t.catMeetingPlace,
      href: "/meeting-place",
      icon: (
        <div className="relative flex items-center justify-center">
          <Heart size={22} className="text-pink-300 fill-pink-300 absolute scale-125 opacity-80" />
          <span className="text-xs relative z-10">🤝</span>
        </div>
      ),
      color: "bg-pink-50 text-pink-600"
    },
  ];

  return (
    <div className="flex md:hidden overflow-x-auto gap-4 pb-2 scrollbar-hide">
      {quickCategories.map((cat) => (
        <Link
          key={cat.href}
          href={cat.href}
          className="flex flex-col items-center gap-2 min-w-[70px] shrink-0 group"
        >
          <div className={`w-12 h-12 ${cat.color} rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
            {cat.icon}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-[#003366] transition-colors">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
