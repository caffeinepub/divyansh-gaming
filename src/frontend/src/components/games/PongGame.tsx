import { useCallback, useEffect, useRef, useState } from "react";

const W = 480;
const H = 400;
const PAD_W = 12;
const PAD_H = 70;
const BALL_R = 8;
const WIN_SCORE = 7;
const PLAYER_SPEED = 6;
const AI_SPEED = 3.5;
const BALL_SPEED = 5;

type Phase = "start" | "playing" | "over";

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("start");
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [winner, setWinner] = useState<"player" | "ai" | null>(null);
  const phaseRef = useRef<Phase>("start");
  const rafRef = useRef(0);

  const st = useRef({
    playerY: H / 2 - PAD_H / 2,
    aiY: H / 2 - PAD_H / 2,
    ballX: W / 2,
    ballY: H / 2,
    vx: BALL_SPEED,
    vy: BALL_SPEED * 0.6,
    playerScore: 0,
    aiScore: 0,
    mouseY: H / 2,
    particles: [] as {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    }[],
  });

  const resetBall = useCallback((dir: 1 | -1) => {
    const s = st.current;
    s.ballX = W / 2;
    s.ballY = H / 2;
    s.vx = BALL_SPEED * dir;
    s.vy = (Math.random() - 0.5) * BALL_SPEED * 1.2;
  }, []);

  const initGame = useCallback(() => {
    const s = st.current;
    s.playerY = H / 2 - PAD_H / 2;
    s.aiY = H / 2 - PAD_H / 2;
    s.playerScore = 0;
    s.aiScore = 0;
    s.particles = [];
    setPlayerScore(0);
    setAiScore(0);
    setWinner(null);
    resetBall(1);
    phaseRef.current = "playing";
    setPhase("playing");
  }, [resetBall]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      st.current.mouseY = (e.clientY - rect.top) * (H / rect.height);
    };
    const onTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      st.current.mouseY = (e.touches[0].clientY - rect.top) * (H / rect.height);
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === " " &&
        (phaseRef.current === "start" || phaseRef.current === "over")
      ) {
        e.preventDefault();
        initGame();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [initGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function loop() {
      if (!ctx) return;
      const s = st.current;
      const ph = phaseRef.current;

      ctx.fillStyle = "#06060f";
      ctx.fillRect(0, 0, W, H);

      // Center line
      ctx.strokeStyle = "rgba(0,229,255,0.1)";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 12]);
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);

      if (ph === "start") {
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#00e5ff";
        ctx.fillStyle = "#00e5ff";
        ctx.font = "bold 48px 'Bricolage Grotesque', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("PONG", W / 2, H / 2 - 30);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.fillText("Move mouse to control left paddle", W / 2, H / 2 + 20);
        ctx.fillText("Click, tap, or Space to start", W / 2, H / 2 + 42);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (ph === "over") {
        ctx.fillStyle = "rgba(0,0,10,0.85)";
        ctx.fillRect(0, 0, W, H);
        const w = s.playerScore >= WIN_SCORE;
        ctx.shadowBlur = 20;
        ctx.shadowColor = w ? "#00e5ff" : "#ff4466";
        ctx.fillStyle = w ? "#00e5ff" : "#ff4466";
        ctx.font = "bold 38px 'Bricolage Grotesque', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(w ? "YOU WIN!" : "AI WINS!", W / 2, H / 2 - 30);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.fillText(`${s.playerScore} - ${s.aiScore}`, W / 2, H / 2 + 10);
        ctx.fillText("Click, tap, or Space to retry", W / 2, H / 2 + 40);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // ── Playing ──
      // Move player paddle (follow mouse)
      const targetY = s.mouseY - PAD_H / 2;
      const dY = targetY - s.playerY;
      s.playerY += Math.sign(dY) * Math.min(Math.abs(dY), PLAYER_SPEED);
      s.playerY = Math.max(0, Math.min(H - PAD_H, s.playerY));

      // AI paddle
      const aiCenter = s.aiY + PAD_H / 2;
      if (aiCenter < s.ballY - 5) s.aiY += AI_SPEED;
      else if (aiCenter > s.ballY + 5) s.aiY -= AI_SPEED;
      s.aiY = Math.max(0, Math.min(H - PAD_H, s.aiY));

      // Move ball
      s.ballX += s.vx;
      s.ballY += s.vy;

      // Wall bounce
      if (s.ballY - BALL_R < 0) {
        s.ballY = BALL_R;
        s.vy = Math.abs(s.vy);
      }
      if (s.ballY + BALL_R > H) {
        s.ballY = H - BALL_R;
        s.vy = -Math.abs(s.vy);
      }

      // Player paddle collision
      if (
        s.ballX - BALL_R < PAD_W + 10 &&
        s.ballY > s.playerY &&
        s.ballY < s.playerY + PAD_H &&
        s.vx < 0
      ) {
        s.vx = Math.abs(s.vx) * 1.04;
        const rel = (s.ballY - (s.playerY + PAD_H / 2)) / (PAD_H / 2);
        s.vy = rel * BALL_SPEED * 1.2;
        s.ballX = PAD_W + 10 + BALL_R;
        for (let p = 0; p < 5; p++) {
          s.particles.push({
            x: s.ballX,
            y: s.ballY,
            vx: (Math.random() + 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 20,
            color: "#00e5ff",
          });
        }
      }

      // AI paddle collision
      if (
        s.ballX + BALL_R > W - PAD_W - 10 &&
        s.ballY > s.aiY &&
        s.ballY < s.aiY + PAD_H &&
        s.vx > 0
      ) {
        s.vx = -Math.abs(s.vx) * 1.02;
        const rel = (s.ballY - (s.aiY + PAD_H / 2)) / (PAD_H / 2);
        s.vy = rel * BALL_SPEED * 1.2;
        s.ballX = W - PAD_W - 10 - BALL_R;
        for (let p = 0; p < 5; p++) {
          s.particles.push({
            x: s.ballX,
            y: s.ballY,
            vx: -(Math.random() + 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 20,
            color: "#a855f7",
          });
        }
      }

      // Scoring
      if (s.ballX < -10) {
        s.aiScore++;
        setAiScore(s.aiScore);
        if (s.aiScore >= WIN_SCORE) {
          phaseRef.current = "over";
          setPhase("over");
          setWinner("ai");
        } else resetBall(-1);
      }
      if (s.ballX > W + 10) {
        s.playerScore++;
        setPlayerScore(s.playerScore);
        if (s.playerScore >= WIN_SCORE) {
          phaseRef.current = "over";
          setPhase("over");
          setWinner("player");
        } else resetBall(1);
      }

      // Move particles
      for (const p of s.particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
      }
      s.particles = s.particles.filter((p) => p.life > 0);

      // Draw particles
      for (const p of s.particles) {
        ctx.globalAlpha = p.life / 20;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw paddles
      ctx.shadowBlur = 12;
      // Player
      ctx.shadowColor = "#00e5ff";
      const pg = ctx.createLinearGradient(0, s.playerY, 0, s.playerY + PAD_H);
      pg.addColorStop(0, "rgba(0,229,255,0.9)");
      pg.addColorStop(1, "rgba(0,150,200,0.9)");
      ctx.fillStyle = pg;
      ctx.beginPath();
      ctx.roundRect(10, s.playerY, PAD_W, PAD_H, 4);
      ctx.fill();
      // AI
      ctx.shadowColor = "#a855f7";
      const ag = ctx.createLinearGradient(0, s.aiY, 0, s.aiY + PAD_H);
      ag.addColorStop(0, "rgba(168,85,247,0.9)");
      ag.addColorStop(1, "rgba(120,40,200,0.9)");
      ctx.fillStyle = ag;
      ctx.beginPath();
      ctx.roundRect(W - PAD_W - 10, s.aiY, PAD_W, PAD_H, 4);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw ball
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#ffd700";
      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Score display
      ctx.fillStyle = "rgba(0,229,255,0.9)";
      ctx.font = "bold 36px 'JetBrains Mono', monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${s.playerScore}`, W / 2 - 30, 50);
      ctx.fillStyle = "rgba(168,85,247,0.9)";
      ctx.textAlign = "left";
      ctx.fillText(`${s.aiScore}`, W / 2 + 30, 50);

      // Labels
      ctx.fillStyle = "rgba(0,229,255,0.3)";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText("YOU", 16, H - 8);
      ctx.fillStyle = "rgba(168,85,247,0.3)";
      ctx.textAlign = "right";
      ctx.fillText("AI", W - 16, H - 8);

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [resetBall]);

  const handleClick = () => {
    if (phaseRef.current === "start" || phaseRef.current === "over") initGame();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        style={{
          borderRadius: 10,
          boxShadow:
            "0 0 0 1.5px rgba(255,215,0,0.35), 0 0 30px rgba(255,215,0,0.08)",
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
          aria-label="Pong Game"
        />
      </div>
      <div className="flex gap-8 text-sm font-mono">
        <span style={{ color: "#00e5ff", fontWeight: 700 }}>
          YOU: {playerScore}
        </span>
        <span style={{ color: "#a855f7", fontWeight: 700 }}>AI: {aiScore}</span>
      </div>
      {winner && (
        <div
          style={{
            color: winner === "player" ? "#00e5ff" : "#ff4466",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 13,
            fontWeight: 700,
            textShadow: `0 0 12px ${winner === "player" ? "rgba(0,229,255,0.8)" : "rgba(255,68,102,0.8)"}`,
          }}
        >
          {winner === "player" ? "🏆 YOU WIN!" : "💀 AI WINS!"}
        </div>
      )}
      <p
        style={{
          color: "rgba(255,255,255,0.25)",
          fontSize: 11,
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {phase === "playing"
          ? "Move mouse to control your paddle (left)"
          : "Click or Space to play — first to 7 wins"}
      </p>
    </div>
  );
}
