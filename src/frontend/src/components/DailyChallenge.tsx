import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { awardXP } from "../hooks/useXPSystem";

interface Challenge {
  id: string;
  title: string;
  game: string;
  description: string;
  targetScore: number;
  rewardBadge: string;
  difficulty: "Easy" | "Medium" | "Hard";
  badge: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: "c1",
    title: "Snake Speedrun",
    game: "Snake",
    description: "Reach a score of 500 points without dying.",
    targetScore: 500,
    rewardBadge: "Serpent King",
    difficulty: "Easy",
    badge: "🐍",
  },
  {
    id: "c2",
    title: "Asteroid Annihilator",
    game: "Space Shooter 3D",
    description: "Destroy 20 asteroids in a single run.",
    targetScore: 200,
    rewardBadge: "Void Slayer",
    difficulty: "Medium",
    badge: "💥",
  },
  {
    id: "c3",
    title: "Brick Buster",
    game: "Brick Breaker",
    description: "Break 30 bricks without losing a ball.",
    targetScore: 300,
    rewardBadge: "Demolisher",
    difficulty: "Easy",
    badge: "🧱",
  },
  {
    id: "c4",
    title: "Survival Run",
    game: "Car Racing",
    description: "Survive for 60 seconds in Car Racing.",
    targetScore: 600,
    rewardBadge: "Road Warrior",
    difficulty: "Medium",
    badge: "🚗",
  },
  {
    id: "c5",
    title: "Flappy Legend",
    game: "Flappy Bird",
    description: "Score 10 points in Flappy Bird.",
    targetScore: 10,
    rewardBadge: "Sky Pioneer",
    difficulty: "Hard",
    badge: "🐦",
  },
  {
    id: "c6",
    title: "Pong Pro",
    game: "Multiplayer Pong",
    description: "Win a Pong match 7-0 (flawless victory).",
    targetScore: 7,
    rewardBadge: "Pong Master",
    difficulty: "Hard",
    badge: "🏓",
  },
  {
    id: "c7",
    title: "Mole Hunter",
    game: "Whack-A-Mole",
    description: "Whack 25 moles in a single session.",
    targetScore: 250,
    rewardBadge: "Mole Slayer",
    difficulty: "Easy",
    badge: "🔨",
  },
  {
    id: "c8",
    title: "Speed Typist",
    game: "Typing Test",
    description: "Achieve a WPM score above 50.",
    targetScore: 50,
    rewardBadge: "Keyboard Ninja",
    difficulty: "Medium",
    badge: "⌨️",
  },
  {
    id: "c9",
    title: "Memory Maestro",
    game: "Memory Match",
    description: "Complete Memory Match in under 60 seconds.",
    targetScore: 60,
    rewardBadge: "Mind Palace",
    difficulty: "Medium",
    badge: "🧠",
  },
  {
    id: "c10",
    title: "Reaction King",
    game: "Reaction Test",
    description: "React in under 200ms three times in a row.",
    targetScore: 200,
    rewardBadge: "Lightning Reflex",
    difficulty: "Hard",
    badge: "⚡",
  },
  {
    id: "c11",
    title: "Color Champion",
    game: "Color Match",
    description: "Score 15 correct matches in Color Match.",
    targetScore: 150,
    rewardBadge: "Spectrum Master",
    difficulty: "Easy",
    badge: "🎨",
  },
  {
    id: "c12",
    title: "Asteroid Ace",
    game: "Asteroid Shooter",
    description: "Score 1000 points in Asteroid Shooter.",
    targetScore: 1000,
    rewardBadge: "Space Ace",
    difficulty: "Medium",
    badge: "🚀",
  },
  {
    id: "c13",
    title: "Speed Demon",
    game: "Car Racing",
    description: "Score 1500 points in Car Racing.",
    targetScore: 1500,
    rewardBadge: "Turbo Legend",
    difficulty: "Hard",
    badge: "🏎️",
  },
  {
    id: "c14",
    title: "Snake Ultra",
    game: "Snake",
    description: "Reach a score of 1000 points in Snake.",
    targetScore: 1000,
    rewardBadge: "Snake Emperor",
    difficulty: "Hard",
    badge: "🐍",
  },
  {
    id: "c15",
    title: "Boss Slayer",
    game: "Space Shooter 3D",
    description: "Defeat the boss wave in Space Shooter 3D.",
    targetScore: 500,
    rewardBadge: "Boss Hunter",
    difficulty: "Hard",
    badge: "👾",
  },
  {
    id: "c16",
    title: "Perfect Pong",
    game: "Multiplayer Pong",
    description: "Win a Pong match without conceding more than 3 points.",
    targetScore: 7,
    rewardBadge: "Pong Knight",
    difficulty: "Medium",
    badge: "🏓",
  },
  {
    id: "c17",
    title: "Brick Destroyer",
    game: "Brick Breaker",
    description: "Clear two entire rows of bricks.",
    targetScore: 200,
    rewardBadge: "Brick Titan",
    difficulty: "Medium",
    badge: "🧱",
  },
  {
    id: "c18",
    title: "Flappy Survivor",
    game: "Flappy Bird",
    description: "Score 5 points without hitting any pipes.",
    targetScore: 5,
    rewardBadge: "Wing Walker",
    difficulty: "Easy",
    badge: "🐦",
  },
  {
    id: "c19",
    title: "Mole Marathon",
    game: "Whack-A-Mole",
    description: "Whack 50 moles in total.",
    targetScore: 500,
    rewardBadge: "Mole Warlord",
    difficulty: "Hard",
    badge: "🔨",
  },
  {
    id: "c20",
    title: "Color Blitz",
    game: "Color Match",
    description: "Score 25 correct matches in Color Match.",
    targetScore: 250,
    rewardBadge: "Chromatic God",
    difficulty: "Hard",
    badge: "🎨",
  },
  {
    id: "c21",
    title: "Speedy Memory",
    game: "Memory Match",
    description: "Complete Memory Match with no mismatches.",
    targetScore: 100,
    rewardBadge: "Perfect Memory",
    difficulty: "Hard",
    badge: "🧠",
  },
  {
    id: "c22",
    title: "Combo Shooter",
    game: "Asteroid Shooter",
    description: "Destroy 5 asteroids in 3 seconds.",
    targetScore: 500,
    rewardBadge: "Combo Lord",
    difficulty: "Hard",
    badge: "💥",
  },
  {
    id: "c23",
    title: "Quick Racer",
    game: "Car Racing",
    description: "Score 800 points in under 45 seconds.",
    targetScore: 800,
    rewardBadge: "Speed Icon",
    difficulty: "Medium",
    badge: "🚗",
  },
  {
    id: "c24",
    title: "Snake Zen",
    game: "Snake",
    description: "Reach 750 points without hitting a wall.",
    targetScore: 750,
    rewardBadge: "Zen Serpent",
    difficulty: "Medium",
    badge: "🐍",
  },
  {
    id: "c25",
    title: "Neon Platformer Ace",
    game: "Neon Platformer 3D",
    description: "Collect all 8 stars in Neon Platformer 3D.",
    targetScore: 800,
    rewardBadge: "Star Collector",
    difficulty: "Medium",
    badge: "⭐",
  },
  {
    id: "c26",
    title: "Platformer Speedrun",
    game: "Neon Platformer 3D",
    description: "Complete Neon Platformer 3D in under 2 minutes.",
    targetScore: 120,
    rewardBadge: "Speed Platformer",
    difficulty: "Hard",
    badge: "🌟",
  },
  {
    id: "c27",
    title: "Reaction God",
    game: "Reaction Test",
    description: "Average under 180ms across 5 attempts.",
    targetScore: 180,
    rewardBadge: "Reaction Legend",
    difficulty: "Hard",
    badge: "⚡",
  },
  {
    id: "c28",
    title: "Typing Fury",
    game: "Typing Test",
    description: "Type without any errors for a full round.",
    targetScore: 60,
    rewardBadge: "Error-Free Typist",
    difficulty: "Medium",
    badge: "⌨️",
  },
  {
    id: "c29",
    title: "Wave Survivor",
    game: "Space Shooter 3D",
    description: "Survive 10 waves in Space Shooter 3D.",
    targetScore: 1000,
    rewardBadge: "Wave Master",
    difficulty: "Hard",
    badge: "🚀",
  },
  {
    id: "c30",
    title: "Grand Champion",
    game: "Car Racing",
    description: "Score 2000 points in a single Car Racing run.",
    targetScore: 2000,
    rewardBadge: "Grand Champion",
    difficulty: "Hard",
    badge: "🏆",
  },
];

function getDifficultyStyle(d: Challenge["difficulty"]) {
  if (d === "Easy")
    return { color: "#4ade80", border: "#4ade8060", bg: "#4ade8010" };
  if (d === "Medium")
    return { color: "#facc15", border: "#facc1560", bg: "#facc1510" };
  return { color: "#f87171", border: "#f8717160", bg: "#f8717110" };
}

function getCountdown(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { hours, minutes, seconds };
}

function getLast7Days(): { dateStr: string; label: string }[] {
  const days: { dateStr: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const label =
      i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" });
    days.push({ dateStr, label });
  }
  return days;
}

export default function DailyChallenge() {
  const today = new Date();
  const dayIndex = today.getDate() % 30;
  const challenge = CHALLENGES[dayIndex];
  const dateStr = today.toISOString().slice(0, 10);
  const storageKey = `divyansh_challenge_${dateStr}`;

  const [completed, setCompleted] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === challenge.id;
    } catch {
      return false;
    }
  });
  const [countdown, setCountdown] = useState(getCountdown());
  const last7 = getLast7Days();

  useEffect(() => {
    const id = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleComplete = () => {
    try {
      localStorage.setItem(storageKey, challenge.id);
    } catch {
      /* ignore */
    }
    setCompleted(true);
    awardXP(150, "Daily Challenge");
  };

  const diff = getDifficultyStyle(challenge.difficulty);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Countdown */}
      <div
        className="w-full rounded-xl p-5 flex flex-col items-center gap-3"
        style={{
          background: "oklch(0.09 0.025 270 / 0.9)",
          border: "1px solid oklch(0.82 0.18 200 / 0.2)",
          boxShadow: "0 0 30px oklch(0.82 0.18 200 / 0.06)",
        }}
      >
        <p
          className="font-mono text-xs tracking-widest uppercase"
          style={{ color: "oklch(0.82 0.18 200 / 0.6)" }}
        >
          Next Challenge In
        </p>
        <div className="flex items-center gap-4">
          {[
            { val: pad(countdown.hours), label: "HRS" },
            { val: pad(countdown.minutes), label: "MIN" },
            { val: pad(countdown.seconds), label: "SEC" },
          ].map(({ val, label }, i) => (
            <div key={label} className="flex items-center gap-4">
              {i > 0 && (
                <span
                  className="font-display font-black text-3xl"
                  style={{ color: "oklch(0.82 0.18 200 / 0.4)" }}
                >
                  :
                </span>
              )}
              <div className="flex flex-col items-center">
                <span
                  className="font-mono font-black text-4xl"
                  style={{
                    color: "oklch(0.82 0.18 200)",
                    textShadow: "0 0 20px oklch(0.82 0.18 200 / 0.5)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {val}
                </span>
                <span
                  className="font-mono text-xs tracking-widest"
                  style={{ color: "oklch(0.82 0.18 200 / 0.4)" }}
                >
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Challenge card */}
      <div
        className="w-full rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden"
        style={{
          background: "oklch(0.10 0.03 50 / 0.9)",
          border: "2px solid oklch(0.78 0.17 60 / 0.5)",
          boxShadow:
            "0 0 40px oklch(0.78 0.17 60 / 0.12), 0 0 80px oklch(0.78 0.17 60 / 0.06)",
        }}
      >
        {/* Gold glow corner */}
        <div
          className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at top right, oklch(0.78 0.17 60 / 0.15), transparent 70%)",
          }}
        />

        {/* Header row */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span
              className="text-4xl"
              style={{
                filter: "drop-shadow(0 0 8px oklch(0.78 0.17 60 / 0.8))",
              }}
              aria-hidden="true"
            >
              {challenge.badge}
            </span>
            <div>
              <div
                className="font-mono text-xs tracking-widest uppercase mb-1"
                style={{ color: "oklch(0.78 0.17 60 / 0.7)" }}
              >
                Daily Challenge ·{" "}
                {today.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <h3
                className="font-display font-black text-xl"
                style={{ color: "oklch(0.95 0.05 60)" }}
              >
                {challenge.title}
              </h3>
            </div>
          </div>

          {/* Difficulty badge */}
          <span
            className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase shrink-0"
            style={{
              color: diff.color,
              border: `1px solid ${diff.border}`,
              background: diff.bg,
            }}
          >
            {challenge.difficulty}
          </span>
        </div>

        {/* Game + description */}
        <div className="flex flex-col gap-2">
          <div
            className="inline-flex items-center gap-2 text-xs font-mono"
            style={{ color: "oklch(0.78 0.17 60 / 0.8)" }}
          >
            🎮 Game:{" "}
            <span style={{ color: "oklch(0.95 0.05 60)" }}>
              {challenge.game}
            </span>
          </div>
          <p
            className="font-body text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {challenge.description}
          </p>
        </div>

        {/* Target score row */}
        <div
          className="flex items-center justify-between px-4 py-3 rounded-lg"
          style={{
            background: "oklch(0.78 0.17 60 / 0.07)",
            border: "1px solid oklch(0.78 0.17 60 / 0.2)",
          }}
        >
          <div className="flex flex-col">
            <span
              className="font-mono text-xs"
              style={{ color: "oklch(0.78 0.17 60 / 0.6)" }}
            >
              Target Score
            </span>
            <span
              className="font-display font-black text-2xl"
              style={{ color: "oklch(0.78 0.17 60)" }}
            >
              {challenge.targetScore.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span
              className="font-mono text-xs"
              style={{ color: "oklch(0.78 0.17 60 / 0.6)" }}
            >
              Reward Badge
            </span>
            <span
              className="font-display font-bold text-sm"
              style={{ color: "oklch(0.95 0.05 60)" }}
            >
              🏅 {challenge.rewardBadge}
            </span>
          </div>
        </div>

        {/* Complete button or completion banner */}
        <AnimatePresence mode="wait">
          {completed ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex flex-col items-center gap-2 py-4 rounded-lg"
              style={{
                background: "oklch(0.55 0.18 145 / 0.1)",
                border: "1px solid oklch(0.55 0.18 145 / 0.4)",
              }}
              data-ocid="daily.success_state"
            >
              <motion.span
                className="text-4xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                🏅
              </motion.span>
              <p
                className="font-display font-bold text-base"
                style={{ color: "#4ade80" }}
              >
                Challenge Completed!
              </p>
              <p
                className="font-mono text-xs"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                You earned: {challenge.rewardBadge}
              </p>
            </motion.div>
          ) : (
            <motion.button
              key="complete-btn"
              type="button"
              className="w-full py-3.5 rounded-lg font-display font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "oklch(0.78 0.17 60 / 0.15)",
                border: "1.5px solid oklch(0.78 0.17 60 / 0.6)",
                color: "oklch(0.78 0.17 60)",
                boxShadow: "0 0 20px oklch(0.78 0.17 60 / 0.15)",
              }}
              onClick={handleComplete}
              data-ocid="daily.complete.button"
            >
              ✓ Mark as Complete
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Last 7 days */}
      <div className="w-full">
        <p
          className="font-mono text-xs tracking-widest uppercase mb-3 text-center"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Last 7 Days
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {last7.map(({ dateStr: dStr, label }) => {
            const key = `divyansh_challenge_${dStr}`;
            const isDone = (() => {
              try {
                return !!localStorage.getItem(key);
              } catch {
                return false;
              }
            })();
            const isToday = dStr === dateStr;

            return (
              <div
                key={dStr}
                className="flex flex-col items-center gap-1"
                title={dStr}
                data-ocid={`daily.history.item.${last7.findIndex((d) => d.dateStr === dStr) + 1}`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200"
                  style={{
                    background: isDone
                      ? "oklch(0.55 0.18 145 / 0.2)"
                      : isToday
                        ? "oklch(0.78 0.17 60 / 0.1)"
                        : "oklch(0.12 0.02 270)",
                    border: isDone
                      ? "1.5px solid oklch(0.55 0.18 145 / 0.6)"
                      : isToday
                        ? "1.5px solid oklch(0.78 0.17 60 / 0.5)"
                        : "1px solid oklch(0.25 0.03 270)",
                    boxShadow: isDone
                      ? "0 0 10px oklch(0.55 0.18 145 / 0.2)"
                      : "none",
                  }}
                >
                  {isDone ? "✓" : isToday ? "●" : "○"}
                </div>
                <span
                  className="font-mono text-xs"
                  style={{
                    color: isDone
                      ? "#4ade80"
                      : isToday
                        ? "oklch(0.78 0.17 60)"
                        : "rgba(255,255,255,0.25)",
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
