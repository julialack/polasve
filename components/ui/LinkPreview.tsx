'use client'

import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'

interface Metadata {
  title?: string
  description?: string
  image?: string
  url: string
}

export default function LinkPreview({ url }: { url: string }) {
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch(`/api/og?url=${encodeURIComponent(url)}`)
        const data = await res.json()
        if (!data.error) {
          setMetadata(data)
        }
      } catch (err) {
        console.error('Failed to load link preview', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMetadata()
  }, [url])

  if (loading || !metadata) return null

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block mt-2 border border-zinc-200 rounded-sm overflow-hidden bg-zinc-50 hover:bg-zinc-100 transition-colors group"
    >
      <div className="flex flex-col sm:flex-row">
        {metadata.image && (
          <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-zinc-200 overflow-hidden border-b sm:border-b-0 sm:border-r border-zinc-100">
            <img src={metadata.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        )}
        <div className="p-3 flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1">
            <ExternalLink size={10} className="text-zinc-400" />
            <span className="text-[8px] font-black uppercase text-zinc-400 truncate">{new URL(url).hostname}</span>
          </div>
          <h4 className="text-xs font-bold text-[#003366] truncate mb-1 italic line-clamp-1">{metadata.title || url}</h4>
          {metadata.description && (
            <p className="text-[10px] text-zinc-500 line-clamp-2 leading-tight">{metadata.description}</p>
          )}
        </div>
      </div>
    </a>
  )
}
