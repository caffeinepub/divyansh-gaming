import { useCallback, useEffect, useRef, useState } from "react";

const W = 360;
const H = 540;
const BIRD_X = 90;
const BIRD_R = 16;
const GRAVITY = 0.45;
const FLAP_FORCE = -7.5;
const PIPE_W = 52;
const PIPE_GAP = 150;
const PIPE_SPEED_BASE = 2.5;
const PIPE_INTERVAL = 90; // frames

type Phase = "start" | "playing" | "over";

interface Pipe {
  x: number;
  topH: number;
  scored: boolean;
}

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [_phase, setPhase] = useState<Phase>("start");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const phaseRef = useRef<Phase>("start");
  const rafRef = useRef(0);

  const st = useRef({
    birdY: H / 2,
    birdVY: 0,
    pipes: [] as Pipe[],
    frame: 0,
    score: 0,
    speed: PIPE_SPEED_BASE,
    rotation: 0,
    particles: [] as {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    }[],
  });

  const flap = useCallback(() => {
    if (phaseRef.current === "over") return;
    if (phaseRef.current === "start") {
      phaseRef.current = "playing";
      setPhase("playing");
      st.current.birdVY = FLAP_FORCE;
      return;
    }
    st.current.birdVY = FLAP_FORCE;
  }, []);

  const initGame = useCallback(() => {
    const s = st.current;
    s.birdY = H / 2;
    s.birdVY = 0;
    s.pipes = [];
    s.frame = 0;
    s.score = 0;
    s.speed = PIPE_SPEED_BASE;
    s.rotation = 0;
    s.particles = [];
    setScore(0);
    phaseRef.current = "start";
    setPhase("start");
  }, []);

  const handleInput = useCallback(() => {
    if (phaseRef.current === "over") {
      initGame();
    } else {
      flap();
    }
  }, [flap, initGame]);

  const drawBird = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      // Body
      ctx.shadowBlur = 14;
      ctx.shadowColor = "#ffd700";
      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.ellipse(0, 0, BIRD_R, BIRD_R - 2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Wing
      ctx.fillStyle = "#ff8c00";
      ctx.beginPath();
      ctx.ellipse(-4, 3, 10, 6, -0.4, 0, Math.PI * 2);
      ctx.fill();
      // Eye
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(6, -3, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.arc(7, -3, 2.5, 0, Math.PI * 2);
      ctx.fill();
      // Beak
      ctx.fillStyle = "#ff4400";
      ctx.beginPath();
      ctx.moveTo(12, -1);
      ctx.lineTo(18, 0);
      ctx.lineTo(12, 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function loop() {
      if (!ctx) return;
      const s = st.current;
      const ph = phaseRef.current;

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#0a0520");
      sky.addColorStop(0.6, "#0d0830");
      sky.addColorStop(1, "#1a0a10");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Stars
      if (s.frame % 3 === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        for (let i = 0; i < 3; i++) {
          const sx = Math.random() * W;
          const sy = Math.random() * H * 0.7;
          ctx.fillRect(sx, sy, 1, 1);
        }
      }

      // Ground
      ctx.fillStyle = "#1a4020";
      ctx.fillRect(0, H - 60, W, 60);
      ctx.fillStyle = "#0d2e14";
      ctx.fillRect(0, H - 60, W, 10);
      ctx.fillStyle = "#00ff88";
      ctx.fillRect(0, H - 62, W, 3);

      if (ph === "start") {
        drawBird(ctx, BIRD_X, s.birdY + Math.sin(Date.now() * 0.003) * 8, 0);
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#ffd700";
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 40px 'Bricolage Grotesque', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("FLAPPY", W / 2, H / 2 - 80);
        ctx.fillText("BIRD", W / 2, H / 2 - 32);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillText("TAP or SPACE to flap", W / 2, H / 2 + 20);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (ph === "over") {
        // Draw scene frozen
        for (const p of s.pipes) {
          ctx.fillStyle = "#00a040";
          ctx.fillRect(p.x, 0, PIPE_W, p.topH);
          ctx.fillRect(p.x, p.topH + PIPE_GAP, PIPE_W, H - p.topH - PIPE_GAP);
          ctx.fillStyle = "#00c050";
          ctx.fillRect(p.x - 4, p.topH - 20, PIPE_W + 8, 20);
          ctx.fillRect(p.x - 4, p.topH + PIPE_GAP, PIPE_W + 8, 20);
        }
        drawBird(ctx, BIRD_X, s.birdY, s.rotation);
        // Overlay
        ctx.fillStyle = "rgba(0,0,10,0.8)";
        ctx.fillRect(0, 0, W, H);
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ff4466";
        ctx.fillStyle = "#ff4466";
        ctx.font = "bold 40px 'Bricolage Grotesque', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", W / 2, H / 2 - 50);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 36px 'JetBrains Mono', monospace";
        ctx.fillText(`${s.score}`, W / 2, H / 2 + 5);
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillText("Tap or Space to retry", W / 2, H / 2 + 45);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // ── Playing ──
      s.frame++;
      s.speed = PIPE_SPEED_BASE + s.frame * 0.003;

      // Physics
      s.birdVY += GRAVITY;
      s.birdY += s.birdVY;
      s.rotation = Math.min(Math.PI / 2.5, Math.max(-0.4, s.birdVY * 0.07));

      // Spawn pipes
      if (s.frame % PIPE_INTERVAL === 0) {
        const topH = 60 + Math.random() * (H - PIPE_GAP - 120);
        s.pipes.push({ x: W, topH, scored: false });
      }

      // Move & score pipes
      for (const p of s.pipes) {
        p.x -= s.speed;
        if (!p.scored && p.x + PIPE_W < BIRD_X) {
          p.scored = true;
          s.score++;
          setScore(s.score);
        }
      }
      s.pipes = s.pipes.filter((p) => p.x > -PIPE_W);

      // Collision
      const dead =
        s.birdY - BIRD_R < 0 ||
        s.birdY + BIRD_R > H - 60 ||
        s.pipes.some((p) => {
          if (BIRD_X + BIRD_R < p.x || BIRD_X - BIRD_R > p.x + PIPE_W)
            return false;
          return (
            s.birdY - BIRD_R < p.topH || s.birdY + BIRD_R > p.topH + PIPE_GAP
          );
        });

      if (dead) {
        phaseRef.current = "over";
        setPhase("over");
        setBest((b) => Math.max(b, s.score));
      }

      // Draw pipes
      for (const p of s.pipes) {
        // Shadow
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#00ff88";
        ctx.fillStyle = "#006030";
        ctx.fillRect(p.x, 0, PIPE_W, p.topH);
        ctx.fillRect(p.x, p.topH + PIPE_GAP, PIPE_W, H - p.topH - PIPE_GAP);
        ctx.fillStyle = "#00a040";
        ctx.fillRect(p.x + 4, 0, PIPE_W - 8, p.topH);
        ctx.fillRect(
          p.x + 4,
          p.topH + PIPE_GAP,
          PIPE_W - 8,
          H - p.topH - PIPE_GAP,
        );
        // Caps
        ctx.fillStyle = "#00c050";
        ctx.beginPath();
        ctx.roundRect(p.x - 4, p.topH - 22, PIPE_W + 8, 22, [0, 0, 4, 4]);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(p.x - 4, p.topH + PIPE_GAP, PIPE_W + 8, 22, [4, 4, 0, 0]);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      drawBird(ctx, BIRD_X, s.birdY, s.rotation);

      // Score
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#ffd700";
      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 36px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${s.score}`, W / 2, 50);
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawBird]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Spacebar" || e.key === "ArrowUp") {
        e.preventDefault();
        handleInput();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleInput]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        style={{
          borderRadius: 10,
          boxShadow:
            "0 0 0 1.5px rgba(255,215,0,0.4), 0 0 30px rgba(255,215,0,0.08)",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onClick={handleInput}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleInput();
          }}
          tabIndex={0}
          style={{
            display: "block",
            cursor: "pointer",
            maxWidth: "100%",
            touchAction: "none",
          }}
          aria-label="Flappy Bird Game"
        />
      </div>
      <div className="flex gap-6 text-xs font-mono">
        <span style={{ color: "rgba(255,215,0,0.7)" }}>
          SCORE: <strong style={{ color: "#ffd700" }}>{score}</strong>
        </span>
        <span style={{ color: "rgba(255,200,0,0.5)" }}>
          BEST: <strong style={{ color: "oklch(0.78 0.18 75)" }}>{best}</strong>
        </span>
      </div>
    </div>
  );
}
