import { useEffect, useState } from "react";

interface Balloon {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  popped: boolean;
  vx: number;
}

const COLORS = [
  "#ff4488",
  "#44aaff",
  "#44ff88",
  "#ffcc00",
  "#ff8844",
  "#cc44ff",
];

export default function BalloonBurst() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;
    const spawn = setInterval(() => {
      setBalloons((bs) => [
        ...bs.slice(-15),
        {
          id: Date.now() + Math.random(),
          x: 10 + Math.random() * 80,
          y: 110,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 30 + Math.random() * 30,
          popped: false,
          vx: (Math.random() - 0.5) * 2,
        },
      ]);
    }, 500);
    const timer = setInterval(
      () =>
        setTimeLeft((t) => {
          if (t <= 1) {
            setGameOver(true);
            return 0;
          }
          return t - 1;
        }),
      1000,
    );
    const float = setInterval(() => {
      setBalloons((bs) =>
        bs
          .map((b) => ({
            ...b,
            y: b.y - 1.5,
            x: Math.max(2, Math.min(95, b.x + b.vx)),
          }))
          .filter((b) => b.y > -20),
      );
    }, 30);
    return () => {
      clearInterval(spawn);
      clearInterval(timer);
      clearInterval(float);
    };
  }, [gameOver]);

  function pop(id: number, pts: number) {
    if (gameOver) return;
    setBalloons((bs) => bs.filter((b) => b.id !== id));
    setScore((s) => s + pts);
  }

  function reset() {
    setBalloons([]);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-yellow-400">Score: {score}</span>
        <span className="text-cyan-400">Time: {timeLeft}s</span>
      </div>
      <div
        className="relative w-80 h-96 overflow-hidden rounded-xl"
        style={{
          background: "linear-gradient(180deg, #050a20 0%, #0a1530 100%)",
          border: "1px solid rgba(100,150,255,0.3)",
        }}
      >
        {/* Ground */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8"
          style={{ background: "#0a1a0a", borderTop: "1px solid #00ff8840" }}
        />
        {balloons.map((b) => (
          <button
            type="button"
            key={b.id}
            onClick={() => pop(b.id, Math.round((100 / b.size) * 20))}
            className="absolute cursor-pointer select-none transition-transform hover:scale-110 border-0 bg-transparent p-0"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              transform: "translateX(-50%)",
              userSelect: "none",
            }}
          >
            <div className="flex flex-col items-center">
              <div
                style={{
                  width: b.size,
                  height: b.size * 1.2,
                  background: b.color,
                  borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                  boxShadow: `0 0 12px ${b.color}80`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "15%",
                    left: "20%",
                    width: "25%",
                    height: "25%",
                    background: "rgba(255,255,255,0.4)",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <div
                style={{
                  width: 1,
                  height: 20,
                  background: b.color,
                  opacity: 0.5,
                }}
              />
            </div>
          </button>
        ))}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <p className="text-2xl font-bold text-pink-400 mb-2">Time Up!</p>
            <p className="text-yellow-400 mb-4">Score: {score}</p>
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2 bg-pink-500/20 border border-pink-500 text-pink-400 rounded"
            >
              Restart
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-white/40">
        Click balloons before they fly away!
      </p>
    </div>
  );
}
