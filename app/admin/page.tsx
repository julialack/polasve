'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Loader2, Newspaper, Calendar, ArrowLeft, UserCheck, Check, X,
  Building2, MessageSquare, AlertTriangle, Users, BarChart3,
  ShieldAlert, Tags, Megaphone, Search, Trash2, Plus, Ban, Unlock,
  Settings, LayoutDashboard, ExternalLink, UserPlus, FileText,
  ChevronRight, MoreVertical, Info
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type TabType = 'dashboard' | 'users' | 'ads' | 'reports' | 'system' | 'requests' | 'news' | 'events' | 'contact'

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')

  // Data States
  const [stats, setStats] = useState({ users: 0, ads: 0, reports: 0, announcements: 0 })
  const [users, setUsers] = useState<any[]>([])
  const [ads, setAds] = useState<any[]>([])
  const [searchUser, setSearchUser] = useState('')
  const [searchAd, setSearchAd] = useState('')
  const [reports, setReports] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  // Existing Request States
  const [nameRequests, setNameRequests] = useState<any[]>([])
  const [businessRequests, setBusinessRequests] = useState<any[]>([])
  const [contactRequests, setContactRequests] = useState<any[]>([])

  // Form States
  const [newAnnounce, setNewAnnounce] = useState({ title: '', content: '' })
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' })
  const [newsForm, setNewsForm] = useState({ title: '', desc: '', img: '' })
  const [eventForm, setEventForm] = useState({ title: '', date: '', loc: '', desc: '', img: '' })

  const supabase = createClient()
  const router = useRouter()

  const ADMIN_EMAIL = 'julia.lackchristensen@gmail.com'

  // --- Data Fetching ---

  const fetchStats = async () => {
    const [
      { count: uCount },
      { count: aCount },
      { count: rCount },
      { count: annCount }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('ads').select('*', { count: 'exact', head: true }),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('announcements').select('*', { count: 'exact', head: true })
    ])
    setStats({
      users: uCount || 0,
      ads: aCount || 0,
      reports: rCount || 0,
      announcements: annCount || 0
    })
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*') // Hämtar allt som finns

      if (error) {
        console.error("Fel vid hämtning av användare:", error)
        toast.error("Kunde inte hämta användarlistan: " + error.message)
        return
      }

      if (data) {
        console.log("Hämtade användare:", data.length)
        setUsers(data)
      }
    } catch (err) {
      console.error("Oväntat fel:", err)
    }
  }

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Fel vid hämtning av annonser:", error)
        toast.error("Kunde inte hämta annonser")
        return
      }
      if (data) setAds(data)
    } catch (err) {
      console.error("Oväntat fel:", err)
    }
  }

  const fetchReports = async () => {
    const { data } = await supabase
      .from('reports')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false })
    if (data) setReports(data)
  }

  const fetchSystemData = async () => {
    const { data: ann } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
    const { data: cat } = await supabase.from('site_categories').select('*').order('name')
    if (ann) setAnnouncements(ann)
    if (cat) setCategories(cat)
  }

  const fetchRequests = async () => {
    const [nameRes, bizRes, contactRes] = await Promise.all([
      supabase.from('name_change_requests').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
      supabase.from('business_ad_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_requests').select('*').order('created_at', { ascending: false })
    ])
    if (nameRes.data) setNameRequests(nameRes.data)
    if (bizRes.data) setBusinessRequests(bizRes.data)
    if (contactRes.data) setContactRequests(contactRes.data)
  }

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email === ADMIN_EMAIL) {
        setIsAdmin(true)
        loadAllData()
      } else {
        toast.error('Endast administratörer har tillgång hit.')
        router.push('/')
      }
      setLoading(false)
    }
    checkAdmin()
  }, [])

  const loadAllData = () => {
    fetchStats()
    fetchUsers()
    fetchAds()
    fetchReports()
    fetchSystemData()
    fetchRequests()
  }

  // --- Handlers ---

  const handleToggleBan = async (userId: string, currentBan: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_banned: !currentBan })
      .eq('id', userId)

    if (!error) {
      toast.success(currentBan ? 'Användare har återställts' : 'Användare har stängts av')
      fetchUsers()
    }
  }

  const handleDeleteContent = async (type: 'ad' | 'post', id: string, reportId: string) => {
    if (!confirm(`Vill du radera detta ${type === 'ad' ? 'annons' : 'inlägg'} permanent?`)) return

    const table = type === 'ad' ? 'ads' : 'posts'
    const { error } = await supabase.from(table).delete().eq('id', id)

    if (!error) {
      await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId)
      toast.success('Innehåll raderat')
      fetchReports()
      fetchStats()
    } else {
      toast.error('Kunde inte radera innehåll')
    }
  }

  const handleHandleReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    const { error } = await supabase.from('reports').update({ status }).eq('id', reportId)
    if (!error) {
      toast.success(status === 'resolved' ? 'Markerad som löst' : 'Anmälan avfärdad')
      fetchReports()
      fetchStats()
    }
  }

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('announcements').insert([newAnnounce])
    if (!error) {
      toast.success('Meddelande publicerat')
      setNewAnnounce({ title: '', content: '' })
      fetchSystemData()
      fetchStats()
    }
  }

  const handleDeleteAnnouncement = async (id: string) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (!error) {
      toast.error('Meddelande borttaget')
      fetchSystemData()
      fetchStats()
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('site_categories').insert([newCategory])
    if (!error) {
      toast.success('Kategori tillagd')
      setNewCategory({ name: '', slug: '' })
      fetchSystemData()
    }
  }

  // Reuse existing logic for requests
  const handleApproveNameChange = async (req: any) => {
    const { error } = await supabase.from('name_change_requests').update({ status: 'approved' }).eq('id', req.id)
    if (!error) {
      toast.success(`Namnändring för ${req.requested_name} godkänd!`)
      fetchRequests()
    }
  }

  const handlePostNews = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('news').insert([{
      title: newsForm.title,
      description: newsForm.desc,
      image_url: newsForm.img || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop',
      date: new Date().toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })
    }])
    if (!error) {
      toast.success('Nyhet publicerad!')
      setNewsForm({ title: '', desc: '', img: '' })
    }
  }

  // --- Render Helpers ---

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-500" size={40} />
      <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Verifierar Behörighet...</p>
    </div>
  )
  if (!isAdmin) return null

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchUser.toLowerCase())
  )

  const filteredAds = ads.filter(a =>
    a.title?.toLowerCase().includes(searchAd.toLowerCase()) ||
    a.profiles?.full_name?.toLowerCase().includes(searchAd.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#020617] text-zinc-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0f172a] border-r border-white/5 flex flex-col p-6 gap-8">
        <div>
          <h1 className="text-xl font-black italic tracking-tighter text-white flex items-center gap-2">
            <ShieldAlert className="text-blue-500" /> POLASVE <span className="text-[10px] bg-blue-600 px-1.5 py-0.5 rounded not-italic font-black tracking-normal uppercase">Admin</span>
          </h1>
        </div>

        <nav className="flex flex-col gap-1">
          <NavItem icon={<BarChart3 size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Users size={18} />} label="Användare" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <NavItem icon={<Building2 size={18} />} label="Annonser" active={activeTab === 'ads'} onClick={() => setActiveTab('ads')} />
          <NavItem icon={<ShieldAlert size={18} />} label="Moderering" active={activeTab === 'reports'} badge={stats.reports} onClick={() => setActiveTab('reports')} />
          <NavItem icon={<Settings size={18} />} label="System" active={activeTab === 'system'} onClick={() => setActiveTab('system')} />

          <div className="h-px bg-white/5 my-4" />

          <NavItem icon={<UserCheck size={18} />} label="Begäran" active={activeTab === 'requests'} badge={nameRequests.length} onClick={() => setActiveTab('requests')} />
          <NavItem icon={<Newspaper size={18} />} label="Nyheter" active={activeTab === 'news'} onClick={() => setActiveTab('news')} />
          <NavItem icon={<Calendar size={18} />} label="Events" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
          <NavItem icon={<MessageSquare size={18} />} label="Support" active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Tillbaka till portalen
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white capitalize">{activeTab}</h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Hanteringspanel för Polasve Portal</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-blue-500 uppercase">{new Date().toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
             <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">Admin: {ADMIN_EMAIL}</p>
          </div>
        </header>

        {/* --- TABS CONTENT --- */}

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Users className="text-blue-500" />}
              label="Totalt Användare"
              value={stats.users}
              onClick={() => setActiveTab('users')}
            />
            <StatCard
              icon={<Building2 className="text-emerald-500" />}
              label="Aktiva Annonser"
              value={stats.ads}
              onClick={() => setActiveTab('ads')}
            />
            <StatCard
              icon={<AlertTriangle className="text-amber-500" />}
              label="Väntande Anmälningar"
              value={stats.reports}
              onClick={() => setActiveTab('reports')}
            />
            <StatCard
              icon={<Megaphone className="text-purple-500" />}
              label="Meddelanden"
              value={stats.announcements}
              onClick={() => setActiveTab('system')}
            />

            <div className="col-span-1 md:col-span-2 bg-[#0f172a] border border-white/5 p-6 rounded-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Snabbåtgärder</h3>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setActiveTab('news')} className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 p-4 rounded-lg flex items-center gap-3 font-bold text-sm transition-all border border-blue-500/10">
                   <Newspaper size={20} /> Publicera Nyhet
                 </button>
                 <button onClick={() => setActiveTab('system')} className="bg-purple-600/10 hover:bg-purple-600/20 text-purple-500 p-4 rounded-lg flex items-center gap-3 font-bold text-sm transition-all border border-purple-500/10">
                   <Megaphone size={20} /> Nytt Meddelande
                 </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-[#0f172a] border border-white/5 p-4 rounded-xl flex items-center gap-4">
              <Search className="text-zinc-500" size={20} />
              <input
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Sök användare på namn eller e-post..."
                className="bg-transparent border-none outline-none text-white w-full font-medium text-sm"
              />
            </div>

            <div className="bg-[#0f172a] border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-zinc-400 font-black uppercase text-[10px] tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Användare</th>
                    <th className="px-6 py-4">E-post</th>
                    <th className="px-6 py-4">Telefon</th>
                    <th className="px-6 py-4">Skapad</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Åtgärd</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors group/row">
                      <td className="px-6 py-4">
                        <Link href={`/profil/${u.id}`} className="flex items-center gap-3 hover:text-blue-400 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-black text-[10px] overflow-hidden shrink-0 border border-white/5">
                            {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : u.full_name?.charAt(0)}
                          </div>
                          <span className="font-bold text-white group-hover/row:underline">{u.full_name || 'Namnlös'}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 font-medium">{u.email || <span className="text-zinc-600 italic">Ej angiven</span>}</td>
                      <td className="px-6 py-4 text-zinc-400 font-medium">{u.phone || <span className="text-zinc-600 italic">-</span>}</td>
                      <td className="px-6 py-4 text-[10px] text-zinc-500 font-bold uppercase">{u.created_at ? new Date(u.created_at).toLocaleDateString('sv-SE') : 'Okänt datum'}</td>
                      <td className="px-6 py-4">
                        {u.is_banned ?
                          <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-[8px] font-black uppercase">Avstängd</span> :
                          <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[8px] font-black uppercase">Aktiv</span>
                        }
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleBan(u.id, u.is_banned)}
                          className={`p-2 rounded-lg transition-all ${u.is_banned ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-red-500 hover:bg-red-500/10'}`}
                          title={u.is_banned ? 'Återställ' : 'Stäng av'}
                        >
                          {u.is_banned ? <Unlock size={18} /> : <Ban size={18} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ads' && (
          <div className="space-y-6">
            <div className="bg-[#0f172a] border border-white/5 p-4 rounded-xl flex items-center gap-4">
              <Search className="text-zinc-500" size={20} />
              <input
                value={searchAd}
                onChange={(e) => setSearchAd(e.target.value)}
                placeholder="Sök annonser på titel eller säljare..."
                className="bg-transparent border-none outline-none text-white w-full font-medium text-sm"
              />
            </div>

            <div className="bg-[#0f172a] border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-zinc-400 font-black uppercase text-[10px] tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Annons</th>
                    <th className="px-6 py-4">Säljare</th>
                    <th className="px-6 py-4">Pris</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4 text-right">Åtgärd</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAds.map((ad) => (
                    <tr key={ad.id} className="hover:bg-white/5 transition-colors group/row">
                      <td className="px-6 py-4">
                        <Link href={`/annonser/${ad.id}`} className="flex items-center gap-3 hover:text-blue-400 transition-colors">
                          <div className="w-12 h-10 bg-white/5 rounded flex items-center justify-center overflow-hidden border border-white/5">
                            {ad.image_url ? <img src={ad.image_url} className="w-full h-full object-cover" /> : <Building2 size={16} className="text-zinc-700" />}
                          </div>
                          <div>
                            <p className="font-bold text-white line-clamp-1">{ad.title}</p>
                            <p className="text-[9px] text-zinc-500 font-bold uppercase">{new Date(ad.created_at).toLocaleDateString()}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 font-medium">{ad.profiles?.full_name || 'Anonym'}</td>
                      <td className="px-6 py-4 text-zinc-300 font-black italic">{ad.price || 'Bud'}</td>
                      <td className="px-6 py-4">
                        <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[8px] font-black uppercase border border-white/5">{ad.category}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={async () => {
                            if(confirm('Radera annonsen permanent?')) {
                              await supabase.from('ads').delete().eq('id', ad.id)
                              fetchAds()
                              fetchStats()
                              toast.error('Annons raderad')
                            }
                          }}
                          className="text-zinc-600 hover:text-red-500 p-2 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredAds.length === 0 && <p className="text-center py-20 text-zinc-600 italic">Inga annonser hittades.</p>}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            {reports.length === 0 ? (
               <div className="bg-[#0f172a] border border-white/5 p-20 rounded-xl text-center">
                 <ShieldAlert className="mx-auto text-zinc-700 mb-4" size={48} />
                 <p className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">Inga rapporterade ärenden</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {reports.map((rep) => (
                  <div key={rep.id} className={`bg-[#0f172a] border rounded-xl overflow-hidden transition-all ${rep.status === 'pending' ? 'border-red-500/20' : 'border-white/5 opacity-60'}`}>
                    <div className="bg-white/5 px-6 py-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                           rep.content_type === 'ad' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'
                         }`}>
                           {rep.content_type === 'ad' ? 'ANNONS' : 'INLÄGG'}
                         </span>
                         <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">#{rep.id.slice(0, 8)}</span>
                      </div>
                      <span className="text-[9px] text-zinc-500 font-bold uppercase">{new Date(rep.created_at).toLocaleString('sv-SE')}</span>
                    </div>
                    <div className="p-6">
                      <div className="mb-6">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Anmäld av: {rep.profiles?.full_name}</p>
                        <p className="text-white font-medium italic">&quot;{rep.reason}&quot;</p>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-6 border-t border-white/5">
                        <Link
                          href={rep.content_type === 'ad' ? `/annonser/${rep.content_id}` : '#'}
                          className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                          <ExternalLink size={12} /> Visa Innehåll
                        </Link>

                        {rep.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleDeleteContent(rep.content_type, rep.content_id, rep.id)}
                              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-red-500/20"
                            >
                              <Trash2 size={12} /> Radera Innehåll
                            </button>
                            <button
                              onClick={() => handleHandleReport(rep.id, 'resolved')}
                              className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-emerald-500/20"
                            >
                              <Check size={12} /> Åtgärdad
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleHandleReport(rep.id, 'dismissed')}
                          className="text-zinc-500 hover:text-zinc-300 px-2 py-2 text-[10px] font-black uppercase tracking-widest"
                        >
                          Avfärda
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'system' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Announcements Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <Megaphone className="text-purple-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest">Globala Meddelanden</h3>
                </div>
              </div>

              <form onSubmit={handleAddAnnouncement} className="bg-[#0f172a] border border-white/5 p-6 rounded-xl space-y-4">
                 <input
                   value={newAnnounce.title}
                   onChange={(e) => setNewAnnounce({...newAnnounce, title: e.target.value})}
                   placeholder="Titel på meddelande..."
                   required
                   className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm font-medium focus:border-purple-500 outline-none transition-all"
                 />
                 <textarea
                   value={newAnnounce.content}
                   onChange={(e) => setNewAnnounce({...newAnnounce, content: e.target.value})}
                   placeholder="Innehåll..."
                   required
                   className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm font-medium h-24 focus:border-purple-500 outline-none transition-all"
                 />
                 <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2">
                   <Plus size={16} /> Publicera Broadcast
                 </button>
              </form>

              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className="bg-[#0f172a] border border-white/5 p-6 rounded-xl flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-white mb-1">{ann.title}</h4>
                      <p className="text-zinc-500 text-xs leading-relaxed">{ann.content}</p>
                      <p className="text-[8px] text-zinc-600 font-black uppercase mt-3">{new Date(ann.created_at).toLocaleString('sv-SE')}</p>
                    </div>
                    <button onClick={() => handleDeleteAnnouncement(ann.id)} className="text-zinc-600 hover:text-red-500 p-2 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-white">
                <Tags className="text-blue-500" />
                <h3 className="text-sm font-black uppercase tracking-widest">Bazar Kategorier</h3>
              </div>

              <form onSubmit={handleAddCategory} className="bg-[#0f172a] border border-white/5 p-6 rounded-xl flex gap-3">
                 <input
                   value={newCategory.name}
                   onChange={(e) => setNewCategory({ name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                   placeholder="Kategorinamn..."
                   required
                   className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-sm font-medium focus:border-blue-500 outline-none transition-all"
                 />
                 <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all">
                   Lägg till
                 </button>
              </form>

              <div className="bg-[#0f172a] border border-white/5 rounded-xl divide-y divide-white/5">
                {categories.map((cat) => (
                  <div key={cat.id} className="px-6 py-4 flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                       <span className="w-2 h-2 rounded-full bg-blue-500" />
                       <span className="font-bold text-white text-sm">{cat.name}</span>
                       <span className="text-[10px] text-zinc-600 font-mono">/{cat.slug}</span>
                    </div>
                    <button
                      onClick={async () => {
                        if (confirm('Radera kategori?')) {
                          await supabase.from('site_categories').delete().eq('id', cat.id)
                          fetchSystemData()
                        }
                      }}
                      className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Existing Content Tabs (Simplified but functional) */}
        {activeTab === 'requests' && (
           <div className="grid grid-cols-1 gap-8">
             <section>
               <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                 <UserPlus size={16} className="text-blue-500" /> Namnändringar
               </h3>
               <div className="space-y-4">
                 {nameRequests.map(req => (
                   <div key={req.id} className="bg-[#0f172a] border border-white/5 p-6 rounded-xl flex justify-between items-center">
                     <div>
                       <p className="text-[9px] text-zinc-500 font-bold uppercase mb-1">Från: {req.current_name}</p>
                       <p className="text-lg font-black text-white italic">Till: <span className="text-blue-500">{req.requested_name}</span></p>
                     </div>
                     <div className="flex gap-2">
                       <button onClick={() => handleApproveNameChange(req)} className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition-all"><Check size={18} /></button>
                       <button onClick={async () => { await supabase.from('name_change_requests').update({ status: 'rejected' }).eq('id', req.id); fetchRequests(); }} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"><X size={18} /></button>
                     </div>
                   </div>
                 ))}
                 {nameRequests.length === 0 && <p className="text-zinc-600 italic text-sm">Inga väntande förfrågningar.</p>}
               </div>
             </section>
           </div>
        )}

        {activeTab === 'news' && (
          <form onSubmit={handlePostNews} className="max-w-2xl bg-[#0f172a] border border-white/5 p-8 rounded-2xl space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2 mb-4"><Newspaper className="text-blue-500" /> Skapa Nyhet</h3>
            <div className="space-y-4">
              <input value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} placeholder="Titel" required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-blue-500 transition-all" />
              <textarea value={newsForm.desc} onChange={e => setNewsForm({...newsForm, desc: e.target.value})} placeholder="Beskrivning..." required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 h-40 outline-none focus:border-blue-500 transition-all" />
              <input value={newsForm.img} onChange={e => setNewsForm({...newsForm, img: e.target.value})} placeholder="Bild URL" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-blue-500 transition-all" />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-black uppercase text-xs tracking-widest transition-all">Publicera Nyhet</button>
            </div>
          </form>
        )}

        {/* ... Other existing tabs can be added similarly ... */}
        {activeTab === 'contact' && (
           <div className="space-y-6">
             {contactRequests.map(req => (
               <div key={req.id} className="bg-[#0f172a] border border-white/5 p-6 rounded-xl">
                 <div className="flex justify-between items-start mb-4">
                   <div>
                     <h4 className="font-bold text-white">{req.reason}</h4>
                     <p className="text-xs text-zinc-500">{req.email}</p>
                   </div>
                   <span className="text-[8px] font-black uppercase bg-white/5 px-2 py-0.5 rounded">{req.status}</span>
                 </div>
                 <p className="text-sm text-zinc-300 italic mb-6">&quot;{req.message}&quot;</p>
                 <div className="flex justify-end gap-3">
                   {req.status === 'pending' && (
                     <button
                       onClick={async () => { await supabase.from('contact_requests').update({ status: 'handled' }).eq('id', req.id); fetchRequests(); toast.success('Klarmarkerad'); }}
                       className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all"
                     >
                       Markera som klar
                     </button>
                   )}
                   <button
                     onClick={async () => { if(confirm('Radera?')) { await supabase.from('contact_requests').delete().eq('id', req.id); fetchRequests(); } }}
                     className="text-zinc-600 hover:text-red-500 text-[10px] font-black uppercase tracking-widest"
                   >
                     Radera
                   </button>
                 </div>
               </div>
             ))}
           </div>
        )}

      </main>
    </div>
  )
}

// --- Helper Components ---

function NavItem({ icon, label, active, onClick, badge }: { icon: any, label: string, active: boolean, onClick: () => void, badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all group ${
        active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-xs font-black uppercase tracking-widest">{label}</span>
      </div>
      {badge ? (
        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${active ? 'bg-white text-blue-600' : 'bg-red-600 text-white animate-pulse'}`}>
          {badge}
        </span>
      ) : <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'opacity-100' : ''}`} />}
    </button>
  )
}

function StatCard({ icon, label, value, onClick }: { icon: any, label: string, value: number, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`bg-[#0f172a] border border-white/5 p-6 rounded-2xl flex flex-col gap-4 text-left transition-all ${
        onClick ? 'hover:bg-white/5 hover:border-white/10 hover:scale-[1.02] active:scale-95 cursor-pointer' : ''
      }`}
    >
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
        <p className="text-3xl font-black text-white">{value}</p>
      </div>
    </button>
  )
}
