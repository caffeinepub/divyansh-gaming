import { useEffect, useRef, useState } from "react";

export default function MissileCommand() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const [display, setDisplay] = useState({
    score: 0,
    lives: 3,
    gameOver: false,
  });

  function initState() {
    stateRef.current = {
      missiles: [] as any[],
      explosions: [] as any[],
      score: 0,
      lives: 3,
      gameOver: false,
      frame: 0,
      raf: 0,
      spawnTimer: 50,
    };
    setDisplay({ score: 0, lives: 3, gameOver: false });
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
      s.explosions.push({ x: mx, y: my, r: 0, maxR: 50 });
    });

    function loop() {
      s.raf = requestAnimationFrame(loop);
      if (s.gameOver) return;
      s.frame++;
      s.spawnTimer--;
      if (s.spawnTimer <= 0) {
        const tx = 50 + Math.random() * 300;
        s.missiles.push({
          x: Math.random() * 380 + 10,
          y: 0,
          tx,
          speed: 1 + Math.random() * 1.5,
        });
        s.spawnTimer = Math.max(25, 50 - Math.floor(s.score / 30));
      }

      // Move missiles toward city (bottom)
      for (const m of s.missiles) {
        const dx = m.tx - m.x;
        const dy = 380 - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        m.x += (dx / dist) * m.speed;
        m.y += (dy / dist) * m.speed;
      }

      // Grow explosions
      for (const ex of s.explosions) ex.r += 3;

      // Check missile-explosion collision
      s.missiles = s.missiles.filter((m) => {
        for (const ex of s.explosions) {
          if (ex.r > 0 && Math.hypot(m.x - ex.x, m.y - ex.y) < ex.r) {
            s.score += 10;
            return false;
          }
        }
        if (m.y >= 370) {
          s.lives--;
          if (s.lives <= 0) {
            s.gameOver = true;
            setDisplay({ score: s.score, lives: 0, gameOver: true });
          }
          return false;
        }
        return true;
      });

      s.explosions = s.explosions.filter((ex) => ex.r < ex.maxR);
      setDisplay({ score: s.score, lives: s.lives, gameOver: false });

      ctx.fillStyle = "#050510";
      ctx.fillRect(0, 0, 400, 400);

      // City
      ctx.fillStyle = "#1a1a2e";
      for (let i = 0; i < 6; i++)
        ctx.fillRect(
          30 + i * 60,
          360 - 20 - (i % 3) * 15,
          40,
          40 + (i % 3) * 15,
        );

      // Missiles
      for (const m of s.missiles) {
        ctx.strokeStyle = "#ff4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y - 10);
        ctx.lineTo(m.x, m.y + 10);
        ctx.stroke();
      }

      // Explosions
      for (const ex of s.explosions) {
        const alpha = 1 - ex.r / ex.maxR;
        ctx.beginPath();
        ctx.arc(ex.x, ex.y, ex.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,140,0,${alpha * 0.5})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255,200,0,${alpha})`;
        ctx.stroke();
      }
    }
    loop();
    return () => cancelAnimationFrame(s.raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-yellow-400">Score: {display.score}</span>
        <span className="text-red-400">Cities: {display.lives}</span>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded border border-orange-500/30 cursor-crosshair"
        />
        {display.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded">
            <p className="text-2xl font-bold text-orange-400 mb-2">
              CITY DESTROYED
            </p>
            <p className="text-yellow-400 mb-4">Score: {display.score}</p>
            <button
              type="button"
              onClick={() => {
                initState();
              }}
              className="px-4 py-2 bg-orange-500/20 border border-orange-500 text-orange-400 rounded"
            >
              Restart
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-white/40">
        Click to create explosions and destroy missiles
      </p>
    </div>
  );
}
