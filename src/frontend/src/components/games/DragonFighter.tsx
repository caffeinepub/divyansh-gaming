import { useEffect, useRef, useState } from "react";

export default function DragonFighter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const [display, setDisplay] = useState({
    score: 0,
    lives: 3,
    gameOver: false,
  });

  function initState() {
    stateRef.current = {
      dragon: { x: 200, y: 320 },
      fireballs: [] as any[],
      enemies: [] as any[],
      score: 0,
      lives: 3,
      gameOver: false,
      frame: 0,
      raf: 0,
      keys: {} as Record<string, boolean>,
      shootCooldown: 0,
      spawnTimer: 60,
    };
    setDisplay({ score: 0, lives: 3, gameOver: false });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: game init on mount
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    initState();
    const s = stateRef.current;
    const onKey = (e: KeyboardEvent, d: boolean) => {
      s.keys[e.key] = d;
      if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)
      )
        e.preventDefault();
    };
    window.addEventListener("keydown", (e) => onKey(e, true));
    window.addEventListener("keyup", (e) => onKey(e, false));

    function loop() {
      s.raf = requestAnimationFrame(loop);
      if (s.gameOver) return;
      s.frame++;
      if (s.keys.ArrowLeft) s.dragon.x -= 3;
      if (s.keys.ArrowRight) s.dragon.x += 3;
      if (s.keys.ArrowUp) s.dragon.y -= 3;
      if (s.keys.ArrowDown) s.dragon.y += 3;
      s.dragon.x = Math.max(20, Math.min(380, s.dragon.x));
      s.dragon.y = Math.max(20, Math.min(380, s.dragon.y));

      if (s.keys[" "] && s.shootCooldown <= 0) {
        s.fireballs.push({ x: s.dragon.x, y: s.dragon.y - 20 });
        s.shootCooldown = 15;
      }
      if (s.shootCooldown > 0) s.shootCooldown--;

      for (const f of s.fireballs) f.y -= 8;
      s.fireballs = s.fireballs.filter((f: any) => f.y > -10);

      s.spawnTimer--;
      if (s.spawnTimer <= 0) {
        s.enemies.push({
          x: 20 + Math.random() * 360,
          y: -20,
          vy: 1.5 + Math.random(),
        });
        s.spawnTimer = Math.max(20, 60 - Math.floor(s.score / 40));
      }
      for (const e of s.enemies) e.y += e.vy;

      s.fireballs = s.fireballs.filter((f: any) => {
        for (let i = s.enemies.length - 1; i >= 0; i--) {
          if (Math.hypot(f.x - s.enemies[i].x, f.y - s.enemies[i].y) < 22) {
            s.enemies.splice(i, 1);
            s.score += 15;
            return false;
          }
        }
        return true;
      });
      s.enemies = s.enemies.filter((e: any) => {
        if (e.y > 410) {
          s.lives--;
          if (s.lives <= 0) {
            s.gameOver = true;
            setDisplay({ score: s.score, lives: 0, gameOver: true });
          }
          return false;
        }
        if (Math.hypot(e.x - s.dragon.x, e.y - s.dragon.y) < 24) {
          s.lives--;
          if (s.lives <= 0) {
            s.gameOver = true;
            setDisplay({ score: s.score, lives: 0, gameOver: true });
          }
          return false;
        }
        return true;
      });
      setDisplay({ score: s.score, lives: s.lives, gameOver: false });

      ctx.fillStyle = "#060412";
      ctx.fillRect(0, 0, 400, 400);
      // Stars
      ctx.fillStyle = "#ffffff20";
      for (let i = 0; i < 20; i++)
        ctx.fillRect((i * 73 + s.frame) % 400, (i * 57) % 400, 2, 2);
      // Dragon
      ctx.fillStyle = "#ff8800";
      ctx.beginPath();
      ctx.arc(s.dragon.x, s.dragon.y, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffff00";
      ctx.fillRect(s.dragon.x - 22, s.dragon.y - 6, 14, 12);
      ctx.fillRect(s.dragon.x + 8, s.dragon.y - 6, 14, 12);
      // Fireballs
      ctx.fillStyle = "#ff6600";
      for (const f of s.fireballs) {
        ctx.beginPath();
        ctx.arc(f.x, f.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      // Enemies
      ctx.fillStyle = "#aa44ff";
      for (const e of s.enemies) {
        ctx.beginPath();
        ctx.arc(e.x, e.y, 14, 0, Math.PI * 2);
        ctx.fill();
      }
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
        <span className="text-yellow-400">Score: {display.score}</span>
        <span className="text-red-400">Lives: {display.lives}</span>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded border border-orange-500/30"
        />
        {display.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded">
            <p className="text-2xl font-bold text-orange-400 mb-2">
              DRAGON SLAIN!
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
      <p className="text-xs text-white/40">Arrow Keys: fly | Space: fireball</p>
    </div>
  );
}
