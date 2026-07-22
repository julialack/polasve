'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDisplayName } from '@/utils/formatName'
import { Package, MessageSquare, ChevronRight, PlusCircle, Settings, Globe, Info } from 'lucide-react'
import HomeHero from '@/components/HomeHero'

interface Ad {
  id: string
  title: string
  image_url: string | null
  category: string
  price: string | null
}

interface Message {
  id: string
  content: string
  created_at: string
  sender_name: string | null
  is_read: boolean
}

const LANGUAGE_LABELS: Record<string, string> = {
  sv: '🇸🇪 SV',
  pl: '🇵🇱 PL',
  en: '🇬🇧 EN'
}

export default function ProfilPage() {
  const [user, setUser] = useState<any>(null)
  const [ads, setAds] = useState<Ad[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [avatarSvg, setAvatarSvg] = useState<string | null>(null)

  const supabase = createClient()
  const router = useRouter()

  const fetchUserData = useCallback(async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (!currentUser) {
      router.push('/logga-in')
      return
    }

    setUser(currentUser)

    // Fetch Avatar from our local API proxy
    const savedUrl = currentUser.user_metadata?.avatar_url
    if (savedUrl) {
      try {
        const res = await fetch(savedUrl)
        if (res.ok) {
          const svg = await res.text()
          if (svg.startsWith('<svg')) {
            setAvatarSvg(svg)
          }
        }
      } catch (e) {
        console.error("Avatar failed to load")
      }
    }

    // Hämta användarens egna annonser
    const { data: userAds } = await supabase
      .from('ads')
      .select('id, title, image_url, category, price')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })

    if (userAds) setAds(userAds)

    // Hämta senaste meddelanden
    const { data: userMessages } = await supabase
      .from('messages')
      .select('id, content, created_at, sender_name, is_read')
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
      .order('created_at', { ascending: false })
      .limit(5)

    if (userMessages) setMessages(userMessages)

    setLoading(false)
  }, [supabase, router])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center italic text-zinc-400">
      Öppnar profil...
    </div>
  )

  const meta = user?.user_metadata || {}

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-left font-sans">
      <HomeHero />
      <div className="flex-1 py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header Section */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-8 text-left">
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-black text-[#003366] uppercase tracking-tight italic text-left">Min <span className="text-[#a11a2d]">Profil</span></h1>
              <p className="text-zinc-500 mt-2 font-bold uppercase text-[10px] tracking-widest text-left">Hantera din närvaro på Polasve</p>
            </div>
            <Link
              href="/skapa-annons"
              className="flex items-center gap-2 bg-[#003366] text-white px-6 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-[#a11a2d] transition-all shadow-lg active:scale-95 w-fit"
            >
              <PlusCircle size={14} /> Skapa Ny Annons
            </Link>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">

            {/* LEFT: User Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-zinc-200 rounded-sm shadow-xl overflow-hidden text-left">
                <div className="bg-[#003366] h-24 relative">
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <div className="w-24 h-24 bg-white p-1 rounded-full shadow-2xl overflow-hidden border-4 border-white relative flex items-center justify-center">
                      {avatarSvg ? (
                        <div dangerouslySetInnerHTML={{ __html: avatarSvg }} className="w-full h-full object-cover rounded-full bg-zinc-50" />
                      ) : (
                        <div className="w-full h-full bg-zinc-100 rounded-full flex items-center justify-center text-3xl font-black text-[#003366]">
                          {user?.email?.[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-14 pb-10 px-8 text-center">
                  <h2 className="text-xl font-black text-[#003366] uppercase tracking-tighter italic">
                    {formatDisplayName(meta.full_name || user?.email?.split('@')[0])}
                  </h2>
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1 mb-6">{user?.email}</p>

                  {/* BIO & LANGUAGES */}
                  <div className="space-y-6 text-left border-y border-zinc-50 py-6">
                    {meta.bio && (
                      <div className="text-left">
                         <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-300 mb-2 tracking-widest">
                           <Info size={10} /> Om mig
                         </div>
                         <p className="text-xs text-zinc-600 font-medium leading-relaxed italic">&quot;{meta.bio}&quot;</p>
                      </div>
                    )}

                    <div className="text-left">
                       <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-300 mb-2 tracking-widest">
                         <Globe size={10} /> Språk
                       </div>
                       <div className="flex flex-wrap gap-2">
                         {meta.languages && meta.languages.length > 0 ? (
                           meta.languages.map((l: string) => (
                             <span key={l} className="bg-zinc-50 text-[10px] font-bold text-[#003366] px-3 py-1 rounded-full border border-zinc-100">
                               {LANGUAGE_LABELS[l] || l}
                             </span>
                           ))
                         ) : (
                           <span className="text-[10px] text-zinc-300 italic">Inga språk angivna</span>
                         )}
                       </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-zinc-50 rounded-sm">
                      <p className="text-2xl font-black text-[#003366]">{ads.length}</p>
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400">Annonser</p>
                    </div>
                    <div className="text-center p-3 bg-zinc-50 rounded-sm">
                      <p className="text-2xl font-black text-[#a11a2d]">{messages.length}</p>
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400">Meddelanden</p>
                    </div>
                  </div>

                  <Link
                    href="/profil/installningar"
                    className="w-full mt-10 py-4 bg-white hover:bg-[#003366] hover:text-white text-[9px] font-black uppercase tracking-[0.3em] text-[#003366] transition-all flex items-center justify-center gap-3 rounded-sm border-2 border-[#003366]/10"
                  >
                    <Settings size={14} /> Redigera Profil
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT: Content */}
            <div className="lg:col-span-8 space-y-10">

              {/* Ads Section */}
              <section className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden text-left">
                <div className="bg-[#a11a2d] text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-left">
                  <Package size={14} /> Mina Aktiva Annonser
                </div>

                <div className="p-4 md:p-6 text-left">
                  {ads.length === 0 ? (
                    <div className="py-12 text-center text-left">
                      <p className="text-zinc-400 italic text-sm text-center">Du har inga aktiva annonser än.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 text-left">
                      {ads.map((ad) => (
                        <Link href={`/annonser/${ad.id}`} key={ad.id} className="group flex items-center gap-6 p-4 border border-zinc-50 hover:border-[#003366]/20 hover:bg-zinc-50/50 transition-all rounded-sm text-left">
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-100 flex-shrink-0 rounded-sm overflow-hidden border text-left">
                            {ad.image_url ? (
                              <img src={ad.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[8px] font-bold uppercase text-left">Bild saknas</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <span className="text-[7px] font-black text-[#a11a2d] uppercase tracking-widest text-left">{ad.category}</span>
                            <h4 className="font-bold text-base text-[#003366] truncate italic group-hover:underline text-left">{ad.title}</h4>
                            <p className="text-sm font-black text-zinc-900 mt-1 text-left">{ad.price || 'Bud'}</p>
                          </div>
                          <ChevronRight size={20} className="text-zinc-300 group-hover:text-[#003366] transition-colors" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Messages Section */}
              <section className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden text-left">
                <div className="bg-[#003366] text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-left">
                  <MessageSquare size={14} /> Senaste Konversationer
                </div>

                <div className="p-4 md:p-6 text-left">
                  {messages.length === 0 ? (
                    <div className="py-12 text-center text-left">
                      <p className="text-zinc-400 italic text-sm text-center">Inga meddelanden ännu.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-left">
                      {messages.map((msg) => (
                        <Link
                          key={msg.id}
                          href="/meddelanden"
                          className={`block p-5 border rounded-sm transition-all hover:shadow-md ${!msg.is_read ? 'bg-red-50/30 border-red-100' : 'bg-zinc-50/30 border-zinc-50'} text-left`}
                        >
                          <div className="flex justify-between items-start mb-2 text-left">
                            <span className="text-[10px] font-black text-[#003366] uppercase tracking-tighter italic text-left">
                              Från: {msg.sender_name || 'Medlem'}
                            </span>
                            <span className="text-[8px] text-zinc-400 font-bold uppercase text-left">{new Date(msg.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-zinc-600 font-medium italic line-clamp-1 text-left">&quot;{msg.content}&quot;</p>
                        </Link>
                      ))}
                      <Link
                        href="/meddelanden"
                        className="block text-center py-4 text-[9px] font-black uppercase tracking-[0.3em] text-[#003366] hover:text-[#a11a2d] transition-colors mt-4 border-t border-zinc-50"
                      >
                        Visa alla meddelanden &raquo;
                      </Link>
                    </div>
                  )}
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
