import { useEffect, useRef, useState } from "react";

export default function DartGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const [display, setDisplay] = useState({
    score: 0,
    darts: 9,
    gameOver: false,
  });

  function initState() {
    stateRef.current = {
      score: 0,
      darts: 9,
      gameOver: false,
      hits: [] as { x: number; y: number; pts: number }[],
      raf: 0,
      mouse: { x: 200, y: 200 },
      wobble: 0,
    };
    setDisplay({ score: 0, darts: 9, gameOver: false });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: game init on mount
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    initState();
    const s = stateRef.current;
    const CX = 200;
    const CY = 190;

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      s.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    });
    canvas.addEventListener("click", () => {
      if (s.gameOver) return;
      const wobble = (Math.random() - 0.5) * 20;
      const ax = s.mouse.x + wobble;
      const ay = s.mouse.y + wobble;
      const dist = Math.hypot(ax - CX, ay - CY);
      const pts =
        dist < 15
          ? 50
          : dist < 35
            ? 25
            : dist < 60
              ? 10
              : dist < 90
                ? 5
                : dist < 120
                  ? 1
                  : 0;
      s.score += pts;
      s.darts--;
      s.hits.push({ x: ax, y: ay, pts });
      if (s.darts <= 0) {
        s.gameOver = true;
        setDisplay({ score: s.score, darts: 0, gameOver: true });
      } else setDisplay({ score: s.score, darts: s.darts, gameOver: false });
    });

    function loop() {
      s.raf = requestAnimationFrame(loop);
      ctx.fillStyle = "#1a0808";
      ctx.fillRect(0, 0, 400, 400);
      const colors = [
        "#ffffff",
        "#000000",
        "#ff0000",
        "#00aa00",
        "#ff4444",
        "#228822",
      ];
      const radii = [120, 90, 60, 35, 15, 5];
      for (let i = 0; i < radii.length; i++) {
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(CX, CY, radii[i], 0, Math.PI * 2);
        ctx.fill();
      }
      // Score labels
      const scores = ["", "1", "5", "10", "25", "50"];
      ctx.fillStyle = "#ffff00";
      ctx.textAlign = "center";
      for (let i = 1; i < radii.length; i++) {
        ctx.font = `${Math.max(8, 14 - i)}px monospace`;
        ctx.fillText(scores[i], CX + radii[i] - 12, CY + 4);
      }
      // Darts
      for (const h of s.hits) {
        ctx.fillStyle = "#888";
        ctx.fillRect(h.x - 1, h.y - 8, 3, 16);
        ctx.fillStyle = h.pts > 0 ? "#ffff00" : "#ffffff40";
        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(h.pts > 0 ? `+${h.pts}` : "0", h.x, h.y - 12);
      }
      // Crosshair
      ctx.strokeStyle = "rgba(255,255,0,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(s.mouse.x - 12, s.mouse.y);
      ctx.lineTo(s.mouse.x + 12, s.mouse.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s.mouse.x, s.mouse.y - 12);
      ctx.lineTo(s.mouse.x, s.mouse.y + 12);
      ctx.stroke();
    }
    loop();
    return () => cancelAnimationFrame(s.raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-yellow-400">Score: {display.score}</span>
        <span className="text-red-400">Darts: {display.darts}</span>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded border border-red-500/30 cursor-none"
        />
        {display.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded">
            <p className="text-2xl font-bold text-red-400 mb-2">DARTS DONE!</p>
            <p className="text-yellow-400 mb-4">Score: {display.score} / 450</p>
            <button
              type="button"
              onClick={() => {
                initState();
              }}
              className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded"
            >
              Restart
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-white/40">
        Aim and click to throw! Watch for wobble.
      </p>
    </div>
  );
}
