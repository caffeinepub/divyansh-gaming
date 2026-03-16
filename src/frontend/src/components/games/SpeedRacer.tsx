import { useEffect, useRef, useState } from "react";

export default function SpeedRacer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const [display, setDisplay] = useState({ score: 0, gameOver: false });

  function initState() {
    stateRef.current = {
      car: { x: 200, lane: 1 }, // lanes 0,1,2
      obstacles: [] as { x: number; y: number; lane: number }[],
      coins: [] as { x: number; y: number; lane: number; collected: boolean }[],
      score: 0,
      gameOver: false,
      frame: 0,
      raf: 0,
      speed: 3,
      keys: {} as Record<string, boolean>,
      shiftCooldown: 0,
    };
    setDisplay({ score: 0, gameOver: false });
  }

  const LANES = [100, 200, 300];

  // biome-ignore lint/correctness/useExhaustiveDependencies: game init on mount
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    initState();
    const s = stateRef.current;
    const onKey = (e: KeyboardEvent, d: boolean) => {
      s.keys[e.key] = d;
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
    };
    window.addEventListener("keydown", (e) => onKey(e, true));
    window.addEventListener("keyup", (e) => onKey(e, false));

    function loop() {
      s.raf = requestAnimationFrame(loop);
      if (s.gameOver) return;
      s.frame++;
      s.score = Math.floor(s.frame / 6);
      s.speed = 3 + s.score * 0.005;

      if (s.shiftCooldown > 0) s.shiftCooldown--;
      if (s.keys.ArrowLeft && s.car.lane > 0 && s.shiftCooldown === 0) {
        s.car.lane--;
        s.shiftCooldown = 15;
      }
      if (s.keys.ArrowRight && s.car.lane < 2 && s.shiftCooldown === 0) {
        s.car.lane++;
        s.shiftCooldown = 15;
      }
      s.car.x += (LANES[s.car.lane] - s.car.x) * 0.2;

      if (s.frame % 60 === 0) {
        const lane = Math.floor(Math.random() * 3);
        s.obstacles.push({ x: LANES[lane], y: -30, lane });
      }
      if (s.frame % 40 === 0) {
        const lane = Math.floor(Math.random() * 3);
        s.coins.push({ x: LANES[lane], y: -20, lane, collected: false });
      }

      for (const o of s.obstacles) o.y += s.speed;
      for (const c of s.coins) c.y += s.speed;
      s.obstacles = s.obstacles.filter((o) => o.y < 430);
      s.coins = s.coins.filter((c) => c.y < 430);

      // Collision with obstacles
      for (const o of s.obstacles) {
        if (o.lane === s.car.lane && Math.abs(o.y - 340) < 40) {
          s.gameOver = true;
          setDisplay({ score: s.score, gameOver: true });
          return;
        }
      }
      // Collect coins
      s.coins = s.coins.filter((c: any) => {
        if (!c.collected && c.lane === s.car.lane && Math.abs(c.y - 340) < 30) {
          s.score += 20;
          c.collected = true;
          return false;
        }
        return !c.collected;
      });

      setDisplay({ score: s.score, gameOver: false });

      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, 400, 400);
      // Road
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(50, 0, 300, 400);
      // Lane lines
      ctx.strokeStyle = "#ffffff30";
      ctx.setLineDash([20, 20]);
      ctx.lineWidth = 2;
      for (let l = 1; l < 3; l++) {
        ctx.beginPath();
        ctx.moveTo(50 + l * 100, 0);
        ctx.lineTo(50 + l * 100, 400);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      // Obstacles
      ctx.fillStyle = "#ff4444";
      for (const o of s.obstacles) {
        ctx.fillRect(o.x - 18, o.y - 28, 36, 56);
        ctx.fillStyle = "#ff8888";
        ctx.fillRect(o.x - 12, o.y - 20, 24, 10);
        ctx.fillStyle = "#ff4444";
      }
      // Coins
      ctx.fillStyle = "#ffd700";
      for (const c of s.coins) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      // Player car
      ctx.fillStyle = "#00ffcc";
      ctx.fillRect(s.car.x - 18, 322, 36, 56);
      ctx.fillStyle = "#00aaaa";
      ctx.fillRect(s.car.x - 12, 330, 24, 14);
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
          className="rounded border border-cyan-500/30"
        />
        {display.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded">
            <p className="text-2xl font-bold text-red-400 mb-2">CRASH!</p>
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
      <p className="text-xs text-white/40">
        ← → to change lanes, avoid red cars
      </p>
    </div>
  );
}
