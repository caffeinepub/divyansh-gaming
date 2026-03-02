import { useCallback, useEffect, useRef, useState } from "react";

const W = 480;
const H = 540;
const PAD_W = 90;
const PAD_H = 12;
const BALL_R = 8;
const ROWS = 6;
const COLS = 10;
const BRICK_W = 44;
const BRICK_H = 18;
const BRICK_GAD_X = 2;
const BRICK_GAD_Y = 2;
const BRICKS_OFFSET_X = 4;
const BRICKS_OFFSET_Y = 50;

type Phase = "start" | "playing" | "win" | "over";

interface Brick {
  x: number;
  y: number;
  alive: boolean;
  color: string;
}

const ROW_COLORS = [
  "#ff4466",
  "#ff6a00",
  "#ffd700",
  "#00e5ff",
  "#a855f7",
  "#00ff88",
];

function makeBricks(): Brick[] {
  const bricks: Brick[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      bricks.push({
        x: BRICKS_OFFSET_X + c * (BRICK_W + BRICK_GAD_X),
        y: BRICKS_OFFSET_Y + r * (BRICK_H + BRICK_GAD_Y),
        alive: true,
        color: ROW_COLORS[r % ROW_COLORS.length],
      });
    }
  }
  return bricks;
}

export default function BrickBreaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [_phase, setPhase] = useState<Phase>("start");
  const [_score, setScore] = useState(0);
  const phaseRef = useRef<Phase>("start");
  const rafRef = useRef(0);

  const stateRef = useRef({
    padX: W / 2 - PAD_W / 2,
    ballX: W / 2,
    ballY: H - 80,
    vx: 3.5,
    vy: -4,
    bricks: makeBricks(),
    score: 0,
    mouseX: W / 2,
  });

  const initGame = useCallback(() => {
    const s = stateRef.current;
    s.padX = W / 2 - PAD_W / 2;
    s.ballX = W / 2;
    s.ballY = H - 80;
    s.vx = 3.5 * (Math.random() > 0.5 ? 1 : -1);
    s.vy = -4;
    s.bricks = makeBricks();
    s.score = 0;
    s.mouseX = W / 2;
    setScore(0);
    phaseRef.current = "playing";
    setPhase("playing");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      stateRef.current.mouseX = (e.clientX - rect.left) * (W / rect.width);
    };
    const onTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      stateRef.current.mouseX =
        (e.touches[0].clientX - rect.left) * (W / rect.width);
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  const drawFrame = useCallback((ctx: CanvasRenderingContext2D) => {
    const s = stateRef.current;
    const ph = phaseRef.current;

    ctx.fillStyle = "#06060f";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(0,229,255,0.04)";
    ctx.lineWidth = 1;
    for (let y = 0; y < H; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    for (let x = 0; x < W; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    if (ph === "start") {
      ctx.shadowBlur = 25;
      ctx.shadowColor = "#00e5ff";
      ctx.fillStyle = "#00e5ff";
      ctx.font = "bold 48px 'Bricolage Grotesque', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("BRICK", W / 2, H / 2 - 60);
      ctx.fillText("BREAKER", W / 2, H / 2 - 5);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillText("Move mouse / touch to control paddle", W / 2, H / 2 + 40);
      ctx.fillText("Click or tap to start", W / 2, H / 2 + 60);
      return;
    }

    if (ph === "over" || ph === "win") {
      ctx.fillStyle = "rgba(0,0,10,0.88)";
      ctx.fillRect(0, 0, W, H);
      ctx.shadowBlur = 20;
      ctx.shadowColor = ph === "win" ? "#00ff88" : "#ff4466";
      ctx.fillStyle = ph === "win" ? "#00ff88" : "#ff4466";
      ctx.font = "bold 44px 'Bricolage Grotesque', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(ph === "win" ? "YOU WIN!" : "GAME OVER", W / 2, H / 2 - 40);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#00e5ff";
      ctx.font = "bold 28px 'JetBrains Mono', monospace";
      ctx.fillText(`${s.score}`, W / 2, H / 2 + 10);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillText("Click or tap to retry", W / 2, H / 2 + 50);
      return;
    }

    // Move paddle
    s.padX = s.mouseX - PAD_W / 2;
    s.padX = Math.max(0, Math.min(W - PAD_W, s.padX));

    // Move ball
    s.ballX += s.vx;
    s.ballY += s.vy;

    // Wall bounces
    if (s.ballX - BALL_R < 0) {
      s.ballX = BALL_R;
      s.vx = Math.abs(s.vx);
    }
    if (s.ballX + BALL_R > W) {
      s.ballX = W - BALL_R;
      s.vx = -Math.abs(s.vx);
    }
    if (s.ballY - BALL_R < 0) {
      s.ballY = BALL_R;
      s.vy = Math.abs(s.vy);
    }

    // Paddle bounce
    const padY = H - 50;
    if (
      s.ballY + BALL_R >= padY &&
      s.ballY + BALL_R <= padY + PAD_H + 2 &&
      s.ballX >= s.padX &&
      s.ballX <= s.padX + PAD_W
    ) {
      const hitPct = (s.ballX - s.padX) / PAD_W;
      s.vx = (hitPct - 0.5) * 8;
      s.vy = -Math.abs(s.vy);
      s.ballY = padY - BALL_R;
    }

    // Ball fell off bottom
    if (s.ballY > H + 20) {
      phaseRef.current = "over";
      setPhase("over");
      return;
    }

    // Brick collision
    let alive = 0;
    for (const b of s.bricks) {
      if (!b.alive) continue;
      alive++;
      if (
        s.ballX + BALL_R > b.x &&
        s.ballX - BALL_R < b.x + BRICK_W &&
        s.ballY + BALL_R > b.y &&
        s.ballY - BALL_R < b.y + BRICK_H
      ) {
        b.alive = false;
        alive--;
        s.score += 10;
        setScore(s.score);

        // Determine bounce direction
        const overlapLeft = s.ballX + BALL_R - b.x;
        const overlapRight = b.x + BRICK_W - (s.ballX - BALL_R);
        const overlapTop = s.ballY + BALL_R - b.y;
        const overlapBottom = b.y + BRICK_H - (s.ballY - BALL_R);
        const minOverlap = Math.min(
          overlapLeft,
          overlapRight,
          overlapTop,
          overlapBottom,
        );
        if (minOverlap === overlapTop || minOverlap === overlapBottom)
          s.vy = -s.vy;
        else s.vx = -s.vx;
        break;
      }
    }
    if (alive === 0) {
      phaseRef.current = "win";
      setPhase("win");
      return;
    }

    // Draw bricks
    for (const b of s.bricks) {
      if (!b.alive) continue;
      ctx.shadowBlur = 6;
      ctx.shadowColor = b.color;
      ctx.fillStyle = `${b.color}33`;
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, BRICK_W, BRICK_H, 3);
      ctx.fill();
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw paddle
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#00e5ff";
    const pg = ctx.createLinearGradient(s.padX, H - 50, s.padX + PAD_W, H - 50);
    pg.addColorStop(0, "rgba(0,229,255,0.5)");
    pg.addColorStop(0.5, "rgba(0,229,255,0.8)");
    pg.addColorStop(1, "rgba(0,229,255,0.5)");
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.roundRect(s.padX, H - 50, PAD_W, PAD_H, 6);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw ball
    ctx.shadowBlur = 14;
    ctx.shadowColor = "#a855f7";
    ctx.fillStyle = "#c084fc";
    ctx.beginPath();
    ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Score HUD
    ctx.fillStyle = "rgba(0,5,20,0.7)";
    ctx.beginPath();
    ctx.roundRect(6, 6, 110, 32, 4);
    ctx.fill();
    ctx.fillStyle = "rgba(0,229,255,0.5)";
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText("SCORE", 12, 20);
    ctx.fillStyle = "#00e5ff";
    ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.fillText(`${s.score}`, 12, 33);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    function loop() {
      if (!ctx) return;
      drawFrame(ctx);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawFrame]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === " " &&
        (phaseRef.current === "start" ||
          phaseRef.current === "over" ||
          phaseRef.current === "win")
      ) {
        e.preventDefault();
        initGame();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [initGame]);

  const handleClick = () => {
    if (
      phaseRef.current === "start" ||
      phaseRef.current === "over" ||
      phaseRef.current === "win"
    )
      initGame();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        style={{
          borderRadius: 10,
          boxShadow:
            "0 0 0 1.5px rgba(168,85,247,0.4), 0 0 30px rgba(168,85,247,0.1)",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleClick();
          }}
          tabIndex={0}
          style={{
            display: "block",
            cursor: "none",
            maxWidth: "100%",
            touchAction: "none",
          }}
          aria-label="Brick Breaker Game"
        />
      </div>
      <p
        style={{
          color: "rgba(255,255,255,0.25)",
          fontSize: 11,
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {_phase === "playing"
          ? "Move mouse to control paddle"
          : "Click or tap to play"}
      </p>
    </div>
  );
}
