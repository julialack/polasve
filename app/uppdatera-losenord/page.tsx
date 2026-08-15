'use client'

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function UppdateraLosenordPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionError, setSessionError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const verifySession = async () => {
      // Wäit for Supabase to process the reset link
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setSessionError("Din session har utgått. Vänligen begär en ny återställningslänk.");
      }
    };
    verifySession();
  }, [supabase.auth]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Lösenordet måste vara minst 8 tecken långt");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Ditt lösenord har uppdaterats! Du kan nu logga in.");
      router.push("/logga-in");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col justify-center py-12 px-6">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-xl font-black uppercase tracking-[0.3em] text-sve-blue">Nytt lösenord</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-2">Välj ett säkert lösenord</p>
          <div className="w-8 h-px bg-pola-red mx-auto mt-4"></div>
        </div>

        <div className="bg-white p-10 rounded-sm border border-zinc-100 shadow-2xl shadow-zinc-100">
          {sessionError ? (
            <div className="space-y-6 py-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <Lock className="text-red-600" size={32} />
              </div>
              <p className="text-sm text-zinc-900 text-center font-medium">{sessionError}</p>
              <button
                onClick={() => router.push("/glomt-losenord")}
                className="w-full bg-sve-blue text-white py-5 rounded-full font-black uppercase tracking-[0.2em] hover:bg-pola-red transition-all shadow-xl text-[10px]"
              >
                Begär ny länk
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Nytt lösenord</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minst 8 tecken"
                    required
                    className="w-full py-4 bg-transparent border-b border-zinc-200 focus:border-pola-red outline-none transition-colors font-bold text-zinc-950 text-lg placeholder:text-zinc-200 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-900 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full bg-sve-blue text-white py-5 rounded-full font-black uppercase tracking-[0.2em] hover:bg-pola-red transition-all shadow-xl active:scale-[0.98] disabled:bg-zinc-100 disabled:text-zinc-400 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Uppdatera lösenord"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
