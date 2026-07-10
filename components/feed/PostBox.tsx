'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function PostBox() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handlePost = async () => {
    if (!content.trim()) return

    setLoading(true)

    // Kolla om användaren är inloggad
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('Du måste vara inloggad för att posta.')
      router.push('/logga-in')
      return
    }

    const { error } = await supabase
      .from('posts')
      .insert([
        {
          content,
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email?.split('@')[0]
        }
      ])

    if (error) {
      alert('Kunde inte publicera inlägget: ' + error.message)
    } else {
      setContent('')
    }
    setLoading(false)
  }

  return (
    <div className="bg-white border border-zinc-100 rounded-sm p-8 mb-12 shadow-sm">
      <div className="flex gap-6">
        <div className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-400">
          DU
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Dela något med communityt..."
            className="w-full bg-transparent border-none focus:ring-0 resize-none font-light text-zinc-600 placeholder:text-zinc-300 py-2 text-lg"
            rows={2}
            disabled={loading}
          ></textarea>
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-zinc-100">
            <div className="flex gap-4">
              <button className="text-zinc-400 hover:text-red-800 transition-colors text-xl disabled:opacity-50">📸</button>
              <button className="text-zinc-400 hover:text-red-800 transition-colors text-xl disabled:opacity-50">📍</button>
            </div>
            <button
              onClick={handlePost}
              disabled={loading || !content.trim()}
              className="bg-zinc-900 text-white px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-red-800 transition-all active:scale-95 disabled:bg-zinc-300"
            >
              {loading ? 'Publicerar...' : 'Publicera'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
