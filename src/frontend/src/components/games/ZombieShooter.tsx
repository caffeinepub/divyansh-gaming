import { useEffect, useRef, useState } from "react";

export default function ZombieShooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const [display, setDisplay] = useState({
    score: 0,
    lives: 5,
    gameOver: false,
  });

  function initState() {
    stateRef.current = {
      zombies: [] as any[],
      score: 0,
      lives: 5,
      gameOver: false,
      frame: 0,
      raf: 0,
      spawnTimer: 40,
    };
    setDisplay({ score: 0, lives: 5, gameOver: false });
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
      for (const z of s.zombies) {
        if (!z.alive) continue;
        if (Math.abs(mx - z.x) < 18 && Math.abs(my - z.y) < 22) {
          z.alive = false;
          s.score += 10;
          break;
        }
      }
    });

    function loop() {
      s.raf = requestAnimationFrame(loop);
      if (s.gameOver) return;
      s.frame++;
      s.spawnTimer--;
      if (s.spawnTimer <= 0) {
        s.zombies.push({
          x: 30 + Math.random() * 340,
          y: 30,
          alive: true,
          speed: 0.6 + Math.random() * 0.6,
        });
        s.spawnTimer = Math.max(20, 40 - Math.floor(s.score / 50));
      }
      for (const z of s.zombies) {
        if (z.alive) z.y += z.speed;
      }
      s.zombies = s.zombies.filter((z) => {
        if (z.alive && z.y > 380) {
          s.lives--;
          z.alive = false;
          if (s.lives <= 0) {
            s.gameOver = true;
            setDisplay({ score: s.score, lives: 0, gameOver: true });
          }
          return false;
        }
        return true;
      });
      setDisplay({ score: s.score, lives: s.lives, gameOver: false });

      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, 400, 400);

      for (const z of s.zombies) {
        if (!z.alive) continue;
        ctx.fillStyle = "#44ff44";
        ctx.fillRect(z.x - 14, z.y - 18, 28, 36);
        ctx.fillStyle = "#003300";
        ctx.fillRect(z.x - 6, z.y - 24, 12, 8);
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(z.x - 5, z.y - 10, 4, 4);
        ctx.fillRect(z.x + 1, z.y - 10, 4, 4);
      }

      ctx.fillStyle = "#ffffff30";
      ctx.font = "11px monospace";
      ctx.fillText("Click zombies!", 140, 390);
    }
    loop();
    return () => cancelAnimationFrame(s.raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-yellow-400">Score: {display.score}</span>
        <span className="text-red-400">Lives: {display.lives}</span>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded border border-green-500/30 cursor-crosshair"
        />
        {display.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded">
            <p className="text-2xl font-bold text-green-400 mb-2">OVERRUN!</p>
            <p className="text-yellow-400 mb-4">Score: {display.score}</p>
            <button
              type="button"
              onClick={() => {
                initState();
              }}
              className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-400 rounded"
            >
              Restart
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-white/40">Click zombies before they escape!</p>
    </div>
  );
}
