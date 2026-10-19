'use client'

import { useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { useTranslation, LanguageCode } from '@/utils/translations'
import { getMenuPageCopy } from '@/utils/menu-page-copy'

export const LANGUAGES: { code: LanguageCode; label: string; nativeName: string }[] = [
  { code: 'pl', label: 'PL', nativeName: 'Polski (Główny)' },
  { code: 'sv', label: 'SE', nativeName: 'Svenska' },
  { code: 'ua', label: 'UA', nativeName: 'Українська' },
  { code: 'en', label: 'EN', nativeName: 'English' },
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
        <span className="bg-red-800 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">{activeLang.label}</span>
        <ChevronDown size={11} className={`transition-transform duration-300 opacity-70 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Global Clean Popup Modal */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xs bg-white rounded-2xl shadow-2xl border border-zinc-200 p-4 text-left text-zinc-900 animate-in zoom-in-95 duration-200">
            <div className="px-2 pb-3 border-b border-zinc-100 flex items-center justify-between text-zinc-400">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#003366]">{languageLabel}</span>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-zinc-400 hover:text-black rounded-full hover:bg-zinc-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="py-2 space-y-1.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                    currentLang === lang.code
                      ? 'bg-red-50 text-[#a11a2d] font-black border border-red-200 shadow-sm'
                      : 'text-zinc-800 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-zinc-900 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">{lang.label}</span>
                    <span className="text-sm font-bold">{lang.nativeName}</span>
                  </div>
                  {currentLang === lang.code && <Check size={16} className="text-[#a11a2d] shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
