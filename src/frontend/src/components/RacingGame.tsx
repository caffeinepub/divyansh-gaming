import { Car, ChevronLeft, ChevronRight, Heart, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

// ─── Constants ────────────────────────────────────────────────────────────────
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 640;
const LANE_COUNT = 3;
const ROAD_LEFT = 80;
const ROAD_RIGHT = CANVAS_WIDTH - 80;
const ROAD_WIDTH = ROAD_RIGHT - ROAD_LEFT;
const LANE_WIDTH = ROAD_WIDTH / LANE_COUNT;

const PLAYER_W = 48;
const PLAYER_H = 84;
const ENEMY_W = 46;
const ENEMY_H = 80;
const TREE_W = 26;
const TREE_H = 40;

const BASE_SPEED = 4;
const MAX_SPEED = 14;
const SPEED_INCREMENT = 0.002;
const SPAWN_INTERVAL_BASE = 90; // frames
const INVINCIBILITY_FRAMES = 90;

const COLORS = {
  road: "#111118",
  roadEdge: "#1a1a28",
  lane: "rgba(255,255,255,0.22)",
  playerCar: "#00e5ff", // neon cyan
  playerGlow: "rgba(0,229,255,0.6)",
  playerWindow: "rgba(0,40,60,0.8)",
  playerWheel: "#0a0a18",
  enemyColors: ["#ff4040", "#ff6a00", "#ff2060", "#ff8c00"],
  enemyWindow: "rgba(40,0,0,0.7)",
  enemyWheel: "#0a0a18",
  grass: "#0b1a0b",
  tree: "#1a4020",
  treeTop: "#0d2e14",
  barrier: "#1a1a30",
  barrierStripe: "#ff4444",
  hud: "#00e5ff",
  hudBg: "rgba(0,5,20,0.75)",
  scoreText: "#ffffff",
  life: "#ff4466",
  overlay: "rgba(0,0,5,0.85)",
  startBg: "rgba(0,2,18,0.96)",
} as const;

type GamePhase = "start" | "playing" | "over";

interface EnemyCar {
  id: number;
  lane: number;
  y: number;
  colorIdx: number;
}

interface TreeObj {
  id: number;
  x: number;
  y: number;
  side: "left" | "right";
}

function getLaneX(lane: number) {
  return ROAD_LEFT + lane * LANE_WIDTH + LANE_WIDTH / 2;
}

// ─── Canvas renderer ──────────────────────────────────────────────────────────
function drawRoad(ctx: CanvasRenderingContext2D) {
  // Grass areas
  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(0, 0, ROAD_LEFT, CANVAS_HEIGHT);
  ctx.fillRect(ROAD_RIGHT, 0, CANVAS_WIDTH - ROAD_RIGHT, CANVAS_HEIGHT);

  // Road surface
  ctx.fillStyle = COLORS.road;
  ctx.fillRect(ROAD_LEFT, 0, ROAD_WIDTH, CANVAS_HEIGHT);

  // Road edges
  ctx.fillStyle = COLORS.roadEdge;
  ctx.fillRect(ROAD_LEFT, 0, 6, CANVAS_HEIGHT);
  ctx.fillRect(ROAD_RIGHT - 6, 0, 6, CANVAS_HEIGHT);

  // Road edge glow lines
  ctx.strokeStyle = "rgba(0,229,255,0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ROAD_LEFT + 3, 0);
  ctx.lineTo(ROAD_LEFT + 3, CANVAS_HEIGHT);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ROAD_RIGHT - 3, 0);
  ctx.lineTo(ROAD_RIGHT - 3, CANVAS_HEIGHT);
  ctx.stroke();
}

function drawDashMarks(ctx: CanvasRenderingContext2D, offset: number) {
  ctx.strokeStyle = COLORS.lane;
  ctx.lineWidth = 3;
  ctx.setLineDash([32, 24]);
  ctx.lineDashOffset = -offset;

  for (let l = 1; l < LANE_COUNT; l++) {
    const x = ROAD_LEFT + l * LANE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawBarrier(ctx: CanvasRenderingContext2D, y: number, x: number) {
  ctx.fillStyle = COLORS.barrier;
  ctx.fillRect(x - 6, y, 12, 28);
  ctx.fillStyle = COLORS.barrierStripe;
  ctx.fillRect(x - 6, y + 6, 12, 6);
  ctx.fillRect(x - 6, y + 18, 12, 4);
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // trunk
  ctx.fillStyle = "#3d2b1e";
  ctx.fillRect(x - 4, y + TREE_H - 14, 8, 14);
  // lower canopy
  ctx.fillStyle = COLORS.tree;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + TREE_W / 2 + 4, y + TREE_H - 8);
  ctx.lineTo(x - TREE_W / 2 - 4, y + TREE_H - 8);
  ctx.closePath();
  ctx.fill();
  // upper canopy
  ctx.fillStyle = COLORS.treeTop;
  ctx.beginPath();
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x + TREE_W / 2, y + TREE_H / 2 + 2);
  ctx.lineTo(x - TREE_W / 2, y + TREE_H / 2 + 2);
  ctx.closePath();
  ctx.fill();
}

function drawPlayerCar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  invincible: boolean,
  frame: number,
) {
  const alpha = invincible && Math.floor(frame / 6) % 2 === 0 ? 0.45 : 1.0;
  ctx.globalAlpha = alpha;

  // Glow
  const grd = ctx.createRadialGradient(
    x,
    y + PLAYER_H / 2,
    4,
    x,
    y + PLAYER_H / 2,
    55,
  );
  grd.addColorStop(0, "rgba(0,229,255,0.22)");
  grd.addColorStop(1, "rgba(0,229,255,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(x - 55, y - 10, 110, PLAYER_H + 20);

  // Body
  ctx.fillStyle = COLORS.playerCar;
  // main body rect
  ctx.beginPath();
  ctx.roundRect(x - PLAYER_W / 2, y + 16, PLAYER_W, PLAYER_H - 28, 6);
  ctx.fill();

  // cabin
  ctx.fillStyle = "#00bcd4";
  ctx.beginPath();
  ctx.roundRect(x - PLAYER_W / 2 + 6, y + 4, PLAYER_W - 12, 34, 5);
  ctx.fill();

  // windshield
  ctx.fillStyle = COLORS.playerWindow;
  ctx.beginPath();
  ctx.roundRect(x - PLAYER_W / 2 + 9, y + 8, PLAYER_W - 18, 20, 3);
  ctx.fill();

  // rear window
  ctx.fillStyle = COLORS.playerWindow;
  ctx.beginPath();
  ctx.roundRect(x - PLAYER_W / 2 + 9, y + 30, PLAYER_W - 18, 10, 2);
  ctx.fill();

  // headlights glow
  ctx.fillStyle = "rgba(200,255,255,0.9)";
  ctx.fillRect(x - PLAYER_W / 2 + 4, y + 12, 8, 5);
  ctx.fillRect(x + PLAYER_W / 2 - 12, y + 12, 8, 5);
  ctx.shadowBlur = 12;
  ctx.shadowColor = "#00e5ff";
  ctx.fillStyle = "rgba(200,255,255,0.9)";
  ctx.fillRect(x - PLAYER_W / 2 + 4, y + 12, 8, 5);
  ctx.fillRect(x + PLAYER_W / 2 - 12, y + 12, 8, 5);
  ctx.shadowBlur = 0;

  // taillights
  ctx.fillStyle = "rgba(255,60,60,0.85)";
  ctx.fillRect(x - PLAYER_W / 2 + 4, y + PLAYER_H - 16, 9, 5);
  ctx.fillRect(x + PLAYER_W / 2 - 13, y + PLAYER_H - 16, 9, 5);

  // Wheels
  ctx.fillStyle = COLORS.playerWheel;
  ctx.beginPath();
  ctx.roundRect(x - PLAYER_W / 2 - 5, y + 22, 10, 18, 3);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(x + PLAYER_W / 2 - 5, y + 22, 10, 18, 3);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(x - PLAYER_W / 2 - 5, y + PLAYER_H - 28, 10, 18, 3);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(x + PLAYER_W / 2 - 5, y + PLAYER_H - 28, 10, 18, 3);
  ctx.fill();

  ctx.globalAlpha = 1.0;
}

function drawEnemyCar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  colorIdx: number,
) {
  const color = COLORS.enemyColors[colorIdx % COLORS.enemyColors.length];

  // Glow
  const grd = ctx.createRadialGradient(
    x,
    y + ENEMY_H / 2,
    4,
    x,
    y + ENEMY_H / 2,
    45,
  );
  grd.addColorStop(0, `${color.replace(")", ", 0.2)").replace("rgb", "rgba")}`);
  grd.addColorStop(1, "rgba(255,64,0,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(x - 45, y - 10, 90, ENEMY_H + 20);

  // Body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x - ENEMY_W / 2, y + 14, ENEMY_W, ENEMY_H - 26, 6);
  ctx.fill();

  // cabin
  ctx.fillStyle = shadeColor(color, -25);
  ctx.beginPath();
  ctx.roundRect(x - ENEMY_W / 2 + 5, y + 4, ENEMY_W - 10, 32, 5);
  ctx.fill();

  // windshield
  ctx.fillStyle = COLORS.enemyWindow;
  ctx.beginPath();
  ctx.roundRect(x - ENEMY_W / 2 + 8, y + 8, ENEMY_W - 16, 18, 3);
  ctx.fill();

  // rear window
  ctx.fillStyle = COLORS.enemyWindow;
  ctx.beginPath();
  ctx.roundRect(x - ENEMY_W / 2 + 8, y + 28, ENEMY_W - 16, 9, 2);
  ctx.fill();

  // headlights (pointing down = taillights for enemy)
  ctx.fillStyle = "rgba(255, 120, 30, 0.9)";
  ctx.fillRect(x - ENEMY_W / 2 + 4, y + ENEMY_H - 14, 8, 5);
  ctx.fillRect(x + ENEMY_W / 2 - 12, y + ENEMY_H - 14, 8, 5);

  // top headlights
  ctx.fillStyle = "rgba(255,200,100,0.7)";
  ctx.fillRect(x - ENEMY_W / 2 + 4, y + 10, 7, 5);
  ctx.fillRect(x + ENEMY_W / 2 - 11, y + 10, 7, 5);

  // Wheels
  ctx.fillStyle = COLORS.enemyWheel;
  ctx.beginPath();
  ctx.roundRect(x - ENEMY_W / 2 - 5, y + 18, 10, 16, 3);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(x + ENEMY_W / 2 - 5, y + 18, 10, 16, 3);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(x - ENEMY_W / 2 - 5, y + ENEMY_H - 26, 10, 16, 3);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(x + ENEMY_W / 2 - 5, y + ENEMY_H - 26, 10, 16, 3);
  ctx.fill();
}

function shadeColor(color: string, amount: number): string {
  // quick hex shade
  if (color.startsWith("#")) {
    const num = Number.parseInt(color.slice(1), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
    return `rgb(${r},${g},${b})`;
  }
  return color;
}

function drawHUD(
  ctx: CanvasRenderingContext2D,
  score: number,
  lives: number,
  speed: number,
) {
  // HUD background
  ctx.fillStyle = COLORS.hudBg;
  ctx.beginPath();
  ctx.roundRect(8, 8, 160, 48, 6);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,229,255,0.3)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Score
  ctx.fillStyle = COLORS.hud;
  ctx.font = "bold 11px 'JetBrains Mono', monospace";
  ctx.textAlign = "left";
  ctx.fillText("SCORE", 18, 26);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px 'JetBrains Mono', monospace";
  ctx.fillText(score.toString().padStart(6, "0"), 18, 48);

  // Lives
  ctx.fillStyle = COLORS.hudBg;
  ctx.beginPath();
  ctx.roundRect(CANVAS_WIDTH - 90, 8, 82, 48, 6);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,68,102,0.35)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = COLORS.life;
  ctx.font = "bold 11px 'JetBrains Mono', monospace";
  ctx.textAlign = "left";
  ctx.fillText("LIVES", CANVAS_WIDTH - 80, 26);
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < lives ? COLORS.life : "rgba(255,68,102,0.18)";
    ctx.font = "bold 16px 'JetBrains Mono', monospace";
    ctx.fillText("♥", CANVAS_WIDTH - 80 + i * 22, 48);
  }

  // Speed meter
  ctx.fillStyle = COLORS.hudBg;
  ctx.beginPath();
  ctx.roundRect(CANVAS_WIDTH / 2 - 44, 8, 88, 28, 5);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,229,255,0.25)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const speedPct = Math.min((speed - BASE_SPEED) / (MAX_SPEED - BASE_SPEED), 1);
  const barW = 70 * speedPct;
  ctx.fillStyle = "rgba(0,229,255,0.12)";
  ctx.fillRect(CANVAS_WIDTH / 2 - 35, 18, 70, 10);
  const speedGrad = ctx.createLinearGradient(
    CANVAS_WIDTH / 2 - 35,
    18,
    CANVAS_WIDTH / 2 + 35,
    18,
  );
  speedGrad.addColorStop(0, "rgba(0,229,255,0.9)");
  speedGrad.addColorStop(1, "rgba(255,80,80,0.9)");
  ctx.fillStyle = speedGrad;
  ctx.fillRect(CANVAS_WIDTH / 2 - 35, 18, barW, 10);
  ctx.fillStyle = "rgba(0,229,255,0.7)";
  ctx.font = "8px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText("SPEED", CANVAS_WIDTH / 2, 15);
}

function drawStartScreen(ctx: CanvasRenderingContext2D) {
  // Dark overlay
  ctx.fillStyle = COLORS.startBg;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Grid lines
  ctx.strokeStyle = "rgba(0,229,255,0.05)";
  ctx.lineWidth = 1;
  for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
  }
  for (let x = 0; x < CANVAS_WIDTH; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
  }

  // Title glow
  ctx.save();
  ctx.shadowBlur = 40;
  ctx.shadowColor = "rgba(0,229,255,0.9)";
  ctx.font = "bold 52px 'Bricolage Grotesque', sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#00e5ff";
  ctx.fillText("CAR", CANVAS_WIDTH / 2, 210);
  ctx.fillText("RACING", CANVAS_WIDTH / 2, 275);
  ctx.restore();

  // Subtitle
  ctx.font = "13px 'JetBrains Mono', monospace";
  ctx.fillStyle = "rgba(0,229,255,0.6)";
  ctx.textAlign = "center";
  ctx.fillText("by Divyansh Gamer", CANVAS_WIDTH / 2, 315);

  // Instructions
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "11px 'JetBrains Mono', monospace";
  ctx.fillText("← → Arrow keys or A/D to switch lanes", CANVAS_WIDTH / 2, 390);
  ctx.fillText(
    "Avoid enemy cars — survive as long as possible!",
    CANVAS_WIDTH / 2,
    410,
  );

  // Press space button
  const bx = CANVAS_WIDTH / 2;
  const by = 470;
  const bw = 220;
  const bh = 44;
  const grad = ctx.createLinearGradient(
    bx - bw / 2,
    by - bh / 2,
    bx + bw / 2,
    by + bh / 2,
  );
  grad.addColorStop(0, "rgba(0,229,255,0.18)");
  grad.addColorStop(1, "rgba(160,0,255,0.18)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,229,255,0.6)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#00e5ff";
  ctx.font = "bold 14px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText("PRESS SPACE OR TAP TO START", bx, by + 5);

  // Mini car illustration
  drawPlayerCar(ctx, CANVAS_WIDTH / 2, 115, false, 0);
}

function drawGameOverScreen(ctx: CanvasRenderingContext2D, score: number) {
  // Dark overlay
  ctx.fillStyle = "rgba(0,0,10,0.88)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Panel
  const px = CANVAS_WIDTH / 2 - 150;
  const py = CANVAS_HEIGHT / 2 - 140;
  const grad = ctx.createLinearGradient(px, py, px + 300, py + 280);
  grad.addColorStop(0, "rgba(255,40,40,0.12)");
  grad.addColorStop(1, "rgba(0,229,255,0.06)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(px, py, 300, 280, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,68,102,0.6)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // GAME OVER
  ctx.save();
  ctx.shadowBlur = 28;
  ctx.shadowColor = "rgba(255,40,40,0.9)";
  ctx.font = "bold 44px 'Bricolage Grotesque', sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#ff4466";
  ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, py + 60);
  ctx.restore();

  // Player name
  ctx.font = "13px 'JetBrains Mono', monospace";
  ctx.fillStyle = "rgba(0,229,255,0.75)";
  ctx.textAlign = "center";
  ctx.fillText("Divyansh Gamer", CANVAS_WIDTH / 2, py + 95);

  // Score
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "12px 'JetBrains Mono', monospace";
  ctx.fillText("FINAL SCORE", CANVAS_WIDTH / 2, py + 130);
  ctx.save();
  ctx.shadowBlur = 16;
  ctx.shadowColor = "rgba(0,229,255,0.9)";
  ctx.fillStyle = "#00e5ff";
  ctx.font = "bold 36px 'JetBrains Mono', monospace";
  ctx.fillText(score.toString().padStart(6, "0"), CANVAS_WIDTH / 2, py + 172);
  ctx.restore();

  // Play again button
  const bx = CANVAS_WIDTH / 2;
  const by = py + 230;
  const bw = 180;
  const bh = 42;
  const bGrad = ctx.createLinearGradient(
    bx - bw / 2,
    by - bh / 2,
    bx + bw / 2,
    by + bh / 2,
  );
  bGrad.addColorStop(0, "rgba(0,229,255,0.2)");
  bGrad.addColorStop(1, "rgba(160,0,255,0.2)");
  ctx.fillStyle = bGrad;
  ctx.beginPath();
  ctx.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,229,255,0.7)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "#00e5ff";
  ctx.font = "bold 13px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText("▶ PLAY AGAIN", bx, by + 5);
}

// ─── Main Game Component ──────────────────────────────────────────────────────
export default function RacingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<GamePhase>("start");
  const [phase, setPhase] = useState<GamePhase>("start");
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLives, setDisplayLives] = useState(3);
  const scoreSubmittedRef = useRef(false);
  const { actor } = useActor();

  // Game state stored in refs so the game loop can access them without stale closures
  const stateRef = useRef({
    playerLane: 1,
    targetLane: 1,
    playerX: getLaneX(1),
    score: 0,
    lives: 3,
    speed: BASE_SPEED,
    dashOffset: 0,
    enemies: [] as EnemyCar[],
    trees: [] as TreeObj[],
    barriers: [] as { x: number; y: number; side: "left" | "right" }[],
    frame: 0,
    spawnTimer: 0,
    invincibilityFrames: 0,
    nextId: 0,
    scoreTimer: 0,
  });

  const keysRef = useRef<{
    left: boolean;
    right: boolean;
    space: boolean;
    _leftProcessed: boolean;
    _rightProcessed: boolean;
  }>({
    left: false,
    right: false,
    space: false,
    _leftProcessed: false,
    _rightProcessed: false,
  });
  const rafRef = useRef<number>(0);

  // ─── Score submission ──────────────────────────────────────────────────────
  const submitScore = useCallback(
    async (finalScore: number) => {
      if (scoreSubmittedRef.current) return;
      scoreSubmittedRef.current = true;
      try {
        if (!actor) return;
        await actor.addLeaderboardEntry({
          rank: BigInt(0),
          score: BigInt(finalScore),
          playerName: "Divyansh Gamer",
          gameName: "Car Racing",
        });
      } catch (_e) {
        // Silently ignore backend errors
      }
    },
    [actor],
  );

  // ─── Input handling ────────────────────────────────────────────────────────
  const handleLaneInput = useCallback((dir: "left" | "right") => {
    const s = stateRef.current;
    if (phaseRef.current !== "playing") return;
    if (dir === "left" && s.targetLane > 0) s.targetLane -= 1;
    if (dir === "right" && s.targetLane < LANE_COUNT - 1) s.targetLane += 1;
  }, []);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.playerLane = 1;
    s.targetLane = 1;
    s.playerX = getLaneX(1);
    s.score = 0;
    s.lives = 3;
    s.speed = BASE_SPEED;
    s.dashOffset = 0;
    s.enemies = [];
    s.trees = [];
    s.barriers = [];
    s.frame = 0;
    s.spawnTimer = 0;
    s.invincibilityFrames = 0;
    s.nextId = 0;
    s.scoreTimer = 0;
    scoreSubmittedRef.current = false;
    phaseRef.current = "playing";
    setPhase("playing");
    setDisplayScore(0);
    setDisplayLives(3);
  }, []);

  // ─── Keyboard listeners ────────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        if (!keysRef.current.left) {
          keysRef.current.left = true;
          keysRef.current._leftProcessed = true;
          handleLaneInput("left");
        }
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        if (!keysRef.current.right) {
          keysRef.current.right = true;
          keysRef.current._rightProcessed = true;
          handleLaneInput("right");
        }
      }
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (phaseRef.current === "start" || phaseRef.current === "over") {
          startGame();
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = false;
        keysRef.current._leftProcessed = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = false;
        keysRef.current._rightProcessed = false;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [handleLaneInput, startGame]);

  // ─── Canvas tap ────────────────────────────────────────────────────────────
  const handleCanvasTap = useCallback(
    (
      e:
        | React.MouseEvent<HTMLCanvasElement>
        | React.TouchEvent<HTMLCanvasElement>,
    ) => {
      if (phaseRef.current === "start" || phaseRef.current === "over") {
        startGame();
        return;
      }
      // Left/right tap areas
      let clientX: number;
      if ("touches" in e) {
        clientX = e.touches[0]?.clientX ?? 0;
      } else {
        clientX = (e as React.MouseEvent).clientX;
      }
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const tapX = clientX - rect.left;
      if (tapX < rect.width / 2) {
        handleLaneInput("left");
      } else {
        handleLaneInput("right");
      }
    },
    [handleLaneInput, startGame],
  );

  // ─── Game loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function loop() {
      if (!ctx) return;
      const s = stateRef.current;
      const currentPhase = phaseRef.current;

      // ── Start screen ──
      if (currentPhase === "start") {
        drawStartScreen(ctx);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // ── Game Over screen ──
      if (currentPhase === "over") {
        // Draw frozen road beneath
        drawRoad(ctx);
        drawDashMarks(ctx, s.dashOffset);
        // Draw remaining trees
        for (const t of s.trees) drawTree(ctx, t.x, t.y);
        // Draw remaining enemies
        for (const e of s.enemies)
          drawEnemyCar(ctx, getLaneX(e.lane), e.y, e.colorIdx);
        // Player
        drawPlayerCar(ctx, s.playerX, CANVAS_HEIGHT - PLAYER_H - 32, false, 0);
        drawHUD(ctx, s.score, 0, s.speed);
        drawGameOverScreen(ctx, s.score);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // ── Playing ──
      s.frame++;

      // Speed up over time
      s.speed = Math.min(BASE_SPEED + s.frame * SPEED_INCREMENT, MAX_SPEED);

      // Scroll dash marks
      s.dashOffset = (s.dashOffset + s.speed) % 56;

      // Score increments every ~60 frames
      s.scoreTimer++;
      if (s.scoreTimer >= 60) {
        s.scoreTimer = 0;
        s.score++;
        setDisplayScore(s.score);
      }

      // Invincibility countdown
      if (s.invincibilityFrames > 0) s.invincibilityFrames--;

      // Smooth lane switching
      const targetX = getLaneX(s.targetLane);
      const dx = targetX - s.playerX;
      s.playerX += dx * 0.18;
      if (Math.abs(dx) < 1) s.playerX = targetX;

      // Spawn trees on sides
      if (s.frame % 22 === 0) {
        const ty = -TREE_H;
        s.trees.push(
          { id: s.nextId++, x: 30, y: ty, side: "left" },
          { id: s.nextId++, x: CANVAS_WIDTH - 30, y: ty, side: "right" },
        );
      }

      // Spawn barriers occasionally
      if (s.frame % 80 === 0) {
        s.barriers.push(
          { x: ROAD_LEFT - 10, y: -30, side: "left" },
          { x: ROAD_RIGHT + 10, y: -30, side: "right" },
        );
      }

      // Spawn enemies
      s.spawnTimer++;
      const spawnInterval = Math.max(SPAWN_INTERVAL_BASE - s.frame * 0.05, 40);
      if (s.spawnTimer >= spawnInterval) {
        s.spawnTimer = 0;
        const lane = Math.floor(Math.random() * LANE_COUNT);
        s.enemies.push({
          id: s.nextId++,
          lane,
          y: -ENEMY_H,
          colorIdx: Math.floor(Math.random() * COLORS.enemyColors.length),
        });
      }

      // Move objects
      for (const t of s.trees) t.y += s.speed * 0.85;
      for (const b of s.barriers) b.y += s.speed * 0.85;
      for (const e of s.enemies) e.y += s.speed;

      // Cleanup off-screen
      s.trees = s.trees.filter((t) => t.y < CANVAS_HEIGHT + TREE_H);
      s.barriers = s.barriers.filter((b) => b.y < CANVAS_HEIGHT + 40);
      s.enemies = s.enemies.filter((e) => e.y < CANVAS_HEIGHT + ENEMY_H);

      // Collision detection
      const playerY = CANVAS_HEIGHT - PLAYER_H - 32;
      const px = s.playerX;

      if (s.invincibilityFrames === 0) {
        for (const e of s.enemies) {
          const ex = getLaneX(e.lane);
          const ey = e.y;
          const overlapX = Math.abs(px - ex) < (PLAYER_W + ENEMY_W) / 2 - 8;
          const overlapY =
            playerY < ey + ENEMY_H - 10 && playerY + PLAYER_H > ey + 10;
          if (overlapX && overlapY) {
            s.lives--;
            setDisplayLives(s.lives);
            s.invincibilityFrames = INVINCIBILITY_FRAMES;
            // Remove colliding enemy
            s.enemies = s.enemies.filter((en) => en.id !== e.id);
            if (s.lives <= 0) {
              phaseRef.current = "over";
              setPhase("over");
              submitScore(s.score);
              rafRef.current = requestAnimationFrame(loop);
              return;
            }
            break;
          }
        }
      }

      // ─── Draw ───
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Background
      ctx.fillStyle = COLORS.grass;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      drawRoad(ctx);
      drawDashMarks(ctx, s.dashOffset);

      // Trees
      for (const t of s.trees) drawTree(ctx, t.x, t.y);

      // Barriers
      for (const b of s.barriers) drawBarrier(ctx, b.y, b.x);

      // Enemies
      for (const e of s.enemies)
        drawEnemyCar(ctx, getLaneX(e.lane), e.y, e.colorIdx);

      // Player
      drawPlayerCar(
        ctx,
        s.playerX,
        playerY,
        s.invincibilityFrames > 0,
        s.frame,
      );

      // HUD
      drawHUD(ctx, s.score, s.lives, s.speed);

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [submitScore]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Canvas wrapper */}
      <div
        className="relative"
        style={{
          borderRadius: "10px",
          boxShadow:
            "0 0 0 1.5px rgba(0,229,255,0.4), 0 0 40px rgba(0,229,255,0.18), 0 0 80px rgba(0,229,255,0.07)",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block cursor-pointer select-none"
          style={{ maxWidth: "100%", touchAction: "none" }}
          onClick={handleCanvasTap}
          onTouchStart={handleCanvasTap}
          onKeyDown={(e) => {
            if (
              e.key === " " &&
              (phaseRef.current === "start" || phaseRef.current === "over")
            ) {
              startGame();
            }
          }}
          tabIndex={0}
          aria-label="Car Racing Game — use arrow keys or A/D to steer"
        />

        {/* Mobile touch controls overlay — only in playing phase */}
        {phase === "playing" && (
          <div
            className="absolute bottom-0 left-0 right-0 flex pointer-events-none"
            style={{ height: "72px" }}
          >
            <button
              type="button"
              className="flex-1 flex items-center justify-center pointer-events-auto active:bg-white/10 transition-colors"
              style={{
                background: "rgba(0,229,255,0.05)",
                borderTop: "1px solid rgba(0,229,255,0.12)",
                borderRight: "1px solid rgba(0,229,255,0.08)",
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                handleLaneInput("left");
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleLaneInput("left");
              }}
              aria-label="Move left"
            >
              <ChevronLeft
                className="w-8 h-8"
                style={{ color: "rgba(0,229,255,0.5)" }}
              />
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center pointer-events-auto active:bg-white/10 transition-colors"
              style={{
                background: "rgba(0,229,255,0.05)",
                borderTop: "1px solid rgba(0,229,255,0.12)",
                borderLeft: "1px solid rgba(0,229,255,0.08)",
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                handleLaneInput("right");
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleLaneInput("right");
              }}
              aria-label="Move right"
            >
              <ChevronRight
                className="w-8 h-8"
                style={{ color: "rgba(0,229,255,0.5)" }}
              />
            </button>
          </div>
        )}
      </div>

      {/* External HUD (mirrors canvas HUD for accessibility) */}
      <div className="flex items-center gap-6 text-sm font-mono">
        <div className="flex items-center gap-2">
          <span
            style={{ color: "rgba(0,229,255,0.6)" }}
            className="text-xs tracking-widest uppercase"
          >
            Score
          </span>
          <span
            className="font-bold text-base tabular-nums"
            style={{
              color: "#00e5ff",
              textShadow: "0 0 10px rgba(0,229,255,0.7)",
            }}
          >
            {String(displayScore).padStart(6, "0")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            style={{ color: "rgba(255,68,102,0.6)" }}
            className="text-xs tracking-widest uppercase"
          >
            Lives
          </span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <Heart
                key={i}
                className="w-4 h-4"
                style={{
                  color: i < displayLives ? "#ff4466" : "rgba(255,68,102,0.2)",
                  fill: i < displayLives ? "#ff4466" : "none",
                  filter:
                    i < displayLives ? "drop-shadow(0 0 4px #ff4466)" : "none",
                }}
              />
            ))}
          </div>
        </div>
        {phase === "over" && (
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-bold tracking-widest uppercase gaming-btn-primary"
            onClick={startGame}
            aria-label="Play Again"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Play Again
          </button>
        )}
      </div>

      {/* Controls hint */}
      {phase === "playing" && (
        <p
          className="text-xs text-center"
          style={{
            color: "rgba(255,255,255,0.25)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          Arrow keys / A-D to switch lanes · Avoid enemy cars
        </p>
      )}
      {phase === "start" && (
        <p
          className="text-xs text-center"
          style={{
            color: "rgba(0,229,255,0.4)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          Click or tap the canvas to start · Arrow keys / A-D to steer
        </p>
      )}
    </div>
  );
}
