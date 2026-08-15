'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { X, Send, Loader2, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason || !message || !email) {
      toast.error('Vänligen fyll i alla fält')
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase.from('contact_requests').insert([
        {
          user_id: user?.id || null,
          email,
          reason,
          message,
          status: 'pending'
        }
      ])

      if (error) throw error

      toast.success('Ditt meddelande har skickats! Vi återkommer så snart vi kan.')
      setReason('')
      setMessage('')
      setEmail('')
      onClose()
    } catch (err: any) {
      toast.error('Kunde inte skicka meddelandet: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden border border-zinc-200 animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="bg-sve-blue p-6 text-white flex justify-between items-center relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-pola-red"></div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
              <MessageSquare size={24} className="text-pola-red" />
              Kontakta oss
            </h2>
            <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mt-1">Har du frågor? Vi hjälper dig!</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Din E-post</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namn@exempel.se"
                required
                className="w-full bg-zinc-50 border-b-2 border-zinc-100 p-4 text-sm font-bold text-zinc-900 outline-none focus:border-pola-red transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Ärende / Anledning</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full bg-zinc-50 border-b-2 border-zinc-100 p-4 text-sm font-bold text-zinc-900 outline-none focus:border-pola-red transition-all appearance-none"
              >
                <option value="">Välj anledning...</option>
                <option value="Fråga om annons">Fråga om annons</option>
                <option value="Tekniskt problem">Tekniskt problem</option>
                <option value="Anmäl inlägg/användare">Anmäl inlägg/användare</option>
                <option value="Samarbeten">Samarbeten</option>
                <option value="Övrigt">Övrigt</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Meddelande</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Skriv din fråga här..."
                required
                rows={4}
                className="w-full bg-zinc-50 border-b-2 border-zinc-100 p-4 text-sm font-bold text-zinc-900 outline-none focus:border-pola-red transition-all resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pola-red hover:bg-sve-blue text-white py-5 rounded-full font-black uppercase tracking-[0.3em] text-xs transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Send size={18} />
                Skicka Meddelande
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
