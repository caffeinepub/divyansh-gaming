import { useEffect, useRef, useState } from "react";

export default function ArcheryGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const [display, setDisplay] = useState({
    score: 0,
    arrows: 10,
    gameOver: false,
  });

  function initState() {
    stateRef.current = {
      score: 0,
      arrows: 10,
      gameOver: false,
      hits: [] as { x: number; y: number; pts: number }[],
      raf: 0,
      mouse: { x: 200, y: 200 },
      windOffset: 0,
    };
    setDisplay({ score: 0, arrows: 10, gameOver: false });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: game init on mount
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    initState();
    const s = stateRef.current;
    const CX = 200;
    const CY = 180;

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      s.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    });
    canvas.addEventListener("click", () => {
      if (s.gameOver || s.arrows <= 0) return;
      const wind = (Math.random() - 0.5) * 30;
      const ax = s.mouse.x + wind;
      const ay = s.mouse.y + wind * 0.3;
      const dist = Math.hypot(ax - CX, ay - CY);
      let pts = 0;
      if (dist < 15) pts = 10;
      else if (dist < 35) pts = 7;
      else if (dist < 60) pts = 5;
      else if (dist < 90) pts = 3;
      else if (dist < 120) pts = 1;
      s.score += pts;
      s.arrows--;
      s.hits.push({ x: ax, y: ay, pts });
      if (s.arrows <= 0) {
        s.gameOver = true;
        setDisplay({ score: s.score, arrows: 0, gameOver: true });
      } else setDisplay({ score: s.score, arrows: s.arrows, gameOver: false });
    });

    function loop() {
      s.raf = requestAnimationFrame(loop);
      ctx.fillStyle = "#0a1505";
      ctx.fillRect(0, 0, 400, 400);
      // Target
      const rings = [
        [120, "#fff"],
        [90, "#000"],
        [60, "#00bbff"],
        [35, "#ff4444"],
        [15, "#ffff00"],
      ];
      for (const [r, c] of rings) {
        ctx.fillStyle = c as string;
        ctx.beginPath();
        ctx.arc(CX, CY, r as number, 0, Math.PI * 2);
        ctx.fill();
      }
      // Hits
      for (const h of s.hits) {
        ctx.fillStyle = "#00ffcc";
        ctx.beginPath();
        ctx.arc(h.x, h.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffff00";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(h.pts > 0 ? `+${h.pts}` : "0", h.x, h.y - 8);
      }
      // Crosshair
      ctx.strokeStyle = "rgba(0,255,200,0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(s.mouse.x - 15, s.mouse.y);
      ctx.lineTo(s.mouse.x + 15, s.mouse.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s.mouse.x, s.mouse.y - 15);
      ctx.lineTo(s.mouse.x, s.mouse.y + 15);
      ctx.stroke();
      ctx.font = "11px monospace";
      ctx.fillStyle = "#ffffff60";
      ctx.textAlign = "left";
      ctx.fillText("Wind varies!", 10, 390);
    }
    loop();
    return () => cancelAnimationFrame(s.raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-yellow-400">Score: {display.score}</span>
        <span className="text-green-400">Arrows: {display.arrows}</span>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded border border-green-500/30 cursor-none"
        />
        {display.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded">
            <p className="text-2xl font-bold text-yellow-400 mb-2">DONE!</p>
            <p className="text-cyan-400 mb-4">
              Final Score: {display.score} / 100
            </p>
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
        Aim with mouse, click to shoot — watch for wind!
      </p>
    </div>
  );
}
