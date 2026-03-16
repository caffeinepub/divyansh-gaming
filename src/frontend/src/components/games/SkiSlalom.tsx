import { useEffect, useRef, useState } from "react";

export default function SkiSlalom() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const [display, setDisplay] = useState({
    score: 0,
    gates: 0,
    gameOver: false,
  });

  function initState() {
    stateRef.current = {
      skier: { x: 200, vx: 0 },
      gates: [] as { x: number; y: number; passed: boolean }[],
      score: 0,
      gateCount: 0,
      gameOver: false,
      frame: 0,
      raf: 0,
      speed: 2.5,
      keys: {} as Record<string, boolean>,
    };
    setDisplay({ score: 0, gates: 0, gameOver: false });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: game init on mount
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    initState();
    const s = stateRef.current;
    const onKey = (e: KeyboardEvent, d: boolean) => {
      s.keys[e.key] = d;
      e.preventDefault();
    };
    window.addEventListener("keydown", (e) => onKey(e, true));
    window.addEventListener("keyup", (e) => onKey(e, false));

    function loop() {
      s.raf = requestAnimationFrame(loop);
      if (s.gameOver) return;
      s.frame++;
      s.score = Math.floor(s.frame / 5);

      if (s.keys.ArrowLeft) s.skier.vx -= 0.4;
      if (s.keys.ArrowRight) s.skier.vx += 0.4;
      s.skier.vx *= 0.85;
      s.skier.x += s.skier.vx;
      s.skier.x = Math.max(20, Math.min(380, s.skier.x));

      // Spawn gates
      if (s.frame % 80 === 0) {
        const gx = 60 + Math.random() * 280;
        s.gates.push({ x: gx, y: -20, passed: false });
      }
      for (const g of s.gates) g.y += s.speed;
      s.speed = Math.min(6, 2.5 + s.score * 0.002);

      for (const g of s.gates) {
        if (!g.passed && g.y > 340 && g.y < 400) {
          if (s.skier.x > g.x - 35 && s.skier.x < g.x + 35) {
            g.passed = true;
            s.gateCount++;
          } else if (g.y > 370) {
            s.gameOver = true;
            setDisplay({ score: s.score, gates: s.gateCount, gameOver: true });
            return;
          }
        }
      }
      s.gates = s.gates.filter((g) => g.y < 430);
      setDisplay({ score: s.score, gates: s.gateCount, gameOver: false });

      ctx.fillStyle = "#e8f4ff";
      ctx.fillRect(0, 0, 400, 400);
      // Snow texture
      ctx.fillStyle = "#f0f8ff";
      for (let i = 0; i < 8; i++)
        ctx.fillRect((i * 50 + s.frame) % 400, 0, 2, 400);
      // Gates
      for (const g of s.gates) {
        ctx.fillStyle = g.passed ? "#00aa00" : "#ff0000";
        ctx.fillRect(g.x - 35, g.y - 3, 24, 10);
        ctx.fillRect(g.x + 11, g.y - 3, 24, 10);
        // Poles
        ctx.fillStyle = "#888";
        ctx.fillRect(g.x - 37, g.y - 20, 4, 30);
        ctx.fillRect(g.x + 33, g.y - 20, 4, 30);
      }
      // Skier
      ctx.fillStyle = "#003399";
      ctx.fillRect(s.skier.x - 8, 330, 16, 22);
      ctx.fillStyle = "#ff8800";
      ctx.beginPath();
      ctx.arc(s.skier.x, 327, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    loop();
    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener("keydown", (e) => onKey(e, true));
      window.removeEventListener("keyup", (e) => onKey(e, false));
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-yellow-800">Score: {display.score}</span>
        <span className="text-blue-600">Gates: {display.gates}</span>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded border border-blue-300"
        />
        {display.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded">
            <p className="text-2xl font-bold text-blue-400 mb-2">
              MISSED GATE!
            </p>
            <p className="text-yellow-400 mb-4">
              Gates: {display.gates} | Score: {display.score}
            </p>
            <button
              type="button"
              onClick={() => {
                initState();
              }}
              className="px-4 py-2 bg-blue-500/20 border border-blue-500 text-blue-400 rounded"
            >
              Restart
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-white/40">← → steer skier through red gates</p>
    </div>
  );
}
