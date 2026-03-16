import { useEffect, useRef, useState } from "react";

export default function GunFight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const [display, setDisplay] = useState({
    score: 0,
    timeLeft: 30,
    gameOver: false,
  });

  function initState() {
    stateRef.current = {
      targets: [] as {
        x: number;
        y: number;
        r: number;
        alive: boolean;
        vx: number;
        vy: number;
      }[],
      score: 0,
      misses: 0,
      timeLeft: 30,
      gameOver: false,
      frame: 0,
      raf: 0,
      spawnTimer: 40,
    };
    setDisplay({ score: 0, timeLeft: 30, gameOver: false });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: game init on mount
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    initState();
    const s = stateRef.current;

    canvas.addEventListener("click", (e) => {
      if (s.gameOver) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let hit = false;
      for (const t of s.targets) {
        if (t.alive && Math.hypot(mx - t.x, my - t.y) < t.r) {
          t.alive = false;
          s.score += Math.round((30 / t.r) * 10);
          hit = true;
          break;
        }
      }
      if (!hit) s.misses++;
    });

    const timer = setInterval(() => {
      if (!s.gameOver) {
        s.timeLeft--;
        if (s.timeLeft <= 0) {
          s.gameOver = true;
          setDisplay({ score: s.score, timeLeft: 0, gameOver: true });
        } else setDisplay((d) => ({ ...d, timeLeft: s.timeLeft }));
      }
    }, 1000);

    function loop() {
      s.raf = requestAnimationFrame(loop);
      if (s.gameOver) return;
      s.frame++;
      s.spawnTimer--;
      if (s.spawnTimer <= 0) {
        const r = 10 + Math.random() * 24;
        s.targets.push({
          x: r + Math.random() * (400 - r * 2),
          y: r + Math.random() * (380 - r * 2),
          r,
          alive: true,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
        });
        s.spawnTimer = 35;
      }
      for (const t of s.targets) {
        if (!t.alive) continue;
        t.x += t.vx;
        t.y += t.vy;
        if (t.x < t.r || t.x > 400 - t.r) t.vx *= -1;
        if (t.y < t.r || t.y > 400 - t.r) t.vy *= -1;
      }
      s.targets = s.targets.filter((t: any) => t.alive || s.frame % 20 !== 0);

      ctx.fillStyle = "#080818";
      ctx.fillRect(0, 0, 400, 400);
      for (const t of s.targets) {
        if (!t.alive) continue;
        ctx.strokeStyle = "#ff4444";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "#ff8888";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#ff4444";
        ctx.beginPath();
        ctx.arc(t.x, t.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      setDisplay((d) => ({ ...d, score: s.score }));
    }
    loop();
    return () => {
      cancelAnimationFrame(s.raf);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-yellow-400">Score: {display.score}</span>
        <span className="text-cyan-400">Time: {display.timeLeft}s</span>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded border border-red-500/30 cursor-crosshair"
        />
        {display.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded">
            <p className="text-2xl font-bold text-yellow-400 mb-2">TIME UP!</p>
            <p className="text-cyan-400 mb-4">Final Score: {display.score}</p>
            <button
              type="button"
              onClick={() => {
                initState();
              }}
              className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded"
            >
              Restart
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-white/40">
        Click targets to shoot them! 30 seconds
      </p>
    </div>
  );
}
