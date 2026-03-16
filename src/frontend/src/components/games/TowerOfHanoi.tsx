import { useState } from "react";

export default function TowerOfHanoi() {
  const N = 4;
  const [pegs, setPegs] = useState<number[][]>([[4, 3, 2, 1], [], []]);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  function clickPeg(p: number) {
    if (won) return;
    if (selected === null) {
      if (pegs[p].length > 0) setSelected(p);
    } else {
      if (selected === p) {
        setSelected(null);
        return;
      }
      const from = pegs[selected];
      const to = pegs[p];
      if (to.length === 0 || to[to.length - 1] > from[from.length - 1]) {
        const newPegs = pegs.map((pp) => [...pp]);
        const disk = newPegs[selected].pop()!;
        newPegs[p].push(disk);
        setPegs(newPegs);
        setMoves((m) => m + 1);
        setSelected(null);
        if (newPegs[2].length === N) setWon(true);
      } else setSelected(null);
    }
  }

  function reset() {
    setPegs([[4, 3, 2, 1], [], []]);
    setSelected(null);
    setMoves(0);
    setWon(false);
  }

  const COLORS = ["#ff4466", "#ff8800", "#ffd700", "#00ffcc"];
  const W = [80, 60, 44, 30];

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-yellow-400">Moves: {moves}</span>
        <span className="text-white/40">Min: {2 ** N - 1}</span>
        {won && <span className="text-green-400 font-bold">✅ Solved!</span>}
      </div>
      <div className="flex gap-8">
        {pegs.map((peg, pi) => {
          const pegLabel = ["from", "via", "to"][pi];
          return (
            <button
              type="button"
              key={pegLabel}
              onClick={() => clickPeg(pi)}
              className="flex flex-col-reverse items-center cursor-pointer w-24 h-40 relative"
              style={{
                background:
                  selected === pi ? "rgba(0,255,200,0.1)" : "transparent",
                border:
                  selected === pi ? "1px solid #00ffcc" : "1px solid #ffffff20",
                borderRadius: 8,
                transition: "all 0.2s",
              }}
            >
              {/* Pole */}
              <div
                className="absolute"
                style={{
                  width: 4,
                  height: "90%",
                  bottom: "5%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#555",
                  borderRadius: 2,
                }}
              />
              {peg.map((disk) => (
                <div
                  key={`disk-val-${disk}`}
                  className="relative z-10 h-6 rounded flex items-center justify-center text-xs font-bold mb-1"
                  style={{
                    width: W[N - disk] || 20,
                    background: COLORS[disk - 1] || "#888",
                    boxShadow: `0 0 8px ${COLORS[disk - 1] || "#888"}`,
                  }}
                >
                  {disk}
                </div>
              ))}
              <p className="absolute -bottom-6 text-xs text-white/40">
                {pi === 0 ? "From" : pi === 1 ? "Via" : "To"}
              </p>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-white/40 mt-4">
        Click peg to select/drop disk. Move all to right peg!
      </p>
      <button
        type="button"
        onClick={reset}
        className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded text-sm"
      >
        Reset
      </button>
    </div>
  );
}
