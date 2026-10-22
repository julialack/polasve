'use client'

import { useState, useEffect } from 'react'
import { Share2, Flag, Bookmark } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import ReportModal from '../ui/ReportModal'

interface AdActionsProps {
  adId: string
  adTitle: string
  currentUserId?: string
}

export default function AdActions({ adId, adTitle, currentUserId }: AdActionsProps) {
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!currentUserId || !adId) return
    const checkSaved = async () => {
      try {
        const { data } = await supabase
          .from('saved_ads')
          .select('id')
          .eq('user_id', currentUserId)
          .eq('ad_id', adId)
          .maybeSingle()
        if (data) setIsSaved(true)
      } catch {
        // Localstorage fallback
        const localSaved = JSON.parse(localStorage.getItem(`saved_ads_${currentUserId}`) || '[]')
        if (localSaved.includes(adId)) setIsSaved(true)
      }
    }
    checkSaved()
  }, [currentUserId, adId, supabase])

  const handleSave = async () => {
    if (!currentUserId) return toast.error('Du måste vara inloggad för att spara annonser')
    if (saving) return

    setSaving(true)
    try {
      if (isSaved) {
        setIsSaved(false)
        toast.success('Annonsen har tagits bort från dina sparade')
        // Localstorage sync
        const localSaved = JSON.parse(localStorage.getItem(`saved_ads_${currentUserId}`) || '[]')
        localStorage.setItem(`saved_ads_${currentUserId}`, JSON.stringify(localSaved.filter((id: string) => id !== adId)))
        await supabase.from('saved_ads').delete().eq('user_id', currentUserId).eq('ad_id', adId)
      } else {
        setIsSaved(true)
        toast.success('Annonsen sparades i din profil!')
        // Localstorage sync
        const localSaved = JSON.parse(localStorage.getItem(`saved_ads_${currentUserId}`) || '[]')
        if (!localSaved.includes(adId)) {
          localStorage.setItem(`saved_ads_${currentUserId}`, JSON.stringify([...localSaved, adId]))
        }
        await supabase.from('saved_ads').insert([{ user_id: currentUserId, ad_id: adId }])
      }
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: adTitle,
          text: `Kolla in denna annons på Polasve: ${adTitle}`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Länk kopierad till urklipp!')
      }
    } catch (err) {
      console.error('Share failed:', err)
    }
  }

  const handleReport = () => {
    if (!currentUserId) return toast.error('Du måste vara inloggad för att anmäla')
    setReportModalOpen(true)
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
            isSaved
              ? 'bg-[#003366] text-white border border-[#003366]'
              : 'bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-[#003366]'
          }`}
        >
          <Bookmark size={14} className={isSaved ? "fill-current text-amber-400" : ""} />
          {isSaved ? 'Sparad' : 'Spara'}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 text-zinc-600 px-4 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-sm"
        >
          <Share2 size={14} /> Dela
        </button>

        <button
          onClick={handleReport}
          className="flex items-center gap-2 bg-white border border-zinc-200 text-[#a11a2d] px-4 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all shadow-sm"
        >
          <Flag size={14} /> Anmäl
        </button>
      </div>

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        contentId={adId}
        contentType="ad"
        reporterId={currentUserId}
      />
    </>
  )
}
