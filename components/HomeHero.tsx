'use client'

import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User, MessageSquare, ShieldCheck, Menu, X, PlusCircle } from 'lucide-react'

export default function HomeHero() {
  const [user, setUser] = useState<any>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  const ADMIN_EMAIL = 'julia.lackchristensen@gmail.com'

  const fetchUnreadCount = useCallback(async (userId: string) => {
    const { count } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false)
    if (count !== null) setUnreadCount(count)
  }, [supabase])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
      if (currentUser) {
        fetchUnreadCount(currentUser.id)
        setAvatarUrl(currentUser.user_metadata?.avatar_url || null)
      }
    }
    getUser()

    // 1. Listen for Auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        fetchUnreadCount(currentUser.id)
        setAvatarUrl(currentUser.user_metadata?.avatar_url || null)
      } else {
        setAvatarUrl(null)
        setUnreadCount(0)
      }
    })

    // 2. Listen for Realtime message updates (Unread count) - ONLY for this user
    const messageChannel = supabase
      .channel(`unread_count_${currentUser.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${currentUser.id}`
      }, () => {
        fetchUnreadCount(currentUser.id)
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
      supabase.removeChannel(messageChannel)
    }
  }, [supabase, fetchUnreadCount])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const navLinks = [
    { name: "Hem", href: "/" },
    { name: "Forum", href: "/annonser" },
    { name: "Nyheter", href: "/nyheter" },
    { name: "Event", href: "/evenemang" },
    { name: "Om Oss", href: "/om-oss" },
  ]

  return (
    <header className="relative bg-gradient-to-r from-[#d60000] to-[#005bbb] text-white overflow-hidden shadow-2xl">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=2000&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="absolute inset-x-0 bottom-0 h-6 bg-white/40 blur-md"></div>
      </div>

      {/* Top Mobile Bar */}
      <div className="relative z-50 md:hidden flex justify-between items-center px-4 py-3">
        <button onClick={() => setMenuOpen(true)} className="p-2 -ml-2">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/meddelanden" className="relative p-2">
                <MessageSquare size={20} className="scale-x-[-1]" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 bg-white text-red-600 text-[7px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{unreadCount}</span>}
              </Link>
              <Link href="/profil" className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-white ml-1">
                {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#003366]"><User size={16} /></div>}
              </Link>
            </>
          ) : (
            <Link href="/logga-in" className="text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-sm">Logga in</Link>
          )}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-2 pb-12 md:pt-16 md:pb-32 flex flex-col items-center text-left">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-16 w-full mb-6 md:mb-10">
          {/* Polish Flag */}
          <div className="w-16 md:w-56 h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] transform md:rotate-[-5deg]">
            <svg viewBox="0 0 120 80" className="w-full h-full">
              <clipPath id="wave-hero-p">
                <path d="M0 15 C 20 5, 40 25, 60 15 C 80 5, 100 25, 120 15 V 65 C 100 75, 80 35, 60 45 C 40 55, 20 35, 0 45 Z" />
              </clipPath>
              <g clipPath="url(#wave-hero-p)">
                <rect width="120" height="40" fill="white" />
                <rect y="40" width="120" height="40" fill="#dc143c" />
              </g>
            </svg>
          </div>

          <div className="text-center">
            <h1 className="text-3xl md:text-7xl font-black uppercase tracking-tight mb-1 md:mb-2 drop-shadow-lg italic">Polacker i Sverige</h1>
            <p className="text-sm md:text-2xl font-medium tracking-wide opacity-90 drop-shadow-md">Din plats för jobb och annonser i Sverige</p>
          </div>

          {/* Swedish Flag */}
          <div className="w-16 md:w-56 h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] transform md:rotate-[5deg] scale-x-[-1]">
            <svg viewBox="0 0 120 80" className="w-full h-full">
              <g clipPath="url(#wave-hero-p)">
                <rect width="120" height="80" fill="#006aa7" />
                <rect y="32" width="120" height="16" fill="#fecc00" />
                <rect x="30" width="16" height="80" fill="#fecc00" />
              </g>
            </svg>
          </div>
        </div>

        {/* Desktop Nav - Hidden on mobile */}
        <nav className="hidden md:flex flex-wrap justify-center items-center gap-6 md:gap-10 w-full border-t border-white/10 pt-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className={`text-[11px] md:text-xs font-black uppercase tracking-[0.2em] hover:text-white/70 transition-all ${pathname === link.href ? 'border-b-2 border-white pb-1' : ''}`}>{link.name}</Link>
          ))}
          {user?.email === ADMIN_EMAIL && (
            <Link href="/admin" className={`text-[11px] md:text-xs font-black uppercase tracking-[0.2em] text-yellow-300 hover:text-white flex items-center gap-2 transition-all ${pathname === '/admin' ? 'border-b-2 border-white pb-1' : ''}`}><ShieldCheck size={16} /> Admin</Link>
          )}

          <div className="flex items-center gap-5 ml-2">
            {user ? (
              <>
                <Link href="/profil" className="hover:opacity-70 transition-opacity">
                  {avatarUrl ? (
                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-md bg-white flex items-center justify-center">
                      <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <User size={22} />
                  )}
                </Link>
                <Link href="/meddelanden" className="relative hover:opacity-70 transition-opacity">
                  <MessageSquare size={22} className="scale-x-[-1]" />
                  {unreadCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-white text-red-600 text-[8px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold shadow-sm border border-red-600">{unreadCount}</span>}
                </Link>
                <button onClick={handleLogout} className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] text-white hover:underline decoration-2 underline-offset-4 ml-1">Logga ut</button>
              </>
            ) : (
              <Link href="/logga-in" className="text-[10px] md:text-[11px] font-black uppercase tracking-widest bg-white text-[#d60000] px-5 py-2 rounded-sm hover:bg-zinc-100 transition-all shadow-lg">Logga in</Link>
            )}
            <Link href="/skapa-annons" className="bg-[#ff3b3b] hover:bg-white hover:text-[#ff3b3b] text-white px-6 py-2.5 rounded-[4px] font-black text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-xl ml-2 border-2 border-transparent hover:border-[#ff3b3b]">Lägg upp annons</Link>
          </div>
        </nav>

        {/* Mobile CTA Button */}
        <div className="md:hidden w-full px-4 mt-4">
           <Link href="/skapa-annons" className="flex items-center justify-center gap-2 bg-[#ff3b3b] text-white py-3 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 border-2 border-white/20">
             <PlusCircle size={16} /> Lägg upp annons
           </Link>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-[100] transition-all duration-300 md:hidden ${menuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMenuOpen(false)} />
        <div className={`absolute top-0 left-0 bottom-0 w-[80%] bg-white shadow-2xl transition-transform duration-300 flex flex-col ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
            <span className="font-black text-[#003366] uppercase tracking-[0.2em] text-xs">Meny</span>
            <button onClick={() => setMenuOpen(false)} className="p-2 text-zinc-400 hover:text-black"><X size={24} /></button>
          </div>
          <nav className="flex-1 overflow-y-auto p-6">
            <ul className="space-y-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} onClick={() => setMenuOpen(false)} className={`text-2xl font-black uppercase tracking-tighter italic block ${pathname === link.href ? 'text-[#a11a2d]' : 'text-[#003366]'}`}>
                    {link.name}
                  </Link>
                </li>
              ))}
              {user?.email === ADMIN_EMAIL && (
                <li>
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-2xl font-black uppercase tracking-tighter italic text-yellow-600 flex items-center gap-2">
                    <ShieldCheck size={24} /> Admin
                  </Link>
                </li>
              )}
            </ul>
            <div className="mt-12 pt-8 border-t border-zinc-100 space-y-8">
               {user ? (
                 <button onClick={handleLogout} className="text-lg font-black text-[#a11a2d] uppercase tracking-widest">Logga ut</button>
               ) : (
                 <Link href="/logga-in" onClick={() => setMenuOpen(false)} className="block bg-[#003366] text-white text-center py-4 rounded-sm font-bold uppercase tracking-widest shadow-xl">Logga in / Bli medlem</Link>
               )}
            </div>
          </nav>
          <div className="p-6 bg-zinc-50 text-center">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Polacker i Sverige &copy; 2026</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" className="w-full h-auto translate-y-1">
          <path fill="white" d="M0,40 C480,80 960,80 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </header>
  )
}

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" className="w-full h-auto translate-y-1">
          <path fill="white" d="M0,40 C480,80 960,80 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>





