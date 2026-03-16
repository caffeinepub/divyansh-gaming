import { useEffect, useRef, useState } from "react";

export default function PlatformerRun() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const [display, setDisplay] = useState({ score: 0, gameOver: false });

  function initState() {
    stateRef.current = {
      player: { x: 80, y: 280, vy: 0, onGround: false },
      platforms: [
        { x: 0, y: 350, w: 200 },
        { x: 250, y: 320, w: 120 },
        { x: 420, y: 290, w: 100 },
        { x: 570, y: 310, w: 130 },
        { x: 750, y: 280, w: 110 },
      ],
      coins: [
        { x: 100, y: 310 },
        { x: 310, y: 285 },
        { x: 475, y: 255 },
        { x: 630, y: 275 },
        { x: 800, y: 245 },
      ],
      camX: 0,
      score: 0,
      gameOver: false,
      frame: 0,
      raf: 0,
      keys: {} as Record<string, boolean>,
    };
    setDisplay({ score: 0, gameOver: false });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: game init on mount
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    initState();
    const s = stateRef.current;
    const onKey = (e: KeyboardEvent, d: boolean) => {
      s.keys[e.key] = d;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(e.key))
        e.preventDefault();
    };
    window.addEventListener("keydown", (e) => onKey(e, true));
    window.addEventListener("keyup", (e) => onKey(e, false));

    function loop() {
      s.raf = requestAnimationFrame(loop);
      if (s.gameOver) return;
      s.frame++;

      if (s.keys.ArrowRight) s.player.x += 3;
      if (s.keys.ArrowLeft) s.player.x -= 1;
      if ((s.keys.ArrowUp || s.keys[" "]) && s.player.onGround) {
        s.player.vy = -13;
        s.player.onGround = false;
      }

      s.player.vy += 0.55;
      s.player.y += s.player.vy;
      s.player.onGround = false;

      for (const p of s.platforms) {
        if (
          s.player.x + 16 > p.x &&
          s.player.x - 16 < p.x + p.w &&
          s.player.y + 20 >= p.y &&
          s.player.y + 20 <= p.y + 15 &&
          s.player.vy >= 0
        ) {
          s.player.y = p.y - 20;
          s.player.vy = 0;
          s.player.onGround = true;
        }
      }

      if (s.player.y > 430) {
        s.gameOver = true;
        setDisplay({ score: s.score, gameOver: true });
        return;
      }

      // Collect coins
      s.coins = s.coins.filter((c: any) => {
        if (Math.hypot(c.x - s.player.x, c.y - s.player.y) < 24) {
          s.score += 50;
          return false;
        }
        return true;
      });

      // Camera
      s.camX = Math.max(0, s.player.x - 120);
      s.score = Math.max(s.score, Math.floor(s.player.x / 10));
      setDisplay({ score: s.score, gameOver: false });

      ctx.fillStyle = "#0a0820";
      ctx.fillRect(0, 0, 400, 400);

      ctx.save();
      ctx.translate(-s.camX, 0);

      for (const p of s.platforms) {
        ctx.fillStyle = "#2a4a8a";
        ctx.fillRect(p.x, p.y, p.w, 20);
        ctx.fillStyle = "#3a6aaa";
        ctx.fillRect(p.x, p.y, p.w, 5);
      }
      for (const c of s.coins) {
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#00ffcc";
      ctx.fillRect(s.player.x - 12, s.player.y - 20, 24, 30);
      ctx.fillStyle = "#ffcc00";
      ctx.beginPath();
      ctx.arc(s.player.x, s.player.y - 26, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
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
      <span className="text-yellow-400 font-mono">Score: {display.score}</span>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded border border-blue-500/30"
        />
        {display.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded">
            <p className="text-2xl font-bold text-red-400 mb-2">FELL DOWN!</p>
            <p className="text-yellow-400 mb-4">Score: {display.score}</p>
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
      <p className="text-xs text-white/40">
        ← → Move | ↑ / Space: Jump | Collect coins!
      </p>
    </div>
  );
}
