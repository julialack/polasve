'use client'

import { Users } from "lucide-react";

export default function InfoBar() {
  const today = new Date().toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-gradient-to-b from-white to-[#f8f9fa] border-b border-zinc-200 py-3 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] md:text-xs text-zinc-500 font-medium">
        <div className="capitalize font-bold text-[#003366]">{today}</div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><Users size={12} /> 142 online</span>
          <span className="hidden sm:inline border-l pl-4 font-bold text-[#a11a2d]">Välkommen!</span>
        </div>
      </div>
    </div>
  );
}
