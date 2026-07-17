'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDisplayName } from '@/utils/formatName'

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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif italic text-zinc-400">Laddar profil...</div>

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Left: User Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-zinc-50 p-10 rounded-sm border border-zinc-100">
              <div className="w-20 h-20 bg-red-800 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-xl shadow-red-900/20">
                {user?.email?.[0].toUpperCase()}
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 mb-2 uppercase tracking-tight">
                {formatDisplayName(user?.user_metadata?.full_name)}
              </h1>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-8">{user?.email}</p>

              <div className="pt-8 border-t border-zinc-200">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300 mb-4">Statistik</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-light text-zinc-900">{ads.length}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Annonser</p>
                  </div>
                </div>
              </div>

              {/* Quick Link to Messages */}
              <div className="mt-8 pt-8 border-t border-zinc-200">
                <Link
                  href="/meddelanden"
                  className="w-full flex items-center justify-between group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 group-hover:text-red-800 transition-colors">Gå till alla meddelanden</span>
                  <span className="text-red-800 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right: User's Content */}
          <div className="lg:col-span-2 space-y-20">
            {/* Ads Section */}
            <section>
              <div className="mb-12 flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-light uppercase tracking-widest text-zinc-900">Mina <span className="font-bold">Annonser</span></h2>
                  <div className="h-px w-16 bg-red-800 mt-4"></div>
                </div>
                <Link href="/skapa-annons" className="text-[10px] font-bold uppercase tracking-widest text-red-800 border-b border-red-800 pb-1">
                  + Ny Annons
                </Link>
              </div>

              {ads.length === 0 ? (
                <div className="text-center py-20 bg-zinc-50 border border-zinc-100 rounded-sm">
                  <p className="text-zinc-500 font-serif italic mb-6">Du har inte skapat några annonser ännu.</p>
                  <Link href="/skapa-annons" className="bg-zinc-900 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px]">
                    Skapa din första annons
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {ads.map((ad) => (
                    <div key={ad.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 border border-zinc-100 rounded-sm hover:shadow-xl hover:shadow-zinc-100 transition-all gap-6">
                      <div className="flex items-center gap-6">
                        {/* Ad Thumbnail */}
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-100 rounded-sm overflow-hidden flex-shrink-0 border border-zinc-50">
                          {ad.image_url ? (
                            <img
                              src={ad.image_url}
                              alt={ad.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[8px] font-bold uppercase tracking-widest text-center px-1">
                              Ingen bild
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-800 border border-red-800/20 px-3 py-1 rounded-full mb-2 inline-block">
                            {ad.category}
                          </span>
                          <h3 className="text-lg font-light text-zinc-900 group-hover:text-red-800 transition-colors tracking-tight">
                            {ad.title}
                          </h3>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Link href={`/annonser/${ad.id}`} className="text-[9px] font-bold uppercase tracking-widest border border-zinc-200 px-4 py-2 hover:bg-zinc-900 hover:text-white transition-all">
                          Visa
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Messages Preview Section */}
            <section>
              <div className="mb-12 flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-light uppercase tracking-widest text-zinc-900">Senaste <span className="font-bold">Meddelanden</span></h2>
                  <div className="h-px w-16 bg-red-800 mt-4"></div>
                </div>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-20 bg-zinc-50 border border-zinc-100 rounded-sm">
                  <p className="text-zinc-500 font-serif italic">Inga meddelanden ännu.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`p-6 border rounded-sm transition-all ${msg.is_read ? 'border-zinc-100' : 'border-red-100 bg-red-50/10'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-red-800">
                          {msg.ads?.title || 'Allmänt'}
                        </span>
                        <span className="text-[8px] text-zinc-300 font-bold uppercase tracking-widest">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 font-light line-clamp-1 italic">
                        "{msg.content}"
                      </p>
                    </div>
                  ))}
                  <Link
                    href="/meddelanden"
                    className="block text-center py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-red-800 transition-colors"
                  >
                    Se alla meddelanden
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
