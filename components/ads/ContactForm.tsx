'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface ContactFormProps {
  receiverId: string
  adId: string
  adTitle: string
}

export default function ContactForm({ receiverId, adId, adTitle }: ContactFormProps) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('Du måste vara inloggad för att skicka meddelanden.')
      router.push('/logga-in')
      return
    }

    if (user.id === receiverId) {
      alert('Du kan inte skicka meddelanden till din egen annons.')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('messages')
      .insert([
        {
          sender_id: user.id,
          receiver_id: receiverId,
          ad_id: adId,
          content: message,
        }
      ])

    if (error) {
      alert('Kunde inte skicka meddelande: ' + error.message)
    } else {
      setSent(true)
      setMessage('')
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="bg-zinc-900 p-8 rounded-sm text-center border border-[#a11a2d]/30 shadow-2xl">
        <div className="text-[#a11a2d] text-3xl mb-4 font-serif italic">✓</div>
        <h3 className="text-xl font-light italic font-serif mb-2 text-white">Meddelande skickat</h3>
        <p className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">
          Annonsören har fått ditt meddelande.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-zinc-950 p-10 text-white shadow-2xl rounded-sm relative overflow-hidden border border-zinc-900">
      <div className="relative z-10">
        <h3 className="text-xl font-bold italic text-white/90 mb-6 uppercase tracking-tight">Intresserad?</h3>
        <form onSubmit={handleSendMessage} className="space-y-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Skriv ditt meddelande här...`}
            required
            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-sm text-sm font-bold text-white focus:border-[#a11a2d] outline-none transition-colors min-h-[140px] resize-none placeholder:text-zinc-600 placeholder:font-normal"
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="w-full bg-[#a11a2d] text-white py-5 rounded-sm font-black uppercase tracking-[0.2em] hover:bg-[#8d1627] transition-all text-[11px] shadow-xl shadow-red-900/10 disabled:bg-zinc-800 disabled:shadow-none active:scale-95"
          >
            {loading ? 'Skickar...' : 'Skicka Meddelande'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic font-serif">Svarar vanligtvis inom 24 timmar</p>
        </div>
      </div>
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-red-800/10 rounded-full blur-3xl"></div>
    </div>
  )
}
