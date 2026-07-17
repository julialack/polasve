import Link from "next/link";

const NEWS_ARTICLES = [
  {
    id: 1,
    title: "Polsk kulturvecka i Stockholm",
    category: "Kultur",
    description: "Upplev det bästa av polsk konst, musik och film under en hel vecka i huvudstaden. Vernissage och konserter väntar.",
    img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop",
    date: "12 Juli 2026"
  },
  {
    id: 2,
    title: "Stort sug efter polska hantverkare",
    category: "Karriär",
    description: "Byggbranschen i Sverige rapporterar rekordhögt intresse för polsk kompetens inför sommarens alla renoveringar.",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop",
    date: "11 Juli 2026"
  },
  {
    id: 3,
    title: "Nya direktlinjer till Warszawa",
    category: "Resor",
    description: "Flygbolagen utökar antalet turer mellan Sverige och Polen för att möta den ökande efterfrågan från pendlare.",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=1000&auto=format&fit=crop",
    date: "10 Juli 2026"
  }
];

export default function NyheterPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12">
      <main className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#003366] uppercase tracking-tight">Senaste <span className="text-[#a11a2d]">Nyheterna</span></h1>
          <div className="h-1 w-20 bg-[#a11a2d] mt-4"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {NEWS_ARTICLES.map((article) => (
            <div key={article.id} className="bg-white border border-zinc-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={article.img}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#003366] text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
                  {article.category}
                </div>
              </div>
              <div className="p-6">
                <p className="text-[10px] text-zinc-400 font-bold mb-2 uppercase tracking-widest">{article.date}</p>
                <h2 className="text-xl font-bold text-[#003366] mb-3 group-hover:text-[#a11a2d] transition-colors line-clamp-2 italic">
                  {article.title}
                </h2>
                <p className="text-sm text-zinc-600 font-light leading-relaxed line-clamp-3">
                  {article.description}
                </p>
                <div className="mt-6 pt-6 border-t border-zinc-50 flex justify-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#003366] group-hover:gap-2 transition-all">Läs hela artikeln →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
