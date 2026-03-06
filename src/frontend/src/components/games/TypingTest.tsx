import { useCallback, useEffect, useRef, useState } from "react";

const PHRASES = [
  "The quick brown fox jumps over the lazy dog near the riverbank.",
  "Gamers never quit they just respawn with more determination.",
  "Press start to unleash the neon warrior within you tonight.",
  "Every pixel is a battlefield and every frame is a legend.",
  "Speed and precision are the hallmarks of a true champion.",
  "In the digital realm champions are forged in neon fire.",
  "Coding through the night while neon lights paint the sky.",
  "Victory belongs to those who never stop pushing forward.",
];

const DURATION = 60;

type GameState = "idle" | "playing" | "over";

export default function TypingTest() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [phrase, setPhrase] = useState(PHRASES[0]);
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [bestWpm, setBestWpm] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const wordCountRef = useRef(0);
  const totalCharsRef = useRef(0);
  const correctCharsRef = useRef(0);

  const pickPhrase = useCallback(
    () => PHRASES[Math.floor(Math.random() * PHRASES.length)],
    [],
  );

  const endGame = useCallback((finalWpm: number, finalAcc: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState("over");
    setBestWpm((b) => Math.max(b, finalWpm));
    setWpm(finalWpm);
    setAccuracy(finalAcc);
  }, []);

  const startGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const p = pickPhrase();
    setPhrase(p);
    setTyped("");
    setTimeLeft(DURATION);
    setWpm(0);
    setAccuracy(100);
    wordCountRef.current = 0;
    totalCharsRef.current = 0;
    correctCharsRef.current = 0;
    startTimeRef.current = Date.now();
    setGameState("playing");
    setTimeout(() => inputRef.current?.focus(), 50);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setGameState("over");
          setBestWpm((b) => Math.max(b, wpm));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [pickPhrase, wpm]);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (gameState !== "playing") return;
      const val = e.target.value;
      setTyped(val);
      totalCharsRef.current = val.length;
      correctCharsRef.current = val
        .split("")
        .filter((ch, i) => ch === phrase[i]).length;

      // WPM calculation
      const elapsedMin = (Date.now() - startTimeRef.current) / 60000;
      const words = correctCharsRef.current / 5;
      const currWpm = elapsedMin > 0 ? Math.round(words / elapsedMin) : 0;
      const acc =
        totalCharsRef.current > 0
          ? Math.round((correctCharsRef.current / totalCharsRef.current) * 100)
          : 100;
      setWpm(currWpm);
      setAccuracy(acc);

      // Check completion
      if (val === phrase) {
        // Secret: Speed Reader — completed with 100% accuracy (zero errors)
        if (
          totalCharsRef.current === val.length &&
          correctCharsRef.current === val.length
        ) {
          window.dispatchEvent(
            new CustomEvent("secret-trigger", {
              detail: { id: "secret_speed_reader" },
            }),
          );
        }
        endGame(currWpm, acc);
      }
    },
    [gameState, phrase, endGame],
  );

  const timerPct = (timeLeft / DURATION) * 100;
  const timerColor =
    timerPct > 50 ? "#00e5ff" : timerPct > 25 ? "#ffd700" : "#ff4466";

  return (
    <div
      className="flex flex-col items-center gap-4"
      style={{ maxWidth: 520, width: "100%" }}
    >
      {/* HUD */}
      <div className="flex gap-6 w-full justify-center">
        <div className="text-center">
          <div
            style={{
              color: "rgba(0,229,255,0.5)",
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: "0.1em",
            }}
          >
            WPM
          </div>
          <div
            style={{
              color: "#00e5ff",
              fontSize: 28,
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 700,
              textShadow: "0 0 12px rgba(0,229,255,0.7)",
            }}
          >
            {wpm}
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
            TIME
          </div>
          <div
            style={{
              color: timerColor,
              fontSize: 28,
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 700,
            }}
          >
            {timeLeft}s
          </div>
        </div>
        <div className="text-center">
          <div
            style={{
              color: "rgba(168,85,247,0.5)",
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: "0.1em",
            }}
          >
            ACC
          </div>
          <div
            style={{
              color: "#a855f7",
              fontSize: 28,
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 700,
            }}
          >
            {accuracy}%
          </div>
        </div>
        {bestWpm > 0 && (
          <div className="text-center">
            <div
              style={{
                color: "rgba(255,215,0,0.5)",
                fontSize: 10,
                fontFamily: "JetBrains Mono, monospace",
                letterSpacing: "0.1em",
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
              {bestWpm}
            </div>
          </div>
        )}
      </div>

      {/* Timer bar */}
      <div
        style={{
          width: "100%",
          height: 4,
          background: "rgba(255,255,255,0.08)",
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

      {/* Phrase display */}
      {gameState !== "idle" && (
        <div
          style={{
            width: "100%",
            padding: "16px 20px",
            borderRadius: 8,
            border: "1px solid rgba(0,229,255,0.2)",
            background: "rgba(6,6,20,0.9)",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 16,
            lineHeight: 1.7,
            letterSpacing: "0.02em",
          }}
        >
          {Array.from(phrase).map((char, pos) => {
            const typedChar = typed[pos];
            let color = "rgba(255,255,255,0.35)";
            if (pos < typed.length) {
              color = typedChar === char ? "#00e5ff" : "#ff4466";
            }
            if (pos === typed.length) {
              color = "rgba(255,255,255,0.9)";
            }
            const spanKey = `p${pos}`;
            return (
              <span
                key={spanKey}
                style={{
                  color,
                  background:
                    pos === typed.length
                      ? "rgba(0,229,255,0.15)"
                      : "transparent",
                  borderRadius: 2,
                  textShadow:
                    typedChar === char && pos < typed.length
                      ? "0 0 8px rgba(0,229,255,0.5)"
                      : "none",
                  transition: "color 0.1s",
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      )}

      {/* Input */}
      {gameState === "playing" && (
        <input
          ref={inputRef}
          type="text"
          value={typed}
          onChange={handleInput}
          placeholder="Start typing here..."
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 8,
            border: "1.5px solid rgba(0,229,255,0.4)",
            background: "rgba(0,5,20,0.8)",
            color: "#fff",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 15,
            outline: "none",
            caretColor: "#00e5ff",
          }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      )}

      {/* Game Over */}
      {gameState === "over" && (
        <div className="flex flex-col items-center gap-3">
          <div
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 15,
              fontWeight: 700,
              color: "#00e5ff",
              textAlign: "center",
            }}
          >
            {typed === phrase ? "🎉 COMPLETED!" : "⏱️ TIME'S UP!"} · {wpm} WPM ·{" "}
            {accuracy}% accuracy
          </div>
          <button
            type="button"
            className="gaming-btn-primary px-8 py-3 rounded font-display font-bold text-sm tracking-widest uppercase"
            onClick={startGame}
          >
            🔄 Try Again
          </button>
        </div>
      )}

      {/* Start */}
      {gameState === "idle" && (
        <button
          type="button"
          className="gaming-btn-primary px-8 py-3 rounded font-display font-bold text-sm tracking-widest uppercase"
          onClick={startGame}
        >
          ⌨️ Start Typing
        </button>
      )}
    </div>
  );
}
