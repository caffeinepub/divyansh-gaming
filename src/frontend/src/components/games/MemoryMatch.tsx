import { useCallback, useEffect, useRef, useState } from "react";

const EMOJIS = ["🎮", "🚀", "⚡", "🔥", "💎", "🎯", "🌟", "🎲"];

type CardState = "hidden" | "flipped" | "matched";

interface Card {
  id: number;
  emoji: string;
  state: CardState;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeCards(): Card[] {
  const pairs = [...EMOJIS, ...EMOJIS];
  return shuffle(pairs).map((emoji, i) => ({ id: i, emoji, state: "hidden" }));
}

type GameState = "idle" | "playing" | "win";

export default function MemoryMatch() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [cards, setCards] = useState<Card[]>(makeCards());
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [best, setBest] = useState<{ moves: number; time: number } | null>(
    null,
  );
  const flippedRef = useRef<number[]>([]);
  const lockedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const movesRef = useRef(0);
  const timeRef = useRef(0);

  const startGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const newCards = makeCards();
    setCards(newCards);
    setMoves(0);
    setTime(0);
    movesRef.current = 0;
    timeRef.current = 0;
    flippedRef.current = [];
    lockedRef.current = false;
    setGameState("playing");
    timerRef.current = setInterval(() => {
      timeRef.current++;
      setTime(timeRef.current);
    }, 1000);
  }, []);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  const flipCard = useCallback(
    (idx: number) => {
      if (lockedRef.current) return;
      const card = cards[idx];
      if (card.state !== "hidden") return;
      if (flippedRef.current.includes(idx)) return;

      const newCards = [...cards];
      newCards[idx] = { ...newCards[idx], state: "flipped" };
      setCards(newCards);

      const flipped = [...flippedRef.current, idx];
      flippedRef.current = flipped;

      if (flipped.length === 2) {
        lockedRef.current = true;
        movesRef.current++;
        setMoves(movesRef.current);
        const [a, b] = flipped;
        const cardsSnap = newCards;

        if (cardsSnap[a].emoji === cardsSnap[b].emoji) {
          // Match!
          setTimeout(() => {
            const matched = [...newCards];
            matched[a] = { ...matched[a], state: "matched" };
            matched[b] = { ...matched[b], state: "matched" };
            setCards(matched);
            flippedRef.current = [];
            lockedRef.current = false;
            if (matched.every((c) => c.state === "matched")) {
              if (timerRef.current) clearInterval(timerRef.current);
              setGameState("win");
              setBest((prev) => {
                if (
                  !prev ||
                  movesRef.current < prev.moves ||
                  (movesRef.current === prev.moves &&
                    timeRef.current < prev.time)
                ) {
                  return { moves: movesRef.current, time: timeRef.current };
                }
                return prev;
              });
            }
          }, 300);
        } else {
          // No match
          setTimeout(() => {
            const reset = [...newCards];
            reset[a] = { ...reset[a], state: "hidden" };
            reset[b] = { ...reset[b], state: "hidden" };
            setCards(reset);
            flippedRef.current = [];
            lockedRef.current = false;
          }, 800);
        }
      }
    },
    [cards],
  );

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div
      className="flex flex-col items-center gap-4 select-none"
      style={{ userSelect: "none" }}
    >
      {/* HUD */}
      <div className="flex gap-6">
        <div className="text-center">
          <div
            style={{
              color: "rgba(0,229,255,0.5)",
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: "0.12em",
            }}
          >
            MOVES
          </div>
          <div
            style={{
              color: "#00e5ff",
              fontSize: 22,
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 700,
            }}
          >
            {moves}
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
              color: "#a855f7",
              fontSize: 22,
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 700,
            }}
          >
            {formatTime(time)}
          </div>
        </div>
        {best && (
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
                fontSize: 22,
                fontFamily: "JetBrains Mono, monospace",
                fontWeight: 700,
              }}
            >
              {best.moves}m
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
        }}
      >
        {cards.map((card, i) => (
          <button
            key={card.id}
            type="button"
            onClick={() => gameState === "playing" && flipCard(i)}
            style={{
              width: 72,
              height: 72,
              borderRadius: 8,
              border:
                card.state === "matched"
                  ? "1.5px solid rgba(0,255,136,0.6)"
                  : card.state === "flipped"
                    ? "1.5px solid rgba(168,85,247,0.8)"
                    : "1.5px solid rgba(0,229,255,0.2)",
              background:
                card.state === "matched"
                  ? "rgba(0,255,136,0.12)"
                  : card.state === "flipped"
                    ? "rgba(168,85,247,0.2)"
                    : "rgba(6,6,20,0.9)",
              cursor:
                gameState === "playing" && card.state === "hidden"
                  ? "pointer"
                  : "default",
              fontSize: card.state !== "hidden" ? 30 : 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.15s, background 0.2s, border-color 0.2s",
              transform: card.state !== "hidden" ? "scale(1.05)" : "scale(1)",
              boxShadow:
                card.state === "matched"
                  ? "0 0 12px rgba(0,255,136,0.35)"
                  : card.state === "flipped"
                    ? "0 0 12px rgba(168,85,247,0.4)"
                    : "none",
            }}
          >
            {card.state !== "hidden" ? card.emoji : "?"}
          </button>
        ))}
      </div>

      {gameState === "idle" && (
        <button
          type="button"
          className="gaming-btn-primary px-8 py-3 rounded font-display font-bold text-sm tracking-widest uppercase"
          onClick={startGame}
        >
          🃏 Start Game
        </button>
      )}
      {gameState === "win" && (
        <div className="flex flex-col items-center gap-3">
          <div
            style={{
              color: "#00ff88",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 16,
              fontWeight: 700,
              textAlign: "center",
              textShadow: "0 0 12px rgba(0,255,136,0.8)",
            }}
          >
            ✅ MATCHED IN {moves} MOVES · {formatTime(time)}
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
      {gameState === "playing" && (
        <p
          style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: 11,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          Flip cards to find matching pairs
        </p>
      )}
    </div>
  );
}
