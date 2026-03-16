import { useEffect, useRef, useState } from "react";

export default function BubblePop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const [display, setDisplay] = useState({
    score: 0,
    missed: 0,
    gameOver: false,
  });

  function initState() {
    stateRef.current = {
      bubbles: [] as any[],
      score: 0,
      missed: 0,
      gameOver: false,
      frame: 0,
      raf: 0,
      spawnTimer: 40,
    };
    setDisplay({ score: 0, missed: 0, gameOver: false });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: game init on mount
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    initState();
    const s = stateRef.current;
    const COLORS = ["#ff88cc", "#88ccff", "#aaffaa", "#ffcc44", "#cc88ff"];

    canvas.addEventListener("click", (e) => {
      if (s.gameOver) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      s.bubbles = s.bubbles.filter((b: any) => {
        if (Math.hypot(mx - b.x, my - b.y) < b.r) {
          s.score += Math.round((20 / b.r) * 10);
          return false;
        }
        return true;
      });
      setDisplay((d) => ({ ...d, score: s.score }));
    });

    function loop() {
      s.raf = requestAnimationFrame(loop);
      if (s.gameOver) return;
      s.frame++;
      s.spawnTimer--;
      if (s.spawnTimer <= 0) {
        s.bubbles.push({
          x: 30 + Math.random() * 340,
          y: 410,
          r: 12 + Math.random() * 24,
          vy: -(0.8 + Math.random() * 1.2),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
        s.spawnTimer = 25;
      }
      for (const b of s.bubbles) b.y += b.vy;
      s.bubbles = s.bubbles.filter((b: any) => {
        if (b.y < -b.r) {
          s.missed++;
          if (s.missed >= 10) {
            s.gameOver = true;
            setDisplay({ score: s.score, missed: s.missed, gameOver: true });
          }
          return false;
        }
        return true;
      });
      setDisplay((d) => ({ ...d, score: s.score, missed: s.missed }));

      ctx.fillStyle = "#050a20";
      ctx.fillRect(0, 0, 400, 400);
      for (const b of s.bubbles) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `${b.color}40`;
        ctx.fill();
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        // Shine
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fill();
      }
    }
    loop();
    return () => cancelAnimationFrame(s.raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-yellow-400">Score: {display.score}</span>
        <span className="text-red-400">Missed: {display.missed}/10</span>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded border border-pink-500/30 cursor-pointer"
        />
        {display.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded">
            <p className="text-2xl font-bold text-pink-400 mb-2">Pop!</p>
            <p className="text-yellow-400 mb-4">Score: {display.score}</p>
            <button
              type="button"
              onClick={() => {
                initState();
              }}
              className="px-4 py-2 bg-pink-500/20 border border-pink-500 text-pink-400 rounded"
            >
              Restart
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-white/40">Click bubbles before they escape!</p>
    </div>
  );
}
