'use client'

import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User, MessageSquare, ShieldCheck } from 'lucide-react'

export default function HomeHero() {
  const [user, setUser] = useState<any>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  const ADMIN_EMAIL = 'julia.lackchristensen@gmail.com'

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
      if (currentUser) {
        fetchUnreadCount(currentUser.id)
        // Set avatar from metadata primarily
        setAvatarUrl(currentUser.user_metadata?.avatar_url || null)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        fetchUnreadCount(currentUser.id)
        setAvatarUrl(currentUser.user_metadata?.avatar_url || null)
      } else {
        setAvatarUrl(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUnreadCount = async (userId: string) => {
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false)
    if (count !== null) setUnreadCount(count)
  }

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
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-24 md:pt-16 md:pb-32 flex flex-col items-center text-left">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 w-full mb-10">

          {/* Polish Flag */}
          <div className="w-24 md:w-56 h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] transform md:rotate-[-5deg]">
            <svg viewBox="0 0 120 80" className="w-full h-full">
              <defs>
                <clipPath id="wave-final-p">
                  <path d="M0 15 C 20 5, 40 25, 60 15 C 80 5, 100 25, 120 15 V 65 C 100 75, 80 35, 60 45 C 40 55, 20 35, 0 45 Z" />
                </clipPath>
                <linearGradient id="shade-final-p" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="black" stopOpacity="0.4" />
                  <stop offset="25%" stopColor="white" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="black" stopOpacity="0.3" />
                  <stop offset="75%" stopColor="white" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="black" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <g clipPath="url(#wave-final-p)">
                <rect width="120" height="40" fill="white" />
                <rect y="40" width="120" height="40" fill="#dc143c" />
                <rect width="120" height="80" fill="url(#shade-final-p)" style={{ mixBlendMode: 'multiply' }} />
              </g>
            </svg>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tight mb-2 drop-shadow-lg italic">Polacker i Sverige</h1>
            <p className="text-lg md:text-2xl font-medium tracking-wide opacity-90 drop-shadow-md">Din plats för jobb och annonser i Sverige</p>
          </div>

          {/* Swedish Flag */}
          <div className="w-24 md:w-56 h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] transform md:rotate-[5deg] scale-x-[-1]">
            <svg viewBox="0 0 120 80" className="w-full h-full">
              <g clipPath="url(#wave-final-p)">
                <rect width="120" height="80" fill="#006aa7" />
                <rect y="32" width="120" height="16" fill="#fecc00" />
                <rect x="30" width="16" height="80" fill="#fecc00" />
                <rect width="120" height="80" fill="url(#shade-final-p)" style={{ mixBlendMode: 'multiply' }} />
              </g>
            </svg>
          </div>
        </div>

        <nav className="flex flex-wrap justify-center items-center gap-6 md:gap-10 w-full border-t border-white/10 pt-8">
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
                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-md">
                      <img src={avatarUrl} alt="" className="w-full h-full object-cover bg-white" />
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
      </div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" className="w-full h-auto translate-y-1">
          <path fill="#f8f9fa" d="M0,40 C480,80 960,80 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </header>
  )
}
