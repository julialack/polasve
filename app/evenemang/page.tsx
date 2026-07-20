import Link from "next/link";
import { Calendar, MapPin, Clock, Tag } from "lucide-react";

const EVENTS = [
  {
    id: 1,
    title: "Polska Filmdagar",
    date: "15-20 Augusti 2026",
    location: "Saga Bio, Stockholm",
    description: "En vecka fylld med modern polsk filmkonst. Vi visar prisbelönta verk och bjuder in till samtal med regissörer.",
    category: "Kultur",
    img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Networking Meet-up för IT-proffs",
    date: "25 Augusti 2026",
    location: "Epicenter, Stockholm",
    category: "Karriär",
    description: "Knyt nya kontakter inom den svenska IT-branschen. En kväll för erfarenhetsutbyte och nätverkande.",
    img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Barnens Dag: Polska lekar",
    date: "1 September 2026",
    location: "Slottsskogen, Göteborg",
    category: "Familj",
    description: "En rolig dag för hela familjen med traditionella polska lekar, mat och gemenskap.",
    img: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function EvenemangPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] py-16">
      <main className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-[#003366] uppercase tracking-tight">Kommande <span className="text-[#a11a2d]">Evenemang</span></h1>
          <div className="h-1 w-24 bg-[#a11a2d] mt-4"></div>
          <p className="text-zinc-500 mt-4 italic font-serif">Hitta kulturella möten, workshops och sociala träffar i hela Sverige.</p>
        </div>

        <div className="grid gap-10">
          {EVENTS.map((event) => (
            <div key={event.id} className="bg-white border border-zinc-200 rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row group">
              <div className="w-full md:w-80 lg:w-96 aspect-video md:aspect-auto overflow-hidden flex-shrink-0">
                <img
                  src={event.img}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-[#003366] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                      {event.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#003366] mb-4 italic group-hover:text-[#a11a2d] transition-colors leading-tight">
                    {event.title}
                  </h2>
                  <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                    {event.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-zinc-50 pt-6">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar size={16} className="text-[#a11a2d]" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <MapPin size={16} className="text-[#a11a2d]" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">{event.location}</span>
                  </div>
                </div>
              </div>
              <div className="p-8 md:border-l border-zinc-50 flex items-center justify-center bg-zinc-50/30">
                <button className="bg-[#003366] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#a11a2d] transition-all shadow-md active:scale-95 whitespace-nowrap">
                  Visa Detaljer
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
