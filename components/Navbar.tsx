'use client'

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { User, MessageSquare, Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const fetchUnreadCount = useCallback(async (userId: string) => {
    const { count } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (count !== null) setUnreadCount(count);
  }, [supabase]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) fetchUnreadCount(user.id);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) fetchUnreadCount(currentUser.id);
      else setUnreadCount(0);
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchUnreadCount]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Hem", href: "/" },
    { name: "Forum", href: "/annonser" },
    { name: "Nyheter", href: "/nyheter" },
    { name: "Event", href: "/evenemang" },
    { name: "Om Oss", href: "/om-oss" },
  ];

  // Hide main navbar on pages that have the HomeHero component included
  const mainPages = ['/', '/annonser', '/nyheter', '/evenemang', '/om-oss', '/profil', '/profil/installningar', '/skapa-annons', '/meddelanden'];
  if (mainPages.includes(pathname)) return null;

  return (
    <header className="bg-white border-b border-zinc-100 z-50 shadow-sm relative text-left">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Desktop View */}
        <div className="hidden md:flex flex-col items-center">
          {/* Top Logo Part */}
          <div className="py-6 flex justify-center w-full">
            <Link href="/" className="inline-block">
              <div className="w-24 md:w-40 h-auto">
                <svg viewBox="0 0 120 60" className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
                  <defs>
                    <clipPath id="wave-path-v2-nav">
                      <path d="M0 15 C 20 5, 40 25, 60 15 C 80 5, 100 25, 120 15 V 45 C 100 55, 80 35, 60 45 C 40 55, 20 35, 0 45 Z" />
                    </clipPath>
                    <linearGradient id="flag-shade-v2-nav" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="black" stopOpacity="0.1" />
                      <stop offset="25%" stopColor="white" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="black" stopOpacity="0.1" />
                      <stop offset="75%" stopColor="white" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="black" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <g clipPath="url(#wave-path-v2-nav)">
                    <rect x="0" y="0" width="60" height="30" fill="white" />
                    <rect x="0" y="30" width="60" height="30" fill="#a11a2d" />
                    <rect x="60" y="0" width="60" height="60" fill="#006aa7" />
                    <rect x="60" y="24" width="60" height="12" fill="#fecc00" />
                    <rect x="78" y="0" width="12" height="60" fill="#fecc00" />
                    <rect x="0" y="0" width="120" height="60" fill="url(#flag-shade-v2-nav)" />
                  </g>
                </svg>
              </div>
            </Link>
          </div>

          {/* Bottom Nav + Actions Part */}
          <nav className="border-t border-zinc-100 w-full bg-zinc-50/30">
            <div className="flex justify-center items-center h-16 relative">
              <ul className="flex items-center gap-10 lg:gap-16">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.name} className="relative h-full flex items-center">
                      <Link
                        href={link.href}
                        className={`text-[11px] lg:text-[13px] font-black uppercase tracking-[0.2em] transition-colors ${
                          isActive ? "text-[#003366]" : "text-zinc-400 hover:text-[#003366]"
                        }`}
                      >
                        {link.name}
                      </Link>
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#003366]"></div>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Action Icons positioned relative to the container */}
              <div className="absolute right-0 flex items-center gap-4 lg:gap-6">
                {!user ? (
                  <Link href="/logga-in" className="text-[11px] font-black text-[#003366] uppercase tracking-[0.2em] border-b-2 border-transparent hover:border-[#003366] transition-all py-1">
                    Bli medlem / Logga in
                  </Link>
                ) : (
                  <>
                    <Link href="/profil" className="text-zinc-500 hover:text-[#003366] transition-colors p-2" title="Min Profil">
                      <User size={22} />
                    </Link>
                    <Link href="/meddelanden" className="relative text-zinc-500 hover:text-[#003366] transition-colors p-2" title="Meddelanden">
                      <MessageSquare size={22} className="scale-x-[-1]" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 bg-[#a11a2d] text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                    <button onClick={handleLogout} className="text-[11px] font-black text-[#a11a2d] uppercase tracking-widest hover:underline ml-2">
                      Logga ut
                    </button>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile View */}
        <div className="md:hidden py-4 flex items-center justify-between">
          <button
            className="p-2 text-zinc-600 hover:bg-zinc-50 rounded-md transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="inline-block">
            <div className="w-24 h-10 overflow-visible">
              <svg viewBox="0 0 120 60" className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
                <g clipPath="url(#wave-path-v2-nav)">
                  <rect x="0" y="0" width="60" height="30" fill="white" />
                  <rect x="0" y="30" width="60" height="30" fill="#a11a2d" />
                  <rect x="60" y="0" width="60" height="60" fill="#006aa7" />
                  <rect x="60" y="24" width="60" height="12" fill="#fecc00" />
                  <rect x="78" y="0" width="12" height="60" fill="#fecc00" />
                </g>
              </svg>
            </div>
          </Link>

          <div className="w-10"></div> {/* Spacer for symmetry */}
        </div>
      </div>

      {/* Mobile Drawer Menu (Slide-in) */}
      <div className={`fixed inset-0 z-[100] transition-all duration-300 md:hidden ${menuOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />
        <div className={`absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-300 flex flex-col ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 border-b flex justify-between items-center text-left">
            <span className="font-black text-[#003366] uppercase tracking-widest text-sm text-left">Meny</span>
            <button onClick={() => setMenuOpen(false)} className="p-2 text-zinc-400"><X size={24} /></button>
          </div>
          <nav className="flex-1 overflow-y-auto p-6 text-left">
            <ul className="space-y-4 text-left">
              {navLinks.map((link) => (
                <li key={link.name} className="text-left">
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-xl font-bold uppercase tracking-wider block py-3 border-b border-zinc-50 text-left ${pathname === link.href ? 'text-[#a11a2d]' : 'text-zinc-800'}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-12 pt-8 border-t border-zinc-100 space-y-6 text-left">
              {user ? (
                <div className="text-left space-y-6">
                  <Link href="/profil" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 text-lg font-bold text-zinc-800 text-left">
                    <User size={20} className="text-[#003366]" /> Min Profil
                  </Link>
                  <Link href="/meddelanden" onClick={() => setMenuOpen(false)} className="flex items-center justify-between text-lg font-bold text-zinc-800 text-left">
                    <div className="flex items-center gap-4 text-left">
                      <MessageSquare size={20} className="text-[#003366]" /> Meddelanden
                    </div>
                    {unreadCount > 0 && <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>}
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left text-lg font-bold text-[#a11a2d] pt-4 uppercase tracking-widest text-left">
                    Logga ut
                  </button>
                </div>
              ) : (
                <Link href="/logga-in" onClick={() => setMenuOpen(false)} className="block bg-[#003366] text-white text-center py-4 rounded-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-900/20 text-center">
                  Logga in / Bli medlem
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
