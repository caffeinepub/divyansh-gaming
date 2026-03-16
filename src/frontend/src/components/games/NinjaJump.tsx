import { useEffect, useRef, useState } from "react";

export default function NinjaJump() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const [display, setDisplay] = useState({ score: 0, gameOver: false });

  function initState() {
    stateRef.current = {
      ninja: { x: 60, y: 300, vy: 0, onGround: true },
      obstacles: [] as { x: number; w: number; h: number }[],
      score: 0,
      gameOver: false,
      frame: 0,
      raf: 0,
      speed: 4,
      spawnTimer: 0,
      jumping: false,
    };
    setDisplay({ score: 0, gameOver: false });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: game init on mount
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    initState();
    const s = stateRef.current;
    const GROUND = 340;

    const jump = () => {
      if (s.onGround || s.ninja?.onGround) {
        s.ninja.vy = -14;
        s.ninja.onGround = false;
      }
    };
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    });
    canvas.addEventListener("click", jump);

    function loop() {
      s.raf = requestAnimationFrame(loop);
      if (s.gameOver) return;
      s.frame++;
      s.score = Math.floor(s.frame / 6);
      s.speed = 4 + s.score * 0.003;

      // Ninja physics
      s.ninja.vy += 0.7;
      s.ninja.y += s.ninja.vy;
      if (s.ninja.y >= GROUND) {
        s.ninja.y = GROUND;
        s.ninja.vy = 0;
        s.ninja.onGround = true;
      }

      // Spawn obstacles
      s.spawnTimer--;
      if (s.spawnTimer <= 0) {
        const h = 30 + Math.random() * 40;
        s.obstacles.push({ x: 440, w: 20, h });
        s.spawnTimer = 60 + Math.random() * 60;
      }

      // Move obstacles
      for (const o of s.obstacles) o.x -= s.speed;
      s.obstacles = s.obstacles.filter((o) => o.x > -50);

      // Collision
      for (const o of s.obstacles) {
        if (
          s.ninja.x + 20 > o.x &&
          s.ninja.x < o.x + o.w &&
          s.ninja.y + 30 > GROUND + 10 - o.h &&
          s.ninja.y < GROUND + 30
        ) {
          s.gameOver = true;
          setDisplay({ score: s.score, gameOver: true });
          return;
        }
      }

      setDisplay({ score: s.score, gameOver: false });

      ctx.fillStyle = "#0d0d1a";
      ctx.fillRect(0, 0, 440, 400);

      // Ground
      ctx.fillStyle = "#1a1a3a";
      ctx.fillRect(0, GROUND + 30, 440, 70);
      ctx.strokeStyle = "#00ffcc40";
      ctx.strokeRect(0, GROUND + 30, 440, 1);

      // Obstacles
      ctx.fillStyle = "#ff4466";
      for (const o of s.obstacles)
        ctx.fillRect(o.x, GROUND + 30 - o.h, o.w, o.h);

      // Ninja
      ctx.fillStyle = "#00ffcc";
      ctx.fillRect(s.ninja.x, s.ninja.y, 24, 30);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(s.ninja.x + 4, s.ninja.y + 4, 6, 4);
    }
    loop();
    return () => cancelAnimationFrame(s.raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-yellow-400 font-mono">Score: {display.score}</span>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={440}
          height={400}
          className="rounded border border-cyan-500/30"
        />
        {display.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded">
            <p className="text-2xl font-bold text-red-400 mb-2">GAME OVER</p>
            <p className="text-yellow-400 mb-4">Score: {display.score}</p>
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
      <p className="text-xs text-white/40">Space / Click to jump</p>
    </div>
  );
}
