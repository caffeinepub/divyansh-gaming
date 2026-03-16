import { useEffect, useState } from "react";

function isSolvable(tiles: number[]) {
  let inv = 0;
  const t = tiles.filter((x) => x !== 0);
  for (let i = 0; i < t.length; i++)
    for (let j = i + 1; j < t.length; j++) if (t[i] > t[j]) inv++;
  return inv % 2 === 0;
}

function shuffle(): number[] {
  let t: number[];
  do {
    t = [...Array(15).keys()].map((x) => x + 1);
    t.push(0);
    for (let i = t.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [t[i], t[j]] = [t[j], t[i]];
    }
  } while (!isSolvable(t));
  return t;
}

export default function NumberPuzzle() {
  const [tiles, setTiles] = useState(shuffle);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (tiles.every((v, i) => v === (i < 15 ? i + 1 : 0))) setWon(true);
  }, [tiles]);

  function click(i: number) {
    if (won) return;
    const zero = tiles.indexOf(0);
    const neighbors = [zero - 1, zero + 1, zero - 4, zero + 4];
    const valid = neighbors.filter(
      (n) =>
        (n >= 0 &&
          n < 16 &&
          Math.abs((n % 4) - (zero % 4)) <= 1 &&
          Math.floor(n / 4) === Math.floor(zero / 4)) ||
        ((n === zero - 4 || n === zero + 4) && n >= 0 && n < 16),
    );
    if (valid.includes(i)) {
      const newTiles = [...tiles];
      [newTiles[i], newTiles[zero]] = [newTiles[zero], newTiles[i]];
      setTiles(newTiles);
      setMoves((m) => m + 1);
    }
  }

  function canMove(i: number) {
    const zero = tiles.indexOf(0);
    if (i === zero - 1 && zero % 4 !== 0) return true;
    if (i === zero + 1 && zero % 4 !== 3) return true;
    if (i === zero - 4 && zero >= 4) return true;
    if (i === zero + 4 && zero < 12) return true;
    return false;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-yellow-400">Moves: {moves}</span>
        {won && <span className="text-green-400 font-bold">✅ SOLVED!</span>}
      </div>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: "repeat(4, 64px)" }}
      >
        {tiles.map((v, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: game array
            key={`tile-${i}`}
            onClick={() => click(i)}
            onKeyDown={(e) => e.key === "Enter" && click(i)}
            className="w-16 h-16 flex items-center justify-center text-xl font-bold rounded transition-all"
            style={{
              background:
                v === 0
                  ? "transparent"
                  : canMove(i)
                    ? "rgba(0,255,200,0.2)"
                    : "rgba(100,100,200,0.3)",
              border:
                v === 0
                  ? "none"
                  : `1px solid ${canMove(i) ? "#00ffcc" : "#4444aa"}`,
              color: canMove(i) ? "#00ffcc" : "#aaaaff",
              cursor: canMove(i) ? "pointer" : "default",
              transform: canMove(i) ? "scale(1.05)" : "scale(1)",
            }}
          >
            {v || ""}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          setTiles(shuffle());
          setMoves(0);
          setWon(false);
        }}
        className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded text-sm"
      >
        Shuffle
      </button>
    </div>
  );
}
