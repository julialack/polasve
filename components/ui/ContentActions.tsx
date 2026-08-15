'use client'

import { useState } from 'react'
import { Share2, Flag } from 'lucide-react'
import { toast } from 'sonner'
import ReportModal from './ReportModal'

interface ContentActionsProps {
  contentId: string
  contentTitle: string
  contentType: 'post' | 'ad' | 'comment' | 'news'
  currentUserId?: string
  shareUrl?: string
  className?: string
}

export default function ContentActions({ contentId, contentTitle, contentType, currentUserId, shareUrl, className = '' }: ContentActionsProps) {
  const [reportModalOpen, setReportModalOpen] = useState(false)

  const handleShare = async () => {
    const url = shareUrl || window.location.href
    try {
      if (navigator.share) {
        await navigator.share({
          title: contentTitle,
          text: `Kolla in detta på Polasve: ${contentTitle}`,
          url: url,
        })
      } else {
        await navigator.clipboard.writeText(url)
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
      <div className={`flex items-center gap-3 ${className}`}>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-sve-blue transition-colors"
          title="Dela"
        >
          <Share2 size={14} />
          <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Dela</span>
        </button>
        <button
          onClick={handleReport}
          className="flex items-center gap-1.5 text-zinc-300 hover:text-pola-red transition-colors"
          title="Anmäl"
        >
          <Flag size={13} />
          <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Anmäl</span>
        </button>
      </div>

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        contentId={contentId}
        contentType={contentType === 'news' ? 'post' : contentType as any} // Map news to post or just handle news in modal
        reporterId={currentUserId}
      />
    </>
  )
}
