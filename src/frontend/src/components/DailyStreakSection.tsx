// ─── Daily Streak Section ──────────────────────────────────────────────────────
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { playClick } from "../hooks/useSoundEffects";
import { awardXP } from "../hooks/useXPSystem";

interface StreakMilestone {
  day: number;
  reward: string;
  xp: number;
  label: string;
}

const MILESTONES: StreakMilestone[] = [
  { day: 3, reward: "+50 XP", xp: 50, label: "Day 3" },
  { day: 7, reward: "+100 XP", xp: 100, label: "Day 7" },
  { day: 14, reward: "+250 XP + Badge", xp: 250, label: "Day 14" },
  { day: 30, reward: "LEGENDARY: +500 XP", xp: 500, label: "Day 30" },
];

function getNextMilestone(streak: number): StreakMilestone | null {
  return MILESTONES.find((m) => streak < m.day) ?? null;
}

function getMilestoneProgress(streak: number): {
  progress: number;
  next: StreakMilestone | null;
  prev: number;
} {
  const next = getNextMilestone(streak);
  if (!next) return { progress: 100, next: null, prev: 30 };

  const milestoneIdx = MILESTONES.indexOf(next);
  const prev = milestoneIdx === 0 ? 0 : MILESTONES[milestoneIdx - 1].day;
  const progress = Math.min(100, ((streak - prev) / (next.day - prev)) * 100);
  return { progress, next, prev };
}

export default function DailyStreakSection() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const lastLogin = localStorage.getItem("dg_lastLoginDate") ?? "";
    const stored = Number.parseInt(
      localStorage.getItem("dg_currentStreak") ?? "0",
      10,
    );
    const awardedStr =
      localStorage.getItem("dg_streak_milestones_awarded") ?? "[]";
    let awarded: number[] = [];
    try {
      awarded = JSON.parse(awardedStr);
    } catch {
      awarded = [];
    }

    let newStreak = stored;

    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().slice(0, 10);

      if (lastLogin === yStr) {
        newStreak = stored + 1;
      } else {
        newStreak = 1;
      }

      localStorage.setItem("dg_lastLoginDate", today);
      localStorage.setItem("dg_currentStreak", String(newStreak));

      // Check and award milestones
      for (const m of MILESTONES) {
        if (newStreak >= m.day && !awarded.includes(m.day)) {
          awardXP(m.xp, "Streak Milestone");
          awarded.push(m.day);
        }
      }
      localStorage.setItem(
        "dg_streak_milestones_awarded",
        JSON.stringify(awarded),
      );
    }

    setStreak(newStreak);
  }, []);

  const { progress, next } = getMilestoneProgress(streak);

  return (
    <section
      id="daily-streak"
      data-ocid="streak.section"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(0.09 0.025 55 / 0.85)" }}
    >
      {/* Glow orbs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: "oklch(0.78 0.18 75)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-8"
        style={{ background: "oklch(0.72 0.22 55)" }}
      />

      <div className="container px-4 md:px-6 relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase mb-4"
            style={{
              background: "oklch(0.78 0.18 75 / 0.1)",
              border: "1px solid oklch(0.78 0.18 75 / 0.4)",
              color: "oklch(0.78 0.18 75)",
            }}
          >
            🔥 Daily Streak
          </div>

          {/* Streak counter */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <motion.div
              className="text-7xl md:text-9xl leading-none select-none"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              🔥
            </motion.div>
            <h2
              className="font-display font-black text-5xl md:text-7xl tracking-tight"
              style={{
                color: "oklch(0.78 0.18 75)",
                textShadow:
                  "0 0 30px oklch(0.78 0.18 75 / 0.5), 0 0 60px oklch(0.72 0.22 55 / 0.3)",
              }}
            >
              Day {streak} Streak
            </h2>
            <p className="font-mono text-sm text-foreground/50 tracking-widest uppercase">
              Come back tomorrow to keep your streak!
            </p>
          </div>
        </motion.div>

        {/* Progress bar toward next milestone */}
        {next && (
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-foreground/50">
                Progress to Day {next.day}
              </span>
              <span
                className="font-mono text-xs"
                style={{ color: "oklch(0.78 0.18 75)" }}
              >
                {streak} / {next.day} days
              </span>
            </div>
            <div
              className="w-full h-3 rounded-full overflow-hidden"
              style={{ background: "oklch(0.15 0.03 55)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.72 0.22 55), oklch(0.78 0.18 75), oklch(0.85 0.15 85))",
                  boxShadow: "0 0 10px oklch(0.78 0.18 75 / 0.6)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* Milestone cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MILESTONES.map((milestone, i) => {
            const isCompleted = streak >= milestone.day;
            return (
              <motion.div
                key={milestone.day}
                className="relative rounded-lg p-5 flex flex-col items-center gap-3 text-center"
                style={{
                  background: isCompleted
                    ? "oklch(0.78 0.18 75 / 0.12)"
                    : "oklch(var(--card))",
                  border: isCompleted
                    ? "1px solid oklch(0.78 0.18 75 / 0.5)"
                    : "1px solid oklch(var(--border))",
                  boxShadow: isCompleted
                    ? "0 0 20px oklch(0.78 0.18 75 / 0.15)"
                    : "none",
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Completion checkmark */}
                {isCompleted && (
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                    style={{
                      background: "oklch(0.78 0.18 75)",
                      color: "oklch(0.1 0.02 55)",
                      boxShadow: "0 0 8px oklch(0.78 0.18 75 / 0.7)",
                    }}
                  >
                    ✓
                  </div>
                )}

                {/* Day badge */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-display font-black text-lg"
                  style={{
                    background: isCompleted
                      ? "oklch(0.78 0.18 75 / 0.2)"
                      : "oklch(0.14 0.025 55)",
                    color: isCompleted
                      ? "oklch(0.78 0.18 75)"
                      : "oklch(var(--foreground) / 0.4)",
                    border: isCompleted
                      ? "1.5px solid oklch(0.78 0.18 75 / 0.5)"
                      : "1.5px solid oklch(var(--border))",
                  }}
                >
                  {milestone.day}
                </div>

                <div>
                  <p
                    className="font-mono text-xs tracking-widest uppercase mb-1"
                    style={{
                      color: isCompleted
                        ? "oklch(0.78 0.18 75)"
                        : "oklch(var(--foreground) / 0.5)",
                    }}
                  >
                    {milestone.label}
                  </p>
                  <p
                    className="font-display font-bold text-xs leading-snug"
                    style={{
                      color: isCompleted
                        ? "oklch(0.85 0.15 75)"
                        : "oklch(var(--foreground) / 0.35)",
                    }}
                  >
                    {milestone.reward}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA reminder */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-lg"
            style={{
              background: "oklch(0.78 0.18 75 / 0.06)",
              border: "1px solid oklch(0.78 0.18 75 / 0.25)",
            }}
          >
            <span className="text-xl">🏆</span>
            <p className="font-body text-sm text-foreground/60">
              Reach{" "}
              <span
                style={{ color: "oklch(0.78 0.18 75)" }}
                className="font-semibold"
              >
                30 days
              </span>{" "}
              for the LEGENDARY reward. Don't break your streak!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
