import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 text-center md:">
        <div className="max-w-xs text-center md:">
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs italic">Polacker i Sverige</h4>
          <p className="text-[11px] leading-relaxed">Din officiella portal för nyheter, karriär och gemenskap. Vi sammanför det polska communityt i Sverige sedan 2026.</p>
        </div>
        <div className="flex gap-16 mx-auto md:mx-0">
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[10px]">Länkar</h4>
            <ul className="space-y-2 text-[10px]">
              <li><Link href="/nyheter" className="hover:text-white transition-colors">Nyhetsarkiv</Link></li>
              <li><Link href="/evenemang" className="hover:text-white transition-colors">Evenemang</Link></li>
              <li><Link href="/annonser" className="hover:text-white transition-colors">Bazar</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-white text-[11px] font-bold">© {new Date().getFullYear()} POLASVE</p>
          <p className="text-[10px] mt-2 uppercase tracking-widest">Gemenskap • Förtroende • Kvalitet</p>
        </div>
      </div>
    </footer>
  );
}
