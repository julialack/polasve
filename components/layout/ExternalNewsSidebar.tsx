'use client'

import { useEffect, useState } from 'react'
import { Newspaper, ExternalLink, ArrowRight } from 'lucide-react'

export default function ExternalNewsSidebar() {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/poland-news')
        const data = await res.json()
        if (Array.isArray(data)) {
          // Show only top 4
          setNews(data.slice(0, 4))
        }
      } catch (e) {
        console.error("Failed to load external news")
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  if (loading) {
    return (
      <div className="bg-white border border-zinc-200 shadow-sm rounded-sm overflow-hidden p-4">
        <div className="h-4 bg-zinc-100 animate-pulse rounded-sm mb-4 w-1/2"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 bg-zinc-50 animate-pulse rounded-sm"></div>
              <div className="flex-1 space-y-2">
                <div className="h-2 bg-zinc-50 animate-pulse rounded-sm"></div>
                <div className="h-2 bg-zinc-50 animate-pulse rounded-sm w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="bg-white border border-zinc-200 shadow-sm overflow-hidden rounded-sm">
      <div className="bg-zinc-800 text-white px-4 py-2 text-[8px] font-black uppercase tracking-[0.2em] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper size={10} /> Live från Polen
        </div>
        <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
      </div>

      <div className="p-3 space-y-3">
        {news.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 group border-b border-zinc-50 pb-3 last:border-0 last:pb-0"
          >
            <div className="w-12 h-12 relative flex-shrink-0 rounded-sm overflow-hidden border border-zinc-100 bg-zinc-50">
              {item.image ? (
                <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[7px] font-black uppercase text-zinc-300 p-1 text-center leading-none" style={{ color: item.color }}>
                  {item.source}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[6px] font-black uppercase px-1 rounded-sm text-white" style={{ backgroundColor: item.color }}>
                  {item.source}
                </span>
              </div>
              <h4 className="text-[10px] font-bold text-zinc-800 leading-tight group-hover:text-sve-blue transition-colors line-clamp-2 italic">
                {item.title}
              </h4>
            </div>
          </a>
        ))}
      </div>

      <a
        href="/nyheter"
        className="block text-center py-2 bg-zinc-50 text-[8px] font-black text-zinc-400 hover:text-pola-red uppercase tracking-widest border-t transition-colors"
      >
        Visa fler nyheter &raquo;
      </a>
    </section>
  )
}
