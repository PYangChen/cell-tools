import Link from "next/link";
import { CellLogo } from "./SiteHeader";
import { TOOLS } from "./tools";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <CellLogo className="h-6 w-6" />
          <div>
            <p className="text-sm font-semibold">細胞的小工具箱</p>
            <p className="text-xs opacity-60">小小工具，讓每天順手一點。</p>
          </div>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm opacity-80">
          {TOOLS.map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="hover:text-emerald-300">
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <p className="border-t border-white/5 py-4 text-center text-xs opacity-50">
        © 細胞的小工具箱 · 所有資料只在你的瀏覽器中運作
      </p>
    </footer>
  );
}
