'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Newspaper,
  Calendar,
  ShoppingCart,
  Tag,
  Repeat,
  Briefcase,
  Home,
  Search,
  Building,
  Wrench,
  Truck,
  Lightbulb,
  Users,
  Info,
  PlusCircle,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Mail
} from "lucide-react";

export default function SidebarNav() {
  const pathname = usePathname();

  const sections = [
    {
      title: "Portal",
      items: [
        { name: "Forum / Bazar", href: "/annonser", icon: <Box size={14} /> },
        { name: "Senaste Nyheterna", href: "/nyheter", icon: <Newspaper size={14} /> },
        { name: "Event", href: "/evenemang", icon: <Calendar size={14} /> },
      ]
    },
    {
      title: "Marketplace",
      href: "/marketplace",
      items: [
        { name: "Köp / Acceptera", href: "/marketplace/kop", icon: <ShoppingCart size={14} /> },
        { name: "Sälj / Bortskänkes", href: "/marketplace/salj", icon: <Tag size={14} /> },
        { name: "Bytes", href: "/marketplace/bytes", icon: <Repeat size={14} /> },
      ]
    },
    {
      title: "Jobb & Bostad",
      href: "/bostad",
      items: [
        { name: "Leta jobb", href: "/jobb", icon: <Briefcase size={14} /> },
        { name: "Lägenhet sökes", href: "/bostad/sokes", icon: <Search size={14} /> },
        { name: "Lägenheter Hyra ut", href: "/bostad/uthyres", icon: <Home size={14} /> },
        { name: "Lokaler", href: "/bostad/lokaler", icon: <Building size={14} /> },
      ]
    },
    {
      title: "Tjänster & Transport",
      items: [
        { name: "Tjänster", href: "/tjanster", icon: <Wrench size={14} /> },
        { name: "Transport", href: "/transport", icon: <Truck size={14} /> },
      ]
    },
    {
      title: "Community",
      href: "/community",
      items: [
        { name: "Tips & Trick", href: "/tips", icon: <Lightbulb size={14} /> },
        { name: "Meeting Place", href: "/meeting-place", icon: <Users size={14} /> },
      ]
    },
    {
      title: "Information",
      items: [
        { name: "Institutioner", href: "/institutioner", icon: <Info size={14} /> },
        { name: "Om oss", href: "/om-oss", icon: <Users size={14} /> },
      ]
    }
  ];

  const footerLinks = [
    { name: "Villkor", href: "/villkor", icon: <ShieldCheck size={12} /> },
    { name: "Frågor & Svar", href: "/faq", icon: <HelpCircle size={12} /> },
    { name: "Kontakt", href: "/om-oss", icon: <Mail size={12} /> },
  ];

  return (
    <aside className="space-y-2">
      {/* Sidebar Header */}
      <section className="bg-white shadow-sm overflow-hidden border border-zinc-200 rounded-sm">
        <div className="bg-[#a11a2d] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">Sido meny</div>
      </section>

      {/* Navigation Sections */}
      {sections.map((section) => (
        <section key={section.title} className="bg-white border border-zinc-200 shadow-sm relative overflow-hidden rounded-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#003366]"></div>
          <div className="p-2">
            {section.href ? (
                <Link href={section.href} className="block group/title">
                    <h4 className="text-[8px] font-black uppercase text-zinc-400 mb-1 tracking-[0.2em] group-hover/title:text-[#a11a2d] transition-colors flex justify-between items-center">
                        {section.title}
                        <ChevronRight size={8} className="opacity-0 group-hover/title:opacity-100" />
                    </h4>
                </Link>
            ) : (
                <h4 className="text-[8px] font-black uppercase text-zinc-400 mb-1 tracking-[0.2em]">{section.title}</h4>
            )}
            <nav className="flex flex-col space-y-0">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between py-1 px-1 rounded-sm transition-all group ${
                      isActive
                        ? "bg-zinc-50 text-[#a11a2d]"
                        : "text-[#003366] hover:bg-zinc-50 hover:text-[#a11a2d]"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-[10px] font-bold">
                      <span className={isActive ? "text-[#a11a2d]" : "text-[#003366] opacity-70 group-hover:opacity-100"}>
                        {item.icon}
                      </span>
                      {item.name}
                    </div>
                    <ChevronRight size={10} className={`transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />
                  </Link>
                );
              })}
            </nav>
          </div>
        </section>
      ))}

      {/* Action Button at bottom */}
      <section className="px-3 pt-4">
        <Link
          href="/skapa-annons"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#003366] hover:bg-[#a11a2d] text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-2xl active:scale-95"
        >
          <PlusCircle size={15} /> Lägg annons
        </Link>
      </section>
    </aside>
  );
}
