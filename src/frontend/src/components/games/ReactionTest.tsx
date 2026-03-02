import { useCallback, useRef, useState } from "react";

const ROUNDS = 5;

type RoundState = "waiting" | "ready" | "green" | "clicked" | "too-early";

function getRating(ms: number): string {
  if (ms < 150) return "⚡ SUPERHUMAN!";
  if (ms < 200) return "🔥 INCREDIBLE";
  if (ms < 250) return "✨ EXCELLENT";
  if (ms < 300) return "👍 GREAT";
  if (ms < 400) return "😊 GOOD";
  if (ms < 500) return "🙂 AVERAGE";
  return "🐌 SLOW";
}

export default function ReactionTest() {
  const [roundState, setRoundState] = useState<RoundState>("waiting");
  const [round, setRound] = useState(0);
  const [lastTime, setLastTime] = useState<number | null>(null);
  const [times, setTimes] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const greenRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waitRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const greenStartRef = useRef<number>(0);

  const clearTimers = useCallback(() => {
    if (greenRef.current) clearTimeout(greenRef.current);
    if (waitRef.current) clearTimeout(waitRef.current);
  }, []);

  const startRound = useCallback(() => {
    clearTimers();
    setRoundState("ready");
    setLastTime(null);
    const delay = 1000 + Math.random() * 3000;
    waitRef.current = setTimeout(() => {
      setRoundState("green");
      greenStartRef.current = performance.now();
    }, delay);
  }, [clearTimers]);

  const handleClick = useCallback(() => {
    if (done) {
      // Reset
      setTimes([]);
      setRound(0);
      setDone(false);
      setRoundState("waiting");
      setLastTime(null);
      return;
    }

    if (roundState === "waiting") {
      startRound();
      return;
    }

    if (roundState === "ready") {
      clearTimers();
      setRoundState("too-early");
      return;
    }

    if (roundState === "green") {
      const rt = performance.now() - greenStartRef.current;
      setLastTime(rt);
      const newTimes = [...times, rt];
      setTimes(newTimes);
      const newRound = round + 1;
      setRound(newRound);
      if (newRound >= ROUNDS) {
        setDone(true);
        setRoundState("waiting");
      } else {
        setRoundState("clicked");
      }
      return;
    }

    if (roundState === "too-early" || roundState === "clicked") {
      startRound();
      return;
    }
  }, [roundState, round, times, done, startRound, clearTimers]);

  const avg =
    times.length > 0
      ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      : null;
  const best = times.length > 0 ? Math.round(Math.min(...times)) : null;

  const getBgColor = () => {
    if (roundState === "green") return "rgba(0,255,136,0.15)";
    if (roundState === "too-early") return "rgba(255,68,102,0.15)";
    if (roundState === "clicked") return "rgba(0,229,255,0.1)";
    return "rgba(6,6,20,0.9)";
  };

  const getBorderColor = () => {
    if (roundState === "green") return "#00ff88";
    if (roundState === "too-early") return "#ff4466";
    if (roundState === "clicked") return "#00e5ff";
    return "rgba(0,229,255,0.25)";
  };

  return (
    <div
      className="flex flex-col items-center gap-4 select-none"
      style={{ userSelect: "none" }}
    >
      {/* Progress */}
      <div className="flex gap-2">
        {Array.from({ length: ROUNDS }, (_, i) => {
          const dotKey = `dot-${String(i + 1)}`;
          return (
            <div
              key={dotKey}
              style={{
                width: 32,
                height: 8,
                borderRadius: 4,
                background:
                  i < round
                    ? "#00e5ff"
                    : i === round && !done
                      ? "rgba(0,229,255,0.3)"
                      : "rgba(255,255,255,0.1)",
                boxShadow: i < round ? "0 0 8px rgba(0,229,255,0.6)" : "none",
                transition: "background 0.3s",
              }}
            />
          );
        })}
      </div>

      {/* Main button */}
      <button
        type="button"
        onClick={handleClick}
        style={{
          width: 300,
          height: 300,
          borderRadius: "50%",
          border: `3px solid ${getBorderColor()}`,
          background: getBgColor(),
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          transition: "background 0.15s, border-color 0.15s, transform 0.1s",
          transform: roundState === "green" ? "scale(1.04)" : "scale(1)",
          boxShadow:
            roundState === "green"
              ? "0 0 40px rgba(0,255,136,0.4), inset 0 0 40px rgba(0,255,136,0.1)"
              : roundState === "too-early"
                ? "0 0 40px rgba(255,68,102,0.4)"
                : "0 0 20px rgba(0,229,255,0.1), inset 0 0 20px rgba(0,0,20,0.5)",
        }}
      >
        {/* Icon / state */}
        {roundState === "waiting" && !done && (
          <>
            <div style={{ fontSize: 52 }}>⚡</div>
            <div
              style={{
                color: "#00e5ff",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textAlign: "center",
              }}
            >
              CLICK TO
              <br />
              START
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: 11,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              Round {round + 1} / {ROUNDS}
            </div>
          </>
        )}
        {roundState === "ready" && (
          <>
            <div style={{ fontSize: 52 }}>👀</div>
            <div
              style={{
                color: "#ffd700",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textAlign: "center",
              }}
            >
              WAIT FOR
              <br />
              GREEN...
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.25)",
                fontSize: 11,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              Don't click yet!
            </div>
          </>
        )}
        {roundState === "green" && (
          <>
            <div style={{ fontSize: 52 }}>🟢</div>
            <div
              style={{
                color: "#00ff88",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textShadow: "0 0 20px rgba(0,255,136,0.9)",
                textAlign: "center",
              }}
            >
              CLICK
              <br />
              NOW!
            </div>
          </>
        )}
        {roundState === "too-early" && (
          <>
            <div style={{ fontSize: 52 }}>❌</div>
            <div
              style={{
                color: "#ff4466",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 14,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              TOO EARLY!
              <br />
              Click to retry
            </div>
          </>
        )}
        {roundState === "clicked" && lastTime !== null && (
          <>
            <div style={{ fontSize: 52 }}>✅</div>
            <div
              style={{
                color: "#00e5ff",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 22,
                fontWeight: 700,
                textShadow: "0 0 12px rgba(0,229,255,0.8)",
              }}
            >
              {Math.round(lastTime)} ms
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 11,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {getRating(lastTime)} · Click for next
            </div>
          </>
        )}
        {done && (
          <>
            <div style={{ fontSize: 44 }}>🏆</div>
            <div
              style={{
                color: "#ffd700",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 18,
                fontWeight: 700,
                textAlign: "center",
                textShadow: "0 0 12px rgba(255,215,0,0.8)",
              }}
            >
              AVG: {avg} ms
            </div>
            <div
              style={{
                color: "rgba(0,229,255,0.7)",
                fontSize: 13,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              BEST: {best} ms
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 11,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {avg !== null ? getRating(avg) : ""} · Click to retry
            </div>
          </>
        )}
      </button>

      {/* Round times */}
      {times.length > 0 && (
        <div className="flex gap-2">
          {times.map((t, i) => {
            const timeKey = `rt-${String(i + 1)}-${Math.round(t)}`;
            return (
              <div
                key={timeKey}
                style={{
                  padding: "4px 8px",
                  borderRadius: 4,
                  border: "1px solid rgba(0,229,255,0.3)",
                  background: "rgba(0,5,20,0.8)",
                  color: "#00e5ff",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {Math.round(t)}ms
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
