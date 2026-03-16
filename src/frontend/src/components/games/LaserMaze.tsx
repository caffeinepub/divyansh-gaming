import { useEffect, useRef, useState } from "react";

export default function LaserMaze() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const [display, setDisplay] = useState({
    level: 1,
    gameOver: false,
    won: false,
  });

  const LEVELS = [
    [
      { x1: 0, y1: 150, x2: 280, y2: 150 },
      { x1: 120, y1: 250, x2: 400, y2: 250 },
    ],
    [
      { x1: 0, y1: 120, x2: 200, y2: 120 },
      { x1: 100, y1: 200, x2: 400, y2: 200 },
      { x1: 50, y1: 280, x2: 350, y2: 280 },
    ],
    [
      { x1: 0, y1: 100, x2: 180, y2: 100 },
      { x1: 220, y1: 100, x2: 400, y2: 100 },
      { x1: 100, y1: 200, x2: 300, y2: 200 },
      { x1: 0, y1: 300, x2: 400, y2: 300 },
    ],
  ];

  function initState(level = 0) {
    stateRef.current = {
      player: { x: 200, y: 360 },
      level,
      lasers: LEVELS[level] || LEVELS[0],
      goal: { x: 200, y: 30 },
      gameOver: false,
      won: false,
      raf: 0,
      keys: {} as Record<string, boolean>,
    };
    setDisplay({ level: level + 1, gameOver: false, won: false });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: game init on mount
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    initState(0);
    const s = stateRef.current;
    const onKey = (e: KeyboardEvent, d: boolean) => {
      s.keys[e.key] = d;
      e.preventDefault();
    };
    window.addEventListener("keydown", (e) => onKey(e, true));
    window.addEventListener("keyup", (e) => onKey(e, false));

    function ptSegDist(
      px: number,
      py: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
    ) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const t = Math.max(
        0,
        Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)),
      );
      return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
    }

    function loop() {
      s.raf = requestAnimationFrame(loop);
      if (s.gameOver || s.won) return;
      if (s.keys.ArrowLeft) s.player.x -= 2.5;
      if (s.keys.ArrowRight) s.player.x += 2.5;
      if (s.keys.ArrowUp) s.player.y -= 2.5;
      if (s.keys.ArrowDown) s.player.y += 2.5;
      s.player.x = Math.max(10, Math.min(390, s.player.x));
      s.player.y = Math.max(10, Math.min(390, s.player.y));

      for (const l of s.lasers) {
        if (ptSegDist(s.player.x, s.player.y, l.x1, l.y1, l.x2, l.y2) < 10) {
          s.gameOver = true;
          setDisplay((d) => ({ ...d, gameOver: true }));
          return;
        }
      }
      if (Math.hypot(s.player.x - s.goal.x, s.player.y - s.goal.y) < 20) {
        const nextLevel = s.level + 1;
        if (nextLevel >= LEVELS.length) {
          s.won = true;
          setDisplay((d) => ({ ...d, won: true }));
        } else {
          initState(nextLevel);
        }
        return;
      }

      ctx.fillStyle = "#050520";
      ctx.fillRect(0, 0, 400, 400);
      for (const l of s.lasers) {
        ctx.strokeStyle = "rgba(255,0,80,0.8)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(l.x2, l.y2);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255,0,80,0.2)";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(l.x2, l.y2);
        ctx.stroke();
      }
      // Goal
      ctx.fillStyle = "#00ff88";
      ctx.beginPath();
      ctx.arc(s.goal.x, s.goal.y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#003300";
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillText("EXIT", s.goal.x, s.goal.y + 4);
      // Player
      ctx.fillStyle = "#00ccff";
      ctx.beginPath();
      ctx.arc(s.player.x, s.player.y, 9, 0, Math.PI * 2);
      ctx.fill();
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
      <span className="text-cyan-400 font-mono">
        Level: {display.level} / {3}
      </span>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded border border-red-500/30"
        />
        {(display.gameOver || display.won) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded">
            <p
              className="text-2xl font-bold mb-4"
              style={{ color: display.won ? "#00ff88" : "#ff4466" }}
            >
              {display.won ? "ESCAPED!" : "ZAPPED!"}
            </p>
            <button
              type="button"
              onClick={() => {
                initState(0);
              }}
              className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded"
            >
              Restart
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-white/40">
        Arrow Keys: navigate | Reach the green exit
      </p>
    </div>
  );
}
