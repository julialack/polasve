'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Tag as TagIcon } from 'lucide-react'
import { toast } from 'sonner'

const FEED_CATEGORIES = [
  { id: 'allmänt', label: 'Allmänt', color: 'bg-zinc-100 text-zinc-600' },
  { id: 'fråga', label: 'Fråga', color: 'bg-blue-50 text-blue-700' },
  { id: 'tips', label: 'Tips', color: 'bg-green-50 text-green-700' },
  { id: 'varning', label: 'Varning', color: 'bg-red-50 text-red-700' },
  { id: 'hjälp', label: 'Hjälp', color: 'bg-orange-50 text-orange-700' }
]

export default function PostBox() {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('allmänt')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handlePost = async () => {
    if (!content.trim()) return

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error('Du måste vara inloggad för att posta.')
      router.push('/logga-in')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('posts')
      .insert([
        {
          content,
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email?.split('@')[0],
          edited: false,
          category: category // New column
        }
      ])

    if (error) {
      toast.error('Kunde inte publicera inlägget.')
      console.error(error)
    } else {
      toast.success('Inlägget har publicerats!')
      setContent('')
      setCategory('allmänt')
    }
    setLoading(false)
  }

  return (
    <div className="bg-white border border-zinc-100 rounded-sm p-4 mb-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Dela något med communityt..."
          className="w-full bg-transparent border-none focus:ring-0 resize-none font-bold text-zinc-900 placeholder:text-zinc-300 py-1 text-sm md:text-base"
          rows={2}
          disabled={loading}
        ></textarea>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-50">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            <TagIcon size={14} className="text-zinc-300 shrink-0" />
            <div className="flex gap-1.5">
              {FEED_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all border ${
                    category === cat.id
                    ? 'border-[#003366] bg-[#003366] text-white shadow-md'
                    : 'border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handlePost}
            disabled={loading || !content.trim()}
            className="bg-[#003366] text-white px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#a11a2d] transition-all active:scale-95 disabled:bg-zinc-100 disabled:text-zinc-300 flex items-center gap-2 shadow-lg shadow-blue-900/10"
          >
            {loading && <Loader2 size={12} className="animate-spin" />}
            Publicera
          </button>
        </div>
      </div>
    </div>
  )
}
