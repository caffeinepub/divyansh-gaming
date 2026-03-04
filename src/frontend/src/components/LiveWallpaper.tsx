import { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
  color: string;
}

interface Streak {
  x: number;
  y: number;
  len: number;
  angle: number;
  speed: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

interface GridLine {
  offset: number;
  speed: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const STAR_COUNT = 320;
const STAR_SPEED = 4.5;
const GRID_HORIZON = 0.62; // 0–1 fraction of canvas height
const GRID_LINES_V = 16; // vertical perspective lines
const GRID_LINES_H = 20; // horizontal lines receding to horizon
const STREAK_MAX = 6;

const COLORS = [
  "0.82 0.18 200", // neon cyan
  "0.62 0.22 295", // neon violet
  "0.80 0.24 320", // hot pink
  "0.78 0.18 75", // gold
  "0.80 0.22 145", // neon green
];

function randomColor(): string {
  return `oklch(${COLORS[Math.floor(Math.random() * COLORS.length)]})`;
}

function randomStreakColor(): string {
  const c = COLORS[Math.floor(Math.random() * 3)]; // cyan, violet, pink
  return `oklch(${c})`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function LiveWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const context = canvasEl.getContext("2d");
    if (!context) return;

    // Use non-nullable aliases inside nested functions
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    let rafId: number;
    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;

    // ── State ──────────────────────────────────────────────────────────────
    const stars: Star[] = [];
    const streaks: Streak[] = [];
    const gridHLines: GridLine[] = [];

    function makeColor(): string {
      return randomColor();
    }

    function initStar(s: Star) {
      s.x = (Math.random() - 0.5) * w * 2;
      s.y = (Math.random() - 0.5) * h * 2;
      s.z = Math.random() * w;
      s.pz = s.z;
      s.color = makeColor();
    }

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        const s: Star = { x: 0, y: 0, z: 0, pz: 0, color: "" };
        initStar(s);
        // scatter z so they don't all rush in together on load
        s.z = Math.random() * w;
        s.pz = s.z;
        stars.push(s);
      }
    }

    function initGridHLines() {
      gridHLines.length = 0;
      for (let i = 0; i < GRID_LINES_H; i++) {
        gridHLines.push({
          offset: i / GRID_LINES_H,
          speed: 0.008 + Math.random() * 0.002,
        });
      }
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      cx = w / 2;
      cy = h / 2;
      initStars();
      initGridHLines();
    }

    // ── Streak spawner ─────────────────────────────────────────────────────
    let streakTimer = 0;
    const STREAK_INTERVAL = 90; // frames between spawns

    function spawnStreak() {
      const angle = (Math.random() - 0.5) * 0.6 - Math.PI / 4;
      const life = 30 + Math.random() * 40;
      streaks.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.7,
        len: 120 + Math.random() * 200,
        angle,
        speed: 12 + Math.random() * 10,
        alpha: 0.7 + Math.random() * 0.3,
        color: randomStreakColor(),
        life,
        maxLife: life,
      });
      // trim old
      if (streaks.length > STREAK_MAX) streaks.shift();
    }

    // ── Render ─────────────────────────────────────────────────────────────
    function drawStars() {
      for (const s of stars) {
        s.pz = s.z;
        s.z -= STAR_SPEED;

        if (s.z <= 0) {
          initStar(s);
          continue;
        }

        const sx = (s.x / s.z) * w + cx;
        const sy = (s.y / s.z) * h + cy;
        const px = (s.x / s.pz) * w + cx;
        const py = (s.y / s.pz) * h + cy;

        // skip if out of bounds
        if (sx < 0 || sx > w || sy < 0 || sy > h) {
          initStar(s);
          continue;
        }

        const size = Math.max(0.5, (1 - s.z / w) * 3.5);
        const alpha = Math.min(1, (1 - s.z / w) * 1.6);

        // draw trail line
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = s.color
          .replace(")", ` / ${alpha * 0.55})`)
          .replace("oklch(", "oklch(");
        // patch alpha into oklch string
        const trailColor = `${s.color.slice(0, -1)} / ${(alpha * 0.5).toFixed(2)})`;
        ctx.strokeStyle = trailColor;
        ctx.lineWidth = size * 0.6;
        ctx.stroke();

        // draw dot at tip
        ctx.beginPath();
        ctx.arc(sx, sy, size * 0.7, 0, Math.PI * 2);
        const dotColor = `${s.color.slice(0, -1)} / ${alpha.toFixed(2)})`;
        ctx.fillStyle = dotColor;
        ctx.fill();
      }
    }

    function drawGrid() {
      const horizon = h * GRID_HORIZON;
      const vanishX = cx;
      const bottom = h;
      const spread = w * 2.2;

      // Horizontal lines receding to horizon
      for (let i = 0; i < gridHLines.length; i++) {
        const line = gridHLines[i];
        line.offset += line.speed;
        if (line.offset >= 1) line.offset -= 1;

        // perspective: lines closer to camera = lower on screen
        // use exponential distribution to cluster lines near camera
        const t = line.offset ** 2.2;
        const y = horizon + (bottom - horizon) * t;

        // fade based on distance — near bottom = more opaque
        const alpha = t * 0.35;
        if (alpha < 0.01) continue;

        // x coords fan out from vanishing point
        const fanProgress = 1 - t;
        const xLeft = vanishX - (spread / 2) * (1 - fanProgress * 0.85);
        const xRight = vanishX + (spread / 2) * (1 - fanProgress * 0.85);

        ctx.beginPath();
        ctx.moveTo(xLeft, y);
        ctx.lineTo(xRight, y);

        const gradient = ctx.createLinearGradient(xLeft, y, xRight, y);
        gradient.addColorStop(0, "oklch(0.82 0.18 200 / 0)");
        gradient.addColorStop(
          0.2,
          `oklch(0.82 0.18 200 / ${alpha.toFixed(2)})`,
        );
        gradient.addColorStop(
          0.5,
          `oklch(0.62 0.22 295 / ${(alpha * 1.2).toFixed(2)})`,
        );
        gradient.addColorStop(
          0.8,
          `oklch(0.82 0.18 200 / ${alpha.toFixed(2)})`,
        );
        gradient.addColorStop(1, "oklch(0.82 0.18 200 / 0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.8 + t * 1.2;
        ctx.stroke();
      }

      // Vertical perspective lines fanning from vanish point
      for (let i = 0; i <= GRID_LINES_V; i++) {
        const t = i / GRID_LINES_V;
        const xBottom = vanishX - spread / 2 + spread * t;
        const alpha = 0.14 * (1 - Math.abs(t - 0.5) * 1.2);
        if (alpha < 0.01) continue;

        ctx.beginPath();
        ctx.moveTo(vanishX, horizon);
        ctx.lineTo(xBottom, bottom);

        const grad = ctx.createLinearGradient(
          vanishX,
          horizon,
          xBottom,
          bottom,
        );
        grad.addColorStop(0, "oklch(0.82 0.18 200 / 0)");
        grad.addColorStop(
          0.4,
          `oklch(0.62 0.22 295 / ${(alpha * 0.6).toFixed(2)})`,
        );
        grad.addColorStop(1, `oklch(0.82 0.18 200 / ${alpha.toFixed(2)})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Glow horizon line
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      ctx.lineTo(w, horizon);
      const horizGrad = ctx.createLinearGradient(0, horizon, w, horizon);
      horizGrad.addColorStop(0, "transparent");
      horizGrad.addColorStop(0.15, "oklch(0.62 0.22 295 / 0.08)");
      horizGrad.addColorStop(0.5, "oklch(0.82 0.18 200 / 0.35)");
      horizGrad.addColorStop(0.85, "oklch(0.62 0.22 295 / 0.08)");
      horizGrad.addColorStop(1, "transparent");
      ctx.strokeStyle = horizGrad;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Horizon glow bloom
      const bloomGrad = ctx.createLinearGradient(
        0,
        horizon - 40,
        0,
        horizon + 40,
      );
      bloomGrad.addColorStop(0, "transparent");
      bloomGrad.addColorStop(0.5, "oklch(0.82 0.18 200 / 0.06)");
      bloomGrad.addColorStop(1, "transparent");
      ctx.fillStyle = bloomGrad;
      ctx.fillRect(0, horizon - 40, w, 80);
    }

    function drawStreaks() {
      for (const s of streaks) {
        s.life--;
        if (s.life <= 0) continue;

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;

        const fadeIn = Math.min(1, (s.maxLife - s.life) / 5);
        const fadeOut = Math.min(1, s.life / 10);
        const alpha = s.alpha * fadeIn * fadeOut;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);

        const grad = ctx.createLinearGradient(0, 0, s.len, 0);
        grad.addColorStop(0, `${s.color.slice(0, -1)} / 0)`);
        grad.addColorStop(
          0.3,
          `${s.color.slice(0, -1)} / ${alpha.toFixed(2)})`,
        );
        grad.addColorStop(
          0.7,
          `${s.color.slice(0, -1)} / ${(alpha * 0.8).toFixed(2)})`,
        );
        grad.addColorStop(1, `${s.color.slice(0, -1)} / 0)`);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(s.len, 0);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      }

      // remove dead streaks
      for (let i = streaks.length - 1; i >= 0; i--) {
        if (streaks[i].life <= 0) streaks.splice(i, 1);
      }
    }

    function loop() {
      ctx.clearRect(0, 0, w, h);

      // Deep space background
      const bg = ctx.createRadialGradient(
        cx,
        cy * 0.4,
        0,
        cx,
        cy * 0.4,
        Math.max(w, h),
      );
      bg.addColorStop(0, "oklch(0.10 0.025 270)");
      bg.addColorStop(0.5, "oklch(0.075 0.018 270)");
      bg.addColorStop(1, "oklch(0.055 0.012 270)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      drawGrid();
      drawStars();

      // Spawn streaks
      streakTimer++;
      if (streakTimer >= STREAK_INTERVAL) {
        streakTimer = 0;
        if (Math.random() > 0.3) spawnStreak();
      }
      drawStreaks();

      rafId = requestAnimationFrame(loop);
    }

    // ── Init & cleanup ─────────────────────────────────────────────────────
    resize();
    loop();

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
