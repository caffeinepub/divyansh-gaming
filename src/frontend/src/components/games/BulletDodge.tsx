import { useEffect, useRef, useState } from "react";

export default function BulletDodge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const [display, setDisplay] = useState({ score: 0, gameOver: false });

  function initState() {
    stateRef.current = {
      player: { x: 200, y: 300 },
      bullets: [] as any[],
      score: 0,
      gameOver: false,
      frame: 0,
      raf: 0,
      spawnTimer: 30,
      mx: 200,
      my: 300,
    };
    setDisplay({ score: 0, gameOver: false });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: game init on mount
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    initState();
    const s = stateRef.current;

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      s.mx = e.clientX - rect.left;
      s.my = e.clientY - rect.top;
    });

    function loop() {
      s.raf = requestAnimationFrame(loop);
      if (s.gameOver) return;
      s.frame++;
      s.score = Math.floor(s.frame / 10);

      // Player follows mouse
      s.player.x += (s.mx - s.player.x) * 0.15;
      s.player.y += (s.my - s.player.y) * 0.15;

      // Spawn bullets from edges
      s.spawnTimer--;
      if (s.spawnTimer <= 0) {
        const side = Math.floor(Math.random() * 4);
        let bx = 0;
        let by = 0;
        if (side === 0) {
          bx = Math.random() * 400;
          by = 0;
        } else if (side === 1) {
          bx = 400;
          by = Math.random() * 400;
        } else if (side === 2) {
          bx = Math.random() * 400;
          by = 400;
        } else {
          bx = 0;
          by = Math.random() * 400;
        }
        const speed = 2.5 + Math.random() * 1.5;
        const angle = Math.atan2(s.player.y - by, s.player.x - bx);
        s.bullets.push({
          x: bx,
          y: by,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        });
        s.spawnTimer = Math.max(12, 30 - Math.floor(s.score / 20));
      }

      for (const b of s.bullets) {
        b.x += b.vx;
        b.y += b.vy;
      }
      s.bullets = s.bullets.filter(
        (b) => b.x > -20 && b.x < 420 && b.y > -20 && b.y < 420,
      );

      // Collision
      for (const b of s.bullets) {
        if (Math.hypot(b.x - s.player.x, b.y - s.player.y) < 14) {
          s.gameOver = true;
          setDisplay({ score: s.score, gameOver: true });
          return;
        }
      }

      setDisplay({ score: s.score, gameOver: false });

      ctx.fillStyle = "#070710";
      ctx.fillRect(0, 0, 400, 400);

      // Player
      ctx.fillStyle = "#00ffcc";
      ctx.beginPath();
      ctx.arc(s.player.x, s.player.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Bullets
      ctx.fillStyle = "#ff4444";
      for (const b of s.bullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    loop();
    return () => cancelAnimationFrame(s.raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-yellow-400 font-mono">
        Survived: {display.score}s
      </span>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded border border-cyan-500/30 cursor-none"
        />
        {display.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded">
            <p className="text-2xl font-bold text-red-400 mb-2">HIT!</p>
            <p className="text-yellow-400 mb-4">Survived: {display.score}s</p>
            <button
              type="button"
              onClick={() => {
                initState();
              }}
              className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded"
            >
              Restart
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-white/40">Move your mouse to dodge bullets</p>
    </div>
  );
}
