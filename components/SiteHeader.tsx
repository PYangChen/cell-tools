"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOOLS } from "./tools";

export function CellLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx={16} cy={16} r={14} fill="#10b981" fillOpacity={0.25} stroke="#34d399" strokeWidth={2} />
      <circle cx={13} cy={14} r={6} fill="#34d399" />
      <circle cx={22} cy={21} r={2.5} fill="#a7f3d0" />
      <circle cx={9} cy={23} r={1.8} fill="#a7f3d0" />
    </svg>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <CellLogo />
          <span className="hidden sm:inline">細胞的小工具箱</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {TOOLS.map((t) => {
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 transition ${
                  active
                    ? "bg-emerald-400/20 text-emerald-300"
                    : "opacity-70 hover:bg-white/10 hover:opacity-100"
                }`}
              >
                {t.short}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
