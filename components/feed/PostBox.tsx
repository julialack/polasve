'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Tag as TagIcon } from 'lucide-react'
import { toast } from 'sonner'
import UserAvatar from '../ui/UserAvatar'

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
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handlePost = async () => {
    if (!content.trim()) return

    setLoading(true)
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (!currentUser) {
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
          user_id: currentUser.id,
          user_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
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
    <div className="bg-white border border-zinc-100 rounded-sm p-3 md:p-4 mb-6 shadow-sm">
      <div className="flex gap-3 md:gap-4">
        <UserAvatar
          avatarUrl={user?.user_metadata?.avatar_url}
          userId={user?.id}
          userName={user?.user_metadata?.full_name}
          size="sm"
        />
        <div className="flex-1 flex flex-col gap-3 md:gap-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Dela något med communityt..."
            className="w-full bg-transparent border-none focus:ring-0 resize-none font-bold text-zinc-950 placeholder:text-zinc-300 py-1 text-sm md:text-base"
            rows={1}
            disabled={loading}
          ></textarea>

          <div className="flex flex-col gap-4 pt-3 md:pt-4 border-t border-zinc-50">
            <div className="flex items-start gap-2">
              <TagIcon size={12} className="text-zinc-500 shrink-0 mt-2" />
              <div className="flex flex-wrap gap-1.5">
                {FEED_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2.5 md:px-3 py-1 rounded-full transition-all border ${
                      category === cat.id
                      ? 'border-sve-blue bg-sve-blue text-white shadow-md'
                      : 'border-zinc-100 bg-zinc-50 text-zinc-600 hover:border-zinc-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 md:pt-0">
              <button
                onClick={handlePost}
                disabled={loading || !content.trim()}
                className="bg-sve-blue text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-pola-red transition-all active:scale-95 disabled:bg-zinc-100 disabled:text-zinc-400 flex items-center gap-2 shadow-md w-full md:w-auto justify-center"
              >
                {loading && <Loader2 size={12} className="animate-spin" />}
                Publicera inlägg
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
