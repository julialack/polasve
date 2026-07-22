'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatDisplayName } from '@/utils/formatName'
import { Send, User, ChevronLeft, Loader2, MessageSquare, Camera, X } from 'lucide-react'
import HomeHero from '@/components/HomeHero'
import Image from 'next/image'
import { toast } from 'sonner'

export default function MeddelandenPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setCurrentUser(user)
      fetchConversations(user.id)
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (!selectedChat || !currentUser) return
    const channel = supabase.channel('chat_thread').on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages'
      }, (payload) => {
        const msg = payload.new
        if ((msg.sender_id === selectedChat && msg.receiver_id === currentUser.id) ||
            (msg.sender_id === currentUser.id && msg.receiver_id === selectedChat)) {
          setMessages(prev => [...prev, msg])
        }
        fetchConversations(currentUser.id)
      }).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [selectedChat, currentUser])

  const fetchConversations = async (userId: string) => {
    const { data } = await supabase.from('messages').select('sender_id, receiver_id, content, created_at, sender_name').or(`sender_id.eq.${userId},receiver_id.eq.${userId}`).order('created_at', { ascending: false })
    if (data) {
      const uniqueChats: any[] = []
      const seenIds = new Set()
      data.forEach(msg => {
        const otherId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id
        if (!seenIds.has(otherId)) {
          seenIds.add(otherId)
          uniqueChats.push({ otherId, lastMessage: msg.content, time: msg.created_at, name: msg.sender_id === userId ? 'Mottagare' : msg.sender_name })
        }
      })
      setConversations(uniqueChats)
    }
  }

  const fetchMessages = async (otherId: string) => {
    const { data } = await supabase.from('messages').select('*').or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${currentUser.id})`).order('created_at', { ascending: true })
    if (data) setMessages(data)
    await supabase.from('messages').update({ is_read: true }).eq('receiver_id', currentUser.id).eq('sender_id', otherId)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!newMessage.trim() && !imageFile) || !selectedChat || sending) return

    setSending(true)
    let imageUrl = null

    if (imageFile) {
      setUploading(true)
      const fileName = `${currentUser.id}-${Date.now()}.${imageFile.name.split('.').pop()}`
      const { error: uploadError } = await supabase.storage.from('message-images').upload(fileName, imageFile)
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('message-images').getPublicUrl(fileName)
        imageUrl = publicUrl
      }
      setUploading(false)
    }

    const { error } = await supabase.from('messages').insert([{
      sender_id: currentUser.id,
      receiver_id: selectedChat,
      content: newMessage.trim() || (imageUrl ? "Skickade en bild" : ""),
      image_url: imageUrl,
      sender_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
      is_read: false
    }])

    if (!error) {
      setNewMessage('')
      setImageFile(null)
      setImagePreview(null)
    }
    setSending(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center italic text-zinc-400">Öppnar chatt...</div>

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <HomeHero />
      <div className="flex-1 max-w-6xl mx-auto w-full h-[calc(100vh-140px)] md:h-[70vh] md:my-10 bg-white border border-zinc-200 shadow-xl rounded-sm flex overflow-hidden">
        <aside className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-zinc-100 bg-zinc-50/50`}>
          <div className="p-6 border-b border-zinc-100 bg-white"><h1 className="text-xl font-black text-[#003366] uppercase tracking-tighter italic">Meddelanden</h1></div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? <div className="p-10 text-center text-zinc-400 text-sm italic">Inga aktiva chatter än.</div> : (
              conversations.map((chat) => (
                <button key={chat.otherId} onClick={() => { setSelectedChat(chat.otherId); fetchMessages(chat.otherId) }} className={`w-full p-4 flex gap-3 hover:bg-white transition-colors border-b border-zinc-50 text-left ${selectedChat === chat.otherId ? 'bg-white border-l-4 border-l-[#a11a2d]' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center flex-shrink-0"><User size={20} className="text-zinc-500" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1"><span className="font-bold text-xs text-[#003366] truncate uppercase tracking-wider">{chat.name}</span><span className="text-[9px] text-zinc-400 font-bold">{new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                    <p className="text-xs text-zinc-500 truncate italic">"{chat.lastMessage}"</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <main className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-white`}>
          {selectedChat ? (
            <>
              <div className="p-4 border-b border-zinc-100 flex items-center gap-4">
                <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-[#003366]"><ChevronLeft size={24} /></button>
                <div className="w-8 h-8 rounded-full bg-[#003366] flex items-center justify-center text-white font-bold text-[10px]">{conversations.find(c => c.otherId === selectedChat)?.name?.[0]?.toUpperCase() || 'U'}</div>
                <div><h2 className="font-black text-xs text-[#003366] uppercase tracking-widest italic">{conversations.find(c => c.otherId === selectedChat)?.name || 'Användare'}</h2><span className="text-[9px] text-green-500 font-bold uppercase">Online nu</span></div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/30" ref={scrollRef}>
                {messages.map((msg) => {
                  const isMine = msg.sender_id === currentUser.id
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${isMine ? 'bg-[#003366] text-white rounded-br-none' : 'bg-white border border-zinc-100 text-zinc-800 rounded-bl-none'}`}>
                        {msg.image_url && <div className="mb-2 rounded-lg overflow-hidden border border-white/20"><img src={msg.image_url} alt="Skickad bild" className="max-w-full h-auto" /></div>}
                        <p className="leading-relaxed font-medium">{msg.content}</p>
                        <span className={`text-[8px] mt-1 block opacity-50 ${isMine ? 'text-right' : 'text-left'}`}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-100 bg-white">
                {imagePreview && (
                  <div className="mb-4 relative w-20 h-20 rounded-md overflow-hidden border border-zinc-200">
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    <button type="button" onClick={() => { setImagePreview(null); setImageFile(null) }} className="absolute top-0 right-0 bg-black/50 text-white p-0.5"><X size={14} /></button>
                  </div>
                )}
                <div className="flex gap-3 bg-zinc-50 rounded-full items-center px-4 py-1 border border-zinc-100 focus-within:border-[#003366] transition-colors">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-zinc-400 hover:text-[#003366] p-2 transition-colors"><Camera size={20} /></button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
                  <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Skriv ett meddelande..." className="flex-1 bg-transparent border-none py-3 text-sm font-bold text-zinc-900 outline-none placeholder:text-zinc-400" />
                  <button disabled={(!newMessage.trim() && !imageFile) || sending} className="text-[#003366] hover:text-[#a11a2d] transition-colors p-2 disabled:opacity-30">
                    {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-zinc-50/20">
              <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6"><MessageSquare size={40} className="text-zinc-300" /></div>
              <h2 className="text-xl font-bold text-[#003366] mb-2 italic">Dina konversationer</h2>
              <p className="text-zinc-400 text-sm max-w-xs font-serif italic">Välj en konversation för att börja chatta.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
