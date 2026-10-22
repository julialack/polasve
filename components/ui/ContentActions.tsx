'use client'

import { useState } from 'react'
import { Share2, Flag } from 'lucide-react'
import { toast } from 'sonner'
import ReportModal from './ReportModal'
import { useTranslation } from '@/utils/translations'
import { getMenuPageCopy } from '@/utils/menu-page-copy'

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
  const { lang } = useTranslation()
  const copy = getMenuPageCopy(lang).common

  const handleShare = async () => {
    const url = shareUrl || window.location.href
    try {
      if (navigator.share) {
        await navigator.share({
          title: contentTitle,
          text: `${copy.shareIntro} ${contentTitle}`,
          url: url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        toast.success(copy.linkCopied)
      }
    } catch (err) {
      console.error('Share failed:', err)
    }
  }

  const handleReport = () => {
    if (!currentUserId) return toast.error(copy.signInToReport)
    setReportModalOpen(true)
  }

  return (
    <>
      <div className={`flex items-center gap-3 ${className}`}>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-sve-blue transition-colors"
          title={copy.share}
        >
          <Share2 size={14} />
          <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">{copy.share}</span>
        </button>
        <button
          onClick={handleReport}
          className="flex items-center gap-1.5 text-zinc-300 hover:text-pola-red transition-colors"
          title={copy.report}
        >
          <Flag size={13} />
          <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">{copy.report}</span>
        </button>
      </div>

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        contentId={contentId}
        contentType={contentType === 'news' ? 'post' : contentType}
        reporterId={currentUserId}
      />
    </>
  )
}
