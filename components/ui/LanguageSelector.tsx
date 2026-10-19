'use client'

import { useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { useTranslation, LanguageCode } from '@/utils/translations'
import { getMenuPageCopy } from '@/utils/menu-page-copy'

export const LANGUAGES: { code: LanguageCode; flag: string; nativeName: string }[] = [
  { code: 'pl', flag: '🇵🇱', nativeName: 'Polski (Główny)' },
  { code: 'sv', flag: '🇸🇪', nativeName: 'Svenska' },
  { code: 'ua', flag: '🇺🇦', nativeName: 'Українська' },
  { code: 'en', flag: '🇬🇧', nativeName: 'English' },
]

interface LanguageSelectorProps {
  variant?: 'hero' | 'navbar'
}

export default function LanguageSelector({ variant = 'hero' }: LanguageSelectorProps) {
  const { lang: currentLang, setLang } = useTranslation()
  const languageLabel = getMenuPageCopy(currentLang).common.chooseLanguage
  const [open, setOpen] = useState(false)

  const selectLanguage = (code: LanguageCode) => {
    setLang(code)
    setOpen(false)
  }

  const activeLang = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0]

  const buttonStyle = variant === 'navbar'
    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200'
    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all active:scale-95 shadow-xs ${buttonStyle}`}
        aria-label={languageLabel}
        title={activeLang.nativeName}
      >
        <span className="text-base leading-none">{activeLang.flag}</span>
        <span className="uppercase text-[10px] tracking-wider font-extrabold">{activeLang.code}</span>
        <ChevronDown size={11} className={`transition-transform duration-300 opacity-70 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Mobile-Friendly Popup Modal / Dropdown */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          />
          <div className="fixed md:absolute right-4 md:right-0 top-16 md:top-full mt-2 z-[999] w-60 bg-white rounded-xl shadow-2xl border border-zinc-200 p-2 animate-in zoom-in-95 duration-200 text-left text-zinc-900">
            <div className="px-3 py-2 border-b border-zinc-100 flex items-center justify-between text-zinc-400 bg-white rounded-t-xl">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#003366]">{languageLabel}</span>
              <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-black p-1">
                <X size={14} />
              </button>
            </div>
            <div className="py-1 space-y-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left ${
                    currentLang === lang.code
                      ? 'bg-red-50 text-[#a11a2d] font-black border border-red-200'
                      : 'text-zinc-800 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl leading-none">{lang.flag}</span>
                    <span className="font-bold">{lang.nativeName}</span>
                  </div>
                  {currentLang === lang.code && <Check size={14} className="text-[#a11a2d] shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
