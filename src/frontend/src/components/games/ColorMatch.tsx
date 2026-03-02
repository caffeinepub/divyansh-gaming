import { useCallback, useRef, useState } from "react";

const COLORS = [
  { name: "RED", hex: "#ff4466" },
  { name: "BLUE", hex: "#00a8ff" },
  { name: "GREEN", hex: "#00ff88" },
  { name: "YELLOW", hex: "#ffd700" },
  { name: "PURPLE", hex: "#c084fc" },
  { name: "ORANGE", hex: "#ff6a00" },
];

const ROUNDS = 20;

type GameState = "idle" | "playing" | "over";

interface ColorItem {
  name: string;
  hex: string;
}

interface Round {
  textColor: ColorItem;
  inkColor: ColorItem;
  options: ColorItem[];
}

function getRandomItem(arr: ColorItem[], exclude?: ColorItem): ColorItem {
  const filtered = exclude ? arr.filter((x) => x !== exclude) : arr;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeRound(): Round {
  const textColor = getRandomItem(COLORS);
  const inkColor = getRandomItem(COLORS, textColor);
  const wrong = shuffleArr(COLORS.filter((c) => c !== textColor)).slice(0, 3);
  const options = shuffleArr([textColor, ...wrong]);
  return { textColor, inkColor, options };
}

export default function ColorMatch() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [round, setRound] = useState<Round | null>(null);
  const [roundNum, setRoundNum] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [highScore, setHighScore] = useState(0);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roundNumRef = useRef(0);
  const scoreRef = useRef(0);
  const streakRef = useRef(0);

  const startGame = useCallback(() => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    roundNumRef.current = 1;
    scoreRef.current = 0;
    streakRef.current = 0;
    setRoundNum(1);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setGameState("playing");
    setRound(makeRound());
  }, []);

  const handleAnswer = useCallback(
    (chosen: ColorItem) => {
      if (!round || feedback !== null) return;
      const correct = chosen.name === round.textColor.name;
      setFeedback(correct ? "correct" : "wrong");
      const newScore = scoreRef.current + (correct ? 1 + streakRef.current : 0);
      const newStreak = correct ? streakRef.current + 1 : 0;
      scoreRef.current = newScore;
      streakRef.current = newStreak;
      setScore(newScore);
      setStreak(newStreak);

      feedbackTimerRef.current = setTimeout(() => {
        setFeedback(null);
        if (roundNumRef.current >= ROUNDS) {
          setGameState("over");
          setHighScore((h) => Math.max(h, newScore));
        } else {
          roundNumRef.current++;
          setRoundNum(roundNumRef.current);
          setRound(makeRound());
        }
      }, 600);
    },
    [round, feedback],
  );

  return (
    <div
      className="flex flex-col items-center gap-5 select-none"
      style={{ userSelect: "none", minWidth: 300 }}
    >
      {/* HUD */}
      <div className="flex gap-6">
        <div className="text-center">
          <div
            style={{
              color: "rgba(0,229,255,0.5)",
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: "0.1em",
            }}
          >
            SCORE
          </div>
          <div
            style={{
              color: "#00e5ff",
              fontSize: 26,
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 700,
              textShadow: "0 0 12px rgba(0,229,255,0.7)",
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
              letterSpacing: "0.1em",
            }}
          >
            ROUND
          </div>
          <div
            style={{
              color: "#a855f7",
              fontSize: 26,
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 700,
            }}
          >
            {gameState === "playing" ? `${roundNum}/${ROUNDS}` : "-"}
          </div>
        </div>
        <div className="text-center">
          <div
            style={{
              color: "rgba(255,215,0,0.5)",
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: "0.1em",
            }}
          >
            STREAK
          </div>
          <div
            style={{
              color: "oklch(0.78 0.18 75)",
              fontSize: 26,
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 700,
            }}
          >
            {streak}🔥
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div
        style={{
          padding: "8px 16px",
          borderRadius: 6,
          border: "1px solid rgba(0,229,255,0.2)",
          background: "rgba(0,5,20,0.6)",
          color: "rgba(255,255,255,0.5)",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 11,
          textAlign: "center",
        }}
      >
        Click the button matching the{" "}
        <strong style={{ color: "#00e5ff" }}>TEXT</strong> (ignore the ink
        color!)
      </div>

      {/* Word display */}
      {gameState === "playing" && round && (
        <div
          style={{
            padding: "20px 40px",
            borderRadius: 12,
            border: `2px solid ${feedback === "correct" ? "#00ff88" : feedback === "wrong" ? "#ff4466" : "rgba(0,229,255,0.15)"}`,
            background:
              feedback === "correct"
                ? "rgba(0,255,136,0.1)"
                : feedback === "wrong"
                  ? "rgba(255,68,102,0.1)"
                  : "rgba(6,6,20,0.9)",
            transition: "border-color 0.15s, background 0.15s",
            boxShadow:
              feedback === "correct"
                ? "0 0 20px rgba(0,255,136,0.3)"
                : feedback === "wrong"
                  ? "0 0 20px rgba(255,68,102,0.3)"
                  : "none",
          }}
        >
          <div
            style={{
              color: round.inkColor.hex,
              fontSize: 42,
              fontFamily: "Bricolage Grotesque, sans-serif",
              fontWeight: 900,
              letterSpacing: "0.2em",
              textShadow: `0 0 20px ${round.inkColor.hex}80`,
            }}
          >
            {round.textColor.name}
          </div>
        </div>
      )}

      {/* Options */}
      {gameState === "playing" && round && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            width: "100%",
          }}
        >
          {round.options.map((opt) => (
            <button
              key={opt.name}
              type="button"
              onClick={() => handleAnswer(opt)}
              style={{
                padding: "14px",
                borderRadius: 8,
                border: `2px solid ${opt.hex}50`,
                background: `${opt.hex}18`,
                cursor: feedback !== null ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                transition: "transform 0.1s, border-color 0.1s",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: opt.hex,
                  flexShrink: 0,
                  boxShadow: `0 0 10px ${opt.hex}60`,
                }}
              />
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 13,
                  fontWeight: 700,
                  color: opt.hex,
                  letterSpacing: "0.08em",
                }}
              >
                {opt.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Start / Over */}
      {gameState === "idle" && (
        <button
          type="button"
          className="gaming-btn-primary px-8 py-3 rounded font-display font-bold text-sm tracking-widest uppercase"
          onClick={startGame}
        >
          🎨 Start Game
        </button>
      )}
      {gameState === "over" && (
        <div className="flex flex-col items-center gap-3">
          <div
            style={{
              color: "#ffd700",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 16,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            🏆 Final Score: {score} / {ROUNDS} · Best: {highScore}
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
    </div>
  );
}
