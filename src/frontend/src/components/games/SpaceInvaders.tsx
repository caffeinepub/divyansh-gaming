import { useEffect, useRef, useState } from "react";

export default function SpaceInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    player: { x: number; y: number };
    bullets: { x: number; y: number }[];
    enemies: { x: number; y: number; alive: boolean }[];
    enemyDir: number;
    score: number;
    lives: number;
    gameOver: boolean;
    won: boolean;
    keys: Record<string, boolean>;
    shootCooldown: number;
    raf: number;
  } | null>(null);
  const [display, setDisplay] = useState({
    score: 0,
    lives: 3,
    gameOver: false,
    won: false,
  });

  function initState() {
    const enemies: { x: number; y: number; alive: boolean }[] = [];
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 8; c++)
        enemies.push({ x: 60 + c * 48, y: 50 + r * 40, alive: true });
    stateRef.current = {
      player: { x: 196, y: 360 },
      bullets: [],
      enemies,
      enemyDir: 1,
      score: 0,
      lives: 3,
      gameOver: false,
      won: false,
      keys: {},
      shootCooldown: 0,
      raf: 0,
    };
    setDisplay({ score: 0, lives: 3, gameOver: false, won: false });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: game init on mount
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    initState();
    const s = stateRef.current!;

    const onKey = (e: KeyboardEvent, down: boolean) => {
      s.keys[e.key] = down;
      e.preventDefault();
    };
    window.addEventListener("keydown", (e) => onKey(e, true));
    window.addEventListener("keyup", (e) => onKey(e, false));

    let frame = 0;
    function loop() {
      s.raf = requestAnimationFrame(loop);
      if (s.gameOver || s.won) return;
      frame++;

      // Move player
      if (s.keys.ArrowLeft && s.player.x > 10) s.player.x -= 3;
      if (s.keys.ArrowRight && s.player.x < 382) s.player.x += 3;

      // Shoot
      if (s.keys[" "] && s.shootCooldown <= 0) {
        s.bullets.push({ x: s.player.x, y: s.player.y - 10 });
        s.shootCooldown = 18;
      }
      if (s.shootCooldown > 0) s.shootCooldown--;

      // Move bullets
      s.bullets = s.bullets.filter((b) => b.y > -10);
      for (const b of s.bullets) b.y -= 7;

      // Move enemies
      if (frame % 40 === 0) {
        const alive = s.enemies.filter((e) => e.alive);
        const minX = Math.min(...alive.map((e) => e.x));
        const maxX = Math.max(...alive.map((e) => e.x));
        if (maxX > 380 || minX < 20) {
          s.enemyDir *= -1;
          for (const e of s.enemies) e.y += 12;
        }
        for (const e of s.enemies) e.x += s.enemyDir * 12;
      }

      // Bullet-enemy collisions
      for (const b of s.bullets) {
        for (const e of s.enemies) {
          if (e.alive && Math.abs(b.x - e.x) < 16 && Math.abs(b.y - e.y) < 12) {
            e.alive = false;
            b.y = -100;
            s.score += 10;
          }
        }
      }

      // Check win
      if (!s.enemies.some((e) => e.alive)) {
        s.won = true;
        setDisplay((d) => ({ ...d, won: true, score: s.score }));
        return;
      }

      // Enemy reaches player
      for (const e of s.enemies) {
        if (e.alive && e.y > 350) {
          s.lives--;
          if (s.lives <= 0) {
            s.gameOver = true;
            setDisplay((d) => ({
              ...d,
              gameOver: true,
              lives: 0,
              score: s.score,
            }));
            return;
          }
          break;
        }
      }

      setDisplay({
        score: s.score,
        lives: s.lives,
        gameOver: false,
        won: false,
      });

      // Draw
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, 400, 400);

      // Player
      ctx.fillStyle = "#00ffcc";
      ctx.fillRect(s.player.x - 15, s.player.y - 8, 30, 12);
      ctx.fillRect(s.player.x - 3, s.player.y - 18, 6, 10);

      // Bullets
      ctx.fillStyle = "#ffff00";
      for (const b of s.bullets) ctx.fillRect(b.x - 2, b.y, 4, 10);

      // Enemies
      for (const e of s.enemies) {
        if (!e.alive) continue;
        ctx.fillStyle = "#ff4466";
        ctx.fillRect(e.x - 12, e.y - 8, 24, 16);
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(e.x - 6, e.y - 14, 4, 6);
        ctx.fillRect(e.x + 2, e.y - 14, 4, 6);
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
          className="rounded border border-cyan-500/30"
        />
        {(display.gameOver || display.won) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded">
            <p
              className="text-2xl font-bold mb-2"
              style={{ color: display.won ? "#00ff88" : "#ff4466" }}
            >
              {display.won ? "YOU WIN!" : "GAME OVER"}
            </p>
            <p className="text-yellow-400 mb-4">Score: {display.score}</p>
            <button
              type="button"
              onClick={() => {
                initState();
              }}
              className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded hover:bg-cyan-500/30"
            >
              Restart
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-white/40">← → Move | Space Shoot</p>
    </div>
  );
}
