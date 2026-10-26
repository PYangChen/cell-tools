"use client";

import { useEffect, useRef, useState } from "react";

type Level = {
  name: string;
  weight: number;
  score: number; // 1-5, drives the aspect stars
  color: string;
  poem: string;
  advice: string;
};

const LEVELS: Level[] = [
  {
    name: "大吉",
    weight: 8,
    score: 5,
    color: "#f59e0b",
    poem: "春風得意馬蹄疾，一日看盡長安花。",
    advice: "今天諸事順遂，想做的事放手去做，貴人就在身邊。",
  },
  {
    name: "中吉",
    weight: 20,
    score: 4,
    color: "#fb923c",
    poem: "雲開月現照前程，守得雲開見月明。",
    advice: "努力會有回報，把握機會、主動出擊會有好結果。",
  },
  {
    name: "小吉",
    weight: 22,
    score: 4,
    color: "#facc15",
    poem: "小橋流水人家近，細雨微風草色新。",
    advice: "平穩中帶著小驚喜，踏實做事，好運會慢慢累積。",
  },
  {
    name: "吉",
    weight: 18,
    score: 3,
    color: "#4ade80",
    poem: "山重水複疑無路，柳暗花明又一村。",
    advice: "雖有小波折，但終能化解，保持耐心就好。",
  },
  {
    name: "末吉",
    weight: 14,
    score: 3,
    color: "#38bdf8",
    poem: "靜待花開時節近，莫急莫躁莫相催。",
    advice: "好運還在路上，今天宜守不宜攻，穩住步調。",
  },
  {
    name: "凶",
    weight: 12,
    score: 2,
    color: "#a78bfa",
    poem: "烏雲蔽日風雨前，謹言慎行保平安。",
    advice: "今天容易出小狀況，凡事多檢查一遍，少說多做。",
  },
  {
    name: "大凶",
    weight: 6,
    score: 1,
    color: "#ef4444",
    poem: "逆水行舟用力撐，否極泰來終有時。",
    advice: "今天宜低調、避免衝動決定。壞運到頂就會反轉，明天會更好。",
  },
];

const ASPECTS = ["事業", "感情", "財運", "健康"];
const LUCKY_COLORS = ["紅色", "橘色", "黃色", "綠色", "藍色", "紫色", "白色", "粉色"];
const SHAKE_MS = 1600;

type Result = {
  level: Level;
  no: number;
  stars: number[];
  luckyColor: string;
  luckyNumber: number;
};

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawFortune(): Result {
  const total = LEVELS.reduce((sum, l) => sum + l.weight, 0);
  let pick = Math.random() * total;
  const level = LEVELS.find((l) => (pick -= l.weight) < 0) ?? LEVELS[0];
  return {
    level,
    no: randInt(1, 100),
    stars: ASPECTS.map(() => Math.min(5, Math.max(1, level.score + randInt(-1, 1)))),
    luckyColor: LUCKY_COLORS[randInt(0, LUCKY_COLORS.length - 1)],
    luckyNumber: randInt(1, 99),
  };
}

export default function FortunePage() {
  const [shaking, setShaking] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function draw() {
    if (shaking) return;
    setResult(null);
    setShaking(true);
    timer.current = setTimeout(() => {
      setResult(drawFortune());
      setShaking(false);
    }, SHAKE_MS);
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-6 p-6 py-12">
      <h1 className="text-2xl font-bold">好運抽籤</h1>
      <p className="text-sm opacity-70">誠心默念你的問題，然後搖出今天的運勢</p>

      <div className={shaking ? "tube-shaking" : ""}>
        <svg viewBox="0 0 160 200" className="h-48 w-40" aria-hidden>
          {[40, 58, 76, 94, 112].map((x, i) => (
            <rect
              key={x}
              x={x}
              y={8 + (i % 2) * 10}
              width={10}
              height={70}
              rx={3}
              fill="#fde68a"
              stroke="#b45309"
              strokeWidth={1.5}
              transform={`rotate(${(i - 2) * 5} ${x + 5} 80)`}
            />
          ))}
          <path
            d="M32 70 H128 L120 190 Q80 200 40 190 Z"
            fill="#b91c1c"
            stroke="#7f1d1d"
            strokeWidth={3}
          />
          <rect x={28} y={64} width={104} height={14} rx={6} fill="#dc2626" stroke="#7f1d1d" strokeWidth={3} />
          <circle cx={80} cy={130} r={26} fill="#fde68a" />
          <text
            x={80}
            y={131}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={30}
            fontWeight={800}
            fill="#b91c1c"
          >
            籤
          </text>
        </svg>
      </div>

      <button
        onClick={draw}
        disabled={shaking}
        className="rounded-full bg-red-700 px-10 py-3 text-lg font-bold text-white transition enabled:hover:bg-red-800 disabled:opacity-50"
      >
        {shaking ? "搖籤中…" : result ? "再抽一次" : "開始抽籤"}
      </button>

      {result && (
        <section
          className="card-in w-full rounded-2xl border-2 bg-amber-50 p-6 text-zinc-900"
          style={{ borderColor: result.level.color }}
          aria-live="polite"
        >
          <p className="text-center text-sm text-zinc-500">第 {result.no} 籤</p>
          <p
            className="my-2 text-center text-7xl font-black"
            style={{ color: result.level.color, WebkitTextStroke: "1px #7f1d1d" }}
          >
            {result.level.name}
          </p>
          <p className="text-center text-lg font-semibold text-red-900">
            {result.level.poem}
          </p>
          <p className="mt-3 text-center text-sm text-zinc-700">
            {result.level.advice}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {ASPECTS.map((a, i) => (
              <div key={a} className="flex items-center justify-between">
                <dt>{a}</dt>
                <dd className="text-amber-500" aria-label={`${result.stars[i]} 星`}>
                  {"★".repeat(result.stars[i])}
                  <span className="text-zinc-300">
                    {"★".repeat(5 - result.stars[i])}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex justify-around border-t border-amber-200 pt-3 text-sm">
            <span>幸運色：{result.luckyColor}</span>
            <span>幸運數字：{result.luckyNumber}</span>
          </div>
        </section>
      )}

      <p className="text-xs opacity-50">僅供娛樂，祝你有美好的一天</p>
    </main>
  );
}
