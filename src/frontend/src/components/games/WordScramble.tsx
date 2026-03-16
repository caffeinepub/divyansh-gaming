import { useState } from "react";

const WORDS = [
  "GAMING",
  "DRAGON",
  "BATTLE",
  "ROCKET",
  "SHIELD",
  "LEGEND",
  "ARCADE",
  "PLAYER",
  "SKILLS",
  "TROPHY",
  "CODER",
  "PIXEL",
  "LASER",
  "QUEST",
  "NINJA",
];

function scramble(word: string) {
  let arr = word.split("");
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } while (arr.join("") === word);
  return arr.join("");
}

export default function WordScramble() {
  const [idx, setIdx] = useState(0);
  const [scrambled, setScrambled] = useState(() => scramble(WORDS[0]));
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);
  const total = WORDS.length;

  function check() {
    if (input.toUpperCase() === WORDS[idx]) {
      setScore((s) => s + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Answer: ${WORDS[idx]}`);
    }
    const next = idx + 1;
    if (next >= total) {
      setTimeout(() => setDone(true), 1200);
    } else {
      setTimeout(() => {
        setIdx(next);
        setScrambled(scramble(WORDS[next]));
        setInput("");
        setFeedback("");
      }, 1200);
    }
  }

  function reset() {
    setIdx(0);
    setScrambled(scramble(WORDS[0]));
    setInput("");
    setScore(0);
    setFeedback("");
    setDone(false);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-4 text-sm font-mono">
        <span className="text-yellow-400">
          Score: {score}/{total}
        </span>
        <span className="text-cyan-400">
          {idx + 1}/{total}
        </span>
      </div>
      {!done ? (
        <>
          <div
            className="text-4xl font-bold tracking-widest"
            style={{
              color: "#00ffcc",
              letterSpacing: "0.3em",
              textShadow: "0 0 20px #00ffcc",
            }}
          >
            {scrambled}
          </div>
          <p className="text-white/40 text-sm">Unscramble this gaming word</p>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && check()}
            placeholder="Your answer..."
            maxLength={10}
            className="px-4 py-2 rounded text-center text-lg font-bold tracking-widest uppercase"
            style={{
              background: "rgba(0,255,200,0.08)",
              border: "1px solid #00ffcc40",
              color: "#00ffcc",
              outline: "none",
              width: 220,
            }}
          />
          {feedback && (
            <p
              className={`font-bold text-lg ${feedback.startsWith("✅") ? "text-green-400" : "text-red-400"}`}
            >
              {feedback}
            </p>
          )}
          <button
            type="button"
            onClick={check}
            className="px-6 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded font-bold"
          >
            Check
          </button>
        </>
      ) : (
        <div className="text-center">
          <p className="text-3xl font-bold text-yellow-400 mb-2">
            {score >= total * 0.8
              ? "🏆 Excellent!"
              : score >= total * 0.5
                ? "👍 Good!"
                : "💪 Keep trying!"}
          </p>
          <p className="text-white/60 mb-4">
            Score: {score} / {total}
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
    </div>
  );
}
