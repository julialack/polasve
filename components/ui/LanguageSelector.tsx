'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'

export type LanguageCode = 'pl' | 'sv' | 'ua' | 'en'

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
  const [currentLang, setCurrentLang] = useState<LanguageCode>('pl')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('polasve_lang') as LanguageCode
    if (saved && LANGUAGES.some(l => l.code === saved)) {
      setCurrentLang(saved)
    }
  }, [])

  const selectLanguage = (code: LanguageCode) => {
    setCurrentLang(code)
    localStorage.setItem('polasve_lang', code)
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
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black transition-all active:scale-95 shadow-xs ${buttonStyle}`}
        aria-label="Wybierz język / Välj språk"
      >
        <span className="text-base leading-none">{activeLang.flag}</span>
        <span className="uppercase text-[10px] tracking-wider font-black">{activeLang.code}</span>
        <ChevronDown size={11} className={`transition-transform duration-300 opacity-70 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Mobile-Friendly Popup Modal / Dropdown */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-[160] w-52 bg-white rounded-xl shadow-2xl border border-zinc-200 p-2 animate-in zoom-in-95 duration-200 text-left text-zinc-900">
            <div className="px-3 py-2 border-b border-zinc-100 flex items-center justify-between text-zinc-400">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#003366]">Wybierz język</span>
              <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-black">
                <X size={14} />
              </button>
            </div>
            <div className="py-1 space-y-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all text-left ${
                    currentLang === lang.code
                      ? 'bg-red-50 text-[#a11a2d] font-black'
                      : 'text-zinc-800 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </div>
                  {currentLang === lang.code && <Check size={14} className="text-[#a11a2d]" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
