import { useCallback, useEffect, useRef, useState } from "react";

const W = 480;
const H = 540;
const SHIP_W = 28;
const SHIP_H = 36;
const BULLET_W = 4;
const BULLET_H = 14;
const BULLET_SPEED = 9;
const SHIP_SPEED = 5;
const AST_SPEED_BASE = 2;

type Phase = "start" | "playing" | "over";

interface Bullet {
  x: number;
  y: number;
  id: number;
}
interface Asteroid {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  id: number;
  rot: number;
  rotV: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

let nextId = 0;

function spawnAsteroid(frame: number): Asteroid {
  const r = 16 + Math.random() * 22;
  return {
    x: r + Math.random() * (W - 2 * r),
    y: -r,
    r,
    vx: (Math.random() - 0.5) * 2,
    vy: AST_SPEED_BASE + Math.random() * 2 + frame * 0.002,
    id: nextId++,
    rot: 0,
    rotV: (Math.random() - 0.5) * 0.06,
  };
}

export default function AsteroidShooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const phaseRef = useRef<Phase>("start");
  const rafRef = useRef(0);

  const st = useRef({
    shipX: W / 2,
    bullets: [] as Bullet[],
    asteroids: [] as Asteroid[],
    particles: [] as Particle[],
    frame: 0,
    score: 0,
    lives: 3,
    shootTimer: 0,
    astTimer: 0,
    invincible: 0,
    scoreTimer: 0,
  });

  const keys = useRef({ left: false, right: false, space: false });

  const initGame = useCallback(() => {
    const s = st.current;
    s.shipX = W / 2;
    s.bullets = [];
    s.asteroids = [];
    s.particles = [];
    s.frame = 0;
    s.score = 0;
    s.lives = 3;
    s.shootTimer = 0;
    s.astTimer = 0;
    s.invincible = 60;
    s.scoreTimer = 0;
    setScore(0);
    setLives(3);
    phaseRef.current = "playing";
    setPhase("playing");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A")
        keys.current.left = e.type === "keydown";
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
        keys.current.right = e.type === "keydown";
      if (e.key === " " || e.key === "Spacebar") {
        if (e.type === "keydown") {
          e.preventDefault();
          keys.current.space = true;
          if (phaseRef.current === "start" || phaseRef.current === "over")
            initGame();
        } else {
          keys.current.space = false;
        }
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [initGame]);

  const drawShip = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, invincible: number) => {
      const alpha =
        invincible > 0 && Math.floor(invincible / 5) % 2 === 0 ? 0.4 : 1;
      ctx.globalAlpha = alpha;
      const y = H - SHIP_H - 20;
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#00e5ff";
      // Body
      ctx.fillStyle = "#00e5ff";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - SHIP_W / 2, y + SHIP_H);
      ctx.lineTo(x - SHIP_W / 4, y + SHIP_H - 8);
      ctx.lineTo(x, y + SHIP_H - 4);
      ctx.lineTo(x + SHIP_W / 4, y + SHIP_H - 8);
      ctx.lineTo(x + SHIP_W / 2, y + SHIP_H);
      ctx.closePath();
      ctx.fill();
      // Cockpit
      ctx.fillStyle = "#0a2040";
      ctx.beginPath();
      ctx.ellipse(x, y + 12, 5, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      // Engine glow
      if (keys.current.left || keys.current.right || Math.random() > 0.3) {
        ctx.shadowColor = "#a855f7";
        ctx.fillStyle = "rgba(168,85,247,0.9)";
        ctx.beginPath();
        ctx.ellipse(
          x,
          y + SHIP_H + 4,
          4,
          8 + Math.random() * 4,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function drawAsteroid(a: Asteroid) {
      ctx!.save();
      ctx!.translate(a.x, a.y);
      ctx!.rotate(a.rot);
      ctx!.shadowBlur = 8;
      ctx!.shadowColor = "#ff6a00";
      const pts = 7;
      ctx!.beginPath();
      for (let i = 0; i < pts; i++) {
        const ang = (i / pts) * Math.PI * 2;
        const rr = a.r * (0.75 + Math.sin(i * 2.3) * 0.25);
        const px = Math.cos(ang) * rr;
        const py = Math.sin(ang) * rr;
        if (i === 0) ctx!.moveTo(px, py);
        else ctx!.lineTo(px, py);
      }
      ctx!.closePath();
      ctx!.fillStyle = "#2a1a0a";
      ctx!.fill();
      ctx!.strokeStyle = "#ff6a00";
      ctx!.lineWidth = 2;
      ctx!.stroke();
      ctx!.shadowBlur = 0;
      ctx!.restore();
    }

    function loop() {
      if (!ctx) return;
      const s = st.current;
      const ph = phaseRef.current;

      ctx.fillStyle = "#06060f";
      ctx.fillRect(0, 0, W, H);
      // Stars
      if (s.frame % 2 === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        const sx = Math.random() * W;
        const sy = Math.random() * H;
        ctx.fillRect(sx, sy, 1, 1);
      }

      if (ph === "start") {
        ctx.shadowBlur = 25;
        ctx.shadowColor = "#00e5ff";
        ctx.fillStyle = "#00e5ff";
        ctx.font = "bold 44px 'Bricolage Grotesque', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("ASTEROID", W / 2, H / 2 - 60);
        ctx.fillText("SHOOTER", W / 2, H / 2 - 10);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillText(
          "← → Arrow or A/D to move · Space to shoot",
          W / 2,
          H / 2 + 40,
        );
        ctx.fillText("Press SPACE to start", W / 2, H / 2 + 62);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (ph === "over") {
        ctx.fillStyle = "rgba(0,0,10,0.85)";
        ctx.fillRect(0, 0, W, H);
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#ff4466";
        ctx.fillStyle = "#ff4466";
        ctx.font = "bold 44px 'Bricolage Grotesque', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", W / 2, H / 2 - 50);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#00e5ff";
        ctx.font = "bold 30px 'JetBrains Mono', monospace";
        ctx.fillText(`${s.score}`, W / 2, H / 2 + 10);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillText("SPACE or tap to retry", W / 2, H / 2 + 50);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // ── Playing ──
      s.frame++;
      if (s.invincible > 0) s.invincible--;

      // Move ship
      if (keys.current.left)
        s.shipX = Math.max(SHIP_W / 2 + 4, s.shipX - SHIP_SPEED);
      if (keys.current.right)
        s.shipX = Math.min(W - SHIP_W / 2 - 4, s.shipX + SHIP_SPEED);

      // Shoot
      s.shootTimer++;
      if (keys.current.space && s.shootTimer >= 12) {
        s.shootTimer = 0;
        s.bullets.push({ x: s.shipX, y: H - SHIP_H - 26, id: nextId++ });
      }

      // Spawn asteroids
      s.astTimer++;
      const astInterval = Math.max(35, 90 - s.frame * 0.04);
      if (s.astTimer >= astInterval) {
        s.astTimer = 0;
        s.asteroids.push(spawnAsteroid(s.frame));
      }

      // Move bullets
      for (const b of s.bullets) b.y -= BULLET_SPEED;
      s.bullets = s.bullets.filter((b) => b.y > -20);

      // Move asteroids
      for (const a of s.asteroids) {
        a.x += a.vx;
        a.y += a.vy;
        a.rot += a.rotV;
      }
      s.asteroids = s.asteroids.filter((a) => a.y < H + a.r);

      // Score timer
      s.scoreTimer++;
      if (s.scoreTimer >= 60) {
        s.scoreTimer = 0;
        s.score++;
        setScore(s.score);
      }

      // Bullet-asteroid collisions
      const toRemoveBullets = new Set<number>();
      const toRemoveAsts = new Set<number>();
      for (const b of s.bullets) {
        for (const a of s.asteroids) {
          if (toRemoveAsts.has(a.id)) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          if (Math.sqrt(dx * dx + dy * dy) < a.r + 4) {
            toRemoveBullets.add(b.id);
            toRemoveAsts.add(a.id);
            s.score += Math.round(a.r);
            setScore(s.score);
            // Particles
            for (let p = 0; p < 6; p++) {
              s.particles.push({
                x: a.x,
                y: a.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 30,
                maxLife: 30,
                color: "#ff6a00",
              });
            }
          }
        }
      }
      s.bullets = s.bullets.filter((b) => !toRemoveBullets.has(b.id));
      s.asteroids = s.asteroids.filter((a) => !toRemoveAsts.has(a.id));

      // Ship-asteroid collision
      if (s.invincible === 0) {
        const shipY = H - SHIP_H - 20;
        for (const a of s.asteroids) {
          const dx = s.shipX - a.x;
          const dy = shipY + SHIP_H / 2 - a.y;
          if (Math.sqrt(dx * dx + dy * dy) < a.r + 14) {
            s.lives--;
            setLives(s.lives);
            s.invincible = 90;
            s.asteroids = s.asteroids.filter((aa) => aa.id !== a.id);
            if (s.lives <= 0) {
              phaseRef.current = "over";
              setPhase("over");
              setHighScore((h) => Math.max(h, s.score));
              rafRef.current = requestAnimationFrame(loop);
              return;
            }
            break;
          }
        }
      }

      // Move particles
      for (const p of s.particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
      }
      s.particles = s.particles.filter((p) => p.life > 0);

      // Draw particles
      for (const p of s.particles) {
        const a = p.life / p.maxLife;
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * a, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw asteroids
      for (const a of s.asteroids) drawAsteroid(a);

      // Draw bullets
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#a855f7";
      ctx.fillStyle = "#c084fc";
      for (const b of s.bullets) {
        ctx.beginPath();
        ctx.roundRect(b.x - BULLET_W / 2, b.y, BULLET_W, BULLET_H, 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Draw ship
      drawShip(ctx, s.shipX, s.invincible);

      // HUD
      ctx.fillStyle = "rgba(0,5,20,0.7)";
      ctx.beginPath();
      ctx.roundRect(6, 6, 130, 44, 5);
      ctx.fill();
      ctx.fillStyle = "rgba(0,229,255,0.4)";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText("SCORE", 14, 22);
      ctx.fillStyle = "#00e5ff";
      ctx.font = "bold 15px 'JetBrains Mono', monospace";
      ctx.fillText(String(s.score).padStart(5, "0"), 14, 41);

      // Lives
      ctx.fillStyle = "#ff4466";
      for (let i = 0; i < s.lives; i++) {
        ctx.font = "14px serif";
        ctx.fillText("♥", W - 26 - i * 18, 28);
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawShip]);

  const handleClick = useCallback(() => {
    if (phaseRef.current === "start" || phaseRef.current === "over") initGame();
  }, [initGame]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        style={{
          borderRadius: 10,
          boxShadow:
            "0 0 0 1.5px rgba(0,229,255,0.35), 0 0 30px rgba(0,229,255,0.1)",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleClick();
          }}
          tabIndex={0}
          style={{
            display: "block",
            cursor: "pointer",
            maxWidth: "100%",
            touchAction: "none",
          }}
          aria-label="Asteroid Shooter Game"
        />
      </div>
      <div className="flex gap-6 text-xs font-mono">
        <span style={{ color: "rgba(0,229,255,0.6)" }}>
          SCORE: <strong style={{ color: "#00e5ff" }}>{score}</strong>
        </span>
        <span style={{ color: "rgba(255,68,102,0.6)" }}>
          LIVES:{" "}
          <strong style={{ color: "#ff4466" }}>{"♥".repeat(lives)}</strong>
        </span>
        <span style={{ color: "rgba(255,215,0,0.6)" }}>
          BEST:{" "}
          <strong style={{ color: "oklch(0.78 0.18 75)" }}>{highScore}</strong>
        </span>
      </div>
      <p
        style={{
          color: "rgba(255,255,255,0.25)",
          fontSize: 11,
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {phase === "playing"
          ? "← → to move · Space to shoot"
          : "Tap or Space to start"}
      </p>
    </div>
  );
}
