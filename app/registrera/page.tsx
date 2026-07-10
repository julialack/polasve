'use client'

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function RegistreraPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Kolla din e-post för att bekräfta kontot!");
      router.push("/logga-in");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 text-3xl font-light tracking-widest text-zinc-900 mb-10">
            POLA<span className="font-bold text-red-800">SVE</span>
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-[0.3em] text-zinc-900">Skapa konto</h1>
        </div>

        <div className="bg-white p-10 rounded-sm border border-zinc-100 shadow-2xl shadow-zinc-100">
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300">Namn</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ditt för- och efternamn"
                required
                className="w-full py-3 bg-transparent border-b border-zinc-200 focus:border-red-800 outline-none transition-colors font-light text-zinc-900 placeholder:text-zinc-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300">E-post</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namn@exempel.se"
                required
                className="w-full py-3 bg-transparent border-b border-zinc-200 focus:border-red-800 outline-none transition-colors font-light text-zinc-900 placeholder:text-zinc-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300">Lösenord</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minst 8 tecken"
                  required
                  className="w-full py-3 bg-transparent border-b border-zinc-200 focus:border-red-800 outline-none transition-colors font-light text-zinc-900 placeholder:text-zinc-200"
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
              className="w-full bg-zinc-900 text-white py-4 rounded-full font-bold uppercase tracking-[0.2em] hover:bg-red-800 transition-all active:scale-[0.98] disabled:bg-zinc-300 text-[10px]"
            >
              {loading ? "Skapar konto..." : "Skapa konto"}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          Har du redan ett konto?{" "}
          <Link href="/logga-in" className="text-red-800 hover:underline ml-2">Logga in</Link>
        </p>
      </div>
    </div>
  );
}
