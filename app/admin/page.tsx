'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Loader2, Newspaper, Calendar, ArrowLeft, UserCheck, Check, X,
  Building2, MessageSquare, AlertTriangle, Users, BarChart3,
  ShieldAlert, Tags, Megaphone, Search, Trash2, Plus, Ban, Unlock,
  Settings, ExternalLink, UserPlus, ChevronRight, RotateCcw,
  FileText, FolderTrash
} from 'lucide-react'
import Link from 'next/link'
import { capitalizeFirst } from '@/utils/capitalize'

type TabType = 'dashboard' | 'posts' | 'ads' | 'trash' | 'reports' | 'users' | 'requests' | 'system' | 'news' | 'contact'

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')

  // Data States
  const [stats, setStats] = useState({ users: 0, ads: 0, posts: 0, reports: 0, announcements: 0, trash: 0 })
  const [users, setUsers] = useState<any[]>([])
  const [ads, setAds] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [news, setNews] = useState<any[]>([])

  // Search and Filter States
  const [searchUser, setSearchUser] = useState('')
  const [searchAd, setSearchAd] = useState('')
  const [searchPost, setSearchPost] = useState('')
  const [reportStatusFilter, setReportStatusFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all')
  const [adStatusFilter, setAdStatusFilter] = useState<'all' | 'active' | 'finished' | 'expired'>('all')
  const [adPaymentFilter, setAdPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all')

  // Request States
  const [nameRequests, setNameRequests] = useState<any[]>([])
  const [contactRequests, setContactRequests] = useState<any[]>([])

  // Form States
  const [newAnnounce, setNewAnnounce] = useState({ title: '', content: '' })
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' })
  const [newsForm, setNewsForm] = useState({ title: '', desc: '', img: '' })

  const supabase = createClient()
  const router = useRouter()

  const ADMIN_EMAIL = 'julia.lackchristensen@gmail.com'

  // Helper for Calling Server-Side Admin API (bypasses client RLS)
  const callAdminApi = async (action: string, payload: any = {}) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        toast.error(data.error || 'Åtgärden misslyckades')
        return false
      }
      toast.success(data.message || 'Åtgärden genomfördes')
      return true
    } catch (err: any) {
      toast.error('Kunde inte nå servern: ' + err.message)
      return false
    }
  }

  // --- Data Fetching ---

  const fetchStats = useCallback(async () => {
    const [
      { count: uCount },
      { count: aCount },
      { count: pCount },
      { count: rCount },
      { count: annCount },
      { count: trashCount }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('ads').select('*', { count: 'exact', head: true }).neq('status', 'finished'),
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('announcements').select('*', { count: 'exact', head: true }),
      supabase.from('ads').select('*', { count: 'exact', head: true }).eq('status', 'finished')
    ])
    setStats({
      users: uCount || 0,
      ads: aCount || 0,
      posts: pCount || 0,
      reports: rCount || 0,
      announcements: annCount || 0,
      trash: trashCount || 0
    })
  }, [supabase])

  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      if (!error && data) setUsers(data)
    } catch (err) {
      console.error("Fel vid hämtning av användare:", err)
    }
  }, [supabase])

  const fetchAds = useCallback(async () => {
    try {
      const { data: adsData, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Fel vid hämtning av annonser:", error)
        setAds([])
        return
      }

      if (adsData && adsData.length > 0) {
        const userIds = Array.from(new Set(adsData.map(a => a.user_id).filter(Boolean)))
        let profilesMap: Record<string, any> = {}

        if (userIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', userIds)

          if (profilesData) {
            profilesData.forEach(p => { profilesMap[p.id] = p })
          }
        }

        const adsWithProfiles = adsData.map(ad => ({
          ...ad,
          profiles: profilesMap[ad.user_id] || null
        }))

        setAds(adsWithProfiles)
      } else {
        setAds([])
      }
    } catch (err) {
      console.error("Fel vid hämtning av annonser:", err)
      setAds([])
    }
  }, [supabase])

  const fetchPosts = useCallback(async () => {
    try {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Fel vid hämtning av inlägg:", error)
        setPosts([])
        return
      }

      if (postsData && postsData.length > 0) {
        const userIds = Array.from(new Set(postsData.map(p => p.user_id).filter(Boolean)))
        let profilesMap: Record<string, any> = {}

        if (userIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, full_name, email, avatar_url')
            .in('id', userIds)

          if (profilesData) {
            profilesData.forEach(p => { profilesMap[p.id] = p })
          }
        }

        const postsWithProfiles = postsData.map(p => ({
          ...p,
          profiles: profilesMap[p.user_id] || null
        }))

        setPosts(postsWithProfiles)
      } else {
        setPosts([])
      }
    } catch (err) {
      console.error("Fel vid hämtning av inlägg:", err)
      setPosts([])
    }
  }, [supabase])

  const fetchReports = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (error || !data) return

      const reporterIds = Array.from(new Set(data.map(r => r.reporter_id).filter(Boolean)))
      const adIds = data.filter(r => r.content_type === 'ad').map(r => r.content_id)
      const postIds = data.filter(r => r.content_type === 'post').map(r => r.content_id)
      const userIds = Array.from(new Set([
        ...data.filter(r => r.content_type === 'user').map(r => r.content_id),
        ...reporterIds
      ]))

      let adsMap: Record<string, any> = {}
      let postsMap: Record<string, any> = {}
      let profilesMap: Record<string, any> = {}

      if (adIds.length > 0) {
        const { data: adsData } = await supabase.from('ads').select('id, title, description, image_url, price').in('id', adIds)
        if (adsData) adsData.forEach(a => { adsMap[a.id] = a })
      }

      if (postIds.length > 0) {
        const { data: postsData } = await supabase.from('posts').select('id, content, image_url').in('id', postIds)
        if (postsData) postsData.forEach(p => { postsMap[p.id] = p })
      }

      if (userIds.length > 0) {
        const { data: profilesData } = await supabase.from('profiles').select('id, full_name, email, avatar_url').in('id', userIds)
        if (profilesData) profilesData.forEach(p => { profilesMap[p.id] = p })
      }

      const enriched = data.map(rep => {
        let targetContent = null
        let contentUrl = '#'
        let contentExists = false

        if (rep.content_type === 'ad') {
          targetContent = adsMap[rep.content_id] || null
          contentExists = !!targetContent
          contentUrl = `/annonser/${rep.content_id}`
        } else if (rep.content_type === 'post') {
          targetContent = postsMap[rep.content_id] || null
          contentExists = !!targetContent
          contentUrl = `/sok`
        } else if (rep.content_type === 'user') {
          targetContent = profilesMap[rep.content_id] || null
          contentExists = !!targetContent
          contentUrl = `/profil/${rep.content_id}`
        }

        return {
          ...rep,
          profiles: profilesMap[rep.reporter_id] || null,
          targetContent,
          contentExists,
          contentUrl
        }
      })

      setReports(enriched)
    } catch (err) {
      console.error("Fel vid hämtning av anmälningar:", err)
    }
  }, [supabase])

  const fetchSystemData = useCallback(async () => {
    const { data: ann } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
    const { data: cat } = await supabase.from('site_categories').select('*').order('name')
    const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false })
    if (ann) setAnnouncements(ann)
    if (cat) setCategories(cat)
    if (newsData) setNews(newsData)
  }, [supabase])

  const fetchRequests = useCallback(async () => {
    const [nameRes, contactRes] = await Promise.all([
      supabase.from('name_change_requests').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
      supabase.from('contact_requests').select('*').order('created_at', { ascending: false })
    ])
    if (nameRes.data) setNameRequests(nameRes.data)
    if (contactRes.data) setContactRequests(contactRes.data)
  }, [supabase])

  const loadAllData = useCallback(() => {
    fetchStats()
    fetchUsers()
    fetchAds()
    fetchPosts()
    fetchReports()
    fetchSystemData()
    fetchRequests()
  }, [fetchStats, fetchUsers, fetchAds, fetchPosts, fetchReports, fetchSystemData, fetchRequests])

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
  }, [supabase, router, loadAllData])

  // --- Handlers (using Server-Side API) ---

  const handleToggleBan = async (userId: string, currentBan: boolean) => {
    const ok = await callAdminApi('toggle_ban_user', { userId, isBanned: currentBan })
    if (ok) fetchUsers()
  }

  const handleDeleteAd = async (adId: string, permanent: boolean) => {
    const confirmMsg = permanent
      ? 'Vill du radera denna annons permanent ur databasen?'
      : 'Vill du flytta denna annons till Borttagna/Papperskorgen?'
    if (!confirm(confirmMsg)) return

    const ok = await callAdminApi('delete_ad', { adId, permanent })
    if (ok) {
      fetchAds()
      fetchStats()
    }
  }

  const handleRestoreAd = async (adId: string) => {
    const ok = await callAdminApi('restore_ad', { adId })
    if (ok) {
      fetchAds()
      fetchStats()
    }
  }

  const handleMarkAdPaid = async (adId: string) => {
    const ok = await callAdminApi('mark_ad_paid', { adId })
    if (ok) fetchAds()
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Vill du radera detta community-inlägg permanent?')) return
    const ok = await callAdminApi('delete_post', { postId })
    if (ok) {
      fetchPosts()
      fetchStats()
    }
  }

  const handleDeleteReportContent = async (reportId: string, contentType: string, contentId: string) => {
    if (!confirm('Vill du radera det anmälda innehållet permanent och markera anmälan som åtgärdad?')) return
    const ok = await callAdminApi('delete_report_content', { reportId, contentType, contentId })
    if (ok) {
      fetchReports()
      fetchStats()
      fetchAds()
      fetchPosts()
    }
  }

  const handleUpdateReportStatus = async (reportId: string, status: 'pending' | 'resolved' | 'dismissed') => {
    const ok = await callAdminApi('handle_report', { reportId, status })
    if (ok) {
      fetchReports()
      fetchStats()
    }
  }

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await callAdminApi('add_announcement', newAnnounce)
    if (ok) {
      setNewAnnounce({ title: '', content: '' })
      fetchSystemData()
      fetchStats()
    }
  }

  const handleDeleteAnnouncement = async (id: string) => {
    const ok = await callAdminApi('delete_announcement', { id })
    if (ok) {
      fetchSystemData()
      fetchStats()
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await callAdminApi('add_category', newCategory)
    if (ok) {
      setNewCategory({ name: '', slug: '' })
      fetchSystemData()
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Radera kategori?')) return
    const ok = await callAdminApi('delete_category', { id })
    if (ok) fetchSystemData()
  }

  const handleApproveNameChange = async (req: any) => {
    const ok = await callAdminApi('approve_name_change', {
      reqId: req.id,
      userId: req.user_id,
      requestedName: req.requested_name
    })
    if (ok) fetchRequests()
  }

  const handleRejectNameChange = async (reqId: string) => {
    const ok = await callAdminApi('reject_name_change', { reqId })
    if (ok) fetchRequests()
  }

  const handlePostNews = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await callAdminApi('add_news', {
      title: newsForm.title,
      description: newsForm.desc,
      image_url: newsForm.img
    })
    if (ok) {
      setNewsForm({ title: '', desc: '', img: '' })
      fetchSystemData()
    }
  }

  const handleDeleteNews = async (id: string) => {
    if (!confirm('Radera denna nyhet?')) return
    const ok = await callAdminApi('delete_news', { id })
    if (ok) fetchSystemData()
  }

  const handleContactAction = async (reqId: string, deleteItem = false) => {
    const ok = await callAdminApi('handle_contact', { reqId, deleteItem })
    if (ok) fetchRequests()
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

  const filteredPosts = posts.filter(p =>
    p.content?.toLowerCase().includes(searchPost.toLowerCase()) ||
    p.profiles?.full_name?.toLowerCase().includes(searchPost.toLowerCase())
  )

  const trashedAds = ads.filter(a => a.status === 'finished')

  return (
    <div className="min-h-screen bg-[#020617] text-zinc-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0f172a] border-r border-white/5 flex flex-col p-6 gap-8 shrink-0">
        <div>
          <h1 className="text-xl font-black italic tracking-tighter text-white flex items-center gap-2">
            <ShieldAlert className="text-blue-500" /> POLASVE <span className="text-[10px] bg-blue-600 px-1.5 py-0.5 rounded not-italic font-black tracking-normal uppercase">Admin</span>
          </h1>
        </div>

        <nav className="flex flex-col gap-1">
          <NavItem icon={<BarChart3 size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<MessageSquare size={18} />} label="Inlägg (Forum)" active={activeTab === 'posts'} badge={posts.length} onClick={() => setActiveTab('posts')} />
          <NavItem icon={<Building2 size={18} />} label="Annonser" active={activeTab === 'ads'} badge={stats.ads} onClick={() => setActiveTab('ads')} />
          <NavItem icon={<FolderTrash size={18} />} label="Borttagna" active={activeTab === 'trash'} badge={stats.trash} onClick={() => setActiveTab('trash')} />
          <NavItem icon={<ShieldAlert size={18} />} label="Moderering" active={activeTab === 'reports'} badge={stats.reports} onClick={() => setActiveTab('reports')} />
          <NavItem icon={<Users size={18} />} label="Användare" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />

          <div className="h-px bg-white/5 my-3" />

          <NavItem icon={<UserCheck size={18} />} label="Begäran" active={activeTab === 'requests'} badge={nameRequests.length} onClick={() => setActiveTab('requests')} />
          <NavItem icon={<Newspaper size={18} />} label="Nyheter" active={activeTab === 'news'} onClick={() => setActiveTab('news')} />
          <NavItem icon={<Settings size={18} />} label="System & Kategori" active={activeTab === 'system'} onClick={() => setActiveTab('system')} />
          <NavItem icon={<MessageSquare size={18} />} label="Support" active={activeTab === 'contact'} badge={contactRequests.filter(c => c.status === 'pending').length} onClick={() => setActiveTab('contact')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Tillbaka till portalen
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-8 flex justify-between items-end border-b border-white/5 pb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white capitalize">{activeTab}</h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Säker administratörspanel för Polasve Portal</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-blue-500 uppercase">{new Date().toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
             <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">Inloggad: {ADMIN_EMAIL}</p>
          </div>
        </header>

        {/* --- DASHBOARD TAB --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<Users className="text-blue-500" />}
                label="Registrerade Användare"
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
                icon={<MessageSquare className="text-purple-500" />}
                label="Community-Inlägg"
                value={stats.posts}
                onClick={() => setActiveTab('posts')}
              />
              <StatCard
                icon={<FolderTrash className="text-red-400" />}
                label="Borttagna/Avslutade"
                value={stats.trash}
                onClick={() => setActiveTab('trash')}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#0f172a] border border-white/5 p-6 rounded-xl space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Viktiga åtgärder</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setActiveTab('reports')} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 p-4 rounded-lg flex items-center justify-between font-bold text-xs transition-all border border-amber-500/20">
                    <span className="flex items-center gap-2"><AlertTriangle size={18} /> Anmälningar</span>
                    <span className="bg-amber-500 text-black px-2 py-0.5 rounded text-[10px] font-black">{stats.reports}</span>
                  </button>
                  <button onClick={() => setActiveTab('requests')} className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 p-4 rounded-lg flex items-center justify-between font-bold text-xs transition-all border border-blue-500/20">
                    <span className="flex items-center gap-2"><UserCheck size={18} /> Namnändringar</span>
                    <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-[10px] font-black">{nameRequests.length}</span>
                  </button>
                  <button onClick={() => setActiveTab('news')} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 p-4 rounded-lg flex items-center gap-2 font-bold text-xs transition-all border border-emerald-500/20">
                    <Newspaper size={18} /> Skapa Nyhet
                  </button>
                  <button onClick={() => setActiveTab('system')} className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 p-4 rounded-lg flex items-center gap-2 font-bold text-xs transition-all border border-purple-500/20">
                    <Megaphone size={18} /> Nytt Meddelande
                  </button>
                </div>
              </div>

              <div className="bg-[#0f172a] border border-white/5 p-6 rounded-xl space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Senaste Anmälningar</h3>
                {reports.filter(r => r.status === 'pending').slice(0, 3).map(rep => (
                  <div key={rep.id} className="bg-white/5 p-3 rounded-lg flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white uppercase text-[10px]">{rep.content_type}: #{rep.id.slice(0, 6)}</p>
                      <p className="text-zinc-400 italic line-clamp-1">&quot;{rep.reason}&quot;</p>
                    </div>
                    <button onClick={() => setActiveTab('reports')} className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-[9px] font-black uppercase">
                      Granska
                    </button>
                  </div>
                ))}
                {reports.filter(r => r.status === 'pending').length === 0 && (
                  <p className="text-zinc-600 italic text-xs py-4 text-center">Inga väntande anmälningar just nu. ✨</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- POSTS (COMMUNITY) TAB --- */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="bg-[#0f172a] border border-white/5 p-4 rounded-xl flex items-center gap-4">
              <Search className="text-zinc-500" size={18} />
              <input
                value={searchPost}
                onChange={(e) => setSearchPost(e.target.value)}
                placeholder="Sök inlägg på innehåll eller författare..."
                className="bg-transparent border-none outline-none text-white w-full font-medium text-xs placeholder:text-zinc-500"
              />
            </div>

            <div className="bg-[#0f172a] border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-zinc-400 font-black uppercase text-[10px] tracking-widest border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Inlägg</th>
                    <th className="px-6 py-4">Författare</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Skapad</th>
                    <th className="px-6 py-4 text-right">Åtgärd</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredPosts.map(p => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 max-w-md">
                        <p className="font-medium text-white line-clamp-2 text-xs">{p.content}</p>
                        {p.image_url && <p className="text-[9px] text-blue-400 font-bold uppercase mt-1">📷 Har Bild</p>}
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        <p className="font-bold text-white text-xs">{p.profiles?.full_name || 'Anonym'}</p>
                        <p className="text-[10px] text-zinc-500">{p.profiles?.email || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[8px] font-black uppercase border border-white/5">{p.category || 'Allmänt'}</span>
                      </td>
                      <td className="px-6 py-4 text-[10px] text-zinc-500 font-bold uppercase">
                        {p.created_at ? new Date(p.created_at).toLocaleDateString('sv-SE') : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeletePost(p.id)}
                          className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border border-red-500/20"
                          title="Radera inlägg permanent"
                        >
                          <Trash2 size={14} className="inline mr-1" /> Radera
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredPosts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-16 text-zinc-600 italic">Inga community-inlägg hittades.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- ADS TAB --- */}
        {activeTab === 'ads' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 bg-[#0f172a] border border-white/5 p-4 rounded-xl">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 flex-1">
                  <Search className="text-zinc-500" size={18} />
                  <input
                    value={searchAd}
                    onChange={(e) => setSearchAd(e.target.value)}
                    placeholder="Sök annonser på titel, kategori eller säljare..."
                    className="bg-transparent border-none outline-none text-white w-full font-medium text-xs placeholder:text-zinc-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mr-1">Betalning:</span>
                  <button
                    onClick={() => setAdPaymentFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                      adPaymentFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-400'
                    }`}
                  >
                    Alla
                  </button>
                  <button
                    onClick={() => setAdPaymentFilter('paid')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                      adPaymentFilter === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-zinc-400'
                    }`}
                  >
                    <Check size={12} className="inline mr-1" /> Betalda
                  </button>
                  <button
                    onClick={() => setAdPaymentFilter('unpaid')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                      adPaymentFilter === 'unpaid' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-zinc-400'
                    }`}
                  >
                    <X size={12} className="inline mr-1" /> Ej Betalda
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mr-1">Status:</span>
                <button
                  onClick={() => setAdStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                    adStatusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  Alla
                </button>
                <button
                  onClick={() => setAdStatusFilter('active')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                    adStatusFilter === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  Aktiva
                </button>
                <button
                  onClick={() => setAdStatusFilter('finished')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                    adStatusFilter === 'finished' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  Avslutade/Borttagna
                </button>
              </div>
            </div>

            <div className="bg-[#0f172a] border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-zinc-400 font-black uppercase text-[10px] tracking-widest border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Annons</th>
                    <th className="px-6 py-4">Säljare</th>
                    <th className="px-6 py-4">Pris</th>
                    <th className="px-6 py-4">Betalning</th>
                    <th className="px-6 py-4">Kategori & Status</th>
                    <th className="px-6 py-4 text-right">Åtgärd</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ads
                    .filter(ad => {
                      const matchesSearch = searchAd === '' ||
                        ad.title?.toLowerCase().includes(searchAd.toLowerCase()) ||
                        ad.category?.toLowerCase().includes(searchAd.toLowerCase()) ||
                        ad.profiles?.full_name?.toLowerCase().includes(searchAd.toLowerCase())
                      if (!matchesSearch) return false

                      const isFinished = ad.status === 'finished'
                      if (adStatusFilter === 'active' && isFinished) return false
                      if (adStatusFilter === 'finished' && !isFinished) return false

                      const isPaid = ad.payment_status === 'paid'
                      if (adPaymentFilter === 'paid' && !isPaid) return false
                      if (adPaymentFilter === 'unpaid' && isPaid) return false

                      return true
                    })
                    .map(ad => {
                      const isFinished = ad.status === 'finished'
                      const isPaid = ad.payment_status === 'paid'

                      return (
                        <tr key={ad.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <Link href={`/annonser/${ad.id}`} target="_blank" className="flex items-center gap-3 hover:text-blue-400 transition-colors">
                              <div className="w-12 h-10 bg-white/5 rounded flex items-center justify-center overflow-hidden border border-white/5 shrink-0">
                                {ad.image_url ? <img src={ad.image_url} className="w-full h-full object-cover" /> : <Building2 size={16} className="text-zinc-700" />}
                              </div>
                              <div>
                                <p className="font-bold text-white line-clamp-1 text-xs">{capitalizeFirst(ad.title)}</p>
                                <p className="text-[9px] text-zinc-500 font-bold uppercase">{new Date(ad.created_at).toLocaleDateString('sv-SE')}</p>
                              </div>
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-zinc-400">
                            <p className="font-bold text-white text-xs">{ad.profiles?.full_name || 'Anonym Kund'}</p>
                            <p className="text-[10px] text-zinc-500">{ad.profiles?.email || '-'}</p>
                          </td>
                          <td className="px-6 py-4 text-zinc-300 font-black italic text-xs">{ad.price ? `${ad.price} kr` : 'Bud'}</td>
                          <td className="px-6 py-4">
                            {isPaid ? (
                              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded text-[8px] font-black uppercase flex items-center gap-1 w-fit">
                                <Check size={10} /> BETALD
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                                  EJ BETALD
                                </span>
                                <button
                                  onClick={() => handleMarkAdPaid(ad.id)}
                                  className="text-[8px] font-black uppercase bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white px-2 py-0.5 rounded transition-all border border-blue-500/30"
                                >
                                  Godkänn
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[8px] font-black uppercase border border-white/5 w-fit">{ad.category}</span>
                              {isFinished ? (
                                <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[8px] font-black uppercase w-fit">BORTTAGEN / AVSLUTAD</span>
                              ) : (
                                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[8px] font-black uppercase w-fit">AKTIV</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!isFinished ? (
                                <button
                                  onClick={() => handleDeleteAd(ad.id, false)}
                                  className="text-zinc-400 hover:text-amber-400 px-2 py-1 rounded text-[9px] font-black uppercase border border-white/5 transition-colors"
                                  title="Flytta till papperskorgen"
                                >
                                  Flytta till Papperskorg
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRestoreAd(ad.id)}
                                  className="text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded text-[9px] font-black uppercase border border-emerald-500/20 transition-colors"
                                  title="Återaktivera annons"
                                >
                                  <RotateCcw size={12} className="inline mr-1" /> Återställ
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteAd(ad.id, true)}
                                className="text-zinc-600 hover:text-red-500 p-2 transition-colors"
                                title="Radera permanent"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TRASH / BORTTAGNA TAB --- */}
        {activeTab === 'trash' && (
          <div className="space-y-6">
            <div className="bg-[#0f172a] border border-white/5 p-6 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                  <FolderTrash className="text-red-400" /> Papperskorg & Borttaget Innehåll
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Här samlas alla avslutade och borttagna annonser. Du kan återställa dem eller radera dem permanent.</p>
              </div>
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-black uppercase">
                {trashedAds.length} Objekt i papperskorgen
              </span>
            </div>

            <div className="bg-[#0f172a] border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-zinc-400 font-black uppercase text-[10px] tracking-widest border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Titel</th>
                    <th className="px-6 py-4">Säljare</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Skapad</th>
                    <th className="px-6 py-4 text-right">Åtgärder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {trashedAds.map(ad => (
                    <tr key={ad.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-white text-xs">{capitalizeFirst(ad.title)}</td>
                      <td className="px-6 py-4 text-zinc-400 text-xs">{ad.profiles?.full_name || 'Anonym Kund'}</td>
                      <td className="px-6 py-4">
                        <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[8px] font-black uppercase">{ad.category}</span>
                      </td>
                      <td className="px-6 py-4 text-[10px] text-zinc-500 font-bold uppercase">
                        {new Date(ad.created_at).toLocaleDateString('sv-SE')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleRestoreAd(ad.id)}
                            className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border border-emerald-500/20"
                          >
                            <RotateCcw size={12} className="inline mr-1" /> Återställ till Live
                          </button>
                          <button
                            onClick={() => handleDeleteAd(ad.id, true)}
                            className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border border-red-500/20"
                          >
                            <Trash2 size={12} className="inline mr-1" /> Radera Permanent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {trashedAds.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-16 text-zinc-600 italic">Papperskorgen är tom. ✨</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- REPORTS (MODERATION) TAB --- */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0f172a] border border-white/5 p-4 rounded-xl">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setReportStatusFilter('all')}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                    reportStatusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  Alla ({reports.length})
                </button>
                <button
                  onClick={() => setReportStatusFilter('pending')}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                    reportStatusFilter === 'pending' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  Väntande ({reports.filter(r => r.status === 'pending').length})
                </button>
                <button
                  onClick={() => setReportStatusFilter('resolved')}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                    reportStatusFilter === 'resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  Åtgärdade ({reports.filter(r => r.status === 'resolved').length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reports
                .filter(rep => reportStatusFilter === 'all' ? true : rep.status === reportStatusFilter)
                .map(rep => (
                  <div key={rep.id} className="bg-[#0f172a] border border-white/5 rounded-xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                        {rep.content_type}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase">{new Date(rep.created_at).toLocaleString('sv-SE')}</span>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase">Anmält av: {rep.profiles?.full_name || 'Anonym'}</p>
                      <p className="text-xs text-zinc-200 font-medium italic mt-1">&quot;{rep.reason}&quot;</p>
                    </div>

                    <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                      {rep.contentExists ? (
                        <p className="text-xs text-white">{rep.targetContent?.title || rep.targetContent?.content || 'Innehåll finns'}</p>
                      ) : (
                        <p className="text-xs text-red-400 italic">Innehållet är raderat eller hittas inte.</p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                      {rep.contentExists && (
                        <button
                          onClick={() => handleDeleteReportContent(rep.id, rep.content_type, rep.content_id)}
                          className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border border-red-500/20"
                        >
                          <Trash2 size={12} className="inline mr-1" /> Radera permanent
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateReportStatus(rep.id, 'resolved')}
                        className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border border-emerald-500/20"
                      >
                        <Check size={12} className="inline mr-1" /> Åtgärdad
                      </button>
                      <button
                        onClick={() => handleUpdateReportStatus(rep.id, 'dismissed')}
                        className="bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all"
                      >
                        Avfärda
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* --- USERS TAB --- */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-[#0f172a] border border-white/5 p-4 rounded-xl flex items-center gap-4">
              <Search className="text-zinc-500" size={18} />
              <input
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Sök användare på namn eller e-post..."
                className="bg-transparent border-none outline-none text-white w-full font-medium text-xs placeholder:text-zinc-500"
              />
            </div>

            <div className="bg-[#0f172a] border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-zinc-400 font-black uppercase text-[10px] tracking-widest border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Användare</th>
                    <th className="px-6 py-4">E-post</th>
                    <th className="px-6 py-4">Skapad</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Åtgärd</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/profil/${u.id}`} target="_blank" className="font-bold text-white text-xs hover:text-blue-400 transition-colors">
                          {u.full_name || 'Namnlös'}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 text-xs">{u.email || '-'}</td>
                      <td className="px-6 py-4 text-[10px] text-zinc-500 font-bold uppercase">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('sv-SE') : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {u.is_banned ? (
                          <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-[8px] font-black uppercase">Avstängd</span>
                        ) : (
                          <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[8px] font-black uppercase">Aktiv</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleBan(u.id, u.is_banned)}
                          className={`p-2 rounded-lg transition-all ${u.is_banned ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-red-500 hover:bg-red-500/10'}`}
                          title={u.is_banned ? 'Återställ användare' : 'Stäng av användare'}
                        >
                          {u.is_banned ? <Unlock size={16} /> : <Ban size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- REQUESTS TAB --- */}
        {activeTab === 'requests' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <UserPlus size={16} className="text-blue-500" /> Begäran om namnändringar
            </h3>
            <div className="space-y-4">
              {nameRequests.map(req => (
                <div key={req.id} className="bg-[#0f172a] border border-white/5 p-6 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase mb-1">Nuvarande: {req.current_name}</p>
                    <p className="text-base font-black text-white italic">Önskat namn: <span className="text-blue-400">{req.requested_name}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApproveNameChange(req)} className="bg-emerald-500 text-white p-2.5 rounded-lg hover:bg-emerald-600 transition-all"><Check size={18} /></button>
                    <button onClick={() => handleRejectNameChange(req.id)} className="bg-red-500 text-white p-2.5 rounded-lg hover:bg-red-600 transition-all"><X size={18} /></button>
                  </div>
                </div>
              ))}
              {nameRequests.length === 0 && <p className="text-zinc-600 italic text-xs py-8 text-center bg-[#0f172a] rounded-xl border border-white/5">Inga väntande namnändringar. ✨</p>}
            </div>
          </div>
        )}

        {/* --- NEWS TAB --- */}
        {activeTab === 'news' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <form onSubmit={handlePostNews} className="bg-[#0f172a] border border-white/5 p-6 rounded-xl space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 mb-2">
                <Newspaper className="text-blue-500" /> Skapa Nyhet
              </h3>
              <input value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} placeholder="Titel..." required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs outline-none focus:border-blue-500 transition-all" />
              <textarea value={newsForm.desc} onChange={e => setNewsForm({...newsForm, desc: e.target.value})} placeholder="Innehåll/Beskrivning..." required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs h-32 outline-none focus:border-blue-500 transition-all" />
              <input value={newsForm.img} onChange={e => setNewsForm({...newsForm, img: e.target.value})} placeholder="Bild URL (valfri)" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs outline-none focus:border-blue-500 transition-all" />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all">Publicera Nyhet</button>
            </form>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Publicerade Nyheter</h3>
              {news.map(n => (
                <div key={n.id} className="bg-[#0f172a] border border-white/5 p-4 rounded-xl flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-white text-xs">{n.title}</h4>
                    <p className="text-zinc-400 text-xs line-clamp-2 mt-1">{n.description}</p>
                    <p className="text-[8px] text-zinc-600 font-bold uppercase mt-2">{n.date}</p>
                  </div>
                  <button onClick={() => handleDeleteNews(n.id)} className="text-zinc-600 hover:text-red-500 p-1.5 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SYSTEM & CATEGORIES TAB --- */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Megaphone className="text-purple-500" /> Globala Meddelanden
              </h3>
              <form onSubmit={handleAddAnnouncement} className="bg-[#0f172a] border border-white/5 p-6 rounded-xl space-y-4">
                 <input value={newAnnounce.title} onChange={e => setNewAnnounce({...newAnnounce, title: e.target.value})} placeholder="Titel..." required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs outline-none focus:border-purple-500 transition-all" />
                 <textarea value={newAnnounce.content} onChange={e => setNewAnnounce({...newAnnounce, content: e.target.value})} placeholder="Innehåll..." required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs h-24 outline-none focus:border-purple-500 transition-all" />
                 <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all">Publicera Broadcast</button>
              </form>

              <div className="space-y-3">
                {announcements.map(ann => (
                  <div key={ann.id} className="bg-[#0f172a] border border-white/5 p-4 rounded-xl flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-white text-xs">{ann.title}</h4>
                      <p className="text-zinc-400 text-xs mt-1">{ann.content}</p>
                    </div>
                    <button onClick={() => handleDeleteAnnouncement(ann.id)} className="text-zinc-600 hover:text-red-500 p-1 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Tags className="text-blue-500" /> Bazar Kategorier
              </h3>
              <form onSubmit={handleAddCategory} className="bg-[#0f172a] border border-white/5 p-6 rounded-xl flex gap-3">
                 <input value={newCategory.name} onChange={e => setNewCategory({ name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} placeholder="Kategorinamn..." required className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-xs outline-none focus:border-blue-500 transition-all" />
                 <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all">Lägg till</button>
              </form>

              <div className="bg-[#0f172a] border border-white/5 rounded-xl divide-y divide-white/5">
                {categories.map(cat => (
                  <div key={cat.id} className="px-6 py-3 flex justify-between items-center group">
                    <span className="font-bold text-white text-xs">{cat.name}</span>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- CONTACT / SUPPORT TAB --- */}
        {activeTab === 'contact' && (
          <div className="space-y-4 max-w-3xl">
            {contactRequests.map(req => (
              <div key={req.id} className="bg-[#0f172a] border border-white/5 p-6 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-xs">{req.reason}</h4>
                    <p className="text-xs text-zinc-500">{req.email}</p>
                  </div>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${req.status === 'handled' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {req.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 italic">&quot;{req.message}&quot;</p>
                <div className="flex justify-end gap-3 pt-2">
                  {req.status === 'pending' && (
                    <button onClick={() => handleContactAction(req.id, false)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase">
                      Markera som klar
                    </button>
                  )}
                  <button onClick={() => handleContactAction(req.id, true)} className="text-zinc-500 hover:text-red-500 text-[9px] font-black uppercase">
                    Radera
                  </button>
                </div>
              </div>
            ))}
            {contactRequests.length === 0 && <p className="text-zinc-600 italic text-xs py-8 text-center bg-[#0f172a] rounded-xl border border-white/5">Inga meddelanden. ✨</p>}
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
      className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all group ${
        active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-xs font-black uppercase tracking-wider">{label}</span>
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
