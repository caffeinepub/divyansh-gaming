import { useState } from "react";

const ZONES = [
  { id: "tl", label: "Top Left", x: "10%", y: "5%" },
  { id: "tm", label: "Top Mid", x: "40%", y: "5%" },
  { id: "tr", label: "Top Right", x: "70%", y: "5%" },
  { id: "ml", label: "Mid Left", x: "10%", y: "40%" },
  { id: "mr", label: "Mid Right", x: "70%", y: "40%" },
  { id: "bl", label: "Bot Left", x: "10%", y: "75%" },
  { id: "bm", label: "Bot Mid", x: "40%", y: "75%" },
  { id: "br", label: "Bot Right", x: "70%", y: "75%" },
];

export default function SoccerPenalty() {
  const [score, setScore] = useState(0);
  const [kicks, setKicks] = useState(5);
  const [goalkeeperPos, setGoalkeeperPos] = useState("ml");
  const [result, setResult] = useState("");
  const [phase, setPhase] = useState<"aim" | "result" | "gameover">("aim");

  function shoot(zoneId: string) {
    if (phase !== "aim") return;
    const gk = ZONES[Math.floor(Math.random() * ZONES.length)];
    setGoalkeeperPos(gk.id);
    const saved = gk.id === zoneId;
    const newScore = saved ? score : score + 1;
    const newKicks = kicks - 1;
    setScore(newScore);
    setKicks(newKicks);
    setResult(saved ? "⛔ SAVED!" : "⚽ GOAL!");
    setPhase(newKicks <= 0 ? "gameover" : "result");
    setTimeout(() => {
      if (newKicks > 0) setPhase("aim");
    }, 1200);
  }

  function reset() {
    setScore(0);
    setKicks(5);
    setResult("");
    setPhase("aim");
    setGoalkeeperPos("ml");
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-yellow-400">Goals: {score}</span>
        <span className="text-cyan-400">Kicks left: {kicks}</span>
      </div>
      <div
        className="relative w-80 h-56 rounded-lg overflow-hidden"
        style={{ background: "#1a4a1a", border: "2px solid #00ff88" }}
      >
        {/* Goal */}
        <div
          className="absolute"
          style={{
            top: "5%",
            left: "15%",
            width: "70%",
            height: "80%",
            border: "3px solid white",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        {/* Zones */}
        {ZONES.map((z) => (
          <button
            type="button"
            key={z.id}
            onClick={() => shoot(z.id)}
            className="absolute w-14 h-10 rounded transition-all"
            style={{
              left: z.x,
              top: z.y,
              background:
                phase === "aim" ? "rgba(255,255,0,0.15)" : "transparent",
              border:
                phase === "aim" ? "1px solid rgba(255,255,0,0.4)" : "none",
              cursor: phase === "aim" ? "crosshair" : "default",
            }}
          />
        ))}
        {/* Goalkeeper */}
        <div
          className="absolute flex items-center justify-center text-2xl transition-all duration-300"
          style={{
            left: ZONES.find((z) => z.id === goalkeeperPos)?.x ?? "40%",
            top: ZONES.find((z) => z.id === goalkeeperPos)?.y ?? "40%",
            transform: "translate(-50%,-50%)",
          }}
        >
          🧤
        </div>
        {result && (
          <div
            className="absolute inset-0 flex items-center justify-center text-3xl font-bold"
            style={{ color: result.includes("GOAL") ? "#00ff88" : "#ff4466" }}
          >
            {result}
          </div>
        )}
      </div>
      {phase === "gameover" ? (
        <div className="text-center">
          <p className="text-yellow-400 text-xl font-bold mb-2">
            Goals: {score} / 5
          </p>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-400 rounded"
          >
            Replay
          </button>
        </div>
      ) : (
        <p className="text-xs text-white/40">
          Click a zone to shoot the penalty!
        </p>
      )}
    </div>
  );
}
