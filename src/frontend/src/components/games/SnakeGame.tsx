import { useCallback, useEffect, useRef, useState } from "react";

const COLS = 20;
const ROWS = 20;
const CELL = 24;
const W = COLS * CELL;
const H = ROWS * CELL;
const TICK_BASE = 140;
const TICK_MIN = 60;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Phase = "start" | "playing" | "over";
type Pt = { x: number; y: number };

function randomFood(snake: Pt[]): Pt {
  let pt: Pt;
  do {
    pt = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some((s) => s.x === pt.x && s.y === pt.y));
  return pt;
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("start");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const phaseRef = useRef<Phase>("start");
  const dirRef = useRef<Dir>("RIGHT");
  const nextDirRef = useRef<Dir>("RIGHT");
  const snakeRef = useRef<Pt[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Pt>({ x: 15, y: 10 });
  const scoreRef = useRef(0);
  const tickRef = useRef(TICK_BASE);
  const lastTickRef = useRef(0);
  const rafRef = useRef(0);
  const frameRef = useRef(0);

  const initGame = useCallback(() => {
    const snake = [
      { x: 12, y: 10 },
      { x: 11, y: 10 },
      { x: 10, y: 10 },
    ];
    snakeRef.current = snake;
    dirRef.current = "RIGHT";
    nextDirRef.current = "RIGHT";
    foodRef.current = randomFood(snake);
    scoreRef.current = 0;
    tickRef.current = TICK_BASE;
    lastTickRef.current = 0;
    frameRef.current = 0;
    setScore(0);
    phaseRef.current = "playing";
    setPhase("playing");
  }, []);

  const drawGame = useCallback((ctx: CanvasRenderingContext2D, now: number) => {
    const phase = phaseRef.current;

    // Background
    ctx.fillStyle = "#06060f";
    ctx.fillRect(0, 0, W, H);

    // Grid dots
    ctx.fillStyle = "rgba(0,229,255,0.05)";
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        ctx.beginPath();
        ctx.arc(c * CELL + CELL / 2, r * CELL + CELL / 2, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (phase === "start") {
      ctx.shadowBlur = 30;
      ctx.shadowColor = "#00e5ff";
      ctx.fillStyle = "#00e5ff";
      ctx.font = "bold 44px 'Bricolage Grotesque', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SNAKE", W / 2, H / 2 - 40);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(0,229,255,0.55)";
      ctx.font = "13px 'JetBrains Mono', monospace";
      ctx.fillText("Use WASD or Arrow Keys", W / 2, H / 2 + 5);
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillText("Press SPACE or tap to start", W / 2, H / 2 + 28);
      return;
    }

    if (phase === "over") {
      ctx.fillStyle = "rgba(0,0,10,0.85)";
      ctx.fillRect(0, 0, W, H);
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#ff4466";
      ctx.fillStyle = "#ff4466";
      ctx.font = "bold 40px 'Bricolage Grotesque', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", W / 2, H / 2 - 50);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#00e5ff";
      ctx.font = "bold 24px 'JetBrains Mono', monospace";
      ctx.fillText(String(scoreRef.current).padStart(4, "0"), W / 2, H / 2);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillText("SPACE or tap to retry", W / 2, H / 2 + 35);
      return;
    }

    // Tick logic
    if (now - lastTickRef.current > tickRef.current) {
      lastTickRef.current = now;
      dirRef.current = nextDirRef.current;
      const head = snakeRef.current[0];
      let nx = head.x;
      let ny = head.y;
      if (dirRef.current === "UP") ny--;
      if (dirRef.current === "DOWN") ny++;
      if (dirRef.current === "LEFT") nx--;
      if (dirRef.current === "RIGHT") nx++;

      // Wall collision
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
        phaseRef.current = "over";
        setPhase("over");
        setHighScore((h) => Math.max(h, scoreRef.current));
        return;
      }

      // Self collision
      if (snakeRef.current.some((s) => s.x === nx && s.y === ny)) {
        phaseRef.current = "over";
        setPhase("over");
        setHighScore((h) => Math.max(h, scoreRef.current));
        return;
      }

      const newSnake = [{ x: nx, y: ny }, ...snakeRef.current];
      const ateFood = nx === foodRef.current.x && ny === foodRef.current.y;
      if (ateFood) {
        scoreRef.current += 10;
        setScore(scoreRef.current);
        foodRef.current = randomFood(newSnake);
        tickRef.current = Math.max(
          TICK_MIN,
          TICK_BASE - scoreRef.current * 0.3,
        );
      } else {
        newSnake.pop();
      }
      snakeRef.current = newSnake;
    }

    // Draw food (pulsing)
    const pulse = Math.sin(now * 0.008) * 0.3 + 0.7;
    ctx.shadowBlur = 12 * pulse;
    ctx.shadowColor = "#00ff88";
    ctx.fillStyle = `rgba(0,255,136,${pulse})`;
    const fx = foodRef.current.x * CELL + 4;
    const fy = foodRef.current.y * CELL + 4;
    ctx.beginPath();
    ctx.roundRect(fx, fy, CELL - 8, CELL - 8, 4);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    const snake = snakeRef.current;
    for (let i = 0; i < snake.length; i++) {
      const seg = snake[i];
      const isHead = i === 0;
      const t = 1 - i / snake.length;
      const r = 2 + 3 * t;
      if (isHead) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00e5ff";
        ctx.fillStyle = "#00e5ff";
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(0,${Math.round(150 + 79 * t)},${Math.round(180 + 75 * t)},${0.6 + 0.4 * t})`;
      }
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, r);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Score HUD
    ctx.fillStyle = "rgba(0,5,20,0.7)";
    ctx.beginPath();
    ctx.roundRect(6, 6, 120, 36, 5);
    ctx.fill();
    ctx.fillStyle = "rgba(0,229,255,0.4)";
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText("SCORE", 14, 20);
    ctx.fillStyle = "#00e5ff";
    ctx.font = "bold 14px 'JetBrains Mono', monospace";
    ctx.fillText(String(scoreRef.current).padStart(4, "0"), 14, 36);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function loop(now: number) {
      if (!ctx) return;
      frameRef.current++;
      drawGame(ctx, now);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawGame]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const dir = dirRef.current;
      if (phaseRef.current === "start" || phaseRef.current === "over") {
        if (e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          initGame();
        }
      }
      if (phaseRef.current !== "playing") return;
      if (
        (e.key === "ArrowUp" || e.key === "w" || e.key === "W") &&
        dir !== "DOWN"
      )
        nextDirRef.current = "UP";
      if (
        (e.key === "ArrowDown" || e.key === "s" || e.key === "S") &&
        dir !== "UP"
      )
        nextDirRef.current = "DOWN";
      if (
        (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") &&
        dir !== "RIGHT"
      )
        nextDirRef.current = "LEFT";
      if (
        (e.key === "ArrowRight" || e.key === "d" || e.key === "D") &&
        dir !== "LEFT"
      )
        nextDirRef.current = "RIGHT";
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [initGame]);

  const handleTap = () => {
    if (phaseRef.current === "start" || phaseRef.current === "over") initGame();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        style={{
          borderRadius: 10,
          boxShadow:
            "0 0 0 1.5px rgba(0,229,255,0.35), 0 0 30px rgba(0,229,255,0.12)",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onClick={handleTap}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleTap();
          }}
          tabIndex={0}
          style={{
            display: "block",
            cursor: "pointer",
            maxWidth: "100%",
            touchAction: "none",
          }}
          aria-label="Snake Game"
        />
      </div>
      <div className="flex gap-6 text-xs font-mono">
        <span style={{ color: "rgba(0,229,255,0.6)" }}>
          SCORE:{" "}
          <strong style={{ color: "#00e5ff" }}>
            {String(score).padStart(4, "0")}
          </strong>
        </span>
        <span style={{ color: "rgba(255,200,0,0.6)" }}>
          BEST:{" "}
          <strong style={{ color: "oklch(0.78 0.18 75)" }}>
            {String(highScore).padStart(4, "0")}
          </strong>
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
          ? "WASD / Arrow keys to move"
          : "Tap or Space to start"}
      </p>
    </div>
  );
}
