'use client'

import HomeHero from "@/components/HomeHero";
import InfoBar from "@/components/layout/InfoBar";
import SidebarNav from "@/components/layout/SidebarNav";
import { ShieldCheck, Lock, Eye, FileText, UserCheck, Server, Mail } from "lucide-react";
import Link from "next/link";

export default function IntegritetspolicyPage() {
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
                  <ShieldCheck size={20} className="text-red-500" />
                  <span className="text-xs font-black uppercase tracking-widest">Integritetspolicy & Dataskydd (GDPR)</span>
                </div>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-zinc-200 font-mono">Senast uppdaterad: Juli 2026</span>
              </div>

              <div className="p-8 md:p-12 prose prose-zinc max-w-none text-zinc-700 leading-relaxed text-sm">
                <h1 className="text-3xl font-black text-[#003366] uppercase tracking-tighter italic mb-4">
                  Integritetspolicy för Polasve
                </h1>
                <p className="text-zinc-500 text-xs mb-8">
                  Polasve (&quot;vi&quot;, &quot;vår&quot; eller &quot;oss&quot;) värnar om din personliga integritet och strävar alltid efter att skydda dina personuppgifter på bästa sätt. Denna integritetspolicy förklarar hur vi samlar in, använder och skyddar dina personuppgifter i enlighet med EU:s dataskyddsförordning (GDPR - General Data Protection Regulation) och gällande svensk dataskyddslagstiftning.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 not-prose">
                  <div className="bg-zinc-50 p-4 border border-zinc-200 rounded-sm flex items-start gap-3">
                    <UserCheck className="text-[#003366] shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Personuppgiftsansvarig</h4>
                      <p className="text-[11px] text-zinc-600 mt-1">Polasve Portal (kontakt@polasve.se)</p>
                    </div>
                  </div>
                  <div className="bg-zinc-50 p-4 border border-zinc-200 rounded-sm flex items-start gap-3">
                    <Lock className="text-red-800 shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Tillsynsmyndighet</h4>
                      <p className="text-[11px] text-zinc-600 mt-1">Integritetsskyddsmyndigheten (IMY)</p>
                    </div>
                  </div>
                </div>

                <section className="mb-10">
                  <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-wide border-b pb-2 mb-4 flex items-center gap-2">
                    <Eye size={18} className="text-[#003366]" /> 1. Vilka personuppgifter samlar vi in?
                  </h2>
                  <p className="mb-3">Beroende på hur du använder Polasve behandlar vi följande kategorier av personuppgifter:</p>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-600">
                    <li><strong className="text-zinc-800">Konto- och profildata:</strong> Namn, e-postadress, profilbild/avatar, ort, biografi, telefonnummer samt språkinställningar när du skapar ett konto eller uppdaterar din profil.</li>
                    <li><strong className="text-zinc-800">Annons- och inläggsinnehåll:</strong> Rubrik, beskrivning, kategori, pris, bilder, kontaktuppgifter och platsinformation som du själv väljer att publicera i köp/sälj, jobb, bostad, communityflöde eller evenemang.</li>
                    <li><strong className="text-zinc-800">Direktmeddelanden & Kommunikation:</strong> Meddelanden du skickar till andra medlemmar eller till vår kundsupport/rapporteringsfunktion.</li>
                    <li><strong className="text-zinc-800">Betalnings- och transaktionshistorik:</strong> Vid köp av premiumannonser eller frivilliga donationer behandlar vår betalleverantör Stripe dina betalkortsuppgifter och faktureringsuppgifter. Polasve lagrar endast transaktions-ID, belopp och status för betalningen (vi lagrar aldrig hela betalkortsnummer på våra servrar).</li>
                    <li><strong className="text-zinc-800">Tekniska data & Loggar:</strong> IP-adress, enhetsinformation, webbläsartyp, operativsystem och tidsstämplar vid inloggning eller åtkomst av våra tjänster (för säkerhets- och felsökningsändamål).</li>
                  </ul>
                </section>

                <section className="mb-10">
                  <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-wide border-b pb-2 mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-[#003366]" /> 2. Rättslig grund och ändamål med behandlingen
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-white border border-zinc-200 p-4 rounded-sm">
                      <h3 className="font-bold text-zinc-800 text-xs uppercase tracking-wider mb-1">A. Fullgörande av avtal (Art. 6.1 b GDPR)</h3>
                      <p className="text-zinc-600 text-xs">
                        För att tillhandahålla din användarprofil, publicera och administrera dina annonser och inlägg, möjliggöra kommunikation mellan medlemmar samt genomföra betalningar.
                      </p>
                    </div>
                    <div className="bg-white border border-zinc-200 p-4 rounded-sm">
                      <h3 className="font-bold text-zinc-800 text-xs uppercase tracking-wider mb-1">B. Berättigat intresse (Art. 6.1 f GDPR)</h3>
                      <p className="text-zinc-600 text-xs">
                        För att upprätthålla säkerheten på plattformen, förhindra bedrägerier och missbruk, moderera olämpligt innehåll samt förbättra användarupplevelsen och funktionaliteten på Polasve.
                      </p>
                    </div>
                    <div className="bg-white border border-zinc-200 p-4 rounded-sm">
                      <h3 className="font-bold text-zinc-800 text-xs uppercase tracking-wider mb-1">C. Samtycke (Art. 6.1 a GDPR)</h3>
                      <p className="text-zinc-600 text-xs">
                        När du väljer att visa e-post eller telefonnummer publikt i din profil, eller vid valfria cookies och nyhetsbrev. Du kan när som helst återkalla ditt samtycke i dina profilinställningar.
                      </p>
                    </div>
                    <div className="bg-white border border-zinc-200 p-4 rounded-sm">
                      <h3 className="font-bold text-zinc-800 text-xs uppercase tracking-wider mb-1">D. Rättslig förpliktelse (Art. 6.1 c GDPR)</h3>
                      <p className="text-zinc-600 text-xs">
                        För att uppfylla krav i bokföringslagstiftning samt besvara rättsliga begäranden från behöriga myndigheter.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-10">
                  <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-wide border-b pb-2 mb-4 flex items-center gap-2">
                    <Server size={18} className="text-[#003366]" /> 3. Tredjepartsleverantörer & Överföring av data
                  </h2>
                  <p className="mb-3">
                    Vi säljer aldrig dina personuppgifter till tredje part. För att driva plattformen anlitar vi betrodda personuppgiftsbiträden som uppfyller kraven i GDPR:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-600 mb-4">
                    <li><strong className="text-zinc-800">Supabase Inc:</strong> Databashantering, autentisering, fillagring (bilder) och användarsessioner. Data lagras säkert inom EU/EES eller under godkända överföringsmekanismer (Standard Contractual Clauses).</li>
                    <li><strong className="text-zinc-800">Stripe Payments:</strong> Hantering av kortbetalningar och transaktioner vid köp av premiumannonser och donationer.</li>
                    <li><strong className="text-zinc-800">Vercel Inc:</strong> Hosting och infrastruktur för webbapplikationen.</li>
                  </ul>
                </section>

                <section className="mb-10">
                  <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-wide border-b pb-2 mb-4 flex items-center gap-2">
                    <Lock size={18} className="text-[#003366]" /> 4. Lagringstid och gallring
                  </h2>
                  <p className="text-zinc-600 mb-3">
                    Vi sparar dina personuppgifter endast så länge det är nödvändigt för de ändamål för vilka uppgifterna samlades in:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-600">
                    <li>Konto- och profildata sparas så länge ditt konto är aktivt. Du kan när som helst begära radering av ditt konto.</li>
                    <li>Annonser och foruminlägg sparas så länge de är aktiva eller tills du väljer att ta bort dem.</li>
                    <li>Transaktions- och bokföringsuppgifter sparas i enlighet med gällande bokföringslag (normalt 7 år i Sverige).</li>
                  </ul>
                </section>

                <section className="mb-10">
                  <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-wide border-b pb-2 mb-4 flex items-center gap-2">
                    <UserCheck size={18} className="text-[#003366]" /> 5. Dina rättigheter enligt GDPR
                  </h2>
                  <p className="mb-4">Som registrerad användare har du följande rättigheter under dataskyddsförordningen:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose mb-6">
                    <div className="border border-zinc-200 p-3 rounded bg-zinc-50">
                      <h4 className="font-bold text-xs text-zinc-900 uppercase">Rätt till tillgång (Registerutdrag)</h4>
                      <p className="text-[11px] text-zinc-600 mt-1">Du har rätt att begära en kopia av alla personuppgifter vi behandlar om dig.</p>
                    </div>
                    <div className="border border-zinc-200 p-3 rounded bg-zinc-50">
                      <h4 className="font-bold text-xs text-zinc-900 uppercase">Rätt till rättelse</h4>
                      <p className="text-[11px] text-zinc-600 mt-1">Du kan när som helst korrigera felaktiga eller ofullständiga uppgifter i dina profilinställningar.</p>
                    </div>
                    <div className="border border-zinc-200 p-3 rounded bg-zinc-50">
                      <h4 className="font-bold text-xs text-zinc-900 uppercase">Rätt till radering (&quot;Rätten att bli glömd&quot;)</h4>
                      <p className="text-[11px] text-zinc-600 mt-1">Du kan begära att vi raderar ditt konto och alla tillhörande personuppgifter.</p>
                    </div>
                    <div className="border border-zinc-200 p-3 rounded bg-zinc-50">
                      <h4 className="font-bold text-xs text-zinc-900 uppercase">Rätt till dataportabilitet</h4>
                      <p className="text-[11px] text-zinc-600 mt-1">Du har rätt att få ut dina personuppgifter i ett strukturerat och maskinläsbart format.</p>
                    </div>
                  </div>
                </section>

                <section className="mb-10">
                  <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-wide border-b pb-2 mb-4 flex items-center gap-2">
                    <Mail size={18} className="text-[#003366]" /> 6. Kontakt & Klagomål
                  </h2>
                  <p className="mb-3">
                    Om du har frågor angående denna integritetspolicy, vill utöva dina rättigheter eller begära radering av dina uppgifter, är du varmt välkommen att kontakta oss:
                  </p>
                  <p className="bg-zinc-100 p-4 rounded text-xs font-mono text-zinc-800 border border-zinc-200">
                    E-post: kontakt@polasve.se<br />
                    Webbplats: https://polasve.se<br />
                    Ärende: Dataskydd / GDPR
                  </p>
                  <p className="mt-4 text-xs text-zinc-500">
                    Om du anser att vi behandlat dina personuppgifter i strid med GDPR har du också rätt att lämna in ett klagomål till Integritetsskyddsmyndigheten (IMY) via <a href="https://www.imy.se" target="_blank" rel="noopener noreferrer" className="text-red-800 underline">www.imy.se</a>.
                  </p>
                </section>

                <div className="pt-6 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-500">
                  <Link href="/cookiepolicy" className="text-[#003366] hover:underline font-bold">Läs även vår Cookiepolicy &raquo;</Link>
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
