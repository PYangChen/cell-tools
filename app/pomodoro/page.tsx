"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "focus" | "short" | "long";

const MODES: Record<Mode, { label: string; color: string }> = {
  focus: { label: "專注", color: "#ef4444" },
  short: { label: "短休息", color: "#22c55e" },
  long: { label: "長休息", color: "#3b82f6" },
};
const DEFAULT_MINUTES: Record<Mode, number> = { focus: 25, short: 5, long: 15 };
const LONG_BREAK_EVERY = 4;
const RING_R = 130;
const RING_LEN = 2 * Math.PI * RING_R;

function format(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function beep() {
  try {
    const ctx = new AudioContext();
    [0, 0.25, 0.5].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.2, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.2);
    });
  } catch {
    // audio unavailable; the title and ring still show the state
  }
}

export default function PomodoroPage() {
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES);
  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(DEFAULT_MINUTES.focus * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const endAt = useRef(0);

  const total = minutes[mode] * 60;
  const { color } = MODES[mode];

  function switchMode(next: Mode, mins = minutes) {
    setMode(next);
    setRunning(false);
    setRemaining(mins[next] * 60);
  }

  function toggle() {
    if (!running) endAt.current = Date.now() + remaining * 1000;
    setRunning(!running);
  }

  function changeMinutes(m: Mode, value: number) {
    const next = { ...minutes, [m]: Math.min(Math.max(value || 1, 1), 180) };
    setMinutes(next);
    if (m === mode && !running) setRemaining(next[m] * 60);
  }

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setRemaining(left);
      if (left > 0) return;
      beep();
      setRunning(false);
      if (mode === "focus") {
        const count = done + 1;
        setDone(count);
        switchMode(count % LONG_BREAK_EVERY === 0 ? "long" : "short");
      } else {
        switchMode("focus");
      }
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode, done]);

  useEffect(() => {
    const prev = document.title;
    document.title = `${format(remaining)} · ${MODES[mode].label}`;
    return () => {
      document.title = prev;
    };
  }, [remaining, mode]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-8 p-6 py-12">
      <h1 className="text-2xl font-bold">蕃茄鐘</h1>

      <div className="flex gap-2 rounded-full bg-zinc-200 p-1 dark:bg-zinc-800">
        {(Object.keys(MODES) as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              m === mode ? "text-white" : "opacity-70 hover:opacity-100"
            }`}
            style={m === mode ? { backgroundColor: MODES[m].color } : undefined}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      <div className="relative w-72">
        <svg viewBox="0 0 300 300" className="-rotate-90">
          <circle
            cx={150}
            cy={150}
            r={RING_R}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={14}
          />
          <circle
            cx={150}
            cy={150}
            r={RING_R}
            fill="none"
            stroke={color}
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={RING_LEN}
            strokeDashoffset={RING_LEN * (1 - remaining / total)}
            style={{ transition: "stroke-dashoffset 0.3s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-6xl font-bold tabular-nums">
            {format(remaining)}
          </span>
          <span className="mt-1 text-sm opacity-70">{MODES[mode].label}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={toggle}
          className="rounded-full px-10 py-3 text-lg font-bold text-white transition hover:brightness-110"
          style={{ backgroundColor: color }}
        >
          {running ? "暫停" : remaining < total ? "繼續" : "開始"}
        </button>
        <button
          onClick={() => switchMode(mode)}
          className="rounded-full border border-zinc-400 px-6 py-3 text-lg transition hover:bg-zinc-500/10"
        >
          重設
        </button>
      </div>

      <p className="text-sm opacity-70">
        今天已完成 {done} 個蕃茄 {"🍅".repeat(Math.min(done, 12))}
      </p>

      <details className="w-full rounded-lg border border-zinc-300 p-4 dark:border-zinc-700">
        <summary className="cursor-pointer text-sm font-semibold">
          時間設定（分鐘）
        </summary>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {(Object.keys(MODES) as Mode[]).map((m) => (
            <label key={m} className="flex flex-col gap-1 text-sm">
              {MODES[m].label}
              <input
                type="number"
                min={1}
                max={180}
                value={minutes[m]}
                disabled={running}
                onChange={(e) => changeMinutes(m, Number(e.target.value))}
                className="rounded border border-zinc-300 bg-transparent p-2 dark:border-zinc-700"
              />
            </label>
          ))}
        </div>
      </details>
    </main>
  );
}
