import { useEffect, useRef, useState } from "react";

export default function TennisBall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<any>(null);
  const [display, setDisplay] = useState({
    score: 0,
    lives: 3,
    gameOver: false,
  });

  function initState() {
    stateRef.current = {
      ball: { x: 200, y: 80, vx: 2, vy: 3 },
      paddle: { x: 160, w: 80 },
      score: 0,
      lives: 3,
      gameOver: false,
      raf: 0,
      mx: 200,
    };
    setDisplay({ score: 0, lives: 3, gameOver: false });
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: game init on mount
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    initState();
    const s = stateRef.current;

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      s.mx = e.clientX - rect.left;
    });

    function loop() {
      s.raf = requestAnimationFrame(loop);
      if (s.gameOver) return;

      s.paddle.x = Math.max(
        0,
        Math.min(400 - s.paddle.w, s.mx - s.paddle.w / 2),
      );
      s.ball.x += s.ball.vx;
      s.ball.y += s.ball.vy;

      if (s.ball.x < 10 || s.ball.x > 390) s.ball.vx *= -1;
      if (s.ball.y < 10) s.ball.vy *= -1;

      // Paddle hit
      if (
        s.ball.y > 350 &&
        s.ball.y < 370 &&
        s.ball.x > s.paddle.x &&
        s.ball.x < s.paddle.x + s.paddle.w
      ) {
        s.ball.vy = -Math.abs(s.ball.vy) - 0.2;
        s.ball.vx += (s.ball.x - (s.paddle.x + s.paddle.w / 2)) * 0.05;
        s.score += 5;
        setDisplay((d) => ({ ...d, score: s.score }));
      }

      if (s.ball.y > 410) {
        s.lives--;
        s.ball = { x: 200, y: 80, vx: (Math.random() - 0.5) * 4, vy: 3 };
        if (s.lives <= 0) {
          s.gameOver = true;
          setDisplay({ score: s.score, lives: 0, gameOver: true });
          return;
        }
        setDisplay((d) => ({ ...d, lives: s.lives }));
      }

      ctx.fillStyle = "#0a1a08";
      ctx.fillRect(0, 0, 400, 400);
      // Court lines
      ctx.strokeStyle = "#ffffff20";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 200);
      ctx.lineTo(400, 200);
      ctx.stroke();
      // Ball
      ctx.fillStyle = "#ccff00";
      ctx.beginPath();
      ctx.arc(s.ball.x, s.ball.y, 10, 0, Math.PI * 2);
      ctx.fill();
      // Paddle
      ctx.fillStyle = "#00aaff";
      ctx.fillRect(s.paddle.x, 355, s.paddle.w, 12);
    }
    loop();
    return () => cancelAnimationFrame(s.raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-yellow-400">Score: {display.score}</span>
        <span className="text-red-400">Lives: {display.lives}</span>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded border border-lime-500/30"
        />
        {display.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded">
            <p className="text-2xl font-bold text-lime-400 mb-2">MATCH OVER</p>
            <p className="text-yellow-400 mb-4">Score: {display.score}</p>
            <button
              type="button"
              onClick={() => {
                initState();
              }}
              className="px-4 py-2 bg-lime-500/20 border border-lime-500 text-lime-400 rounded"
            >
              Restart
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-white/40">Move mouse to control racket</p>
    </div>
  );
}
