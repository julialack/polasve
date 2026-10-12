import Link from "next/link";

interface AdBoxProps {
  title: string;
  variant?: "blue" | "gold";
  href?: string;
}

export default function AdBox({ title, variant = "blue", href = "/reklam" }: AdBoxProps) {
  const isGold = variant === "gold";

  return (
    <Link
      href={href}
      className={`block p-4 rounded-sm border shadow-sm transition-all text-center group hover:scale-[1.02] ${
        isGold
          ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-amber-400"
          : "bg-gradient-to-r from-[#003366] to-blue-900 text-white border-blue-800"
      }`}
    >
      <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-1">
        {isGold ? "⭐ Reklama Premium" : "📢 Reklama"}
      </p>
      <h4 className="font-black italic uppercase text-xs tracking-tight group-hover:underline">
        {title}
      </h4>
    </Link>
  );
}
