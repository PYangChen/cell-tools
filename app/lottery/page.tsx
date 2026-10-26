"use client";

import { useState } from "react";

// [slice fill, label color]
const COLORS: [string, string][] = [
  ["#f7931e", "#ffffff"],
  ["#1aa34a", "#ffffff"],
  ["#9b2a9b", "#ffe600"],
  ["#1e90e0", "#ffffff"],
  ["#ffd400", "#d3122b"],
  ["#f4a6b8", "#d3122b"],
  ["#e8232a", "#ffe600"],
];
const BULB_COLORS = ["#ffe600", "#ffffff", "#ff8fc7"];
const BULB_COUNT = 24;
const SPIN_MS = 5000;
const SIZE = 440;
const C = SIZE / 2;
const R = 180; // wheel radius, inside the magenta ring

function drawLot(count: number) {
  return {
    index: Math.floor(Math.random() * count),
    jitter: Math.random() - 0.5,
  };
}

function polar(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [C + radius * Math.cos(rad), C + radius * Math.sin(rad)];
}

function slicePath(i: number, step: number) {
  const [x1, y1] = polar(i * step, R);
  const [x2, y2] = polar((i + 1) * step, R);
  return `M ${C} ${C} L ${x1} ${y1} A ${R} ${R} 0 ${step > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;
}

export default function LotteryPage() {
  const [text, setText] = useState("小明\n小華\n小美\n阿強");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [removeWinner, setRemoveWinner] = useState(false);

  const names = text
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean);
  const step = 360 / Math.max(names.length, 1);

  function spin() {
    if (spinning || names.length < 2) return;
    const { index, jitter } = drawLot(names.length);
    const center = (index + 0.5) * step + jitter * step * 0.7;
    const current = ((rotation % 360) + 360) % 360;
    const delta = (((-center - current) % 360) + 360) % 360;
    setWinner(null);
    setSpinning(true);
    setRotation(rotation + 360 * 6 + delta);
    setTimeout(() => {
      setSpinning(false);
      setWinner(names[index]);
      if (removeWinner) {
        setText(names.filter((_, i) => i !== index).join("\n"));
      }
    }, SPIN_MS);
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 p-6 md:flex-row md:items-start md:p-12">
      <section className="flex flex-col gap-3 md:w-72">
        <h1 className="text-2xl font-bold">抽獎小工具</h1>
        <label htmlFor="names" className="text-sm opacity-70">
          名單（一行一個名字）
        </label>
        <textarea
          id="names"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={spinning}
          rows={10}
          className="rounded-lg border border-zinc-300 bg-transparent p-3 dark:border-zinc-700"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={removeWinner}
            onChange={(e) => setRemoveWinner(e.target.checked)}
          />
          抽中後從名單移除
        </label>
        <p className="text-sm opacity-70">共 {names.length} 人</p>
      </section>

      <section className="flex flex-1 flex-col items-center gap-6">
        <div className="w-full max-w-[460px] rounded-3xl bg-neutral-900 p-4">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className={`w-full ${spinning ? "bulbs-spinning" : ""}`}
          >
            <circle cx={C} cy={C} r={C - 2} fill="#d6197f" />
            <circle
              cx={C}
              cy={C}
              r={R + 8}
              fill="none"
              stroke="#ffd1e8"
              strokeWidth={3}
            />
            {Array.from({ length: BULB_COUNT }, (_, i) => {
              const [x, y] = polar((i * 360) / BULB_COUNT, 205);
              return (
                <circle
                  key={i}
                  className={i % 2 ? "bulb-a" : "bulb-b"}
                  cx={x}
                  cy={y}
                  r={7}
                  fill={BULB_COLORS[i % BULB_COLORS.length]}
                />
              );
            })}
            {Array.from({ length: BULB_COUNT }, (_, i) => {
              const [x, y] = polar(((i + 0.5) * 360) / BULB_COUNT, 205);
              return <circle key={i} cx={x} cy={y} r={2.5} fill="#ffe600" />;
            })}

            <g
              style={{
                transformOrigin: `${C}px ${C}px`,
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? `transform ${SPIN_MS}ms cubic-bezier(0.17, 0.67, 0.12, 1)`
                  : "none",
              }}
            >
              {names.length === 0 && (
                <circle cx={C} cy={C} r={R} fill="#52525b" />
              )}
              {names.length === 1 && (
                <circle cx={C} cy={C} r={R} fill={COLORS[0][0]} />
              )}
              {names.length > 1 &&
                names.map((_, i) => (
                  <path
                    key={i}
                    d={slicePath(i, step)}
                    fill={COLORS[i % COLORS.length][0]}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              {names.map((name, i) => {
                const mid = names.length === 1 ? 0 : (i + 0.5) * step;
                const [x, y] = polar(mid, R - 14);
                const size = names.length > 16 ? 13 : names.length > 8 ? 17 : 22;
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    transform={`rotate(${mid - 90} ${x} ${y})`}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize={size}
                    fontWeight={800}
                    fill={COLORS[i % COLORS.length][1]}
                  >
                    {name.length > 6 ? `${name.slice(0, 6)}…` : name}
                  </text>
                );
              })}
            </g>

            <circle cx={C} cy={C} r={22} fill="#ffffff" stroke="#d6197f" strokeWidth={5} />
            <circle cx={C} cy={C} r={7} fill="#d6197f" />
            <polygon
              points={`${C - 16},${C - R - 22} ${C + 16},${C - R - 22} ${C},${C - R + 12}`}
              fill="#ffe600"
              stroke="#b30000"
              strokeWidth={3}
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <button
          onClick={spin}
          disabled={spinning || names.length < 2}
          className="rounded-full bg-red-600 px-10 py-3 text-lg font-bold text-white transition enabled:hover:bg-red-700 disabled:opacity-40"
        >
          {spinning ? "抽獎中…" : "開始抽獎"}
        </button>
        {names.length < 2 && (
          <p className="text-sm opacity-70">至少需要 2 個名字才能抽獎</p>
        )}
        <p className="min-h-10 text-2xl font-bold" aria-live="polite">
          {winner && `🎉 恭喜 ${winner}！`}
        </p>
      </section>
    </main>
  );
}
