import { useEffect, useRef, useState } from "react";

type GameState = "start" | "playing" | "paused" | "gameover";

const CANVAS_W = 800;
const CANVAS_H = 500;
const PADDLE_W = 14;
const PADDLE_H = 90;
const BALL_R = 10;
const PADDLE_SPEED = 6;
const BALL_SPEED_INIT = 5;
const WIN_SCORE = 7;

interface GameData {
  p1y: number;
  p2y: number;
  bx: number;
  by: number;
  bvx: number;
  bvy: number;
  p1score: number;
  p2score: number;
}

function initGame(): GameData {
  return {
    p1y: CANVAS_H / 2 - PADDLE_H / 2,
    p2y: CANVAS_H / 2 - PADDLE_H / 2,
    bx: CANVAS_W / 2,
    by: CANVAS_H / 2,
    bvx: BALL_SPEED_INIT * (Math.random() > 0.5 ? 1 : -1),
    bvy: (Math.random() * 3 + 1) * (Math.random() > 0.5 ? 1 : -1),
    p1score: 0,
    p2score: 0,
  };
}

export default function MultiplayerPong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("start");
  const [winner, setWinner] = useState<string>("");
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const keysRef = useRef<Set<string>>(new Set());
  const gameDataRef = useRef<GameData>(initGame());
  const animRef = useRef<number>(0);
  const stateRef = useRef<GameState>("start");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Responsive scale
  useEffect(() => {
    const updateScale = () => {
      const container = containerRef.current;
      if (!container) return;
      const w = container.clientWidth;
      setScale(Math.min(1, w / CANVAS_W));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Keep stateRef in sync
  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  // Keyboard
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === "Enter" && stateRef.current === "start") {
        gameDataRef.current = initGame();
        setScores({ p1: 0, p2: 0 });
        setGameState("playing");
      }
      if (e.key === "p" || e.key === "P") {
        setGameState((prev) => {
          const next =
            prev === "playing"
              ? "paused"
              : prev === "paused"
                ? "playing"
                : prev;
          stateRef.current = next;
          return next;
        });
      }
      if (["ArrowUp", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Touch zones
  const touchRef = useRef({ p1: 0, p2: 0 }); // -1 up, 1 down, 0 none
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    for (let i = 0; i < e.touches.length; i++) {
      const t = e.touches[i];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) continue;
      const relX = (t.clientX - rect.left) / scale;
      const relY = (t.clientY - rect.top) / scale;
      const isTop = relY < CANVAS_H / 2;
      const dir = isTop ? -1 : 1;
      if (relX < CANVAS_W / 2) {
        touchRef.current.p1 = dir;
      } else {
        touchRef.current.p2 = dir;
      }
    }
  };
  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.touches.length === 0) {
      touchRef.current = { p1: 0, p2: 0 };
    }
  };

  // Draw
  function draw(
    ctx: CanvasRenderingContext2D,
    data: GameData,
    state: GameState,
  ) {
    // Background
    ctx.fillStyle = "#050810";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Center line
    ctx.setLineDash([14, 14]);
    ctx.strokeStyle = "oklch(0.82 0.18 200 / 0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CANVAS_W / 2, 0);
    ctx.lineTo(CANVAS_W / 2, CANVAS_H);
    ctx.stroke();
    ctx.setLineDash([]);

    // Score
    ctx.font = "bold 32px 'Geist Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(0,245,255,0.7)";
    ctx.shadowColor = "#00f5ff";
    ctx.shadowBlur = 12;
    ctx.fillText(`${data.p1score}`, CANVAS_W / 2 - 80, 50);
    ctx.fillText(`${data.p2score}`, CANVAS_W / 2 + 80, 50);
    ctx.shadowBlur = 0;

    // Player labels
    ctx.font = "11px 'Geist Mono', monospace";
    ctx.fillStyle = "rgba(0,245,255,0.4)";
    ctx.fillText("P1", CANVAS_W / 2 - 80, 68);
    ctx.fillText("P2", CANVAS_W / 2 + 80, 68);

    // Paddles
    const drawPaddle = (x: number, y: number, color: string, glow: string) => {
      ctx.shadowColor = glow;
      ctx.shadowBlur = 20;
      ctx.fillStyle = color;
      const r = 6;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + PADDLE_W - r, y);
      ctx.quadraticCurveTo(x + PADDLE_W, y, x + PADDLE_W, y + r);
      ctx.lineTo(x + PADDLE_W, y + PADDLE_H - r);
      ctx.quadraticCurveTo(
        x + PADDLE_W,
        y + PADDLE_H,
        x + PADDLE_W - r,
        y + PADDLE_H,
      );
      ctx.lineTo(x + r, y + PADDLE_H);
      ctx.quadraticCurveTo(x, y + PADDLE_H, x, y + PADDLE_H - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    drawPaddle(20, data.p1y, "#00f5ff", "#00f5ff");
    drawPaddle(CANVAS_W - 20 - PADDLE_W, data.p2y, "#c084fc", "#c084fc");

    // Ball
    ctx.shadowColor = "#00f5ff";
    ctx.shadowBlur = 24;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(data.bx, data.by, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (state === "start") {
      // Overlay
      ctx.fillStyle = "rgba(5,8,16,0.75)";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.font = "bold 48px 'Cabinet Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#00f5ff";
      ctx.shadowColor = "#00f5ff";
      ctx.shadowBlur = 24;
      ctx.fillText("MULTIPLAYER PONG", CANVAS_W / 2, 160);
      ctx.shadowBlur = 0;

      ctx.font = "16px 'Geist Mono', monospace";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText(
        "P1: W / S keys    P2: Arrow Up / Arrow Down",
        CANVAS_W / 2,
        220,
      );
      ctx.fillText("First to 7 wins!  |  P = Pause", CANVAS_W / 2, 248);

      ctx.font = "bold 22px 'Geist Mono', monospace";
      ctx.fillStyle = "#c084fc";
      ctx.shadowColor = "#c084fc";
      ctx.shadowBlur = 16;
      ctx.fillText("Press ENTER to Start", CANVAS_W / 2, 310);
      ctx.shadowBlur = 0;

      // Mobile hint
      ctx.font = "13px 'Geist Mono', monospace";
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillText(
        "Mobile: Tap left/right halves to control paddles",
        CANVAS_W / 2,
        360,
      );
    }

    if (state === "paused") {
      ctx.fillStyle = "rgba(5,8,16,0.65)";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.font = "bold 48px 'Cabinet Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#facc15";
      ctx.shadowColor = "#facc15";
      ctx.shadowBlur = 20;
      ctx.fillText("PAUSED", CANVAS_W / 2, CANVAS_H / 2 - 10);
      ctx.shadowBlur = 0;
      ctx.font = "16px 'Geist Mono', monospace";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText("Press P to resume", CANVAS_W / 2, CANVAS_H / 2 + 30);
    }
  }

  // Game loop
  // biome-ignore lint/correctness/useExhaustiveDependencies: draw is stable, defined in component scope
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const state = stateRef.current;
      const data = gameDataRef.current;

      if (state === "playing") {
        // Move paddles
        const keys = keysRef.current;
        const touch = touchRef.current;

        // P1
        if (keys.has("w") || keys.has("W") || touch.p1 === -1)
          data.p1y -= PADDLE_SPEED;
        if (keys.has("s") || keys.has("S") || touch.p1 === 1)
          data.p1y += PADDLE_SPEED;
        // P2
        if (keys.has("ArrowUp") || touch.p2 === -1) data.p2y -= PADDLE_SPEED;
        if (keys.has("ArrowDown") || touch.p2 === 1) data.p2y += PADDLE_SPEED;

        // Clamp
        data.p1y = Math.max(0, Math.min(CANVAS_H - PADDLE_H, data.p1y));
        data.p2y = Math.max(0, Math.min(CANVAS_H - PADDLE_H, data.p2y));

        // Move ball
        data.bx += data.bvx;
        data.by += data.bvy;

        // Wall bounce top/bottom
        if (data.by - BALL_R <= 0) {
          data.by = BALL_R;
          data.bvy = Math.abs(data.bvy);
        }
        if (data.by + BALL_R >= CANVAS_H) {
          data.by = CANVAS_H - BALL_R;
          data.bvy = -Math.abs(data.bvy);
        }

        // P1 paddle collision (left)
        const p1x = 20;
        if (
          data.bx - BALL_R <= p1x + PADDLE_W &&
          data.bx + BALL_R >= p1x &&
          data.by >= data.p1y &&
          data.by <= data.p1y + PADDLE_H &&
          data.bvx < 0
        ) {
          data.bvx = Math.abs(data.bvx) * 1.05;
          const hitPos = (data.by - (data.p1y + PADDLE_H / 2)) / (PADDLE_H / 2);
          data.bvy = hitPos * 5;
          data.bx = p1x + PADDLE_W + BALL_R;
        }

        // P2 paddle collision (right)
        const p2x = CANVAS_W - 20 - PADDLE_W;
        if (
          data.bx + BALL_R >= p2x &&
          data.bx - BALL_R <= p2x + PADDLE_W &&
          data.by >= data.p2y &&
          data.by <= data.p2y + PADDLE_H &&
          data.bvx > 0
        ) {
          data.bvx = -Math.abs(data.bvx) * 1.05;
          const hitPos = (data.by - (data.p2y + PADDLE_H / 2)) / (PADDLE_H / 2);
          data.bvy = hitPos * 5;
          data.bx = p2x - BALL_R;
        }

        // Cap ball speed
        const speed = Math.sqrt(data.bvx * data.bvx + data.bvy * data.bvy);
        if (speed > 18) {
          data.bvx = (data.bvx / speed) * 18;
          data.bvy = (data.bvy / speed) * 18;
        }

        // Score
        if (data.bx - BALL_R < 0) {
          data.p2score += 1;
          setScores({ p1: data.p1score, p2: data.p2score });
          if (data.p2score >= WIN_SCORE) {
            setWinner("Player 2");
            setGameState("gameover");
            stateRef.current = "gameover";
          } else {
            Object.assign(data, {
              bx: CANVAS_W / 2,
              by: CANVAS_H / 2,
              bvx: BALL_SPEED_INIT,
              bvy: (Math.random() * 3 + 1) * (Math.random() > 0.5 ? 1 : -1),
            });
          }
        }
        if (data.bx + BALL_R > CANVAS_W) {
          data.p1score += 1;
          setScores({ p1: data.p1score, p2: data.p2score });
          if (data.p1score >= WIN_SCORE) {
            setWinner("Player 1");
            setGameState("gameover");
            stateRef.current = "gameover";
          } else {
            Object.assign(data, {
              bx: CANVAS_W / 2,
              by: CANVAS_H / 2,
              bvx: -BALL_SPEED_INIT,
              bvy: (Math.random() * 3 + 1) * (Math.random() > 0.5 ? 1 : -1),
            });
          }
        }
      }

      draw(ctx, gameDataRef.current, stateRef.current);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handlePlayAgain = () => {
    gameDataRef.current = initGame();
    setScores({ p1: 0, p2: 0 });
    setWinner("");
    setGameState("playing");
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full" ref={containerRef}>
      {/* Score HUD above canvas */}
      <div
        className="flex items-center gap-8 px-6 py-3 rounded-lg font-mono text-lg font-bold"
        style={{
          background: "oklch(0.10 0.025 200 / 0.9)",
          border: "1px solid oklch(0.82 0.18 200 / 0.3)",
          boxShadow: "0 0 20px oklch(0.82 0.18 200 / 0.1)",
        }}
      >
        <span style={{ color: "oklch(0.82 0.18 200)" }}>P1: {scores.p1}</span>
        <span style={{ color: "rgba(255,255,255,0.3)" }}>vs</span>
        <span style={{ color: "#c084fc" }}>P2: {scores.p2}</span>
      </div>

      {/* Canvas wrapper */}
      <div
        style={{
          width: CANVAS_W * scale,
          height: CANVAS_H * scale,
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid oklch(0.82 0.18 200 / 0.25)",
          boxShadow:
            "0 0 40px oklch(0.82 0.18 200 / 0.1), 0 0 80px oklch(0.62 0.22 295 / 0.06)",
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{
            display: "block",
            width: CANVAS_W * scale,
            height: CANVAS_H * scale,
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={(e) => e.preventDefault()}
          data-ocid="pong.canvas_target"
        />

        {/* Game Over overlay */}
        {gameState === "gameover" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            style={{ background: "rgba(5,8,16,0.88)" }}
          >
            <div
              className="font-display font-black text-4xl md:text-5xl text-center"
              style={{
                color: "#facc15",
                textShadow: "0 0 30px #facc15, 0 0 60px #facc1580",
                animation: "pulse 1s ease-in-out infinite alternate",
              }}
            >
              🏆 {winner} WINS!
            </div>
            <div
              className="font-mono text-lg"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {scores.p1} – {scores.p2}
            </div>
            <button
              type="button"
              className="font-display font-bold px-8 py-3 rounded text-sm tracking-widest uppercase transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: "oklch(0.82 0.18 200 / 0.15)",
                border: "1.5px solid oklch(0.82 0.18 200 / 0.6)",
                color: "oklch(0.82 0.18 200)",
                boxShadow: "0 0 20px oklch(0.82 0.18 200 / 0.2)",
              }}
              onClick={handlePlayAgain}
              data-ocid="pong.play_again.button"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Start overlay — tap to start on mobile */}
        {gameState === "start" && (
          <button
            type="button"
            className="absolute inset-0 w-full h-full bg-transparent cursor-pointer"
            style={{ touchAction: "none" }}
            onClick={() => {
              gameDataRef.current = initGame();
              setScores({ p1: 0, p2: 0 });
              setGameState("playing");
            }}
            aria-label="Start game"
            data-ocid="pong.start.button"
          />
        )}
      </div>

      {/* Controls reference */}
      <div
        className="flex flex-wrap gap-4 justify-center text-xs font-mono"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        <span>P1: W / S</span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
        <span>P2: ↑ / ↓</span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
        <span>P = Pause</span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
        <span>Enter = Start</span>
      </div>
    </div>
  );
}
