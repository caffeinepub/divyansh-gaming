import { useEffect, useRef, useState } from "react";

export default function RhythmTap() {
  const [active, setActive] = useState(false);
  const [beat, setBeat] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [bpm] = useState(100);
  const [tapsLeft, setTapsLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const beatTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const beatInterval = Math.round(60000 / bpm);

  useEffect(() => {
    if (!active || gameOver) return;
    intervalRef.current = setInterval(() => {
      setBeat(true);
      beatTimeRef.current = Date.now();
      setTimeout(() => setBeat(false), 120);
    }, beatInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, gameOver, beatInterval]);

  function tap() {
    if (!active || gameOver) return;
    const now = Date.now();
    const diff = Math.abs((now - beatTimeRef.current) % beatInterval);
    const adjusted = Math.min(diff, beatInterval - diff);
    let pts = 0;
    let msg = "";
    if (adjusted < 60) {
      pts = 30;
      msg = "🎯 PERFECT!";
    } else if (adjusted < 120) {
      pts = 20;
      msg = "✅ GREAT!";
    } else if (adjusted < 200) {
      pts = 10;
      msg = "👍 GOOD";
    } else {
      msg = "❌ MISS";
    }

    if (pts > 0) {
      setScore((s) => s + pts + streak);
      setStreak((s) => s + 1);
    } else setStreak(0);
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 400);
    setTapsLeft((t) => {
      if (t <= 1) {
        setGameOver(true);
        return 0;
      }
      return t - 1;
    });
  }

  function reset() {
    setActive(false);
    setScore(0);
    setStreak(0);
    setTapsLeft(20);
    setGameOver(false);
    setFeedback("");
    setBeat(false);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-yellow-400">Score: {score}</span>
        <span className="text-purple-400">Streak: {streak}</span>
        <span className="text-cyan-400">Taps: {tapsLeft}</span>
      </div>
      <div className="text-white/40 text-sm">{bpm} BPM</div>
      {/* Beat visualizer */}
      <div className="flex gap-2">
        {[...Array(8)].map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: game array
            key={i}
            className="w-4 rounded transition-all duration-75"
            style={{
              height: beat
                ? `${20 + Math.sin(i) * 16 + Math.random() * 12}px`
                : "8px",
              background: beat ? `hsl(${160 + i * 20},100%,60%)` : "#ffffff20",
            }}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={tap}
        disabled={!active || gameOver}
        className="w-40 h-40 rounded-full text-4xl font-bold transition-all duration-75 select-none"
        style={{
          background: beat ? "rgba(0,255,200,0.4)" : "rgba(0,255,200,0.1)",
          border: `4px solid ${beat ? "#00ffcc" : "#00ffcc40"}`,
          color: "#00ffcc",
          boxShadow: beat ? "0 0 40px #00ffcc" : "none",
          transform: beat ? "scale(1.08)" : "scale(1)",
          cursor: active && !gameOver ? "pointer" : "default",
        }}
      >
        {feedback || (beat ? "TAP!" : "🎵")}
      </button>
      {!active && !gameOver && (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="px-6 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded font-bold"
        >
          Start
        </button>
      )}
      {gameOver && (
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-400 mb-2">
            Score: {score}
          </p>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded"
          >
            Play Again
          </button>
        </div>
      )}
      <p className="text-xs text-white/30">
        Tap the button in rhythm with the beat!
      </p>
    </div>
  );
}
