'use client'

import { useState } from 'react'
import { Share2, Flag } from 'lucide-react'
import { toast } from 'sonner'
import ReportModal from '../ui/ReportModal'

interface AdActionsProps {
  adId: string
  adTitle: string
  currentUserId?: string
}

export default function AdActions({ adId, adTitle, currentUserId }: AdActionsProps) {
  const [reportModalOpen, setReportModalOpen] = useState(false)

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
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 text-zinc-600 px-4 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-sm"
        >
          <Share2 size={14} /> Dela
        </button>
        <button
          onClick={handleReport}
          className="flex items-center gap-2 bg-white border border-zinc-100 text-[#a11a2d] px-4 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all shadow-sm"
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
