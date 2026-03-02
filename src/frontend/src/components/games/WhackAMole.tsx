import { useCallback, useEffect, useRef, useState } from "react";

const HOLES = 9;
const GAME_DURATION = 30;
const MOLE_INTERVALS = [1200, 900, 700, 500];

type GameState = "idle" | "playing" | "over";

interface Hole {
  hasMole: boolean;
  hit: boolean;
  miss: boolean;
  moleTimer: number;
}

export default function WhackAMole() {
  const [state, setState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [holes, setHoles] = useState<Hole[]>(
    Array.from({ length: HOLES }, () => ({
      hasMole: false,
      hit: false,
      miss: false,
      moleTimer: 0,
    })),
  );
  const [highScore, setHighScore] = useState(0);
  const stateRef = useRef<GameState>("idle");
  const scoreRef = useRef(0);
  const timeRef = useRef(GAME_DURATION);
  const holesRef = useRef<Hole[]>(
    Array.from({ length: HOLES }, () => ({
      hasMole: false,
      hit: false,
      miss: false,
      moleTimer: 0,
    })),
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const moleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const moleTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (moleIntervalRef.current) clearInterval(moleIntervalRef.current);
    for (const t of moleTimeoutsRef.current) clearTimeout(t);
    moleTimeoutsRef.current = [];
  }, []);

  const popMole = useCallback(() => {
    if (stateRef.current !== "playing") return;
    const h = [...holesRef.current];
    const empty: number[] = [];
    for (let i = 0; i < h.length; i++) {
      if (!h[i].hasMole) empty.push(i);
    }
    if (empty.length === 0) return;
    const idx = empty[Math.floor(Math.random() * empty.length)];
    h[idx] = { ...h[idx], hasMole: true, hit: false, miss: false };
    holesRef.current = h;
    setHoles([...h]);
    // Remove mole after random time
    const duration = 600 + Math.random() * 800;
    const t = setTimeout(() => {
      if (stateRef.current !== "playing") return;
      const hh = [...holesRef.current];
      if (hh[idx].hasMole && !hh[idx].hit) {
        hh[idx] = { ...hh[idx], hasMole: false, miss: false };
        holesRef.current = hh;
        setHoles([...hh]);
      }
    }, duration);
    moleTimeoutsRef.current.push(t);
  }, []);

  const startGame = useCallback(() => {
    clearTimers();
    const emptyHoles = Array.from({ length: HOLES }, () => ({
      hasMole: false,
      hit: false,
      miss: false,
      moleTimer: 0,
    }));
    holesRef.current = emptyHoles;
    setHoles(emptyHoles);
    scoreRef.current = 0;
    setScore(0);
    timeRef.current = GAME_DURATION;
    setTimeLeft(GAME_DURATION);
    stateRef.current = "playing";
    setState("playing");

    // Timer
    intervalRef.current = setInterval(() => {
      timeRef.current -= 1;
      setTimeLeft(timeRef.current);
      if (timeRef.current <= 0) {
        clearTimers();
        stateRef.current = "over";
        setState("over");
        setHighScore((h) => Math.max(h, scoreRef.current));
        const finalHoles = Array.from({ length: HOLES }, () => ({
          hasMole: false,
          hit: false,
          miss: false,
          moleTimer: 0,
        }));
        holesRef.current = finalHoles;
        setHoles(finalHoles);
      }
    }, 1000);

    // Mole spawner
    const getInterval = () => {
      const t = timeRef.current;
      if (t > 20) return MOLE_INTERVALS[0];
      if (t > 15) return MOLE_INTERVALS[1];
      if (t > 8) return MOLE_INTERVALS[2];
      return MOLE_INTERVALS[3];
    };

    let moleT: ReturnType<typeof setTimeout>;
    const scheduleMole = () => {
      if (stateRef.current !== "playing") return;
      popMole();
      moleT = setTimeout(scheduleMole, getInterval());
      moleTimeoutsRef.current.push(moleT);
    };
    moleT = setTimeout(scheduleMole, 400);
    moleTimeoutsRef.current.push(moleT);
  }, [clearTimers, popMole]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const whack = useCallback((idx: number) => {
    if (stateRef.current !== "playing") return;
    const h = [...holesRef.current];
    if (!h[idx].hasMole || h[idx].hit) return;
    h[idx] = { ...h[idx], hit: true, hasMole: false };
    holesRef.current = h;
    setHoles([...h]);
    scoreRef.current += 1;
    setScore(scoreRef.current);
    // Clear hit anim
    const t = setTimeout(() => {
      const hh = [...holesRef.current];
      hh[idx] = { ...hh[idx], hit: false };
      holesRef.current = hh;
      setHoles([...hh]);
    }, 300);
    moleTimeoutsRef.current.push(t);
  }, []);

  const timerPct = (timeLeft / GAME_DURATION) * 100;
  const timerColor =
    timerPct > 50 ? "#00e5ff" : timerPct > 25 ? "#ffd700" : "#ff4466";

  return (
    <div
      className="flex flex-col items-center gap-4 select-none"
      style={{ userSelect: "none" }}
    >
      {/* HUD */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div
            style={{
              color: "rgba(0,229,255,0.5)",
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: "0.12em",
            }}
          >
            SCORE
          </div>
          <div
            style={{
              color: "#00e5ff",
              fontSize: 28,
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 700,
              textShadow: "0 0 12px rgba(0,229,255,0.8)",
            }}
          >
            {score}
          </div>
        </div>
        <div className="text-center">
          <div
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: "0.12em",
            }}
          >
            TIME
          </div>
          <div
            style={{
              color: timerColor,
              fontSize: 28,
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 700,
              textShadow: `0 0 12px ${timerColor}80`,
            }}
          >
            {timeLeft}s
          </div>
        </div>
        <div className="text-center">
          <div
            style={{
              color: "rgba(255,215,0,0.5)",
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: "0.12em",
            }}
          >
            BEST
          </div>
          <div
            style={{
              color: "oklch(0.78 0.18 75)",
              fontSize: 28,
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 700,
            }}
          >
            {highScore}
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div
        style={{
          width: 320,
          height: 4,
          background: "rgba(255,255,255,0.1)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${timerPct}%`,
            background: timerColor,
            transition: "width 1s linear, background 0.5s",
            boxShadow: `0 0 8px ${timerColor}80`,
          }}
        />
      </div>

      {/* Game grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          padding: 16,
        }}
      >
        {holes.map((hole, i) => {
          const holeKey = `hole-pos-${String(i).padStart(2, "0")}`;
          return (
            <button
              key={holeKey}
              type="button"
              onClick={() => whack(i)}
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                border: `2px solid ${hole.hasMole ? "#a855f7" : hole.hit ? "#00ff88" : "rgba(0,229,255,0.2)"}`,
                background: hole.hit
                  ? "rgba(0,255,136,0.3)"
                  : hole.hasMole
                    ? "rgba(168,85,247,0.25)"
                    : "rgba(0,5,20,0.8)",
                cursor: state === "playing" ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                transition: "transform 0.1s, border-color 0.15s",
                transform: hole.hasMole
                  ? "scale(1.05)"
                  : hole.hit
                    ? "scale(0.9)"
                    : "scale(1)",
                boxShadow: hole.hasMole
                  ? "0 0 20px rgba(168,85,247,0.5)"
                  : hole.hit
                    ? "0 0 15px rgba(0,255,136,0.5)"
                    : "inset 0 4px 16px rgba(0,0,0,0.5)",
              }}
            >
              {hole.hit ? "💥" : hole.hasMole ? "🐹" : ""}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      {state === "idle" && (
        <button
          type="button"
          className="gaming-btn-primary px-8 py-3 rounded font-display font-bold text-sm tracking-widest uppercase"
          onClick={startGame}
        >
          🎯 Start Game
        </button>
      )}
      {state === "over" && (
        <div className="flex flex-col items-center gap-3">
          <div
            style={{
              color: "#ff4466",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 18,
              fontWeight: 700,
              textShadow: "0 0 12px rgba(255,68,102,0.8)",
            }}
          >
            GAME OVER! Score: {scoreRef.current}
          </div>
          <button
            type="button"
            className="gaming-btn-primary px-8 py-3 rounded font-display font-bold text-sm tracking-widest uppercase"
            onClick={startGame}
          >
            🔄 Play Again
          </button>
        </div>
      )}
      {state === "playing" && (
        <p
          style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: 11,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          Click the moles before they disappear!
        </p>
      )}
    </div>
  );
}
