import { useEffect, useState } from "react";

function genQuestion(level: number) {
  const ops =
    level < 5
      ? ["+", "-"]
      : level < 10
        ? ["+", "-", "*"]
        : ["+", "-", "*", "/"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number;
  let b: number;
  let ans: number;
  if (op === "+") {
    a = Math.floor(Math.random() * (10 * level + 10));
    b = Math.floor(Math.random() * (10 * level + 10));
    ans = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * (10 * level + 10)) + 5;
    b = Math.floor(Math.random() * a);
    ans = a - b;
  } else if (op === "*") {
    a = Math.floor(Math.random() * (level + 5)) + 1;
    b = Math.floor(Math.random() * 12) + 1;
    ans = a * b;
  } else {
    b = Math.floor(Math.random() * 10) + 1;
    ans = Math.floor(Math.random() * 10) + 1;
    a = b * ans;
  }
  return { q: `${a} ${op} ${b}`, ans };
}

export default function MathQuiz() {
  const [q, setQ] = useState(() => genQuestion(1));
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (gameOver) return;
    const t = setInterval(
      () =>
        setTimeLeft((tl) => {
          if (tl <= 1) {
            setGameOver(true);
            return 0;
          }
          return tl - 1;
        }),
      1000,
    );
    return () => clearInterval(t);
  }, [gameOver]);

  function check() {
    const n = Number.parseInt(input);
    if (Number.isNaN(n)) return;
    if (n === q.ans) {
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => s + 1);
      setFeedback("✅");
    } else {
      setFeedback(`❌ ${q.ans}`);
      setStreak(0);
    }
    setInput("");
    setTimeout(() => {
      setQ(genQuestion(Math.min(15, Math.floor(score / 30) + 1)));
      setFeedback("");
    }, 600);
  }

  function reset() {
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setGameOver(false);
    setInput("");
    setFeedback("");
    setQ(genQuestion(1));
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-yellow-400">Score: {score}</span>
        <span className="text-cyan-400">Time: {timeLeft}s</span>
        <span className="text-purple-400">Streak: {streak}</span>
      </div>
      {!gameOver ? (
        <>
          <div
            className="text-5xl font-bold text-center"
            style={{ color: "#00ffcc", textShadow: "0 0 20px #00ffcc" }}
          >
            {q.q} = ?
          </div>
          {feedback && (
            <p
              className={`text-2xl font-bold ${feedback.startsWith("✅") ? "text-green-400" : "text-red-400"}`}
            >
              {feedback}
            </p>
          )}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && check()}
            type="number"
            placeholder="?"
            className="w-32 text-center text-2xl font-bold rounded py-2"
            style={{
              background: "rgba(0,255,200,0.08)",
              border: "1px solid #00ffcc40",
              color: "#00ffcc",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={check}
            className="px-6 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded font-bold"
          >
            Submit
          </button>
        </>
      ) : (
        <div className="text-center">
          <p className="text-3xl font-bold text-yellow-400 mb-2">Time's up!</p>
          <p className="text-white/60 mb-4">Score: {score}</p>
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
