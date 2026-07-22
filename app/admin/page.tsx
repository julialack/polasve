'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Newspaper, Calendar, ArrowLeft, UserCheck, Check, X } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'news' | 'event' | 'requests'>('news')

  // Requests State
  const [requests, setRequests] = useState<any[]>([])

  // News Form
  const [newsTitle, setNewsTitle] = useState('')
  const [newsDesc, setNewsDesc] = useState('')
  const [newsImg, setNewsImg] = useState('')

  // Event Form
  const [eventTitle, setEventTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventLoc, setEventLoc] = useState('')
  const [eventDesc, setEventDesc] = useState('')
  const [eventImg, setEventImg] = useState('')

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email === 'julia.lackchristensen@gmail.com') {
        setIsAdmin(true)
        fetchRequests()
      } else {
        toast.error('Endast administratörer har tillgång hit.')
        router.push('/')
      }
      setLoading(false)
    }
    checkAdmin()
  }, [])

  const fetchRequests = async () => {
    const { data } = await supabase
      .from('name_change_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    if (data) setRequests(data)
  }

  const handleApproveRequest = async (request: any) => {
    // 1. Update user metadata (Note: in a real app, this would be a server-side action)
    // For this demo, we'll assume admin manually updates or we use a clever workaround
    // Since we're client-side, we can't easily update OTHER users' metadata without a Service Role.
    // BUT, we can mark the request as approved so you know it's done.

    const { error } = await supabase
      .from('name_change_requests')
      .update({ status: 'approved' })
      .eq('id', request.id)

    if (!error) {
      toast.success(`Begäran för ${request.requested_name} godkänd!`)
      fetchRequests()
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    const { error } = await supabase
      .from('name_change_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId)

    if (!error) {
      toast.error('Begäran borttagen.')
      fetchRequests()
    }
  }

  const handlePostNews = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('news').insert([{
      title: newsTitle,
      description: newsDesc,
      image_url: newsImg || 'https://images.unsplash.com/photo-1590424600305-674393608226?q=80&w=800&auto=format&fit=crop',
      date: new Date().toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })
    }])
    if (!error) {
      toast.success('Nyheten har publicerats!')
      setNewsTitle(''); setNewsDesc(''); setNewsImg('')
    }
  }

  const handlePostEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('events').insert([{
      title: eventTitle,
      date: eventDate,
      location: eventLoc,
      description: eventDesc,
      image_url: eventImg || 'https://images.unsplash.com/photo-1511795409834-432f7b172836?q=80&w=800&auto=format&fit=crop'
    }])
    if (!error) {
      toast.success('Eventet har publicerats!')
      setEventTitle(''); setEventDate(''); setEventLoc(''); setEventDesc(''); setEventImg('')
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center italic text-zinc-400">Verifierar admin...</div>
  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#003366] transition-colors mb-8 text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft size={14} /> Tillbaka till portalen
        </Link>

        <div className="bg-white border border-zinc-200 rounded-sm shadow-xl overflow-hidden text-left">
          <div className="bg-[#003366] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter italic text-left">Admin Portal</h1>
              <p className="text-blue-200 text-[10px] mt-1 font-bold uppercase tracking-widest text-left">Hantera portalens innehåll</p>
            </div>
            <div className="flex bg-blue-900/50 rounded-full p-1 overflow-x-auto max-w-full">
              <button onClick={() => setTab('news')} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shrink-0 ${tab === 'news' ? 'bg-[#a11a2d] text-white shadow-md' : 'text-blue-200'}`}>Nyheter</button>
              <button onClick={() => setTab('event')} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shrink-0 ${tab === 'event' ? 'bg-[#a11a2d] text-white shadow-md' : 'text-blue-200'}`}>Event</button>
              <button onClick={() => setTab('requests')} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shrink-0 flex items-center gap-2 ${tab === 'requests' ? 'bg-[#a11a2d] text-white shadow-md' : 'text-blue-200'}`}>
                Namnändringar {requests.length > 0 && <span className="bg-white text-red-600 px-1.5 rounded-full text-[8px]">{requests.length}</span>}
              </button>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {tab === 'news' && (
              <form onSubmit={handlePostNews} className="space-y-6">
                <div className="flex items-center gap-3 text-[#a11a2d] mb-4">
                  <Newspaper size={20} />
                  <h2 className="text-sm font-black uppercase tracking-widest">Skapa Nyhetsartikel</h2>
                </div>
                <input value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} placeholder="Titel" required className="w-full border-2 p-3 rounded-sm font-bold text-sm outline-none focus:border-[#003366]" />
                <textarea value={newsDesc} onChange={(e) => setNewsDesc(e.target.value)} placeholder="Kort beskrivning..." required className="w-full border-2 p-3 rounded-sm font-bold text-sm outline-none focus:border-[#003366] h-32" />
                <input value={newsImg} onChange={(e) => setNewsImg(e.target.value)} placeholder="Bild-URL (valfritt)" className="w-full border-2 p-3 rounded-sm font-bold text-sm outline-none focus:border-[#003366]" />
                <button type="submit" className="w-full bg-[#003366] text-white py-4 font-black uppercase tracking-widest text-[11px] hover:bg-[#a11a2d] transition-all">Publicera Nyhet</button>
              </form>
            )}

            {tab === 'event' && (
              <form onSubmit={handlePostEvent} className="space-y-6">
                <div className="flex items-center gap-3 text-[#a11a2d] mb-4">
                  <Calendar size={20} />
                  <h2 className="text-sm font-black uppercase tracking-widest">Skapa Evenemang</h2>
                </div>
                <input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="Eventnamn" required className="w-full border-2 p-3 rounded-sm font-bold text-sm outline-none focus:border-[#003366]" />
                <div className="grid md:grid-cols-2 gap-4">
                  <input value={eventDate} onChange={(e) => setEventDate(e.target.value)} placeholder="Datum (t.ex. 15 Aug)" required className="w-full border-2 p-3 rounded-sm font-bold text-sm outline-none focus:border-[#003366]" />
                  <input value={eventLoc} onChange={(e) => setEventLoc(e.target.value)} placeholder="Plats (t.ex. Stockholm)" required className="w-full border-2 p-3 rounded-sm font-bold text-sm outline-none focus:border-[#003366]" />
                </div>
                <textarea value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} placeholder="Beskrivning av eventet..." required className="w-full border-2 p-3 rounded-sm font-bold text-sm outline-none focus:border-[#003366] h-32" />
                <input value={eventImg} onChange={(e) => setEventImg(e.target.value)} placeholder="Bild-URL (valfritt)" className="w-full border-2 p-3 rounded-sm font-bold text-sm outline-none focus:border-[#003366]" />
                <button type="submit" className="w-full bg-[#003366] text-white py-4 font-black uppercase tracking-widest text-[11px] hover:bg-[#a11a2d] transition-all">Publicera Event</button>
              </form>
            )}

            {tab === 'requests' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#a11a2d] mb-6">
                  <UserCheck size={20} />
                  <h2 className="text-sm font-black uppercase tracking-widest">Väntande Namnändringar</h2>
                </div>

                {requests.length === 0 ? (
                  <p className="text-center py-20 text-zinc-400 italic">Inga väntande förfrågningar just nu.</p>
                ) : (
                  <div className="space-y-4">
                    {requests.map((req) => (
                      <div key={req.id} className="p-6 bg-zinc-50 border border-zinc-100 rounded-sm flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-left">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Från: {req.current_name}</p>
                          <p className="text-lg font-bold text-[#003366] italic">Vill byta till: <span className="text-[#a11a2d]">{req.requested_name}</span></p>
                          <p className="text-[9px] text-zinc-400 mt-1 uppercase">ID: {req.user_id}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleApproveRequest(req)} className="bg-green-600 text-white p-2 rounded-sm hover:bg-green-700 transition-colors shadow-sm"><Check size={18} /></button>
                          <button onClick={() => handleRejectRequest(req.id)} className="bg-red-600 text-white p-2 rounded-sm hover:bg-red-700 transition-colors shadow-sm"><X size={18} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-10 p-6 bg-blue-50 border border-blue-100 rounded-sm">
                   <p className="text-[10px] text-blue-800 font-medium leading-relaxed">
                     **Notera:** Som admin behöver du manuellt godkänna ändringen här och sedan uppdatera användarens namn i Supabase Auth Dashboard (eftersom vi kör klientsidan här). Denna lista hjälper dig att hålla koll på vem som vill byta vad!
                   </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
