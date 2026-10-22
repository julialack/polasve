'use client'

import { useEffect, useState, useMemo, useId, type FormEvent } from 'react'
import { MapPin, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useTranslation } from '@/utils/translations'
import { getMenuPageCopy } from '@/utils/menu-page-copy'

interface SvgCity {
  name: string
  x: number
  y: number
  textOffset?: { x: number; y: number }
  region: string
  isCapital?: boolean
  isMajor?: boolean
  isFeatured?: boolean
}

const SWEDEN_PATH =
  'M 68,6 C 72,12 78,18 82,25 C 85,32 80,40 76,50 C 72,60 68,70 64,80 C 60,90 56,100 54,110 C 52,120 54,128 58,134 C 62,140 60,148 54,154 C 48,160 42,168 38,178 C 34,188 28,198 22,206 C 18,212 12,210 10,202 C 8,194 10,184 12,174 C 14,164 16,154 18,144 C 20,134 22,124 22,114 C 22,104 20,94 22,84 C 24,74 26,64 28,54 C 32,44 38,34 44,24 C 50,14 58,8 68,6 Z'
const ISLAND_PATHS = [
  'M 46,172 C 47,182 46,190 45,196 C 44,190 45,182 46,172 Z',
  'M 64,152 C 67,162 66,170 64,180 C 62,170 63,162 64,152 Z',
]

const CITIES: SvgCity[] = [
  { name: 'Kiruna', x: 60, y: 20, textOffset: { x: 3, y: 1 }, region: 'Lappland', isFeatured: true },
  { name: 'Tärnaby', x: 35, y: 54, textOffset: { x: 3, y: 1 }, region: 'Lappland' },
  { name: 'Luleå', x: 73, y: 55, textOffset: { x: -12, y: 1 }, region: 'Norrbotten', isFeatured: true },
  { name: 'Skellefteå', x: 62, y: 72, textOffset: { x: -20, y: 1 }, region: 'Västerbotten' },
  { name: 'Umeå', x: 64, y: 84, textOffset: { x: -11, y: 1 }, region: 'Västerbotten', isMajor: true },
  { name: 'Östersund', x: 35, y: 99, textOffset: { x: 3, y: 1 }, region: 'Jämtland' },
  { name: 'Örnsköldsvik', x: 56, y: 96, textOffset: { x: -27, y: 1 }, region: 'Västernorrland' },
  { name: 'Sundsvall', x: 47, y: 107, textOffset: { x: -16, y: 1 }, region: 'Västernorrland', isFeatured: true },
  { name: 'Hudiksvall', x: 46, y: 119, textOffset: { x: -17, y: 1 }, region: 'Gävleborg' },
  { name: 'Borlänge', x: 29, y: 132, textOffset: { x: -15, y: 1 }, region: 'Dalarna', isFeatured: true },
  { name: 'Falun', x: 37, y: 129, textOffset: { x: 3, y: 1 }, region: 'Dalarna' },
  { name: 'Gävle', x: 48, y: 135, textOffset: { x: -12, y: 1 }, region: 'Gävleborg' },
  { name: 'Västerås', x: 34, y: 149, textOffset: { x: -17, y: 1 }, region: 'Västmanland', isMajor: true },
  { name: 'Uppsala', x: 49, y: 147, textOffset: { x: -13, y: 1 }, region: 'Uppsala', isMajor: true, isFeatured: true },
  { name: 'Karlstad', x: 20, y: 155, textOffset: { x: 3, y: 1 }, region: 'Värmland' },
  { name: 'Örebro', x: 32, y: 159, textOffset: { x: 3, y: 1 }, region: 'Örebro', isMajor: true },
  { name: 'Eskilstuna', x: 28, y: 164, textOffset: { x: -20, y: 1 }, region: 'Södermanland' },
  { name: 'Stockholm', x: 53, y: 159, textOffset: { x: 3, y: 1 }, region: 'Stockholm', isCapital: true, isMajor: true, isFeatured: true },
  { name: 'Norrköping', x: 20, y: 167, textOffset: { x: 3, y: 1 }, region: 'Östergötland', isMajor: true, isFeatured: true },
  { name: 'Linköping', x: 18, y: 173, textOffset: { x: 3, y: 1 }, region: 'Östergötland', isMajor: true, isFeatured: true },
  { name: 'Jönköping', x: 25, y: 180, textOffset: { x: 3, y: 1 }, region: 'Jönköping', isMajor: true },
  { name: 'Göteborg', x: 8, y: 185, textOffset: { x: 3, y: 1 }, region: 'Västra Götaland', isMajor: true, isFeatured: true },
  { name: 'Borås', x: 11, y: 180, textOffset: { x: -13, y: -2 }, region: 'Västra Götaland' },
  { name: 'Växjö', x: 30, y: 188, textOffset: { x: 3, y: 1 }, region: 'Kronoberg' },
  { name: 'Halmstad', x: 14, y: 198, textOffset: { x: 3, y: 1 }, region: 'Halland' },
  { name: 'Helsingborg', x: 7, y: 204, textOffset: { x: -9, y: 1 }, region: 'Skåne' },
  { name: 'Malmö', x: 17, y: 209, textOffset: { x: 3, y: 1 }, region: 'Skåne', isMajor: true, isFeatured: true },
  { name: 'Karlskrona', x: 39, y: 204, textOffset: { x: -19, y: -2 }, region: 'Blekinge' },
  { name: 'Kristianstad', x: 21, y: 198, textOffset: { x: 3, y: -2 }, region: 'Skåne' },
  { name: 'Kalmar', x: 37, y: 196, textOffset: { x: -12, y: 1 }, region: 'Kalmar' },
  { name: 'Visby', x: 70, y: 147, textOffset: { x: 3, y: 1 }, region: 'Gotland' },
]

export default function SwedenMap() {
  const router = useRouter()
  const { lang } = useTranslation()
  const copy = getMenuPageCopy(lang).common
  const [cityCounts, setCityCounts] = useState<Record<string, number>>({})
  const [totalAdCount, setTotalAdCount] = useState<number>(0)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [searchCity, setSearchCity] = useState('')
  const supabase = createClient()
  const mapClipId = useId().replace(/:/g, '')
  const cityListId = `${mapClipId}-cities`

  useEffect(() => {
    const fetchCityCounts = async () => {
      try {
        const { data } = await supabase.from('ads').select('location').eq('status', 'active')
        if (data) {
          const counts: Record<string, number> = {}
          let total = 0
          data.forEach(ad => {
            if (ad.location) {
              total++
              const locLower = ad.location.toLowerCase()
              CITIES.forEach(c => {
                if (locLower.includes(c.name.toLowerCase()) || locLower.includes(c.region.toLowerCase())) {
                  counts[c.name] = (counts[c.name] || 0) + 1
                }
              })
            }
          })
          setCityCounts(counts)
          setTotalAdCount(total)
        }
      } catch (err) {
        console.error('Error fetching map city counts:', err)
      }
    }
    fetchCityCounts()
  }, [supabase])

  const handleCityClick = (cityName: string) => {
    setSelectedCity(cityName)
  }

  const navigateToCity = (cityName: string) => {
    router.push(`/sok?q=${encodeURIComponent(cityName)}`)
  }

  const handleCitySearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = searchCity.trim()
    if (query) {
      navigateToCity(query)
    }
  }

  const topActiveCities = useMemo(() => {
    return CITIES
      .map(c => ({ ...c, count: cityCounts[c.name] || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
  }, [cityCounts])

  return (
    <div className="relative w-full max-w-sm mx-auto bg-slate-900 text-white rounded-xl shadow-2xl overflow-hidden border border-slate-800 p-2.5 md:p-3 group">

      {/* Header */}
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#005293] text-white shadow-sm">
            <MapPin size={15} />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold leading-tight text-white">
              {copy.swedenMap || 'Sverigekartan'}
            </h3>
            <p className="mt-0.5 text-[10px] leading-tight text-slate-400">
              {copy.interactiveMarket}
            </p>
          </div>
        </div>

        {totalAdCount > 0 && (
          <span className="shrink-0 rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] font-semibold text-slate-300">
            {totalAdCount} {copy.listingsCount}
          </span>
        )}
      </div>

      <form onSubmit={handleCitySearch} className="mb-2 flex gap-2">
        <label htmlFor={cityListId} className="sr-only">Sök stad</label>
        <input
          id={cityListId}
          list={`${cityListId}-options`}
          value={searchCity}
          onChange={event => setSearchCity(event.target.value)}
          placeholder="Sök stad..."
          className="min-h-11 min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white placeholder:text-zinc-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
        />
        <datalist id={`${cityListId}-options`}>
          {CITIES.map(city => <option key={city.name} value={city.name} />)}
        </datalist>
        <button
          type="submit"
          disabled={!searchCity.trim()}
          className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#005293] px-3 text-sm font-bold text-white transition-colors hover:bg-[#0069a8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Search size={16} aria-hidden="true" />
          <span>Sök</span>
        </button>
      </form>

      {/* SVG Map Container */}
      <div className="relative w-full aspect-[1/2] max-h-[360px] bg-[#b8d8f8] rounded-lg overflow-hidden border border-slate-700 shadow-inner my-1 flex items-center justify-center p-1">
        <svg
          viewBox="0 0 85 210"
          className="w-auto h-full max-h-[350px] drop-shadow-md select-none"
          preserveAspectRatio="xMidYMid meet"
          role="group"
          aria-label="Interaktiv Sverigekarta. Välj en stad för att se annonssökningen."
        >
          <defs>
            <clipPath id={mapClipId}>
              <path d={SWEDEN_PATH} />
              {ISLAND_PATHS.map(path => <path key={path} d={path} />)}
            </clipPath>
          </defs>

          <path
            d={SWEDEN_PATH}
            fill="#f5f0dc"
          />

          <g fill="#f5f0dc">
            {ISLAND_PATHS.map(path => <path key={path} d={path} />)}
          </g>

          <g clipPath={`url(#${mapClipId})`} opacity="0.22">
            <rect x="0" y="0" width="85" height="210" fill="#004f7f" />
            <rect x="34" y="0" width="14" height="210" fill="#fecc00" />
            <rect x="0" y="143" width="85" height="18" fill="#fecc00" />
          </g>

          <path
            d={SWEDEN_PATH}
            fill="none"
            stroke="#8a7c64"
            strokeWidth="0.8"
          />
          <g fill="none" stroke="#8a7c64" strokeWidth="0.6">
            {ISLAND_PATHS.map(path => <path key={path} d={path} />)}
          </g>

          {/* City Dots, Labels & Badges rendered directly inside SVG */}
          {CITIES.map((city) => {
            const count = cityCounts[city.name] || 0
            const hasAds = count > 0
            const isSelected = selectedCity === city.name
            const isHovered = hoveredCity === city.name || isSelected
            const offset = city.textOffset || { x: 3, y: 1 }

            return (
              <g
                key={city.name}
                transform={`translate(${city.x}, ${city.y})`}
                onClick={() => handleCityClick(city.name)}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleCityClick(city.name)
                  }
                }}
                onMouseEnter={() => setHoveredCity(city.name)}
                onMouseLeave={() => setHoveredCity(null)}
                onFocus={() => setHoveredCity(city.name)}
                onBlur={() => setHoveredCity(null)}
                role="button"
                tabIndex={0}
                aria-label={`${city.name}, ${count} aktiva annonser. Välj stad.`}
                aria-pressed={isSelected}
                className="cursor-pointer outline-none group/pin focus-visible:outline-none"
              >
                <circle r="5" fill="transparent" />

                {/* Pulse effect if ads exist */}
                {hasAds && (
                  <circle
                    r="4.5"
                    fill="rgba(161, 26, 45, 0.4)"
                    className="animate-ping"
                  />
                )}

                {city.isFeatured && (
                  <circle
                    r="3.4"
                    fill="none"
                    stroke={hasAds ? '#a11a2d' : '#003366'}
                    strokeWidth="0.7"
                  />
                )}

                {/* City Dot */}
                <circle
                  r={hasAds ? '2.5' : city.isCapital ? '2.2' : '1.5'}
                  fill={hasAds ? '#a11a2d' : city.isCapital ? '#003366' : '#222222'}
                  stroke={hasAds ? '#ffffff' : '#000000'}
                  strokeWidth="0.4"
                  className="transition-transform hover:scale-125"
                />

                {/* City Name Label (Native SVG text) */}
                {(city.isFeatured || city.isCapital || isHovered) && (
                  <text
                    x={offset.x}
                    y={offset.y}
                    fontSize={city.isFeatured ? city.isCapital ? '5.8' : '5' : city.isCapital ? '4.5' : city.isMajor ? '3.8' : '3.2'}
                    fontWeight={city.isCapital || hasAds ? '900' : '700'}
                    fill={hasAds ? '#a11a2d' : '#111827'}
                    className="font-sans pointer-events-none uppercase tracking-tight"
                  >
                    {city.name}
                  </text>
                )}

                {/* Live Ad Count Badge */}
                {hasAds && (
                  <g transform={`translate(${offset.x > 0 ? offset.x + (city.name.length * 2.2) : offset.x - 4}, -1.5)`}>
                    <rect x="-1" y="-3" width="7" height="4" rx="1" fill="#003366" />
                    <text
                      textAnchor="middle"
                      x="2.5"
                      y="-0.2"
                      fontSize="2.8"
                      fontWeight="bold"
                      fill="#ffffff"
                    >
                      {count}
                    </text>
                  </g>
                )}

                {/* Hover Highlight Box */}
                {isHovered && (
                  <rect
                    x={offset.x - 1}
                    y={offset.y - 3.5}
                    width={city.name.length * 2.5 + (hasAds ? 8 : 2)}
                    height="5"
                    fill="none"
                    stroke="#a11a2d"
                    strokeWidth="0.4"
                    rx="0.5"
                  />
                )}
                {isSelected && (
                  <circle
                    r="5.8"
                    fill="none"
                    stroke="#005293"
                    strokeWidth="0.8"
                    strokeDasharray="1.2 0.8"
                    pointerEvents="none"
                  />
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {selectedCity && (
        <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-800 p-3" aria-live="polite">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{selectedCity}</p>
            <p className="text-xs text-zinc-300">
              {cityCounts[selectedCity] || 0} aktiva annonser
            </p>
          </div>
          <button
            onClick={() => navigateToCity(selectedCity)}
            className="min-h-10 shrink-0 rounded-lg bg-[#005293] px-3 text-xs font-bold text-white transition-colors hover:bg-[#0069a8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            Visa annonser
          </button>
        </div>
      )}

      {/* Popular Cities Quick Filter Bar */}
      <div className="relative z-20 border-t border-slate-800 pt-2 mt-1">
        <div className="flex flex-wrap items-center justify-center gap-1">
          {topActiveCities.map(city => (
            <button
              key={city.name}
              onClick={() => navigateToCity(city.name)}
              className="min-h-9 bg-slate-800 hover:bg-[#003366] hover:text-white text-zinc-200 text-[10px] font-black uppercase px-3 py-1 rounded-full transition-all border border-slate-700 flex items-center gap-1 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <span>{city.name}</span>
              {city.count > 0 && <span className="text-amber-400 font-bold">({city.count})</span>}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
