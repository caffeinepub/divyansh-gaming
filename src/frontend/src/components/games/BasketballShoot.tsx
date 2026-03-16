import { useEffect, useRef, useState } from "react";

export default function BasketballShoot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const [display, setDisplay] = useState({
    score: 0,
    shots: 10,
    gameOver: false,
  });

  function initState() {
    stateRef.current = {
      ball: null as any,
      score: 0,
      shots: 10,
      gameOver: false,
      raf: 0,
      frame: 0,
      dragging: false,
      dragStart: { x: 0, y: 0 },
      ballPos: { x: 200, y: 340 },
      hoop: { x: 200, y: 100 },
    };
    setDisplay({ score: 0, shots: 10, gameOver: false });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: game init on mount
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    initState();
    const s = stateRef.current;

    canvas.addEventListener("mousedown", (e) => {
      if (s.ball || s.gameOver) return;
      const rect = canvas.getBoundingClientRect();
      s.dragging = true;
      s.dragStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    });
    canvas.addEventListener("mouseup", (e) => {
      if (!s.dragging || s.gameOver) return;
      const rect = canvas.getBoundingClientRect();
      const ex = e.clientX - rect.left;
      const ey = e.clientY - rect.top;
      const dx = (s.dragStart.x - ex) * 0.08;
      const dy = (s.dragStart.y - ey) * 0.08;
      s.ball = { x: s.ballPos.x, y: s.ballPos.y, vx: dx, vy: dy };
      s.dragging = false;
      s.shots--;
      setDisplay((d) => ({ ...d, shots: s.shots }));
    });

    function loop() {
      s.raf = requestAnimationFrame(loop);
      if (s.gameOver) return;
      s.frame++;

      if (s.ball) {
        s.ball.vy += 0.4;
        s.ball.x += s.ball.vx;
        s.ball.y += s.ball.vy;
        // Check hoop
        if (
          Math.abs(s.ball.x - s.hoop.x) < 25 &&
          Math.abs(s.ball.y - s.hoop.y) < 20 &&
          s.ball.vy > 0
        ) {
          s.score += 2;
          s.ball = null;
          setDisplay((d) => ({ ...d, score: s.score }));
        }
        if (s.ball && (s.ball.y > 420 || s.ball.x < -20 || s.ball.x > 420)) {
          s.ball = null;
          if (s.shots <= 0) {
            s.gameOver = true;
            setDisplay({ score: s.score, shots: 0, gameOver: true });
            return;
          }
        }
      }
      setDisplay((d) => ({ ...d, shots: s.shots }));

      ctx.fillStyle = "#0a0a18";
      ctx.fillRect(0, 0, 400, 400);

      // Hoop
      ctx.strokeStyle = "#ff6600";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(s.hoop.x, s.hoop.y, 30, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "#ffffff40";
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(s.hoop.x - 25 + i * 10, s.hoop.y);
        ctx.lineTo(s.hoop.x - 15 + i * 10, s.hoop.y + 40);
        ctx.stroke();
      }

      // Ball position guide
      ctx.strokeStyle = "#ff880040";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(s.ballPos.x, s.ballPos.y, 18, 0, Math.PI * 2);
      ctx.stroke();

      if (s.ball) {
        ctx.fillStyle = "#ff8800";
        ctx.beginPath();
        ctx.arc(s.ball.x, s.ball.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ff4400";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(s.ball.x - 14, s.ball.y);
        ctx.lineTo(s.ball.x + 14, s.ball.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(s.ball.x, s.ball.y - 14);
        ctx.lineTo(s.ball.x, s.ball.y + 14);
        ctx.stroke();
      }
    }
    loop();
    return () => cancelAnimationFrame(s.raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-yellow-400">Score: {display.score}</span>
        <span className="text-orange-400">Shots: {display.shots}</span>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded border border-orange-500/30 cursor-pointer"
        />
        {display.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded">
            <p className="text-2xl font-bold text-orange-400 mb-2">GAME OVER</p>
            <p className="text-yellow-400 mb-4">Score: {display.score} pts</p>
            <button
              type="button"
              onClick={() => {
                initState();
              }}
              className="px-4 py-2 bg-orange-500/20 border border-orange-500 text-orange-400 rounded"
            >
              Restart
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-white/40">
        Click &amp; drag from ball position, release to shoot
      </p>
    </div>
  );
}
