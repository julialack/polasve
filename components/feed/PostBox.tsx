'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function PostBox() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handlePost = async () => {
    if (!content.trim()) return

    setLoading(true)
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
          user_name: user.user_metadata?.full_name || user.email?.split('@')[0],
          edited: false
        }
      ])

    if (error) {
      alert('Kunde inte publicera: ' + error.message)
    } else {
      setContent('')
    }
    setLoading(false)
  }

  return (
    <div className="bg-white border border-zinc-100 rounded-sm p-4 mb-6 shadow-sm">
      <div className="flex gap-4">
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Dela något med communityt..."
            className="w-full bg-transparent border-none focus:ring-0 resize-none font-bold text-zinc-900 placeholder:text-zinc-300 py-1 text-sm"
            rows={2}
            disabled={loading}
          ></textarea>
          <div className="flex justify-end items-center mt-2 pt-2 border-t border-zinc-50">
            <button
              onClick={handlePost}
              disabled={loading || !content.trim()}
              className="bg-[#003366] text-white px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-[#a11a2d] transition-all active:scale-95 disabled:bg-zinc-300 flex items-center gap-2 shadow-md shadow-blue-900/10"
            >
              {loading && <Loader2 size={12} className="animate-spin" />}
              Publicera
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
