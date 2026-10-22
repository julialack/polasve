'use client'

import HomeHero from "@/components/HomeHero";
import InfoBar from "@/components/layout/InfoBar";
import SidebarNav from "@/components/layout/SidebarNav";
import { Cookie, ShieldCheck, CheckCircle2, Settings, HelpCircle, FileText } from "lucide-react";
import Link from "next/link";

export default function CookiepolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <HomeHero />
      <InfoBar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-4 gap-6">

          <aside className="hidden md:block md:col-span-3 lg:col-span-1">
            <SidebarNav />
          </aside>

          <div className="col-span-1 md:col-span-9 lg:col-span-2 space-y-6">
            <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden rounded-sm">
              <div className="bg-[#003366] text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cookie size={20} className="text-amber-400" />
                  <span className="text-xs font-black uppercase tracking-widest">Cookiepolicy för Polasve</span>
                </div>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-zinc-200 font-mono">Uppdaterad: Juli 2026</span>
              </div>

              <div className="p-8 md:p-12 prose prose-zinc max-w-none text-zinc-700 leading-relaxed text-sm">
                <h1 className="text-3xl font-black text-[#003366] uppercase tracking-tighter italic mb-4">
                  Cookiepolicy
                </h1>
                <p className="text-zinc-500 text-xs mb-8">
                  Polasve (&quot;vi&quot;, &quot;oss&quot;) använder kakor (cookies) och liknande lagringstekniker (som t.ex. localStorage) för att säkerställa att vår webbplats fungerar korrekt, för att komma ihåg dina inställningar och för att ge dig bästa möjliga användarupplevelse.
                </p>

                <section className="mb-10">
                  <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-wide border-b pb-2 mb-4 flex items-center gap-2">
                    <HelpCircle size={18} className="text-[#003366]" /> 1. Vad är cookies och lokal lagring?
                  </h2>
                  <p className="mb-3">
                    En cookie (kaka) är en liten textfil som lagras på din dator, mobiltelefon eller surfplatta när du besöker en webbplats. Kakor gör att webbplatsen kan känna igen din enhet och komma ihåg viss information om dina besök och inställningar.
                  </p>
                  <p className="mb-3">
                    Lokal lagring (<code className="bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded text-xs font-mono">localStorage</code>) fungerar på ett liknande sätt men sparar data direkt i din webbläsare utan att skicka informationen automatiskt till servern vid varje anrop.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-wide border-b pb-2 mb-4 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-[#003366]" /> 2. Vilka typer av cookies använder vi?
                  </h2>

                  <div className="space-y-6">
                    <div className="border border-zinc-200 p-5 rounded-sm bg-white shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-zinc-900 text-xs uppercase tracking-wider flex items-center gap-2">
                          <ShieldCheck size={16} className="text-emerald-600" /> Nödvändiga cookies (Obligatoriska)
                        </h3>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">Alltid aktiva</span>
                      </div>
                      <p className="text-zinc-600 text-xs mb-3">
                        Dessa cookies krävs för att webbplatsen ska fungera tekniskt och säkert. De kan inte stängas av i våra system då tjänsten annars inte går att använda.
                      </p>
                      <table className="w-full text-xs text-left text-zinc-600 border-collapse border border-zinc-200 mt-2">
                        <thead className="bg-zinc-100 font-bold uppercase text-[10px] text-zinc-700">
                          <tr>
                            <th className="p-2 border border-zinc-200">Namn / Nyckel</th>
                            <th className="p-2 border border-zinc-200">Syfte</th>
                            <th className="p-2 border border-zinc-200">Varaktighet</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 border border-zinc-200 font-mono text-[11px]">sb-*-auth-token</td>
                            <td className="p-2 border border-zinc-200">Säker inloggning och hantering av din användarsession via Supabase.</td>
                            <td className="p-2 border border-zinc-200">Session / Persistent</td>
                          </tr>
                          <tr>
                            <td className="p-2 border border-zinc-200 font-mono text-[11px]">polasve_cookie_consent</td>
                            <td className="p-2 border border-zinc-200">Sparar dina inställningar för samtycke av cookies på webbplatsen.</td>
                            <td className="p-2 border border-zinc-200">1 år (localStorage)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="border border-zinc-200 p-5 rounded-sm bg-white shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-zinc-900 text-xs uppercase tracking-wider flex items-center gap-2">
                          <Settings size={16} className="text-[#003366]" /> Funktionella cookies & Inställningar
                        </h3>
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase">Funktion</span>
                      </div>
                      <p className="text-zinc-600 text-xs mb-3">
                        Möjliggör förbättrad funktionalitet och personliga inställningar, såsom ditt valda språk på webbplatsen.
                      </p>
                      <table className="w-full text-xs text-left text-zinc-600 border-collapse border border-zinc-200 mt-2">
                        <thead className="bg-zinc-100 font-bold uppercase text-[10px] text-zinc-700">
                          <tr>
                            <th className="p-2 border border-zinc-200">Namn / Nyckel</th>
                            <th className="p-2 border border-zinc-200">Syfte</th>
                            <th className="p-2 border border-zinc-200">Varaktighet</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 border border-zinc-200 font-mono text-[11px]">polasve_lang</td>
                            <td className="p-2 border border-zinc-200">Kommer ihåg vilket språk du föredrar (svenska, polska, ukrainska, engelska).</td>
                            <td className="p-2 border border-zinc-200">Persistent (localStorage)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="border border-zinc-200 p-5 rounded-sm bg-white shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-zinc-900 text-xs uppercase tracking-wider flex items-center gap-2">
                          <Cookie size={16} className="text-purple-600" /> Tredjepartscookies (Tjänster & Betalning)
                        </h3>
                        <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded uppercase">Tredjepart</span>
                      </div>
                      <p className="text-zinc-600 text-xs mb-3">
                        När du genomför köp av premiumannonser eller gör frivilliga donationer använder vi Stripe Checkout. Stripe sätter nödvändiga cookies för säkerhet, bedrägeriprevention och betalningshantering.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-10">
                  <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-wide border-b pb-2 mb-4 flex items-center gap-2">
                    <Settings size={18} className="text-[#003366]" /> 3. Hur du hanterar eller stänger av cookies
                  </h2>
                  <p className="mb-3">
                    Du kan när som helst ändra dina cookieinställningar eller radera lagrade cookies i din webbläsare. De flesta webbläsare tillåter dig att blockera alla kakor, acceptera endast förstapartskakor eller radera kakor när du stänger webbläsaren.
                  </p>
                  <p className="text-xs text-zinc-500 italic mb-4">
                    Observera: Om du väljer att helt blockera eller radera nödvändiga cookies i din webbläsare kommer du inte att kunna hålla dig inloggad på Polasve eller använda alla funktioner fullt ut.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-wide border-b pb-2 mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-[#003366]" /> 4. Ändringar och kontakt
                  </h2>
                  <p className="mb-3">
                    Vi kan uppdatera denna cookiepolicy vid behov, exempelvis om vi introducerar nya funktioner på plattformen.
                  </p>
                  <p className="text-xs text-zinc-600">
                    Om du har frågor om vår användning av cookies är du välkommen att kontakta oss på <a href="mailto:kontakt@polasve.se" className="text-red-800 font-bold underline">kontakt@polasve.se</a>.
                  </p>
                </section>

                <div className="pt-6 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-500">
                  <Link href="/integritetspolicy" className="text-[#003366] hover:underline font-bold">&laquo; Läs vår Integritetspolicy</Link>
                  <Link href="/villkor" className="text-[#003366] hover:underline font-bold">Läs Användarvillkoren &raquo;</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
