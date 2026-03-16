import { useState } from "react";

export default function BowlingGame() {
  const INITIAL_PINS = Array(10).fill(true);
  const [pins, setPins] = useState([...INITIAL_PINS]);
  const [power, setPower] = useState(50);
  const [angle, setAngle] = useState(0);
  const [rolls, setRolls] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [rolling, setRolling] = useState(false);
  const [frame, setFrame] = useState(1);

  function bowl() {
    if (rolling) return;
    setRolling(true);
    setTimeout(() => {
      const hit = pins.map((p) => {
        if (!p) return false;
        const angleFactor = Math.abs(angle) < 30 ? 0.85 : 0.5;
        const chance =
          (power / 100) * angleFactor * (0.4 + Math.random() * 0.6);
        return Math.random() > chance;
      });
      const _knocked =
        hit.filter((h) => !h).length - pins.filter((p) => !p).length;
      const knocked2 = pins.filter((p, i) => p && !hit[i]).length;
      const newScore = score + knocked2 * 10;
      setScore(newScore);
      setPins(hit);
      const pinsLeft = hit.filter((p) => p).length;
      let msg = "";
      if (pinsLeft === 0 && rolls % 2 === 0) msg = "🎳 STRIKE!";
      else if (pinsLeft === 0) msg = "✨ SPARE!";
      else msg = `Knocked: ${knocked2}`;
      setMessage(msg);
      setRolls((r) => r + 1);
      const newRolls = rolls + 1;
      if (pinsLeft === 0 || newRolls % 2 === 0) {
        setTimeout(() => {
          setPins([...INITIAL_PINS]);
          setMessage("");
          setFrame((f) => f + 1);
          setRolling(false);
        }, 1200);
      } else setRolling(false);
    }, 700);
  }

  const pinPositions = [
    [{ r: 0, c: 0 }],
    [
      { r: 1, c: -0.5 },
      { r: 1, c: 0.5 },
    ],
    [
      { r: 2, c: -1 },
      { r: 2, c: 0 },
      { r: 2, c: 1 },
    ],
    [
      { r: 3, c: -1.5 },
      { r: 3, c: -0.5 },
      { r: 3, c: 0.5 },
      { r: 3, c: 1.5 },
    ],
  ].flat();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-yellow-400">Score: {score}</span>
        <span className="text-cyan-400">Frame: {frame}</span>
      </div>
      {/* Pin display */}
      <div
        className="relative w-64 h-40"
        style={{ background: "#0a1508", borderRadius: 8 }}
      >
        {pins.map((alive, i) => {
          const pos = pinPositions[i];
          const cx = 128 + pos.c * 28;
          const cy = 20 + pos.r * 28;
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: game array
              key={i}
              className="absolute w-5 h-5 rounded-full flex items-center justify-center text-xs"
              style={{
                left: cx - 10,
                top: cy - 10,
                background: alive ? "#ffffff" : "#ffffff20",
                transition: "background 0.3s",
              }}
            >
              {alive ? "" : "×"}
            </div>
          );
        })}
        {message && (
          <div
            className="absolute inset-0 flex items-center justify-center text-xl font-bold"
            style={{
              color: message.includes("STRIKE") ? "#ffd700" : "#00ff88",
            }}
          >
            {message}
          </div>
        )}
      </div>
      {/* Controls */}
      <div className="flex flex-col gap-2 w-64">
        <span className="text-xs text-white/50">Power: {power}%</span>
        <input
          type="range"
          min={10}
          max={100}
          value={power}
          onChange={(e) => setPower(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-xs text-white/50">Angle: {angle}°</span>
        <input
          type="range"
          min={-45}
          max={45}
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <button
        type="button"
        onClick={bowl}
        disabled={rolling || frame > 10}
        className="px-6 py-2 rounded font-bold transition-all"
        style={{
          background: rolling ? "#ffffff10" : "#ff880030",
          border: "1px solid #ff8800",
          color: "#ff8800",
          cursor: rolling ? "wait" : "pointer",
        }}
      >
        {rolling ? "Rolling..." : frame > 10 ? "DONE" : "🎳 Bowl!"}
      </button>
      {frame > 10 && (
        <p className="text-yellow-400 font-bold">Final Score: {score}</p>
      )}
    </div>
  );
}
