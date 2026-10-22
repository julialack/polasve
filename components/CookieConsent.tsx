'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, ShieldCheck } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("polasve_cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("polasve_cookie_consent", "all");
    setShowBanner(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem("polasve_cookie_consent", "essential");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6 bg-zinc-950/95 text-white backdrop-blur-md border-t border-zinc-800 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8">
        <div className="flex items-start gap-3.5 max-w-3xl">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-full shrink-0 mt-0.5 border border-amber-500/20">
            <Cookie size={22} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <span>Vi använder cookies & dataskydd (GDPR)</span>
            </h3>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Vi använder nödvändiga cookies och lokal lagring för inloggning, säkerhet och språkval. Vi sparar dina val så att webbplatsen fungerar smidigt. Läs mer i vår{" "}
              <Link href="/integritetspolicy" className="text-amber-400 hover:underline font-bold">
                Integritetspolicy
              </Link>{" "}
              och{" "}
              <Link href="/cookiepolicy" className="text-amber-400 hover:underline font-bold">
                Cookiepolicy
              </Link>.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            onClick={handleAcceptEssential}
            className="w-full sm:w-auto px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors border border-zinc-700"
          >
            Endast nödvändiga
          </button>
          <button
            onClick={handleAcceptAll}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-800 hover:bg-red-700 text-white transition-all shadow-md active:scale-95"
          >
            Godkänn alla
          </button>
        </div>
      </div>
    </div>
  );
}
