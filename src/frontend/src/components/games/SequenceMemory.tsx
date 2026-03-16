import { useEffect, useState } from "react";

const COLORS = [
  "#ff4466",
  "#00ffcc",
  "#ffd700",
  "#aa44ff",
  "#ff8800",
  "#00aaff",
];
const LABELS = ["RED", "CYAN", "GOLD", "PURPLE", "ORANGE", "BLUE"];

export default function SequenceMemory() {
  const [phase, setPhase] = useState<
    "idle" | "show" | "input" | "win" | "fail"
  >("idle");
  const [seq, setSeq] = useState<number[]>([]);
  const [userSeq, setUserSeq] = useState<number[]>([]);
  const [active, setActive] = useState(-1);
  const [round, setRound] = useState(1);
  const [highScore, setHighScore] = useState(0);

  function startRound(r: number) {
    const newSeq = [
      ...seq.slice(0, r - 1),
      Math.floor(Math.random() * COLORS.length),
    ];
    setSeq(newSeq);
    setUserSeq([]);
    setPhase("show");
    let i = 0;
    const play = () => {
      if (i < newSeq.length) {
        setActive(newSeq[i]);
        setTimeout(() => {
          setActive(-1);
          i++;
          setTimeout(play, 400);
        }, 600);
      } else setTimeout(() => setPhase("input"), 300);
    };
    setTimeout(play, 600);
  }

  function press(i: number) {
    if (phase !== "input") return;
    const next = [...userSeq, i];
    setUserSeq(next);
    setActive(i);
    setTimeout(() => setActive(-1), 200);
    if (next[next.length - 1] !== seq[next.length - 1]) {
      setPhase("fail");
      setHighScore((h) => Math.max(h, round - 1));
      return;
    }
    if (next.length === seq.length) {
      setPhase("win");
      setTimeout(() => {
        const r = round + 1;
        setRound(r);
        startRound(r);
      }, 800);
    }
  }

  function reset() {
    setPhase("idle");
    setSeq([]);
    setUserSeq([]);
    setActive(-1);
    setRound(1);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-2">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-cyan-400">Round: {round}</span>
        <span className="text-yellow-400">Best: {highScore}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {COLORS.map((c, i) => (
          <button
            type="button"
            // biome-ignore lint/suspicious/noArrayIndexKey: game array
            key={i}
            onClick={() => press(i)}
            className="w-20 h-20 rounded-lg font-bold text-xs transition-all duration-100"
            style={{
              background: active === i ? c : `${c}30`,
              border: `2px solid ${c}`,
              boxShadow: active === i ? `0 0 24px ${c}` : "none",
              color: c,
              cursor: phase === "input" ? "pointer" : "default",
            }}
          >
            {LABELS[i]}
          </button>
        ))}
      </div>
      {phase === "idle" && (
        <button
          type="button"
          onClick={() => startRound(1)}
          className="px-6 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded font-bold"
        >
          Start
        </button>
      )}
      {phase === "show" && (
        <p className="text-yellow-400 animate-pulse">Watch the sequence...</p>
      )}
      {phase === "input" && (
        <p className="text-green-400">
          Repeat: {userSeq.length}/{seq.length}
        </p>
      )}
      {phase === "win" && (
        <p className="text-green-400 font-bold">✅ Next round!</p>
      )}
      {phase === "fail" && (
        <div className="text-center">
          <p className="text-red-400 font-bold text-xl mb-2">
            ❌ Wrong! Score: {round - 1}
          </p>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
