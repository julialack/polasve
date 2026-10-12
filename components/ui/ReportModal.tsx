'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { X, AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/utils/translations'
import { getMenuPageCopy } from '@/utils/menu-page-copy'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  contentId: string
  contentType: 'post' | 'ad' | 'comment' | 'user'
  reporterId?: string
}

export default function ReportModal({ isOpen, onClose, contentId, contentType, reporterId }: ReportModalProps) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { lang } = useTranslation()
  const copy = getMenuPageCopy(lang).common
  const supabase = createClient()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return toast.error(copy.reasonRequired)
    if (!reporterId) return toast.error(copy.signInToReport)

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('reports')
        .insert([
          {
            reporter_id: reporterId,
            content_id: contentId,
            content_type: contentType,
            reason: reason.trim(),
            status: 'pending'
          }
        ])

      if (error) throw error

      toast.success(copy.reportSent)
      setReason('')
      onClose()
    } catch (err: any) {
      console.error('Report error:', err)
      toast.error(copy.reportFailed)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden border border-zinc-200 animate-in zoom-in-95 duration-200">
        <div className="bg-[#a11a2d] text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} />
            <h3 className="font-black text-[11px] uppercase tracking-widest">{copy.reportContent}</h3>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide leading-relaxed">
            {copy.reportPrompt}
          </p>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={copy.reportPlaceholder}
            className="w-full h-32 p-4 bg-zinc-50 border border-zinc-100 rounded-sm text-sm font-bold text-zinc-900 focus:border-[#a11a2d] outline-none resize-none placeholder:font-normal"
            autoFocus
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-zinc-200 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-colors rounded-sm"
            >
              {copy.cancel}
            </button>
            <button
              type="submit"
              disabled={submitting || !reason.trim()}
              className="flex-1 px-4 py-3 bg-[#a11a2d] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#003366] transition-all disabled:opacity-50 rounded-sm flex items-center justify-center gap-2 shadow-lg"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : copy.submitReport}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
