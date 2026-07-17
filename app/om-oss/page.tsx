import { Briefcase, Calendar, Info, Languages, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OmOssPage() {
  const features = [
    {
      title: "Jobbannonser & rekrytering",
      description: "Arbetsgivare kan lägga upp annonser och hitta polska talanger. Medlemmar kan söka jobb, visa sin profil och komma i kontakt med företag.",
      icon: <Briefcase className="text-[#a11a2d]" size={24} />
    },
    {
      title: "Event, utställningar & meet-and-greet",
      description: "Upptäck lokala evenemang, kulturträffar, workshops och sociala möten för polacker runt om i Sverige.",
      icon: <Calendar className="text-[#a11a2d]" size={24} />
    },
    {
      title: "Praktisk hjälp i vardagen",
      description: "Information och guider om allt från försäkringsärenden, bankärenden, myndighetskontakter, visum, personnummer, skattefrågor och mycket mer.",
      icon: <Info className="text-[#a11a2d]" size={24} />
    },
    {
      title: "Översättning & stöd",
      description: "Behöver du hjälp med dokument, formulär eller kommunikation? Här hittar du resurser och kontakter som kan hjälpa dig.",
      icon: <Languages className="text-[#a11a2d]" size={24} />
    },
    {
      title: "Community & meddelanden",
      description: "Skapa din egen profil, chatta med andra medlemmar och bygg ett nätverk av människor som delar samma språk och erfarenheter.",
      icon: <Users className="text-[#a11a2d]" size={24} />
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Hero Section */}
      <section className="bg-white border-b border-zinc-200 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#003366] mb-6 tracking-tight leading-tight italic">
            Polacker i Sverige – <span className="text-[#a11a2d]">Din community, ditt stöd, ditt nätverk</span>
          </h1>
          <div className="h-1 w-24 bg-[#a11a2d] mx-auto mb-10"></div>
          <p className="text-lg text-zinc-600 leading-relaxed font-serif">
            Polacker i Sverige är en samlingsplats för alla polacker som bor, arbetar eller planerar att flytta till Sverige.
            Här möts människor, företag och föreningar i en trygg och aktiv community där vi hjälper varandra att hitta rätt –
            i vardagen, i arbetslivet och i samhället.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[#003366] uppercase tracking-widest flex items-center gap-4">
              Vad du hittar hos oss
              <div className="h-px flex-1 bg-zinc-200"></div>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-white border border-zinc-100 shadow-sm flex items-center justify-center rounded-sm group-hover:border-[#a11a2d] transition-colors">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#003366] mb-3 group-hover:text-[#a11a2d] transition-colors italic">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-24 p-12 bg-[#003366] rounded-sm text-white text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Users size={120} />
            </div>
            <h3 className="text-3xl font-light italic mb-6">Bli en del av vårt växande nätverk idag</h3>
            <p className="text-blue-100 mb-10 max-w-2xl mx-auto font-medium">
              Oavsett om du söker jobb, vill nätverka eller behöver praktisk hjälp finns vi här för dig.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/registrera" className="bg-[#a11a2d] hover:bg-[#8d1627] text-white px-10 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95">
                Bli medlem
              </Link>
              <Link href="/annonser" className="bg-transparent border-2 border-white/20 hover:border-white text-white px-10 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all active:scale-95">
                Utforska Bazar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer-info specific for About Page */}
      <section className="bg-white border-t border-zinc-200 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-zinc-400 text-sm font-bold uppercase tracking-[0.3em]">
            Gemenskap • Förtroende • Kvalitet
          </p>
        </div>
      </section>
    </div>
  );
}
