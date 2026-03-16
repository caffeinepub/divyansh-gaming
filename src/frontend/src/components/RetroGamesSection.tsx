import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface RetroGame {
  id: string;
  name: string;
  year: number;
  genre: string;
  color: string;
  emoji: string;
  playable?: boolean;
}

const RETRO_GAMES: RetroGame[] = [
  {
    id: "contra",
    name: "Contra Runner",
    year: 1987,
    genre: "Action",
    color: "#ff4400",
    emoji: "🔫",
  },
  {
    id: "mario",
    name: "Mario Land",
    year: 1985,
    genre: "Platformer",
    color: "#ff0000",
    emoji: "🍄",
  },
  {
    id: "pacmaze",
    name: "Pac-Maze",
    year: 1980,
    genre: "Arcade",
    color: "#ffff00",
    emoji: "👾",
    playable: true,
  },
  {
    id: "blockdrop",
    name: "Block Drop",
    year: 1984,
    genre: "Puzzle",
    color: "#00ff88",
    emoji: "🟦",
    playable: true,
  },
  {
    id: "galaga",
    name: "Galaga",
    year: 1981,
    genre: "Shooter",
    color: "#00aaff",
    emoji: "🚀",
  },
  {
    id: "frogger",
    name: "Frogger",
    year: 1981,
    genre: "Arcade",
    color: "#88ff00",
    emoji: "🐸",
  },
  {
    id: "breakout",
    name: "Breakout",
    year: 1976,
    genre: "Arcade",
    color: "#ff88ff",
    emoji: "🟥",
    playable: true,
  },
  {
    id: "gorilla",
    name: "Gorilla Bash",
    year: 1981,
    genre: "Platformer",
    color: "#ff8800",
    emoji: "🦍",
  },
  {
    id: "asteroid",
    name: "Asteroid Field",
    year: 1979,
    genre: "Shooter",
    color: "#aaaaff",
    emoji: "☄️",
  },
  {
    id: "duckblaster",
    name: "Duck Blaster",
    year: 1984,
    genre: "Arcade",
    color: "#ffdd00",
    emoji: "🦆",
  },
  {
    id: "bombrun",
    name: "Bomb Run",
    year: 1983,
    genre: "Puzzle",
    color: "#ff4488",
    emoji: "💣",
  },
  {
    id: "cyberfighter",
    name: "Cyber Fighter",
    year: 1992,
    genre: "Fighting",
    color: "#00ffff",
    emoji: "🥊",
  },
  {
    id: "streetbrawler",
    name: "Street Brawler",
    year: 1987,
    genre: "Fighting",
    color: "#ff0066",
    emoji: "👊",
  },
  {
    id: "sonicrush",
    name: "Sonic Rush",
    year: 1991,
    genre: "Platformer",
    color: "#0044ff",
    emoji: "💨",
  },
  {
    id: "megabot",
    name: "MegaBot",
    year: 1987,
    genre: "Action",
    color: "#00ff44",
    emoji: "🤖",
  },
  {
    id: "castlerun",
    name: "Castle Run",
    year: 1986,
    genre: "Adventure",
    color: "#cc88ff",
    emoji: "🏰",
  },
  {
    id: "dungeonquest",
    name: "Dungeon Quest",
    year: 1986,
    genre: "RPG",
    color: "#ff8844",
    emoji: "⚔️",
  },
  {
    id: "dragonbeat",
    name: "Dragon Beat",
    year: 1987,
    genre: "Beat-em-up",
    color: "#ff2200",
    emoji: "🐉",
  },
  {
    id: "rblaster",
    name: "R-Blaster",
    year: 1987,
    genre: "Shooter",
    color: "#44ffff",
    emoji: "🛸",
  },
  {
    id: "gradiuswing",
    name: "Gradius Wing",
    year: 1985,
    genre: "Shooter",
    color: "#ff88aa",
    emoji: "✈️",
  },
  {
    id: "digdug",
    name: "Dig Dug",
    year: 1982,
    genre: "Arcade",
    color: "#ffbb00",
    emoji: "⛏️",
  },
  {
    id: "qbert",
    name: "Q*Bert's",
    year: 1982,
    genre: "Arcade",
    color: "#ff6600",
    emoji: "🎲",
  },
  {
    id: "centipede",
    name: "Centipede",
    year: 1980,
    genre: "Shooter",
    color: "#44ff88",
    emoji: "🐛",
  },
  {
    id: "trongrid",
    name: "Tron Grid",
    year: 1982,
    genre: "Action",
    color: "#00eeff",
    emoji: "⚡",
  },
  {
    id: "pitfall",
    name: "Pitfall Run",
    year: 1982,
    genre: "Platformer",
    color: "#88ff44",
    emoji: "🏃",
  },
  {
    id: "punchmaster",
    name: "Punch Master",
    year: 1983,
    genre: "Fighting",
    color: "#ff4444",
    emoji: "🥊",
  },
  {
    id: "tankwars",
    name: "Tank Wars",
    year: 1985,
    genre: "Strategy",
    color: "#aaaa44",
    emoji: "🪖",
  },
];

// ── Pac-Maze Game ─────────────────────────────────────────────────────────────
function PacMazeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    px: 1,
    py: 1,
    dx: 0,
    dy: 0,
    dots: [] as boolean[][],
    score: 0,
    won: false,
    started: false,
  });
  const rafRef = useRef<number>(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [won, setWon] = useState(false);

  const COLS = 15;
  const ROWS = 12;
  const CELL = 32;
  const WALL = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  useEffect(() => {
    const dots: boolean[][] = [];
    for (let r = 0; r < ROWS; r++) {
      dots[r] = [];
      for (let c = 0; c < COLS; c++) {
        dots[r][c] = WALL[r][c] === 0;
      }
    }
    stateRef.current.dots = dots;
    stateRef.current.px = 1;
    stateRef.current.py = 1;
    stateRef.current.score = 0;
    stateRef.current.won = false;

    const draw = () => {
      const s = stateRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++) {
          if (WALL[r][c]) {
            ctx.fillStyle = "#002244";
            ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
            ctx.strokeStyle = "#0044ff";
            ctx.lineWidth = 2;
            ctx.strokeRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
          } else if (s.dots[r][c]) {
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(
              c * CELL + CELL / 2,
              r * CELL + CELL / 2,
              3,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }
        }
      ctx.fillStyle = "#ffff00";
      ctx.beginPath();
      ctx.arc(
        s.px * CELL + CELL / 2,
        s.py * CELL + CELL / 2,
        CELL / 2 - 4,
        0.25 * Math.PI,
        1.75 * Math.PI,
      );
      ctx.lineTo(s.px * CELL + CELL / 2, s.py * CELL + CELL / 2);
      ctx.fill();
    };

    let last = 0;
    const loop = (ts: number) => {
      const s = stateRef.current;
      if (ts - last > 140) {
        last = ts;
        const nx = s.px + s.dx;
        const ny = s.py + s.dy;
        if (
          s.started &&
          nx >= 0 &&
          nx < COLS &&
          ny >= 0 &&
          ny < ROWS &&
          !WALL[ny][nx]
        ) {
          s.px = nx;
          s.py = ny;
          if (s.dots[ny][nx]) {
            s.dots[ny][nx] = false;
            s.score += 10;
            setDisplayScore(s.score);
          }
        }
        const remaining = s.dots.flat().filter(Boolean).length;
        if (remaining === 0 && !s.won) {
          s.won = true;
          setWon(true);
        }
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      s.started = true;
      if (e.key === "ArrowLeft") {
        s.dx = -1;
        s.dy = 0;
      }
      if (e.key === "ArrowRight") {
        s.dx = 1;
        s.dy = 0;
      }
      if (e.key === "ArrowUp") {
        s.dx = 0;
        s.dy = -1;
      }
      if (e.key === "ArrowDown") {
        s.dx = 0;
        s.dy = 1;
      }
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex gap-6 text-xs font-mono"
        style={{ color: "#00ff41" }}
      >
        <span>SCORE: {displayScore}</span>
        {won && <span style={{ color: "#ffff00" }}>YOU WIN! 🎉</span>}
      </div>
      <canvas
        ref={canvasRef}
        width={COLS * CELL}
        height={ROWS * CELL}
        style={{
          border: "2px solid #00ff41",
          imageRendering: "pixelated",
          display: "block",
        }}
      />
      <p className="text-xs font-mono" style={{ color: "#00ff4180" }}>
        Arrow keys to move
      </p>
    </div>
  );
}

// ── Block Drop (Tetris) ───────────────────────────────────────────────────────
function BlockDropGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [over, setOver] = useState(false);
  const stateRef = useRef({
    board: [] as number[][],
    piece: null as number[][] | null,
    px: 0,
    py: 0,
    pColor: 0,
    score: 0,
    lines: 0,
    over: false,
  });

  const W = 10;
  const H = 20;
  const CELL = 24;
  const PIECES = [
    [[1, 1, 1, 1]],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
  ];
  const COLORS = [
    "#00ffff",
    "#ffff00",
    "#aa00ff",
    "#ff8800",
    "#0044ff",
    "#00ff44",
    "#ff0044",
  ];

  const newPiece = useCallback(() => {
    const i = Math.floor(Math.random() * PIECES.length);
    return { shape: PIECES[i], x: Math.floor(W / 2) - 1, y: 0, c: i };
  }, []);

  useEffect(() => {
    const board: number[][] = Array.from({ length: H }, () => Array(W).fill(0));
    stateRef.current.board = board;
    let cur = newPiece();

    const fits = (shape: number[][], px: number, py: number) => {
      for (let r = 0; r < shape.length; r++)
        for (let c = 0; c < shape[r].length; c++)
          if (shape[r][c]) {
            const nx = px + c;
            const ny = py + r;
            if (nx < 0 || nx >= W || ny >= H) return false;
            if (ny >= 0 && board[ny][nx]) return false;
          }
      return true;
    };

    const place = () => {
      for (let r = 0; r < cur.shape.length; r++)
        for (let c = 0; c < cur.shape[r].length; c++)
          if (cur.shape[r][c]) {
            const ny = cur.y + r;
            if (ny >= 0) board[ny][cur.x + c] = cur.c + 1;
          }
      let cleared = 0;
      for (let r = H - 1; r >= 0; r--) {
        if (board[r].every(Boolean)) {
          board.splice(r, 1);
          board.unshift(Array(W).fill(0));
          cleared++;
          r++;
        }
      }
      stateRef.current.score += cleared * 100;
      stateRef.current.lines += cleared;
      setScore(stateRef.current.score);
      setLines(stateRef.current.lines);
      cur = newPiece();
      if (!fits(cur.shape, cur.x, cur.y)) {
        stateRef.current.over = true;
        setOver(true);
      }
    };

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W * CELL, H * CELL);
      for (let r = 0; r < H; r++)
        for (let c = 0; c < W; c++) {
          if (board[r][c]) {
            ctx.fillStyle = COLORS[board[r][c] - 1];
            ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
          } else {
            ctx.strokeStyle = "#111";
            ctx.lineWidth = 0.5;
            ctx.strokeRect(c * CELL, r * CELL, CELL, CELL);
          }
        }
      ctx.fillStyle = COLORS[cur.c];
      for (let r = 0; r < cur.shape.length; r++)
        for (let c = 0; c < cur.shape[r].length; c++)
          if (cur.shape[r][c])
            ctx.fillRect(
              (cur.x + c) * CELL + 1,
              (cur.y + r) * CELL + 1,
              CELL - 2,
              CELL - 2,
            );
    };

    let last = 0;
    let speed = 500;
    const rafRef2 = { id: 0 };
    const loop = (ts: number) => {
      if (stateRef.current.over) {
        draw();
        return;
      }
      if (ts - last > speed) {
        last = ts;
        speed = Math.max(100, 500 - stateRef.current.lines * 20);
        if (fits(cur.shape, cur.x, cur.y + 1)) cur.y++;
        else place();
      }
      draw();
      rafRef2.id = requestAnimationFrame(loop);
    };
    rafRef2.id = requestAnimationFrame(loop);

    const onKey = (e: KeyboardEvent) => {
      if (stateRef.current.over) return;
      if (e.key === "ArrowLeft" && fits(cur.shape, cur.x - 1, cur.y)) cur.x--;
      if (e.key === "ArrowRight" && fits(cur.shape, cur.x + 1, cur.y)) cur.x++;
      if (e.key === "ArrowDown") {
        if (fits(cur.shape, cur.x, cur.y + 1)) cur.y++;
        else place();
      }
      if (e.key === "ArrowUp") {
        const rot = cur.shape[0].map((_, i) =>
          cur.shape.map((row) => row[i]).reverse(),
        );
        if (fits(rot, cur.x, cur.y)) cur.shape = rot;
      }
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(rafRef2.id);
      window.removeEventListener("keydown", onKey);
    };
  }, [newPiece]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex gap-6 text-xs font-mono"
        style={{ color: "#00ff41" }}
      >
        <span>SCORE: {score}</span>
        <span>LINES: {lines}</span>
        {over && <span style={{ color: "#ff4444" }}>GAME OVER</span>}
      </div>
      <canvas
        ref={canvasRef}
        width={W * CELL}
        height={H * CELL}
        style={{ border: "2px solid #00ff41", imageRendering: "pixelated" }}
      />
      <p className="text-xs font-mono" style={{ color: "#00ff4180" }}>
        ← → move · ↑ rotate · ↓ drop
      </p>
    </div>
  );
}

// ── Breakout Game ─────────────────────────────────────────────────────────────
function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const gameRef = useRef({
    bx: 220,
    by: 340,
    bdx: 3,
    bdy: -3,
    px: 170,
    pw: 80,
    bricks: [] as { x: number; y: number; alive: boolean; color: string }[],
    score: 0,
    lives: 3,
    over: false,
    won: false,
  });

  useEffect(() => {
    const g = gameRef.current;
    const colors = [
      "#ff4444",
      "#ff8800",
      "#ffff00",
      "#00ff44",
      "#00aaff",
      "#ff44ff",
    ];
    const bricks: typeof g.bricks = [];
    for (let r = 0; r < 6; r++)
      for (let c = 0; c < 10; c++)
        bricks.push({
          x: c * 44 + 2,
          y: r * 20 + 40,
          alive: true,
          color: colors[r],
        });
    g.bricks = bricks;

    const W = 440;
    const H = 380;
    let rafId = 0;
    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (g.over || g.won) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = g.won ? "#ffff00" : "#ff4444";
        ctx.font = "bold 28px monospace";
        ctx.textAlign = "center";
        ctx.fillText(g.won ? "YOU WIN! 🎉" : "GAME OVER", W / 2, H / 2);
        return;
      }
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      for (const b of g.bricks) {
        if (!b.alive) continue;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, 40, 16);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x, b.y, 40, 16);
      }
      ctx.fillStyle = "#00ff41";
      ctx.fillRect(g.px, H - 20, g.pw, 10);
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(g.bx, g.by, 7, 0, Math.PI * 2);
      ctx.fill();
      g.bx += g.bdx;
      g.by += g.bdy;
      if (g.bx < 7 || g.bx > W - 7) g.bdx *= -1;
      if (g.by < 7) g.bdy *= -1;
      if (g.by > H - 13 && g.bx >= g.px && g.bx <= g.px + g.pw) {
        g.bdy = -Math.abs(g.bdy);
        g.bdx += (g.bx - (g.px + g.pw / 2)) * 0.04;
      }
      if (g.by > H) {
        g.lives--;
        setLives(g.lives);
        if (g.lives <= 0) {
          g.over = true;
          setOver(true);
          return;
        }
        g.bx = W / 2;
        g.by = 340;
        g.bdx = 3;
        g.bdy = -3;
        g.px = 170;
      }
      for (const b of g.bricks) {
        if (!b.alive) continue;
        if (g.bx > b.x && g.bx < b.x + 40 && g.by > b.y && g.by < b.y + 16) {
          b.alive = false;
          g.bdy *= -1;
          g.score += 10;
          setScore(g.score);
        }
      }
      if (!g.bricks.some((b) => b.alive)) {
        g.won = true;
        setWon(true);
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const onMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      gameRef.current.px = Math.max(
        0,
        Math.min(440 - 80, e.clientX - rect.left - 40),
      );
    };
    const onTouch = (e: TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      gameRef.current.px = Math.max(
        0,
        Math.min(440 - 80, e.touches[0].clientX - rect.left - 40),
      );
    };
    const c = canvasRef.current;
    c?.addEventListener("mousemove", onMove);
    c?.addEventListener("touchmove", onTouch);
    return () => {
      cancelAnimationFrame(rafId);
      c?.removeEventListener("mousemove", onMove);
      c?.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex gap-6 text-xs font-mono"
        style={{ color: "#00ff41" }}
      >
        <span>SCORE: {score}</span>
        <span>LIVES: {"❤️".repeat(lives)}</span>
        {won && <span style={{ color: "#ffff00" }}>YOU WIN!</span>}
        {over && <span style={{ color: "#ff4444" }}>GAME OVER</span>}
      </div>
      <canvas
        ref={canvasRef}
        width={440}
        height={380}
        style={{
          border: "2px solid #00ff41",
          cursor: "none",
          display: "block",
        }}
      />
      <p className="text-xs font-mono" style={{ color: "#00ff4180" }}>
        Move mouse to control paddle
      </p>
    </div>
  );
}

// ── Mock Game Screen ──────────────────────────────────────────────────────────
function MockGameScreen({ game }: { game: RetroGame }) {
  const [phase, setPhase] = useState<"loading" | "playing">("loading");
  const [score, setScore] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("playing"), 1500);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(
      () => setScore((s) => s + Math.floor(Math.random() * 50 + 10)),
      400,
    );
    return () => clearInterval(id);
  }, [phase]);

  return (
    <div
      className="flex flex-col items-center gap-4"
      style={{
        width: 440,
        height: 380,
        background: "#000",
        border: `2px solid ${game.color}`,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {phase === "loading" ? (
        <>
          <div className="text-4xl">{game.emoji}</div>
          <div
            className="text-xl font-mono font-bold"
            style={{ color: game.color }}
          >
            LOADING...
          </div>
          <div className="flex gap-1 mt-2">
            {["a", "b", "c", "d", "e", "f", "g", "h"].map((dk, i) => (
              <motion.div
                key={dk}
                className="w-2 h-2 rounded-full"
                style={{ background: game.color }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="text-5xl">{game.emoji}</div>
          <div
            className="text-2xl font-mono font-bold tracking-widest"
            style={{ color: game.color, textShadow: `0 0 20px ${game.color}` }}
          >
            GAME ON!
          </div>
          <div className="text-lg font-mono mt-2" style={{ color: "#fff" }}>
            SCORE: {score.toLocaleString()}
          </div>
          <div
            className="text-sm font-mono mt-4 px-6 text-center"
            style={{ color: `${game.color}90` }}
          >
            {game.name} — Demo Mode Active
          </div>
          <div className="mt-4 flex gap-2">
            {["←", "→", "↑", "↓"].map((k) => (
              <div
                key={k}
                className="w-8 h-8 font-mono text-sm flex items-center justify-center rounded"
                style={{
                  border: `1px solid ${game.color}60`,
                  color: game.color,
                }}
              >
                \n {k}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Game Modal ─────────────────────────────────────────────────────────────────
function RetroModal({
  game,
  onClose,
}: { game: RetroGame; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const GameContent = game.playable
    ? game.id === "pacmaze"
      ? PacMazeGame
      : game.id === "blockdrop"
        ? BlockDropGame
        : BreakoutGame
    : () => <MockGameScreen game={game} />;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.95)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="relative flex flex-col items-center gap-4 p-6 rounded"
        style={{
          background: "#050505",
          border: `2px solid ${game.color}`,
          boxShadow: `0 0 40px ${game.color}50, inset 0 0 80px rgba(0,0,0,0.8)`,
          maxWidth: "95vw",
        }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        {/* CRT scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
          }}
        />
        <div className="flex items-center justify-between w-full">
          <div>
            <div
              className="font-mono font-bold text-lg tracking-widest"
              style={{
                color: game.color,
                textShadow: `0 0 12px ${game.color}`,
              }}
            >
              {game.name}
            </div>
            <div
              className="font-mono text-xs"
              style={{ color: `${game.color}70` }}
            >
              {game.year} · {game.genre}
            </div>
          </div>
          <button
            type="button"
            data-ocid="retro.close_button"
            onClick={onClose}
            className="w-8 h-8 font-mono font-bold rounded flex items-center justify-center transition-all"
            style={{
              background: "rgba(255,0,0,0.15)",
              border: "1px solid rgba(255,0,0,0.4)",
              color: "#ff4444",
            }}
          >
            ✕
          </button>
        </div>
        <GameContent />
      </motion.div>
    </motion.div>
  );
}

// ── Retro Game Card ───────────────────────────────────────────────────────────
function RetroCard({
  game,
  index,
  onPlay,
}: { game: RetroGame; index: number; onPlay: () => void }) {
  return (
    <motion.div
      className="relative cursor-pointer group"
      style={{
        background: "#0a0a0a",
        border: `1px solid ${game.color}30`,
        borderRadius: 4,
        overflow: "hidden",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 9) * 0.04 }}
      whileHover={{ y: -3, boxShadow: `0 0 20px ${game.color}40` }}
    >
      {/* CRT scan lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px)",
        }}
      />
      <div className="p-3 flex flex-col gap-2 relative z-10">
        <div
          className="text-3xl text-center"
          style={{ filter: `drop-shadow(0 0 6px ${game.color})` }}
        >
          {game.emoji}
        </div>
        <div
          className="font-mono font-bold text-xs text-center leading-tight"
          style={{ color: game.color }}
        >
          {game.name}
        </div>
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-mono"
            style={{ color: `${game.color}70` }}
          >
            {game.year}
          </span>
          <span
            className="text-xs font-mono px-1.5 py-0.5 rounded"
            style={{
              background: `${game.color}20`,
              border: `1px solid ${game.color}40`,
              color: game.color,
            }}
          >
            {game.genre}
          </span>
        </div>
        <button
          type="button"
          data-ocid={`retro.${game.id}.button`}
          onClick={onPlay}
          className="w-full py-1.5 font-mono font-bold text-xs tracking-widest uppercase transition-all duration-200 rounded"
          style={{
            background: `${game.color}20`,
            border: `1px solid ${game.color}60`,
            color: game.color,
          }}
        >
          {game.playable ? "▶ PLAY" : "INSERT COIN"}
        </button>
      </div>
    </motion.div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function RetroGamesSection() {
  const [activeGame, setActiveGame] = useState<RetroGame | null>(null);

  return (
    <section
      id="retro-games"
      data-ocid="retro.section"
      className="relative py-24 overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Phosphor glow bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(0,255,65,0.04) 0%, transparent 70%)",
        }}
      />
      {/* CRT scanlines full */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 4px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="font-mono text-xs tracking-widest mb-3"
            style={{ color: "#00ff4160" }}
          >
            ■ ■ ■ INSERT COIN ■ ■ ■
          </div>
          <h2
            className="font-mono font-black text-5xl md:text-6xl mb-3 tracking-widest uppercase"
            style={{
              color: "#00ff41",
              textShadow:
                "0 0 30px #00ff41, 0 0 60px #00ff4140, 0 0 120px #00ff4120",
              letterSpacing: "0.15em",
            }}
          >
            90&apos;s FANS
          </h2>
          <p
            className="font-mono text-sm tracking-widest"
            style={{ color: "#ffb00080" }}
          >
            ▸ Classic arcade &amp; console legends — reborn in your browser ◂
          </p>
          <div
            className="flex items-center justify-center gap-4 mt-4 font-mono text-xs"
            style={{ color: "#00ff4150" }}
          >
            <span>27 GAMES</span>
            <span>·</span>
            <span>3 PLAYABLE</span>
            <span>·</span>
            <span>RETRO MODE</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-3">
          {RETRO_GAMES.map((game, i) => (
            <RetroCard
              key={game.id}
              game={game}
              index={i}
              onPlay={() => setActiveGame(game)}
            />
          ))}
        </div>

        <motion.div
          className="text-center mt-10 font-mono text-xs"
          style={{ color: "#00ff4140" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          © 1976–1992 CLASSIC ARCADE INC. ALL RIGHTS RESERVED. PRESS START.
        </motion.div>
      </div>

      <AnimatePresence>
        {activeGame && (
          <RetroModal game={activeGame} onClose={() => setActiveGame(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
