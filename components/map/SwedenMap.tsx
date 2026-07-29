'use client'

import { MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

const CITIES = [
  { name: 'Stockholm', top: '72%', left: '68%', pulse: true },
  { name: 'Göteborg', top: '78%', left: '32%', pulse: true },
  { name: 'Malmö', top: '92%', left: '38%', pulse: true },
  { name: 'Uppsala', top: '68%', left: '65%' },
  { name: 'Västerås', top: '70%', left: '58%' },
  { name: 'Örebro', top: '72%', left: '52%' },
  { name: 'Linköping', top: '75%', left: '55%' },
  { name: 'Jönköping', top: '80%', left: '46%' },
  { name: 'Norrköping', top: '74%', left: '60%' },
  { name: 'Gävle', top: '64%', left: '62%' },
  { name: 'Umeå', top: '40%', left: '78%' },
  { name: 'Luleå', top: '30%', left: '85%' },
  { name: 'Kiruna', top: '10%', left: '72%' },
  { name: 'Östersund', top: '48%', left: '48%' },
]

export default function SwedenMap() {
  const router = useRouter()

  const handleCityClick = (cityName: string) => {
    router.push(`/sok?q=${encodeURIComponent(cityName)}`)
  }

  return (
    <div className="relative w-full aspect-[3/5] bg-white border border-zinc-200 rounded-sm overflow-hidden p-6 group shadow-inner">
      {/* Sweden Detailed Silhouette SVG with Provincial Lines */}
      <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
        <svg
          viewBox="0 0 100 250"
          className="h-full w-auto text-[#003366] drop-shadow-2xl"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Main Landmass Silhouette */}
          <path
            d="M72,5 L78,12 L82,20 L80,35 L85,45 L88,60 L85,75 L80,85 L78,100 L75,115 L72,130 L70,145 L65,160 L60,175 L55,190 L50,205 L45,215 L40,225 L35,220 L38,210 L30,200 L25,185 L22,170 L25,155 L28,140 L32,125 L35,110 L38,95 L35,80 L32,65 L35,50 L38,35 L42,20 L45,10 L50,5 Z"
            fill="currentColor"
            className="opacity-[0.04]"
          />

          {/* Provincial Borders (Internal Lines) */}
          <g fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-20">
            {/* Norrland boundaries */}
            <path d="M50,5 L55,30 M55,30 L82,35 M55,30 L42,60 M42,60 L85,75 M42,60 L38,95 M38,95 L80,110" />
            {/* Svealand boundaries */}
            <path d="M38,95 L32,125 M32,125 L75,140 M32,125 L28,150 M28,150 L70,165" />
            {/* Götaland boundaries */}
            <path d="M28,150 L25,185 M25,185 L65,195 M25,185 L35,220 M35,220 L50,230" />
            {/* Detailed internal provincial lines (approximated from image) */}
            <path d="M78,100 L65,105 M72,130 L60,135 M65,160 L50,170 M45,215 L55,210" />
          </g>

          {/* Islands with borders */}
          <g fill="currentColor" stroke="currentColor" strokeWidth="0.5" className="opacity-[0.08]">
            {/* Öland */}
            <path d="M52,185 L54,195 L50,195 Z" />
            {/* Gotland */}
            <path d="M68,170 L72,185 L65,185 Z" />
          </g>
        </svg>
      </div>

      {/* Interactive Pins */}
      {CITIES.map((city) => (
        <button
          key={city.name}
          onClick={() => handleCityClick(city.name)}
          className="absolute -translate-x-1/2 -translate-y-1/2 group/pin z-10 transition-all hover:scale-125"
          style={{ top: city.top, left: city.left }}
          title={`Sök i ${city.name}`}
        >
          <div className="relative flex items-center justify-center">
            {city.pulse && (
              <span className="absolute w-6 h-6 bg-amber-400/30 rounded-full animate-ping"></span>
            )}
            <MapPin
              size={city.pulse ? 20 : 16}
              className={`${city.pulse ? 'text-[#a11a2d]' : 'text-[#003366]'} group-hover/pin:text-amber-500 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]`}
            />

            {/* Tooltip Label */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/pin:opacity-100 transition-all duration-300 translate-x-2 group-hover/pin:translate-x-0 pointer-events-none">
              <div className="bg-[#003366] text-white px-2.5 py-1 rounded-sm shadow-xl flex items-center gap-2 whitespace-nowrap">
                <span className="text-[8px] font-black uppercase tracking-widest">{city.name}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
              </div>
            </div>
          </div>
        </button>
      ))}

      {/* Map Header Overlay */}
      <div className="absolute top-4 left-0 right-0 px-4 flex justify-between items-center pointer-events-none">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-100"></div>
        <span className="px-3 text-[8px] font-black uppercase text-zinc-300 tracking-[0.2em]">Interaktiv Marknad</span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-100"></div>
      </div>

      {/* Map Footer Overlay */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md p-3 border border-zinc-100 shadow-lg rounded-sm text-center transform transition-transform group-hover:-translate-y-1">
          <p className="text-[9px] font-black text-[#003366] uppercase tracking-[0.1em]">Utforska Regioner</p>
          <p className="text-[7px] text-zinc-400 font-bold uppercase mt-1 tracking-tighter">Hitta lokala annonser & tjänster</p>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-zinc-100"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-zinc-100"></div>
    </div>
  )
}
