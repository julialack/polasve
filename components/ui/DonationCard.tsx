'use client'

import { useState } from 'react'
import { Heart, CreditCard, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/utils/translations'
import { getMenuPageCopy } from '@/utils/menu-page-copy'

interface DonationCardProps {
  compact?: boolean
}

export default function DonationCard({ compact = false }: DonationCardProps) {
  const { t, lang } = useTranslation()
  const copy = getMenuPageCopy(lang).donation
  const [selectedAmount, setSelectedAmount] = useState<number>(25)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const PRESET_AMOUNTS = [5, 25, 50, 100]

  const handleDonate = async () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount
    if (!finalAmount || finalAmount < 5) {
      return toast.error(copy.minAmountError)
    }

    setLoading(true)
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount })
      })

      const data = await res.json()
      if (data && data.url) {
        window.location.href = data.url
      } else {
        console.error('Donation checkout could not be started:', data?.error)
        toast.error(data?.error || copy.paymentError)
      }
    } catch (err) {
      console.error('Donation checkout request failed:', err)
      toast.error(copy.startError)
    } finally {
      setLoading(false)
    }
  }

  const effectiveAmount = customAmount ? (parseFloat(customAmount) || 0) : selectedAmount

  return (
    <div className="bg-gradient-to-br from-amber-50/90 via-white to-red-50/50 border-2 border-dashed border-amber-300 rounded-sm p-4 md:p-6 text-left shadow-sm relative overflow-hidden group">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-[#a11a2d] text-white flex items-center justify-center shrink-0 shadow-md">
          <Heart size={16} className="fill-white" />
        </div>
        <h3 className="font-black text-[#003366] uppercase text-xs md:text-sm tracking-wider">
          {t.supportUsTitle}
        </h3>
      </div>

      <p className="text-[11px] md:text-xs text-zinc-600 font-medium leading-relaxed mb-4 italic">
        {t.supportUsSubtitle} ❤️
      </p>

      {/* Preset Amount Selector */}
      <div className="space-y-3 mb-4">
        <p className="text-[9px] font-black uppercase text-amber-800 tracking-widest">{t.selectAmount}</p>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
              className={`py-1.5 px-2 rounded-sm font-black text-xs uppercase tracking-wider transition-all border ${
                selectedAmount === amt && !customAmount
                  ? 'bg-[#a11a2d] text-white border-[#a11a2d] shadow-md scale-105'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-amber-400'
              }`}
            >
              {amt} kr
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="pt-1">
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder={t.customAmountPlaceholder}
            min={5}
            className="w-full p-2.5 bg-white border border-zinc-200 rounded-sm text-xs font-bold text-zinc-900 outline-none focus:border-[#003366] placeholder:text-zinc-400 placeholder:font-normal"
          />
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleDonate}
        disabled={loading || effectiveAmount < 5}
        className="w-full bg-[#003366] hover:bg-[#a11a2d] text-white py-3 rounded-sm font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <>
            <CreditCard size={14} /> {t.donateViaStripe} {effectiveAmount > 0 ? `(${effectiveAmount} kr)` : ''}
          </>
        )}
      </button>

      <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider text-center mt-2.5">
        {t.securePayment}
      </p>
    </div>
  )
}
