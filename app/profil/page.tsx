'use client'

import { useEffect, useState, useCallback, useRef, Suspense } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { formatDisplayName } from '@/utils/formatName'
import { Package, MessageSquare, ChevronRight, PlusCircle, Settings, Globe, Info, Trash2, CheckCircle, Edit3, Send, Camera, X, Loader2, ChevronLeft, Mail, Phone } from 'lucide-react'
import HomeHero from '@/components/HomeHero'
import { toast } from 'sonner'
import UserAvatar from '@/components/ui/UserAvatar'
import SafeImage from '@/components/ui/SafeImage'

interface Ad {
  id: string
  title: string
  image_url: string | null
  category: string
  price: string | null
  status?: string
  payment_status?: string
}

const LANGUAGE_LABELS: Record<string, string> = {
  sv: '🇸🇪 SV',
  pl: '🇵🇱 PL',
  en: '🇬🇧 EN'
}

function ProfilContent() {
  const searchParams = useSearchParams()
  const initialView = searchParams.get('view') === 'chat' ? 'chat' : 'ads'

  const [user, setUser] = useState<any>(null)
  const [ads, setAds] = useState<Ad[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const [activeView, setActiveView] = useState<'ads' | 'chat'>(initialView)
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatMessages])

  const fetchConversations = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('sender_id, receiver_id, content, created_at')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (data) {
      const uniqueChats: any[] = []
      const seenIds = new Set()
      const otherUserIds: string[] = []

      data.forEach(msg => {
        const otherId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id
        if (!seenIds.has(otherId)) {
          seenIds.add(otherId)
          otherUserIds.push(otherId)
          uniqueChats.push({ otherId, lastMessage: msg.content, time: msg.created_at, name: 'Laddar...' })
        }
      })

      if (otherUserIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('id, full_name, avatar_url').in('id', otherUserIds)
        if (profiles) {
          const profileMap = profiles.reduce((acc: any, p: any) => {
            acc[p.id] = { name: p.full_name, avatar: p.avatar_url }
            return acc
          }, {})
          uniqueChats.forEach(chat => {
            const p = profileMap[chat.otherId]
            if (p) { chat.name = p.name || 'Medlem'; chat.avatar = p.avatar }
          })
        }
      }
      setConversations(uniqueChats)
    }
  }, [supabase])

  const fetchChatMessages = useCallback(async (otherId: string) => {
    const { data: { user: u } } = await supabase.auth.getUser()
    if (!u) return

    await supabase.from('messages').update({ is_read: true }).eq('receiver_id', u.id).eq('sender_id', otherId).eq('is_read', false)
    const { data } = await supabase.from('messages').select('*').or(`and(sender_id.eq.${u.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${u.id})`).order('created_at', { ascending: true })
    if (data) setChatMessages(data)
    fetchConversations(u.id)
  }, [supabase, fetchConversations])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() && !imageFile || !selectedChat || !user) return
    setSending(true)
    let imageUrl = null
    if (imageFile) {
      const fileName = `${user.id}-${Date.now()}.${imageFile.name.split('.').pop()}`
      const { error: uploadError } = await supabase.storage.from('message-images').upload(fileName, imageFile)
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('message-images').getPublicUrl(fileName)
        imageUrl = publicUrl
      }
    }
    const { error } = await supabase.from('messages').insert([{
      sender_id: user.id, receiver_id: selectedChat, content: newMessage.trim() || "Bild", image_url: imageUrl,
      sender_name: user.user_metadata?.full_name || user.email?.split('@')[0], is_read: false
    }])
    if (!error) { setNewMessage(''); setImageFile(null); setImagePreview(null); fetchChatMessages(selectedChat) }
    setSending(false)
  }

  const fetchUserData = useCallback(async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) { router.push('/logga-in'); return }
      setUser(currentUser)

      const { data: userAds } = await supabase.from('ads').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false })
      if (userAds) setAds(userAds as any)

      const { count } = await supabase.from('messages').select('id', { count: 'exact', head: true }).eq('receiver_id', currentUser.id).eq('is_read', false)
      setUnreadCount(count || 0)
      fetchConversations(currentUser.id)
    } finally {
      setLoading(false)
    }
  }, [supabase, router, fetchConversations])

  useEffect(() => { fetchUserData() }, [fetchUserData])

  const handleDeleteAd = async (adId: string) => {
    if (!confirm('Ta bort annonsen permanent?')) return
    try {
      setLoading(true)

      // 1. Försök nollställa kopplingar i meddelanden
      const { error: msgError } = await supabase
        .from('messages')
        .update({ ad_id: null })
        .eq('ad_id', adId)

      if (msgError) console.warn('Kunde inte nollställa meddelanden:', msgError)

      // 2. Utför raderingen
      // Vi förlitar oss på Supabase RLS för att verifiera ägarskap
      const { error: deleteError, count } = await supabase
        .from('ads')
        .delete({ count: 'exact' })
        .eq('id', adId)

      if (deleteError) throw deleteError

      if (count && count > 0) {
        toast.success('Annonsen är nu raderad permanent')
        setAds(prev => prev.filter(a => a.id !== adId))
        return
      }

      // 3. Om DELETE returnerar 0 rader, försök åtminstone markera den som 'finished'
      // (Detta kan fungera om din RLS tillåter UPDATE men inte DELETE)
      const { error: updateError } = await supabase
        .from('ads')
        .update({ status: 'finished' })
        .eq('id', adId)

      if (!updateError) {
        toast.success('Annonsen kunde inte raderas helt, men har markerats som avslutad.')
        setAds(prev => prev.map(a => a.id === adId ? { ...a, status: 'finished' } : a))
      } else {
        toast.error('Kunde inte radera annonsen. Kontrollera RLS-policyn i Supabase Dashboard.')
      }

    } catch (e: any) {
      console.error('Borttagningsfel:', e)
      toast.error('Ett oväntat fel uppstod vid radering.')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsFinished = async (adId: string) => {
    try {
      await supabase.from('ads').update({ status: 'finished' }).eq('id', adId)
      toast.success('Markerad som klar')
      setAds(prev => prev.map(ad => ad.id === adId ? { ...ad, status: 'finished' } : ad))
    } catch (e) { toast.error('Fel uppstod') }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  if (loading) return <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center italic text-zinc-400">Laddar profil...</div>

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
              className="flex items-center justify-center gap-2 bg-[#003366] text-white px-6 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-[#a11a2d] transition-all shadow-lg active:scale-95 w-full md:w-fit"
            >
              <PlusCircle size={14} /> Skapa Ny Annons
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* LEFT: User Card (Restored original design) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-zinc-50 border border-zinc-200 rounded-sm shadow-xl overflow-hidden text-left">
                <div className="h-32 relative bg-gradient-to-r from-[#a11a2d] to-[#003366]">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-50"></div>
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                    <div className="w-32 h-32 bg-white p-1 rounded-full shadow-2xl overflow-hidden border-4 border-white relative flex items-center justify-center">
                       <UserAvatar userId={user?.id} size="xl" />
                    </div>
                  </div>
                </div>
                <div className="pt-20 pb-10 px-8 text-center">
                  <h2 className="text-2xl font-pacifico text-sve-blue italic">
                    {formatDisplayName(meta.full_name || user?.email?.split('@')[0])}
                  </h2>
                  <div className="flex flex-col items-center gap-2 mt-1 mb-6">
                    <div className="flex items-center gap-2 text-zinc-400 text-[9px] font-bold uppercase tracking-widest">
                      <Mail size={10} className="text-[#a11a2d]" /> {user?.email}
                    </div>
                    {meta.phone && (
                      <div className="flex items-center gap-2 text-zinc-400 text-[9px] font-bold uppercase tracking-widest">
                        <Phone size={10} className="text-[#003366]" /> {meta.phone}
                      </div>
                    )}
                  </div>

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

                  <div className="mt-8 space-y-2">
                    <button
                      onClick={() => setActiveView('ads')}
                      className={`w-full flex items-center gap-4 p-3 rounded-sm font-black uppercase text-[10px] tracking-widest transition-all ${activeView === 'ads' ? 'bg-[#003366] text-white shadow-lg' : 'hover:bg-zinc-100 text-zinc-600'}`}
                    >
                      <Package size={18} /> Mina Annonser ({ads.length})
                    </button>
                    <button
                      onClick={() => setActiveView('chat')}
                      className={`w-full flex items-center justify-between p-3 rounded-sm font-black uppercase text-[10px] tracking-widest transition-all ${activeView === 'chat' ? 'bg-[#a11a2d] text-white shadow-lg' : 'hover:bg-zinc-100 text-zinc-600'}`}
                    >
                      <div className="flex items-center gap-4">
                        <MessageSquare size={18} /> Meddelanden
                      </div>
                      {unreadCount > 0 && <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${activeView === 'chat' ? 'bg-white text-[#a11a2d]' : 'bg-[#a11a2d] text-white'}`}>{unreadCount}</span>}
                    </button>
                    <Link
                      href="/profil/installningar"
                      className="w-full mt-4 py-4 bg-white hover:bg-zinc-100 text-[9px] font-black uppercase tracking-[0.3em] text-[#003366] transition-all flex items-center justify-center gap-3 rounded-sm border-2 border-[#003366]/10"
                    >
                      <Settings size={14} /> Redigera Profil
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Content (Restored original design) */}
            <div className="lg:col-span-8">
              {activeView === 'ads' ? (
                <section className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden text-left min-h-[500px]">
                  <div className="bg-[#a11a2d] text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Package size={14} /> Mina Aktiva Annonser
                  </div>

                  <div className="p-4 md:p-6 text-left">
                    {ads.length === 0 ? (
                      <div className="py-12 text-center text-left opacity-40">
                        <Package size={40} className="mx-auto mb-4 text-[#003366]" />
                        <p className="text-zinc-400 italic text-sm text-center">Du har inga aktiva annonser än.</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 text-left">
                        {ads.map((ad: any) => (
                          <div key={ad.id} className={`group relative flex flex-col md:flex-row items-center gap-6 p-4 border border-zinc-50 rounded-sm transition-all ${ad.status === 'finished' ? 'opacity-60 bg-zinc-50' : 'hover:border-[#003366]/20 hover:bg-zinc-50/50'}`}>
                            <Link href={`/annonser/${ad.id}`} className="flex flex-1 items-center gap-6 min-w-0">
                              <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-100 flex-shrink-0 rounded-sm overflow-hidden border text-left relative">
                                {ad.image_url ? (
                                  <img src={ad.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[8px] font-bold uppercase text-left">Bild saknas</div>
                                )}
                                {ad.status === 'finished' && (
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest rotate-[-15deg] border-2 border-white px-1 py-0.5">SÅLD / KLAR</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <div className="flex items-center gap-2">
                                  <span className="text-[7px] font-black text-[#a11a2d] uppercase tracking-widest text-left">{ad.category}</span>
                                  {ad.payment_status === 'pending_payment' && (
                                    <span className="bg-amber-100 text-amber-700 text-[6px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter animate-pulse">Väntar på betalning</span>
                                  )}
                                </div>
                                <h4 className="font-bold text-base text-[#003366] truncate italic group-hover:underline text-left">{ad.title}</h4>
                                <p className="text-sm font-black text-zinc-900 mt-1 text-left">{ad.price || 'Bud'}</p>
                              </div>
                            </Link>

                            <div className="flex items-center gap-3 md:border-l border-zinc-100 md:pl-6 w-full md:w-auto">
                              {ad.status !== 'finished' && (
                                <>
                                  <Link
                                    href={`/annonser/${ad.id}/redigera`}
                                    title="Redigera annons"
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-50 text-[#003366] px-4 py-2 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-[#003366] hover:text-white transition-all shadow-sm"
                                  >
                                    <Edit3 size={14} /> Redigera
                                  </Link>
                                  <button
                                    onClick={() => handleMarkAsFinished(ad.id)}
                                    title="Markera som klart/sålt"
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                  >
                                    <CheckCircle size={14} /> Klar
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDeleteAd(ad.id)}
                                title="Ta bort annons"
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-[#a11a2d] hover:text-white transition-all shadow-sm"
                              >
                                <Trash2 size={14} /> Ta bort
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              ) : (
                <div className="bg-white border border-zinc-200 shadow-xl rounded-sm flex flex-col md:flex-row h-[600px] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                  <aside className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-64 flex-col border-r border-zinc-100 bg-zinc-50/50`}>
                    <div className="p-4 border-b border-zinc-100 bg-white font-black text-[10px] uppercase text-[#003366] tracking-widest text-left">Inkorg</div>
                    <div className="flex-1 overflow-y-auto">
                      {conversations.length === 0 ? <div className="p-10 text-center text-zinc-400 text-[10px] uppercase italic">Inga chatter än</div> : conversations.map(chat => (
                        <button key={chat.otherId} onClick={() => { setSelectedChat(chat.otherId); fetchChatMessages(chat.otherId) }} className={`w-full p-4 flex gap-3 hover:bg-white border-b border-zinc-100 text-left ${selectedChat === chat.otherId ? 'bg-white border-l-4 border-l-[#a11a2d]' : ''}`}>
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200 shadow-inner">
                            {chat.avatar ? <img src={chat.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-[#003366]">{chat.name?.[0]}</div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[10px] text-[#003366] truncate uppercase tracking-tight">{chat.name}</p>
                            <p className="text-[9px] text-zinc-500 truncate italic">"{chat.lastMessage}"</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </aside>
                  <main className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-white min-w-0`}>
                    {selectedChat ? (
                      <>
                        <div className="p-3 border-b flex items-center justify-between bg-zinc-50/50">
                          <div className="flex items-center gap-3">
                            <button onClick={() => setSelectedChat(null)} className="md:hidden p-1 text-zinc-400"><ChevronLeft size={20} /></button>
                            <Link href={`/profil/${selectedChat}`} className="font-black text-[10px] uppercase tracking-widest text-[#003366] hover:underline flex items-center gap-2">
                               <div className="w-6 h-6 rounded-full overflow-hidden bg-[#003366] flex items-center justify-center text-white text-[8px] font-bold">
                                 {conversations.find(c => c.otherId === selectedChat)?.avatar ? <img src={conversations.find(c => c.otherId === selectedChat)?.avatar} className="w-full h-full object-cover" /> : conversations.find(c => c.otherId === selectedChat)?.name?.[0]}
                               </div>
                               {conversations.find(c => c.otherId === selectedChat)?.name}
                            </Link>
                          </div>
                          <span className="text-[8px] font-black uppercase text-green-500 bg-green-50 px-2 py-0.5 rounded-full tracking-widest hidden">Aktiv</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/20" ref={scrollRef}>
                          {chatMessages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] p-3 rounded-xl text-xs shadow-sm ${msg.sender_id === user.id ? 'bg-[#003366] text-white rounded-br-none' : 'bg-white border text-zinc-800 rounded-bl-none'}`}>
                                {msg.image_url && <div className="mb-2 rounded-lg overflow-hidden border"><img src={msg.image_url} className="max-w-full h-auto" /></div>}
                                <p className="font-medium leading-relaxed">{msg.content}</p>
                                <span className={`text-[7px] mt-1 block opacity-50 text-right ${msg.sender_id === user.id ? 'text-white/70' : 'text-zinc-400'}`}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <form onSubmit={handleSendMessage} className="p-3 border-t">
                          {imagePreview && (
                            <div className="mb-2 relative w-12 h-12 rounded-sm overflow-hidden border border-zinc-200">
                              <img src={imagePreview} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => { setImagePreview(null); setImageFile(null) }} className="absolute top-0 right-0 bg-black/50 text-white p-0.5"><X size={10} /></button>
                            </div>
                          )}
                          <div className="flex gap-2 bg-zinc-50 rounded-full px-3 py-1 border items-center shadow-inner focus-within:border-[#003366] transition-colors">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-zinc-400 hover:text-[#003366] p-1.5 transition-colors"><Camera size={16} /></button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
                            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e as any) } }} placeholder="Skriv svar..." className="flex-1 bg-transparent border-none py-2 text-[11px] font-bold outline-none text-zinc-950 placeholder:text-zinc-400" />
                            <button type="submit" disabled={sending || (!newMessage.trim() && !imageFile)} className="text-[#a11a2d] hover:text-[#003366] p-1.5 transition-all active:scale-90">{sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}</button>
                          </div>
                        </form>
                      </>
                    ) : <div className="flex-1 flex flex-col items-center justify-center opacity-30 p-12 text-center"><MessageSquare size={40} className="text-[#003366] mb-4" /><p className="text-[10px] font-black uppercase tracking-widest text-[#003366]">Välj en chatt för att svara</p></div>}
                  </main>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center italic text-zinc-400 font-sans">Laddar profil...</div>}>
      <ProfilContent />
    </Suspense>
  )
}
