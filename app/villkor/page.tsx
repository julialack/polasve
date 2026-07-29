import HomeHero from "@/components/HomeHero";
import InfoBar from "@/components/layout/InfoBar";
import SidebarNav from "@/components/layout/SidebarNav";
import { ShieldCheck } from "lucide-react";

export default function VillkorPage() {
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
              <div className="bg-[#003366] text-white px-6 py-4 flex items-center gap-3">
                <ShieldCheck size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Användarvillkor</span>
              </div>

              <div className="p-8 md:p-12 prose prose-zinc max-w-none">
                <h1 className="text-3xl font-black text-[#003366] uppercase tracking-tighter italic mb-8">Villkor för <span className="text-[#a11a2d]">Polasve</span></h1>

                <section className="mb-10">
                    <h2 className="text-lg font-bold text-zinc-800 uppercase mb-4 border-b pb-2">1. Allmänt</h2>
                    <p className="text-zinc-600 text-sm leading-relaxed">Välkommen till Polasve. Genom att använda vår plattform godkänner du dessa villkor. Vi strävar efter att skapa en trygg mötesplats för det polska communityt i Sverige.</p>
                </section>

                <section className="mb-10">
                    <h2 className="text-lg font-bold text-zinc-800 uppercase mb-4 border-b pb-2">2. Annonsering</h2>
                    <p className="text-zinc-600 text-sm leading-relaxed">Som användare ansvarar du för att innehållet i dina annonser är korrekt och följer svensk lag. Vi förbehåller oss rätten att ta bort stötande eller olagligt innehåll.</p>
                </section>

                <section className="mb-10">
                    <h2 className="text-lg font-bold text-zinc-800 uppercase mb-4 border-b pb-2">3. Ansvar</h2>
                    <p className="text-zinc-600 text-sm leading-relaxed">Polasve är en förmedlingstjänst. Vi tar inte ansvar för affärer som görs mellan medlemmar. Träffas alltid på säkra platser vid köp och sälj.</p>
                </section>

                <p className="text-zinc-400 text-[10px] italic mt-20">Senast uppdaterad: 24 juli 2026</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
