'use client'

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoggaInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-20 px-6">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-16">
          <Link href="/" className="inline-flex items-center gap-3 text-3xl font-light tracking-widest text-zinc-900 mb-10">
            POLA<span className="font-bold text-red-800">SVE</span>
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-[0.3em] text-zinc-900">Medlemsinloggning</h1>
          <div className="w-8 h-px bg-red-800 mx-auto mt-4"></div>
        </div>

        <div className="bg-white p-12 rounded-sm border border-zinc-100 shadow-2xl shadow-zinc-100">
          <form onSubmit={handleLogin} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300">E-postadress</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namn@exempel.se"
                required
                className="w-full py-4 bg-transparent border-b border-zinc-200 focus:border-red-800 outline-none transition-colors font-light text-zinc-900 text-lg placeholder:text-zinc-200"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300">Lösenord</label>
                <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-red-800 hover:text-red-600 transition-colors">Glömt?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full py-4 bg-transparent border-b border-zinc-200 focus:border-red-800 outline-none transition-colors font-light text-zinc-900 text-lg placeholder:text-zinc-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 text-white py-5 rounded-full font-bold uppercase tracking-[0.2em] hover:bg-red-800 transition-all shadow-xl shadow-zinc-900/10 active:scale-[0.98] text-[10px]"
            >
              {loading ? "Loggar in..." : "Logga in"}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-6 italic font-serif">Eller logga in med</p>
            <div className="flex gap-4">
              <button className="flex-1 py-3 border border-zinc-100 font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-50 transition-colors">Google</button>
              <button className="flex-1 py-3 border border-zinc-100 font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-50 transition-colors">Facebook</button>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          Inte medlem än?{" "}
          <Link href="/registrera" className="text-red-800 hover:text-red-600 transition-colors ml-2 underline underline-offset-4">Skapa konto</Link>
        </p>
      </div>
    </div>
  );
}
