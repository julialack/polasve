'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDisplayName } from '@/utils/formatName'
import { User, Package, MessageSquare, ChevronRight, PlusCircle, Settings } from 'lucide-react'
import HomeHero from '@/components/HomeHero'

export default function ProfilPage() {
  const [user, setUser] = useState<any>(null)
  const [ads, setAds] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/logga-in')
        return
      }

      setUser(user)

      // Hämta användarens egna annonser
      const { data: userAds } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (userAds) setAds(userAds)

      // Hämta senaste meddelanden
      const { data: userMessages } = await supabase
        .from('messages')
        .select(`
          *,
          ads (title)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(3)

      if (userMessages) setMessages(userMessages)

      setLoading(false)
    }

    fetchUserData()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center italic text-zinc-400">
      Öppnar profil...
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <HomeHero />
      <div className="flex-1 py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header Section */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#003366] uppercase tracking-tight italic">Min <span className="text-[#a11a2d]">Profil</span></h1>
              <p className="text-zinc-500 mt-2 font-medium">Hantera dina annonser och läs dina meddelanden.</p>
            </div>
            <Link
              href="/skapa-annons"
              className="flex items-center gap-2 bg-[#003366] text-white px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-[#a11a2d] transition-all shadow-lg active:scale-95 w-fit"
            >
              <PlusCircle size={16} /> Ny Annons
            </Link>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">

            {/* LEFT: User Profile Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
                <div className="bg-[#003366] h-24 relative">
                  <div className="absolute -bottom-10 left-8">
                    <div className="w-20 h-20 bg-white p-1 rounded-full shadow-lg overflow-hidden">
                      {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-full h-full bg-zinc-100 rounded-full flex items-center justify-center text-2xl font-black text-[#003366]">
                          {user?.email?.[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-14 pb-8 px-8">
                  <h2 className="text-xl font-bold text-zinc-900 truncate uppercase tracking-tight">
                    {formatDisplayName(user?.user_metadata?.full_name || user?.email?.split('@')[0])}
                  </h2>
                  <p className="text-zinc-400 text-xs font-bold truncate mt-1">{user?.email}</p>

                  <div className="mt-8 pt-8 border-t border-zinc-50 grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-zinc-50 rounded-sm">
                      <p className="text-xl font-black text-[#003366]">{ads.length}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Annonser</p>
                    </div>
                    <div className="text-center p-3 bg-zinc-50 rounded-sm">
                      <p className="text-xl font-black text-[#003366]">{messages.length}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Trådar</p>
                    </div>
                  </div>

                  <Link
                    href="/profil/installningar"
                    className="w-full mt-6 py-3 border border-zinc-100 hover:border-[#003366] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-[#003366] transition-all flex items-center justify-center gap-2 rounded-sm"
                  >
                    <Settings size={14} /> Inställningar
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT: Main Content Tabs */}
            <div className="lg:col-span-8 space-y-8">

              {/* My Ads Section */}
              <section className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
                <div className="bg-[#a11a2d] text-white px-6 py-3 flex items-center gap-2">
                  <Package size={16} />
                  <h3 className="text-[11px] font-bold uppercase tracking-widest">Mina Aktiva Annonser</h3>
                </div>

                <div className="p-2 md:p-6">
                  {ads.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-zinc-400 italic font-serif">Du har inga aktiva annonser just nu.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {ads.map((ad) => (
                        <div key={ad.id} className="group flex items-center gap-4 p-3 border border-zinc-50 hover:border-zinc-200 rounded-sm transition-all">
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-100 flex-shrink-0 rounded-sm overflow-hidden border border-zinc-100">
                            {ad.image_url ? (
                              <img src={ad.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[8px] font-bold uppercase">Ingen bild</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[8px] font-bold text-[#a11a2d] uppercase tracking-widest">{ad.category}</span>
                            <h4 className="font-bold text-sm text-[#003366] truncate italic group-hover:underline">{ad.title}</h4>
                            <p className="text-xs font-bold text-zinc-900 mt-1">{ad.price || 'Pris på förfrågan'}</p>
                          </div>
                          <Link href={`/annonser/${ad.id}`} className="p-3 text-zinc-300 hover:text-[#003366] transition-colors">
                            <ChevronRight size={20} />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Messages Preview Section */}
              <section className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
                <div className="bg-[#003366] text-white px-6 py-3 flex items-center gap-2">
                  <MessageSquare size={16} />
                  <h3 className="text-[11px] font-bold uppercase tracking-widest">Senaste Meddelanden</h3>
                </div>

                <div className="p-2 md:p-6">
                  {messages.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-zinc-400 italic font-serif">Inga nya meddelanden.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <Link
                          key={msg.id}
                          href="/meddelanden"
                          className={`block p-4 border rounded-sm transition-all hover:shadow-md ${!msg.is_read ? 'bg-red-50/20 border-red-100' : 'bg-zinc-50/30 border-zinc-50 hover:bg-white'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] font-bold text-[#003366] uppercase tracking-widest truncate max-w-[200px]">
                              {msg.ads?.title || 'Bazar-kontakt'}
                            </span>
                            <span className="text-[8px] text-zinc-400 font-bold uppercase">{new Date(msg.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-zinc-600 font-medium italic line-clamp-1">"{msg.content}"</p>
                        </Link>
                      ))}
                      <Link
                        href="/meddelanden"
                        className="block text-center py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-[#003366] transition-colors mt-4 border-t border-zinc-50"
                      >
                        Öppna hela chatten &gt;&gt;
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
