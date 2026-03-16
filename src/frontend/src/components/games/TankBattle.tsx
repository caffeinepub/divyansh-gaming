import { useEffect, useRef, useState } from "react";

export default function TankBattle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const [display, setDisplay] = useState({
    score: 0,
    lives: 3,
    gameOver: false,
  });

  function initState() {
    stateRef.current = {
      tank: { x: 200, y: 340, angle: -Math.PI / 2 },
      bullets: [] as any[],
      enemies: [
        { x: 80, y: 60, angle: 0, shootTimer: 80 },
        { x: 200, y: 60, angle: 0, shootTimer: 100 },
        { x: 320, y: 60, angle: 0, shootTimer: 120 },
      ],
      enemyBullets: [] as any[],
      score: 0,
      lives: 3,
      gameOver: false,
      raf: 0,
      frame: 0,
      keys: {} as Record<string, boolean>,
      shootCooldown: 0,
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
      e.preventDefault();
    };
    window.addEventListener("keydown", (e) => onKey(e, true));
    window.addEventListener("keyup", (e) => onKey(e, false));

    function loop() {
      s.raf = requestAnimationFrame(loop);
      if (s.gameOver) return;
      s.frame++;

      if (s.keys.ArrowLeft) s.tank.angle -= 0.05;
      if (s.keys.ArrowRight) s.tank.angle += 0.05;
      if (s.keys.ArrowUp) {
        s.tank.x += Math.cos(s.tank.angle) * 3;
        s.tank.y += Math.sin(s.tank.angle) * 3;
      }
      if (s.keys.ArrowDown) {
        s.tank.x -= Math.cos(s.tank.angle) * 2;
        s.tank.y -= Math.sin(s.tank.angle) * 2;
      }
      s.tank.x = Math.max(10, Math.min(390, s.tank.x));
      s.tank.y = Math.max(10, Math.min(390, s.tank.y));

      if (s.keys[" "] && s.shootCooldown <= 0) {
        s.bullets.push({
          x: s.tank.x,
          y: s.tank.y,
          vx: Math.cos(s.tank.angle) * 8,
          vy: Math.sin(s.tank.angle) * 8,
        });
        s.shootCooldown = 20;
      }
      if (s.shootCooldown > 0) s.shootCooldown--;

      for (const b of s.bullets) {
        b.x += b.vx;
        b.y += b.vy;
      }
      s.bullets = s.bullets.filter(
        (b: any) => b.x > 0 && b.x < 400 && b.y > 0 && b.y < 400,
      );

      // Enemy AI
      for (const e of s.enemies) {
        const dx = s.tank.x - e.x;
        const dy = s.tank.y - e.y;
        e.angle = Math.atan2(dy, dx);
        e.shootTimer--;
        if (e.shootTimer <= 0) {
          s.enemyBullets.push({
            x: e.x,
            y: e.y,
            vx: Math.cos(e.angle) * 4,
            vy: Math.sin(e.angle) * 4,
          });
          e.shootTimer = 80 + Math.random() * 40;
        }
      }
      for (const b of s.enemyBullets) {
        b.x += b.vx;
        b.y += b.vy;
      }
      s.enemyBullets = s.enemyBullets.filter(
        (b: any) => b.x > 0 && b.x < 400 && b.y > 0 && b.y < 400,
      );

      // Player bullet vs enemy
      s.bullets = s.bullets.filter((b: any) => {
        for (let i = s.enemies.length - 1; i >= 0; i--) {
          if (Math.hypot(b.x - s.enemies[i].x, b.y - s.enemies[i].y) < 20) {
            s.enemies.splice(i, 1);
            s.score += 100;
            if (s.enemies.length === 0) {
              s.gameOver = true;
              setDisplay({ score: s.score, lives: s.lives, gameOver: true });
            }
            return false;
          }
        }
        return true;
      });

      // Enemy bullet vs player
      s.enemyBullets = s.enemyBullets.filter((b: any) => {
        if (Math.hypot(b.x - s.tank.x, b.y - s.tank.y) < 18) {
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

      ctx.fillStyle = "#0a1008";
      ctx.fillRect(0, 0, 400, 400);

      // Draw player tank
      ctx.save();
      ctx.translate(s.tank.x, s.tank.y);
      ctx.rotate(s.tank.angle);
      ctx.fillStyle = "#00ffcc";
      ctx.fillRect(-14, -10, 28, 20);
      ctx.fillStyle = "#00cc99";
      ctx.fillRect(0, -3, 20, 6);
      ctx.restore();

      // Draw enemies
      for (const e of s.enemies) {
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.rotate(e.angle);
        ctx.fillStyle = "#ff4444";
        ctx.fillRect(-14, -10, 28, 20);
        ctx.fillStyle = "#cc2222";
        ctx.fillRect(0, -3, 20, 6);
        ctx.restore();
      }

      ctx.fillStyle = "#ffff00";
      for (const b of s.bullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#ff8800";
      for (const b of s.enemyBullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
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
          className="rounded border border-green-500/30"
        />
        {display.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded">
            <p
              className="text-2xl font-bold mb-2"
              style={{ color: display.score >= 300 ? "#00ff88" : "#ff4466" }}
            >
              {display.score >= 300 ? "VICTORY!" : "DESTROYED"}
            </p>
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
      <p className="text-xs text-white/40">
        Arrow Keys: move/turn | Space: shoot
      </p>
    </div>
  );
}
