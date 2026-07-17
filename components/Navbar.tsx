'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { name: "Hem", href: "/" },
    { name: "Forum", href: "/annonser" },
    { name: "Nyheter", href: "/nyheter" },
    { name: "Event", href: "/evenemang" },
    { name: "Om Oss", href: "/om-oss" },
  ];

  return (
    <header className="bg-white">
      {/* Top Part: Centered Wavy Flag */}
      <div className="py-6 md:py-8 flex justify-center">
        <Link href="/" className="inline-block">
          <div className="w-24 md:w-40 h-auto">
            <svg viewBox="0 0 120 60" className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
              <defs>
                <clipPath id="wave-path">
                  <path d="M0 15 C 20 5, 40 25, 60 15 C 80 5, 100 25, 120 15 V 45 C 100 55, 80 35, 60 45 C 40 55, 20 35, 0 45 Z" />
                </clipPath>
                <linearGradient id="flag-shade" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="black" stopOpacity="0.1" />
                  <stop offset="25%" stopColor="white" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="black" stopOpacity="0.1" />
                  <stop offset="75%" stopColor="white" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="black" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <g clipPath="url(#wave-path)">
                <rect x="0" y="0" width="60" height="30" fill="white" />
                <rect x="0" y="30" width="60" height="30" fill="#a11a2d" />
                <rect x="60" y="0" width="60" height="60" fill="#006aa7" />
                <rect x="60" y="24" width="60" height="12" fill="#fecc00" />
                <rect x="78" y="0" width="12" height="60" fill="#fecc00" />
                <rect x="0" y="0" width="120" height="60" fill="url(#flag-shade)" />
              </g>
            </svg>
          </div>
        </Link>
      </div>

      {/* Bottom Part: Centered Links */}
      <nav className="border-t border-zinc-100">
        <div className="max-w-4xl mx-auto px-4">
          <ul className="flex justify-center items-center gap-8 md:gap-16">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name} className="relative">
                  <Link
                    href={link.href}
                    className={`block py-4 text-sm font-medium transition-colors ${
                      isActive ? "text-[#003366]" : "text-zinc-600 hover:text-[#003366]"
                    }`}
                  >
                    {link.name}
                  </Link>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#003366]"></div>
                  )}
                </li>
              );
            })}

            {/* Conditional Auth Links at the end */}
            {user ? (
              <li className="relative">
                <Link
                  href="/profil"
                  className={`block py-4 text-sm font-bold transition-colors ${
                    pathname === "/profil" ? "text-zinc-900" : "text-zinc-600 hover:text-[#003366]"
                  }`}
                >
                  Profil
                </Link>
                {pathname === "/profil" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900"></div>
                )}
              </li>
            ) : (
              <li>
                <Link href="/logga-in" className="block py-4 text-sm font-bold text-[#003366] hover:underline">
                  Logga in
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
