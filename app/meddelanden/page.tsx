'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function MeddelandenPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          ads (title)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (data) {
        setMessages(data)

        // Markera alla olästa meddelanden som lästa när man går in på sidan
        const unreadIds = data
          .filter(m => !m.is_read && m.receiver_id === user.id)
          .map(m => m.id)

        if (unreadIds.length > 0) {
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', unreadIds)
        }
      }
      setLoading(false)
    }

    fetchMessages()
  }, [])

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-16">
          <h1 className="text-4xl font-light uppercase tracking-tighter italic text-zinc-900">Mina <span className="font-bold">Meddelanden</span></h1>
          <div className="h-px w-20 bg-red-800 mt-4"></div>
        </div>

        {loading ? (
          <div className="text-center font-serif italic text-zinc-400">Laddar meddelanden...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 border border-zinc-100 rounded-sm">
            <p className="text-zinc-500 font-serif italic mb-6">Du har inga meddelanden ännu.</p>
            <Link href="/annonser" className="text-[10px] font-bold uppercase tracking-widest text-red-800 border-b border-red-800 pb-1">
              Utforska annonser
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-8 border rounded-sm transition-all shadow-zinc-100 hover:shadow-xl ${
                  !msg.is_read ? 'border-red-200 bg-red-50/10' : 'border-zinc-100'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-800 mb-2 block">
                      Angående: {msg.ads?.title || 'Borttagen annons'}
                    </span>
                    <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!msg.is_read && (
                    <span className="bg-red-600 text-white text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Nytt</span>
                  )}
                </div>
                <p className="text-zinc-600 font-light leading-relaxed">
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
