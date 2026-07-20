'use client'

import { MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

const CITIES = [
  { name: 'Stockholm', top: '70%', left: '75%' },
  { name: 'Göteborg', top: '78%', left: '40%' },
  { name: 'Malmö', top: '88%', left: '45%' },
  { name: 'Uppsala', top: '65%', left: '72%' },
  { name: 'Västerås', top: '66%', left: '62%' },
  { name: 'Örebro', top: '69%', left: '55%' },
  { name: 'Linköping', top: '73%', left: '60%' },
  { name: 'Helsingborg', top: '85%', left: '42%' },
  { name: 'Jönköping', top: '76%', left: '52%' },
  { name: 'Norrköping', top: '74%', left: '64%' },
  { name: 'Umeå', top: '35%', left: '80%' },
  { name: 'Luleå', top: '22%', left: '85%' },
  { name: 'Kiruna', top: '10%', left: '75%' },
  { name: 'Östersund', top: '45%', left: '50%' },
]

export default function SwedenMap() {
  const router = useRouter()

  const handleCityClick = (cityName: string) => {
    // Redirect to Search or Ads page with location filter
    router.push(`/sok?q=${encodeURIComponent(cityName)}`)
  }

  return (
    <div className="relative w-full aspect-[3/4] bg-zinc-50 border border-zinc-100 rounded-sm overflow-hidden p-4 group">
      {/* Sweden Silhouette SVG */}
      <svg
        viewBox="0 0 100 200"
        className="w-full h-full opacity-10 text-zinc-900 fill-current"
        preserveAspectRatio="xMidYMid meet"
      >
        <path d="M75 10 L85 20 L80 40 L85 60 L75 80 L70 100 L65 120 L60 140 L55 160 L50 180 L45 190 L40 195 L35 185 L38 175 L45 165 L48 150 L52 135 L58 120 L62 100 L65 85 L60 70 L65 55 L70 30 Z" />
      </svg>

      {/* Interactive Pins */}
      {CITIES.map((city) => (
        <button
          key={city.name}
          onClick={() => handleCityClick(city.name)}
          className="absolute -translate-x-1/2 -translate-y-1/2 group/pin transition-all hover:scale-125 z-10"
          style={{ top: city.top, left: city.left }}
          title={`Sök i ${city.name}`}
        >
          <div className="relative">
            <MapPin
              size={18}
              className="text-[#003366] group-hover/pin:text-[#a11a2d] transition-colors drop-shadow-sm"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-zinc-100 px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity shadow-sm text-[#003366]">
              {city.name}
            </button>
          </div>
        </button>
      ))}

      {/* Map Legend/Info Overlay */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-sm p-3 border border-zinc-200 shadow-sm rounded-sm text-center">
          <p className="text-[9px] font-black text-[#003366] uppercase tracking-[0.1em]">Interaktiv Marknadskarta</p>
          <p className="text-[8px] text-zinc-400 italic mt-0.5">Klicka på en stad för att se annonser</p>
        </div>
      </div>
    </div>
  )
}
