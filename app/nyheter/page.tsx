import Link from "next/link";

const MAIN_NEWS = {
  id: 1,
  title: "Aktuella Nyheter",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  img: "https://images.unsplash.com/photo-1590424600305-674393608226?q=80&w=1200&auto=format&fit=crop",
};

const SIDE_NEWS = [
  { id: 2, title: "Svensk-Polska nyheter", img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400&auto=format&fit=crop" },
  { id: 3, title: "Tips för Edra Evenemang", img: "https://images.unsplash.com/photo-1511795409834-432f7b172836?q=80&w=400&auto=format&fit=crop" },
  { id: 4, title: "Svensk-Polska evenemang nätverk", img: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=400&auto=format&fit=crop" },
  { id: 5, title: "Tips för Utlandssvenskar", img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=400&auto=format&fit=crop" },
];

const GRID_NEWS = [
  { id: 6, title: "Kultur i Stockholm", img: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=400&auto=format&fit=crop" },
  { id: 7, title: "Mötet i Malmö", img: "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=400&auto=format&fit=crop" },
  { id: 8, title: "Gemenskap i Göteborg", img: "https://images.unsplash.com/photo-1590424600305-674393608226?q=80&w=400&auto=format&fit=crop" },
];

export default function NyheterPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Top Feature Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Main Large Article */}
          <div className="lg:col-span-2">
            <Link href={`/nyheter/${MAIN_NEWS.id}`} className="group block">
              <div className="aspect-[16/9] overflow-hidden rounded-sm mb-6 border border-zinc-100 shadow-sm">
                <img
                  src={MAIN_NEWS.img}
                  alt={MAIN_NEWS.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4 group-hover:text-blue-700 transition-colors">
                {MAIN_NEWS.title}
              </h2>
              <p className="text-zinc-500 leading-relaxed max-w-2xl italic font-serif">
                {MAIN_NEWS.description}
              </p>
              <div className="h-px w-full bg-zinc-100 mt-8"></div>
            </Link>
          </div>

          {/* Right 2x2 Grid */}
          <div className="grid grid-cols-2 gap-4 h-full">
            {SIDE_NEWS.map((news) => (
              <Link href={`/nyheter/${news.id}`} key={news.id} className="group block flex flex-col">
                <div className="aspect-[4/3] overflow-hidden rounded-sm mb-3 border border-zinc-50 shadow-sm">
                  <img
                    src={news.img}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-sm font-bold text-[#003366] leading-tight group-hover:underline">
                  {news.title}
                </h3>
                <p className="text-[10px] text-zinc-400 mt-1 italic line-clamp-1">Lorem ipsum dolor sit amet...</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom 3-column Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {GRID_NEWS.map((news) => (
            <Link href={`/nyheter/${news.id}`} key={news.id} className="group block">
              <div className="aspect-[16/10] overflow-hidden rounded-sm mb-4 border border-zinc-100 shadow-sm">
                <img
                  src={news.img}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-[#003366] group-hover:text-blue-700 transition-colors">
                {news.title}
              </h3>
              <p className="text-sm text-zinc-500 mt-2 line-clamp-2">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
