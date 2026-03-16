import { useState } from "react";

const PUZZLES = [
  {
    puzzle: [1, 0, 3, 4, 0, 4, 0, 0, 3, 0, 0, 2, 0, 0, 4, 0],
    solution: [1, 2, 3, 4, 2, 4, 1, 3, 3, 1, 4, 2, 4, 3, 2, 1],
  },
  {
    puzzle: [0, 2, 0, 4, 4, 0, 2, 0, 0, 4, 0, 2, 2, 0, 4, 0],
    solution: [1, 2, 3, 4, 4, 3, 2, 1, 3, 4, 1, 2, 2, 1, 4, 3],
  },
];

export default function SudokuMini() {
  const [pIdx, setPIdx] = useState(0);
  const [cells, setCells] = useState<number[]>([...PUZZLES[0].puzzle]);
  const [errors, setErrors] = useState<boolean[]>(Array(16).fill(false));
  const [solved, setSolved] = useState(false);

  function handleChange(i: number, val: string) {
    if (PUZZLES[pIdx].puzzle[i] !== 0) return;
    const n = Number.parseInt(val) || 0;
    if (n < 0 || n > 4) return;
    const newCells = [...cells];
    newCells[i] = n;
    setCells(newCells);
    const newErrors = newCells.map(
      (v, idx) => v !== 0 && v !== PUZZLES[pIdx].solution[idx],
    );
    setErrors(newErrors);
    if (newCells.every((v, idx) => v === PUZZLES[pIdx].solution[idx]))
      setSolved(true);
  }

  function reset() {
    const next = (pIdx + 1) % PUZZLES.length;
    setPIdx(next);
    setCells([...PUZZLES[next].puzzle]);
    setErrors(Array(16).fill(false));
    setSolved(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-cyan-400 font-bold">4×4 Mini Sudoku</h3>
      <p className="text-xs text-white/40">
        Fill with 1–4, no repeats in row/col/box
      </p>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: "repeat(4,1fr)" }}
      >
        {cells.map((v, i) => (
          <input
            // biome-ignore lint/suspicious/noArrayIndexKey: game array
            key={i}
            type="number"
            min={1}
            max={4}
            value={v === 0 ? "" : v}
            onChange={(e) => handleChange(i, e.target.value)}
            readOnly={PUZZLES[pIdx].puzzle[i] !== 0}
            className="w-12 h-12 text-center text-lg font-bold rounded"
            style={{
              background:
                PUZZLES[pIdx].puzzle[i] !== 0
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(0,200,255,0.08)",
              border: errors[i]
                ? "2px solid #ff4466"
                : i % 2 === Math.floor(i / 4) % 2
                  ? "1px solid #ffffff30"
                  : "1px solid #ffffff20",
              color: errors[i]
                ? "#ff4466"
                : PUZZLES[pIdx].puzzle[i] !== 0
                  ? "#ffffff"
                  : "#00ffcc",
              outline: "none",
              appearance: "textfield" as any,
            }}
          />
        ))}
      </div>
      {solved && (
        <div className="text-green-400 font-bold text-xl">✅ Solved!</div>
      )}
      <button
        type="button"
        onClick={reset}
        className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded text-sm"
      >
        {solved ? "Next Puzzle" : "Reset"}
      </button>
    </div>
  );
}
