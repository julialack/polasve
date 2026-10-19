'use client'

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/utils/translations";
import { getMenuPageCopy } from "@/utils/menu-page-copy";

export default function GlomtLosenordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();
  const { lang } = useTranslation();
  const copy = getMenuPageCopy(lang).account;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/uppdatera-losenord`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success(`${copy.instructionsSent} ${email}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col justify-center py-12 px-6">
      <div className="max-w-md w-full mx-auto">
        <Link href="/logga-in" className="inline-flex items-center gap-2 text-zinc-500 hover:text-sve-blue transition-colors mb-8 text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft size={14} /> {copy.login}
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-xl font-black uppercase tracking-[0.3em] text-sve-blue">{copy.forgotTitle}</h1>
          <div className="w-8 h-px bg-pola-red mx-auto mt-4"></div>
        </div>

        <div className="bg-white p-10 rounded-sm border border-zinc-100 shadow-2xl shadow-zinc-100">
          {!sent ? (
            <form onSubmit={handleReset} className="space-y-8">
              <p className="text-xs text-zinc-500 font-medium leading-relaxed italic text-center">
                {copy.forgotIntro}
              </p>

              <div className="space-y-4">
                <label htmlFor="reset-email" className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">{copy.email}</label>
                <div className="relative">
                  <input
                    id="reset-email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full py-4 bg-transparent border-b border-zinc-200 focus:border-pola-red outline-none transition-colors font-bold text-zinc-950 text-lg placeholder:text-zinc-200 pr-10"
                  />
                  <Mail className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-sve-blue text-white py-5 rounded-full font-black uppercase tracking-[0.2em] hover:bg-pola-red transition-all shadow-xl active:scale-[0.98] disabled:bg-zinc-100 disabled:text-zinc-400 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : copy.sendLink}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-green-600" size={32} />
              </div>
              <h2 className="text-lg font-bold text-zinc-900">{copy.checkEmail}</h2>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed italic">
                {copy.instructionsSent} <strong className="text-zinc-900 not-italic">{email}</strong>.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-[10px] font-black uppercase tracking-widest text-sve-blue hover:text-pola-red transition-colors"
              >
                {copy.sendAgain}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
