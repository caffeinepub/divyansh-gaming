import { Crown, Timer, Trophy } from "lucide-react";
// ─── Weekly Leaderboard Section ────────────────────────────────────────────────
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import type { LeaderboardEntry } from "../backend.d";
import { useGetLeaderboard } from "../hooks/useQueries";

const FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: BigInt(1),
    playerName: "XxDivyanshxX",
    gameName: "Ghost Protocol",
    score: BigInt(98750),
    timestamp: new Date().toISOString(),
    avatar: "🎮",
  },
  {
    rank: BigInt(2),
    playerName: "NeonReaper",
    gameName: "Neon Phantoms",
    score: BigInt(87420),
    timestamp: new Date().toISOString(),
    avatar: "⚔️",
  },
  {
    rank: BigInt(3),
    playerName: "VoidStrike",
    gameName: "Void Corsairs",
    score: BigInt(75300),
    timestamp: new Date().toISOString(),
    avatar: "🚀",
  },
  {
    rank: BigInt(4),
    playerName: "ArcaneHunter",
    gameName: "Dragon's Ascent",
    score: BigInt(62100),
    timestamp: new Date().toISOString(),
    avatar: "🐉",
  },
  {
    rank: BigInt(5),
    playerName: "TurboBlaze",
    gameName: "Hyperdrive X",
    score: BigInt(55890),
    timestamp: new Date().toISOString(),
    avatar: "💥",
  },
];

/** Get the most recent Monday 00:00 UTC */
function getMostRecentMonday(): Date {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun, 1=Mon
  const diffToMon = day === 0 ? 6 : day - 1;
  const monday = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - diffToMon,
      0,
      0,
      0,
      0,
    ),
  );
  return monday;
}

/** Get next Monday 00:00 UTC */
function getNextMonday(): Date {
  const monday = getMostRecentMonday();
  return new Date(monday.getTime() + 7 * 24 * 60 * 60 * 1000);
}

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const update = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ days, hours, minutes });
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

const RANK_CONFIGS = [
  {
    label: "1st",
    color: "oklch(0.78 0.18 75)",
    bg: "oklch(0.78 0.18 75 / 0.1)",
    border: "oklch(0.78 0.18 75 / 0.5)",
    shadow: "0 0 24px oklch(0.78 0.18 75 / 0.25)",
    medal: "🥇",
    size: "md:col-span-1",
  },
  {
    label: "2nd",
    color: "oklch(0.72 0.02 240)",
    bg: "oklch(0.72 0.02 240 / 0.08)",
    border: "oklch(0.72 0.02 240 / 0.4)",
    shadow: "0 0 18px oklch(0.72 0.02 240 / 0.15)",
    medal: "🥈",
    size: "md:col-span-1",
  },
  {
    label: "3rd",
    color: "oklch(0.65 0.14 45)",
    bg: "oklch(0.65 0.14 45 / 0.08)",
    border: "oklch(0.65 0.14 45 / 0.4)",
    shadow: "0 0 18px oklch(0.65 0.14 45 / 0.15)",
    medal: "🥉",
    size: "md:col-span-1",
  },
];

interface WeeklyLeaderboardSectionProps {
  entries?: LeaderboardEntry[];
}

export default function WeeklyLeaderboardSection({
  entries: externalEntries,
}: WeeklyLeaderboardSectionProps) {
  const { data: lbData } = useGetLeaderboard();
  const allEntries =
    externalEntries ??
    (lbData && lbData.length > 0 ? lbData : FALLBACK_LEADERBOARD);

  const weekStart = getMostRecentMonday();
  const nextMonday = getNextMonday();
  const countdown = useCountdown(nextMonday);

  // Store reset time in localStorage
  useEffect(() => {
    const stored = localStorage.getItem("dg_weeklyResetTime");
    if (!stored || new Date(stored).getTime() < weekStart.getTime()) {
      localStorage.setItem("dg_weeklyResetTime", weekStart.toISOString());
    }
  }, [weekStart]);

  const weeklyEntries = useMemo(() => {
    return allEntries
      .filter((e) => {
        try {
          return new Date(e.timestamp).getTime() >= weekStart.getTime();
        } catch {
          return false;
        }
      })
      .sort((a, b) => Number(b.score) - Number(a.score))
      .map((e, i) => ({ ...e, rank: BigInt(i + 1) }));
  }, [allEntries, weekStart]);

  const top3 = weeklyEntries.slice(0, 3);
  const rest = weeklyEntries.slice(3, 10);

  return (
    <section
      id="weekly-leaderboard"
      data-ocid="weekly_lb.section"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(0.09 0.02 295 / 0.85)" }}
    >
      {/* Glow orbs */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-8"
        style={{ background: "oklch(0.78 0.18 75)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-8"
        style={{ background: "oklch(var(--neon-violet))" }}
      />

      <div className="container px-4 md:px-6 relative z-10">
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
            <Trophy className="w-3 h-3" />
            This Week's Champions
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-foreground mb-4">
            Weekly{" "}
            <span
              style={{
                color: "oklch(0.78 0.18 75)",
                textShadow: "0 0 24px oklch(0.78 0.18 75 / 0.4)",
              }}
            >
              Leaderboard
            </span>
          </h2>
          <p className="font-body text-foreground/50 max-w-xl mx-auto mb-6">
            Top scores from this week. Resets every Monday. Climb to the top for
            special prizes!
          </p>

          {/* Countdown */}
          <div
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-lg"
            style={{
              background: "oklch(var(--neon-violet) / 0.08)",
              border: "1px solid oklch(var(--neon-violet) / 0.3)",
            }}
          >
            <Timer
              className="w-4 h-4"
              style={{ color: "oklch(var(--neon-violet))" }}
            />
            <span
              className="font-mono text-sm"
              style={{ color: "oklch(var(--neon-violet))" }}
            >
              Resets in{" "}
              <span className="font-bold">
                {countdown.days}d {countdown.hours}h {countdown.minutes}m
              </span>
            </span>
          </div>
        </motion.div>

        {weeklyEntries.length === 0 ? (
          /* Empty state */
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            data-ocid="weekly_lb.empty_state"
          >
            <div className="text-6xl mb-4">👑</div>
            <p className="font-display font-bold text-2xl text-foreground/40 mb-2">
              Be the first weekly champion!
            </p>
            <p className="font-body text-sm text-foreground/30">
              No scores submitted this week yet. Play any game to claim the top
              spot!
            </p>
          </motion.div>
        ) : (
          <>
            {/* Top 3 podium */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {[0, 1, 2].map((podiumIdx) => {
                const entry = top3[podiumIdx];
                const conf = RANK_CONFIGS[podiumIdx];
                if (!entry)
                  return (
                    <motion.div
                      key={`empty-${podiumIdx}`}
                      className="rounded-lg p-6 flex flex-col items-center gap-3 opacity-30"
                      style={{
                        background: "oklch(var(--card))",
                        border: "1px dashed oklch(var(--border))",
                        minHeight: 160,
                      }}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 0.3, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: podiumIdx * 0.1 }}
                      data-ocid={`weekly_lb.item.${podiumIdx + 1}`}
                    >
                      <span className="text-3xl">{conf.medal}</span>
                      <span className="font-mono text-xs text-foreground/30">
                        {conf.label} Place
                      </span>
                      <span className="font-body text-xs text-foreground/20">
                        Open
                      </span>
                    </motion.div>
                  );

                return (
                  <motion.div
                    key={String(entry.rank)}
                    className="relative rounded-lg p-6 flex flex-col items-center gap-3 text-center"
                    style={{
                      background: conf.bg,
                      border: `1px solid ${conf.border}`,
                      boxShadow: conf.shadow,
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: podiumIdx * 0.1 }}
                    data-ocid={`weekly_lb.item.${podiumIdx + 1}`}
                  >
                    {/* Weekly champion special label */}
                    {podiumIdx === 0 && (
                      <motion.div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest"
                        style={{
                          background: "oklch(0.78 0.18 75)",
                          color: "oklch(0.1 0.02 75)",
                          boxShadow: "0 0 12px oklch(0.78 0.18 75 / 0.7)",
                        }}
                        animate={{
                          boxShadow: [
                            "0 0 12px oklch(0.78 0.18 75 / 0.7)",
                            "0 0 20px oklch(0.78 0.18 75 / 1)",
                            "0 0 12px oklch(0.78 0.18 75 / 0.7)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <Crown className="w-3 h-3" />
                        Weekly Champion Crown
                      </motion.div>
                    )}

                    <span className="text-4xl mt-2">{conf.medal}</span>

                    {/* Avatar */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                      style={{
                        background: conf.bg,
                        border: `1.5px solid ${conf.border}`,
                      }}
                    >
                      {entry.avatar || entry.playerName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p
                        className="font-display font-bold text-base"
                        style={{ color: conf.color }}
                      >
                        {entry.playerName}
                      </p>
                      <p className="font-body text-xs text-foreground/50 mt-0.5">
                        {entry.gameName}
                      </p>
                    </div>

                    <p
                      className="font-mono font-bold text-xl"
                      style={{ color: conf.color }}
                    >
                      {Number(entry.score).toLocaleString()}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Entries 4-10 */}
            {rest.length > 0 && (
              <motion.div
                className="rounded-lg overflow-hidden"
                style={{
                  border: "1px solid oklch(var(--border))",
                  background: "oklch(var(--card))",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {rest.map((entry, i) => (
                  <div
                    key={`${String(entry.rank)}-${entry.playerName}`}
                    className="flex items-center gap-4 px-5 py-3 border-b border-border last:border-b-0"
                    data-ocid={`weekly_lb.item.${i + 4}`}
                  >
                    <span className="font-mono text-sm text-foreground/40 w-6 text-center">
                      #{i + 4}
                    </span>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                      style={{
                        background: "oklch(var(--muted))",
                        border: "1px solid oklch(var(--border))",
                      }}
                    >
                      {entry.avatar || entry.playerName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-display font-bold text-sm text-foreground flex-1 min-w-0 truncate">
                      {entry.playerName}
                    </span>
                    <span className="font-body text-xs text-foreground/40 hidden sm:block">
                      {entry.gameName}
                    </span>
                    <span
                      className="font-mono font-bold text-sm"
                      style={{ color: "oklch(var(--neon-cyan) / 0.8)" }}
                    >
                      {Number(entry.score).toLocaleString()}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
