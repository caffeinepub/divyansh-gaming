import { useEffect, useState } from "react";

const COLORS = ["#ff4466", "#00ffcc", "#ffd700", "#aa44ff"];

export default function PatternMemory() {
  const [phase, setPhase] = useState<
    "idle" | "show" | "input" | "win" | "fail"
  >("idle");
  const [pattern, setPattern] = useState<number[]>([]);
  const [userSeq, setUserSeq] = useState<number[]>([]);
  const [active, setActive] = useState(-1);
  const [level, setLevel] = useState(1);

  function startRound(lvl: number) {
    const seq = Array.from({ length: lvl + 2 }, () =>
      Math.floor(Math.random() * 4),
    );
    setPattern(seq);
    setUserSeq([]);
    setPhase("show");
    let i = 0;
    const show = () => {
      if (i < seq.length) {
        setActive(seq[i]);
        setTimeout(() => {
          setActive(-1);
          i++;
          setTimeout(show, 300);
        }, 500);
      } else setPhase("input");
    };
    setTimeout(show, 500);
  }

  function press(i: number) {
    if (phase !== "input") return;
    const next = [...userSeq, i];
    setUserSeq(next);
    setActive(i);
    setTimeout(() => setActive(-1), 200);
    if (next[next.length - 1] !== pattern[next.length - 1]) {
      setPhase("fail");
      return;
    }
    if (next.length === pattern.length) {
      setLevel((l) => l + 1);
      setPhase("win");
      setTimeout(() => startRound(level + 1), 1000);
    }
  }

  function reset() {
    setLevel(1);
    setPhase("idle");
    setPattern([]);
    setUserSeq([]);
    setActive(-1);
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="text-sm font-mono text-cyan-400">
        Level {level} | Pattern length: {pattern.length || level + 2}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {COLORS.map((c, i) => (
          <button
            type="button"
            // biome-ignore lint/suspicious/noArrayIndexKey: game array
            key={`color-${i}`}
            onClick={() => press(i)}
            className="w-28 h-28 rounded-xl transition-all duration-150"
            style={{
              background: active === i ? c : `${c}40`,
              border: `2px solid ${c}`,
              boxShadow: active === i ? `0 0 30px ${c}` : "none",
              cursor: phase === "input" ? "pointer" : "default",
            }}
          />
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
        <p className="text-yellow-400 font-bold">Watch the pattern...</p>
      )}
      {phase === "input" && (
        <p className="text-green-400 font-bold">
          Repeat it! {userSeq.length}/{pattern.length}
        </p>
      )}
      {phase === "win" && (
        <p className="text-green-400 font-bold text-xl">
          ✅ Correct! Next level...
        </p>
      )}
      {phase === "fail" && (
        <div className="text-center">
          <p className="text-red-400 font-bold text-xl mb-2">
            ❌ Wrong! Level {level - 1}
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
