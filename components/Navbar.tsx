'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchUnreadCount(user.id);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUnreadCount(session.user.id);
      } else {
        setUnreadCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUnreadCount = async (userId: string) => {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (!error && count !== null) {
      setUnreadCount(count);
    }
  };

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('unread_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          fetchUnreadCount(user.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="border-b border-zinc-100 bg-white/80 backdrop-blur-md px-4 md:px-6 py-4 md:py-5 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl md:text-2xl font-bold tracking-tight text-red-800 flex items-center gap-2 md:gap-3">
          <div className="w-8 h-5 md:w-10 md:h-6 bg-white border border-zinc-200 flex flex-col overflow-hidden rounded-sm shadow-sm">
            <div className="h-1/2 bg-white"></div>
            <div className="h-1/2 bg-red-800"></div>
          </div>
          <span className="tracking-widest font-light">POLA</span><span className="font-bold">SVE</span>
        </Link>

        <nav className="flex gap-4 md:gap-8 items-center">
          <Link href="/annonser" className="text-[10px] md:text-xs font-semibold text-zinc-500 hover:text-red-800 transition-colors uppercase tracking-[0.1em] md:tracking-[0.2em]">
            Annonser
          </Link>

          {user ? (
            <>
              <Link href="/meddelanden" className="relative text-[10px] md:text-xs font-semibold text-zinc-500 hover:text-red-800 transition-colors uppercase tracking-[0.2em]">
                Meddelanden
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/profil" className="text-[10px] md:text-xs font-bold border-2 border-zinc-900 text-zinc-900 px-4 md:px-6 py-2 md:py-2.5 rounded-full hover:bg-zinc-900 hover:text-white transition-all active:scale-95 uppercase tracking-widest">
                Min Profil
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:block text-[10px] md:text-xs font-bold text-red-800 uppercase tracking-widest hover:underline"
              >
                Logga ut
              </button>
            </>
          ) : (
            <Link href="/logga-in" className="text-[10px] md:text-xs font-bold border-2 border-red-800 text-red-800 px-4 md:px-6 py-2 md:py-2.5 rounded-full hover:bg-red-800 hover:text-white transition-all active:scale-95 uppercase tracking-widest">
              Logga in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
