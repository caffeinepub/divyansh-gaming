import { useState } from "react";

interface Question {
  shapes: string[];
  oddIndex: number;
  hint: string;
}

const QUESTIONS: Question[] = [
  { shapes: ["🔵", "🔵", "🔴", "🔵"], oddIndex: 2, hint: "Different color" },
  { shapes: ["⬛", "⬛", "⬛", "⬜"], oddIndex: 3, hint: "Different shade" },
  { shapes: ["🔺", "🔺", "🔷", "🔺"], oddIndex: 2, hint: "Different shape" },
  { shapes: ["⭐", "⭐", "⭐", "🌙"], oddIndex: 3, hint: "Not a star" },
  { shapes: ["🟢", "🟡", "🟢", "🟢"], oddIndex: 1, hint: "Different color" },
  { shapes: ["🔶", "🔶", "🔶", "🔷"], oddIndex: 3, hint: "Different color" },
  { shapes: ["💎", "💎", "💰", "💎"], oddIndex: 2, hint: "Not a gem" },
  { shapes: ["🎯", "🎯", "🎯", "🎪"], oddIndex: 3, hint: "Not a target" },
];

export default function IQTest() {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);

  function pick(i: number) {
    if (feedback) return;
    const correct = i === QUESTIONS[idx].oddIndex;
    setFeedback(
      correct
        ? "✅ Correct!"
        : `❌ The odd one was: ${QUESTIONS[idx].shapes[QUESTIONS[idx].oddIndex]}`,
    );
    if (correct) setScore((s) => s + 10);
    setTimeout(() => {
      const next = idx + 1;
      if (next >= QUESTIONS.length) {
        setDone(true);
      } else {
        setIdx(next);
        setFeedback("");
      }
    }, 1200);
  }

  function reset() {
    setIdx(0);
    setScore(0);
    setFeedback("");
    setDone(false);
  }

  const q = QUESTIONS[idx];
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-4 text-sm font-mono">
        <span className="text-yellow-400">Score: {score}</span>
        <span className="text-cyan-400">
          {idx + 1}/{QUESTIONS.length}
        </span>
      </div>
      <p className="text-white/60">Which one is the ODD one out?</p>
      {!done ? (
        <>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {q.shapes.map((s, i) => (
              <button
                type="button"
                // biome-ignore lint/suspicious/noArrayIndexKey: game array
                key={i}
                onClick={() => pick(i)}
                className="w-24 h-24 rounded-xl text-5xl flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  cursor: feedback ? "default" : "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
          {feedback && (
            <p
              className={`font-bold text-lg ${feedback.startsWith("✅") ? "text-green-400" : "text-red-400"}`}
            >
              {feedback}
            </p>
          )}
        </>
      ) : (
        <div className="text-center">
          <p className="text-3xl font-bold text-yellow-400 mb-2">
            IQ Score: {score}
          </p>
          <p className="text-white/60 mb-4">
            {score >= 70
              ? "Genius!"
              : score >= 50
                ? "Above Average!"
                : "Keep training!"}
          </p>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
