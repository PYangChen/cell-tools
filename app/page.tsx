import Link from "next/link";

const FEATURES = [
  { title: "免註冊", text: "打開就能用，不用登入、不用安裝。" },
  { title: "隱私安心", text: "名單與結果都只留在你的瀏覽器。" },
  { title: "手機電腦都順", text: "版面自動調整，隨時隨地開工。" },
];

function WheelArt() {
  return (
    <div className="relative grid h-28 w-28 place-items-center rounded-full bg-fuchsia-600 p-2 shadow-lg shadow-fuchsia-900/50 transition duration-700 group-hover:rotate-[200deg]">
      <div
        className="h-full w-full rounded-full border-2 border-white"
        style={{
          background:
            "conic-gradient(#f7931e 0 60deg,#1aa34a 60deg 120deg,#9b2a9b 120deg 180deg,#1e90e0 180deg 240deg,#ffd400 240deg 300deg,#e8232a 300deg 360deg)",
        }}
      />
      <div className="absolute h-6 w-6 rounded-full border-4 border-fuchsia-600 bg-white" />
    </div>
  );
}

function TimerArt() {
  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28" aria-hidden>
      <circle cx={60} cy={60} r={48} fill="none" stroke="#fff" strokeOpacity={0.12} strokeWidth={10} />
      <circle
        cx={60}
        cy={60}
        r={48}
        fill="none"
        stroke="#ef4444"
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={301.6}
        strokeDashoffset={95}
        transform="rotate(-90 60 60)"
        className="transition-all duration-700 group-hover:[stroke-dashoffset:200]"
      />
      <text x={60} y={62} textAnchor="middle" dominantBaseline="middle" fontSize={26} fontWeight={700} fill="#fff">
        25:00
      </text>
    </svg>
  );
}

function TubeArt() {
  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28 origin-bottom transition duration-300 group-hover:-rotate-6" aria-hidden>
      {[38, 52, 66, 80].map((x, i) => (
        <rect key={x} x={x} y={6 + (i % 2) * 8} width={8} height={50} rx={2} fill="#fde68a" transform={`rotate(${(i - 1.5) * 5} ${x + 4} 60)`} />
      ))}
      <path d="M28 52 H92 L86 112 Q60 118 34 112 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth={2} />
      <rect x={24} y={48} width={72} height={10} rx={5} fill="#dc2626" stroke="#7f1d1d" strokeWidth={2} />
      <circle cx={60} cy={84} r={16} fill="#fde68a" />
      <text x={60} y={85} textAnchor="middle" dominantBaseline="middle" fontSize={18} fontWeight={800} fill="#b91c1c">
        籤
      </text>
    </svg>
  );
}

const CARDS = [
  {
    href: "/lottery",
    title: "幸運轉盤",
    desc: "輸入名單，轉動霓虹轉盤，公平隨機抽出幸運兒。聚會、抽獎、分組都好用。",
    tag: "抽獎",
    glow: "hover:border-fuchsia-400/60 hover:shadow-fuchsia-500/20",
    art: <WheelArt />,
  },
  {
    href: "/pomodoro",
    title: "蕃茄鐘",
    desc: "25 分鐘專注、5 分鐘休息，自動輪替並記錄完成的蕃茄，幫你守住專注力。",
    tag: "專注",
    glow: "hover:border-red-400/60 hover:shadow-red-500/20",
    art: <TimerArt />,
  },
  {
    href: "/fortune",
    title: "好運抽籤",
    desc: "搖一搖籤筒，從大吉到大凶，看看今天的運勢與幸運色、幸運數字。",
    tag: "運勢",
    glow: "hover:border-amber-400/60 hover:shadow-amber-500/20",
    art: <TubeArt />,
  },
];

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* background cells */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold text-emerald-300">
          3 個免費小工具 · 開啟即用
        </span>
        <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-7xl">
          <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent">
            細胞的小工具箱
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-balance text-lg opacity-75">
          抽獎、專注、問運勢——把生活中常用的小事，收進一個乾淨好用的工具箱。
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="#tools"
            className="rounded-full bg-emerald-400 px-8 py-3 font-bold text-black transition hover:bg-emerald-300"
          >
            開始使用
          </a>
          <Link
            href="/fortune"
            className="rounded-full border border-white/20 px-8 py-3 font-semibold transition hover:bg-white/10"
          >
            先抽支籤 🎋
          </Link>
        </div>
      </section>

      <section id="tools" className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 pb-16 sm:px-6">
        <h2 className="mb-8 text-center text-2xl font-bold">選一個工具</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {CARDS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={`group flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-xl backdrop-blur transition duration-300 hover:-translate-y-1 ${c.glow}`}
            >
              <div className="grid h-40 place-items-center">{c.art}</div>
              <span className="mt-2 rounded-full bg-white/10 px-3 py-0.5 text-xs opacity-80">
                {c.tag}
              </span>
              <h3 className="mt-3 text-xl font-bold">{c.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed opacity-70">
                {c.desc}
              </p>
              <span className="mt-5 text-sm font-semibold text-emerald-300 transition group-hover:translate-x-1">
                立即使用 →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
        <ul className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <li key={f.title} className="rounded-2xl border border-white/10 p-5">
              <p className="font-bold text-emerald-300">{f.title}</p>
              <p className="mt-1 text-sm opacity-70">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
