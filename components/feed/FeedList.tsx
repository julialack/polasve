'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatDisplayName } from '@/utils/formatName'

export default function FeedList() {
  const [posts, setPosts] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) setPosts(data)
    }

    fetchPosts()

    // Lyssna på realtidsändringar
    const channel = supabase
      .channel('realtime posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        setPosts((currentPosts) => [payload.new, ...currentPosts])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (posts.length === 0) {
    return (
      <div className="space-y-8">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse flex gap-6 pl-14">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-zinc-100 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-100 rounded"></div>
            </div>
          </div>
        ))}
        <p className="text-center text-zinc-400 font-serif italic">Inga inlägg ännu. Bli den första att skriva!</p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {posts.map((post) => (
        <div key={post.id} className="group border-b border-zinc-50 pb-8 last:border-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center font-bold text-[10px] text-zinc-400">
                {post.user_name?.[0] || 'U'}
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-widest text-zinc-900">
                  {formatDisplayName(post.user_name)}
                </h4>
                <p className="text-[9px] text-zinc-300 font-bold uppercase tracking-tighter">
                  {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
          <p className="text-zinc-600 font-light leading-relaxed mb-6 pl-14">
            {post.content}
          </p>
          <div className="flex gap-8 items-center pl-14">
            <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 hover:text-red-800 transition-colors uppercase tracking-[0.2em]">
              Gilla ({post.likes_count})
            </button>
            <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-[0.2em]">
              Svara
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
