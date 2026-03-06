import { Gamepad2, Medal, Star, Target, Trophy, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import type { LeaderboardEntry } from "../backend.d";

interface PlayerProfileModalProps {
  playerName: string | null;
  entries: LeaderboardEntry[];
  onClose: () => void;
  avatar?: string;
}

function RankBadge({ rank }: { rank: bigint }) {
  const r = Number(rank);
  if (r === 1)
    return (
      <span
        className="inline-flex items-center justify-center w-9 h-9 rounded-full font-display font-black text-xs"
        style={{
          background: "oklch(var(--gold) / 0.2)",
          border: "1.5px solid oklch(var(--gold) / 0.8)",
          color: "oklch(var(--gold))",
          boxShadow: "0 0 10px oklch(var(--gold) / 0.4)",
        }}
      >
        #1
      </span>
    );
  if (r === 2)
    return (
      <span
        className="inline-flex items-center justify-center w-9 h-9 rounded-full font-display font-black text-xs"
        style={{
          background: "oklch(var(--silver) / 0.18)",
          border: "1.5px solid oklch(var(--silver) / 0.7)",
          color: "oklch(var(--silver))",
          boxShadow: "0 0 8px oklch(var(--silver) / 0.3)",
        }}
      >
        #2
      </span>
    );
  if (r === 3)
    return (
      <span
        className="inline-flex items-center justify-center w-9 h-9 rounded-full font-display font-black text-xs"
        style={{
          background: "oklch(var(--bronze) / 0.2)",
          border: "1.5px solid oklch(var(--bronze) / 0.7)",
          color: "oklch(var(--bronze))",
          boxShadow: "0 0 8px oklch(var(--bronze) / 0.3)",
        }}
      >
        #3
      </span>
    );
  return (
    <span
      className="inline-flex items-center justify-center w-9 h-9 rounded-full font-display font-bold text-xs"
      style={{
        background: "oklch(var(--muted))",
        border: "1px solid oklch(var(--border))",
        color: "oklch(var(--foreground) / 0.45)",
      }}
    >
      #{r}
    </span>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accentColor: string;
}

function StatCard({ icon, label, value, accentColor }: StatCardProps) {
  return (
    <div
      className="flex flex-col gap-2 rounded-lg p-4"
      style={{
        background: `${accentColor.replace(")", " / 0.06)")}`,
        border: `1px solid ${accentColor.replace(")", " / 0.22)")}`,
      }}
    >
      <div
        className="w-8 h-8 rounded flex items-center justify-center shrink-0"
        style={{
          background: accentColor.replace(")", " / 0.12)"),
          color: accentColor,
          filter: `drop-shadow(0 0 5px ${accentColor.replace(")", " / 0.4)")})`,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          className="font-display font-black text-xl leading-none mb-0.5"
          style={{ color: accentColor }}
        >
          {value}
        </p>
        <p className="font-mono text-xs tracking-wider uppercase text-foreground/45">
          {label}
        </p>
      </div>
    </div>
  );
}

export default function PlayerProfileModal({
  playerName,
  entries,
  onClose,
  avatar,
}: PlayerProfileModalProps) {
  // Derive all player stats from entries
  const playerData = useMemo(() => {
    if (!playerName) return null;

    const playerEntries = entries.filter((e) => e.playerName === playerName);
    if (playerEntries.length === 0) return null;

    const totalGames = playerEntries.length;
    const totalScore = playerEntries.reduce(
      (sum, e) => sum + Number(e.score),
      0,
    );
    const bestScore = Math.max(...playerEntries.map((e) => Number(e.score)));
    const bestRank = Math.min(...playerEntries.map((e) => Number(e.rank)));

    // Favorite game: most entries, tie-break by total score
    const gameMap = new Map<string, { count: number; totalScore: number }>();
    for (const e of playerEntries) {
      const existing = gameMap.get(e.gameName) ?? { count: 0, totalScore: 0 };
      gameMap.set(e.gameName, {
        count: existing.count + 1,
        totalScore: existing.totalScore + Number(e.score),
      });
    }
    let favoriteGame = "";
    let maxCount = 0;
    let maxScore = 0;
    for (const [game, { count, totalScore: gs }] of gameMap.entries()) {
      if (count > maxCount || (count === maxCount && gs > maxScore)) {
        maxCount = count;
        maxScore = gs;
        favoriteGame = game;
      }
    }

    // Game history sorted by score descending
    const gameHistory = [...playerEntries].sort(
      (a, b) => Number(b.score) - Number(a.score),
    );

    return {
      totalGames,
      totalScore,
      bestScore,
      bestRank,
      favoriteGame,
      gameHistory,
    };
  }, [playerName, entries]);

  const initial = playerName ? playerName.charAt(0).toUpperCase() : "?";

  const formatDate = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <AnimatePresence>
      {playerName && playerData && (
        <>
          {/* Backdrop */}
          <motion.div
            key="profile-backdrop"
            className="fixed inset-0 z-[100]"
            style={{
              background: "oklch(0 0 0 / 0.78)",
              backdropFilter: "blur(6px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-label="Close player profile"
            data-ocid="player.profile.modal"
          />

          {/* Modal panel */}
          <motion.div
            key="profile-panel"
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl overflow-hidden pointer-events-auto"
              style={{
                background: "oklch(0.095 0.022 270)",
                border: "1.5px solid oklch(var(--neon-cyan) / 0.35)",
                boxShadow:
                  "0 0 0 1px oklch(var(--neon-cyan) / 0.08), 0 24px 80px oklch(0 0 0 / 0.7), 0 0 60px oklch(var(--neon-cyan) / 0.08)",
              }}
              initial={{ opacity: 0, y: 44, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 32, scale: 0.97 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              aria-modal="true"
              aria-label={`${playerName}'s player profile`}
            >
              {/* Top neon glow line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, oklch(var(--neon-cyan) / 0.8) 30%, oklch(var(--neon-violet) / 0.8) 70%, transparent 100%)",
                }}
              />

              {/* Scrollable content */}
              <div className="overflow-y-auto flex-1 p-6 md:p-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-8">
                  <div className="flex items-center gap-5">
                    {/* Avatar */}
                    <div
                      className="relative shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-display font-black text-2xl"
                      style={{
                        background:
                          "radial-gradient(circle, oklch(var(--neon-cyan) / 0.25) 0%, oklch(var(--neon-violet) / 0.18) 100%)",
                        border: "2px solid oklch(var(--neon-cyan) / 0.6)",
                        color: "oklch(var(--neon-cyan))",
                        boxShadow:
                          "0 0 24px oklch(var(--neon-cyan) / 0.3), 0 0 8px oklch(var(--neon-cyan) / 0.2) inset",
                        textShadow: "0 0 16px oklch(var(--neon-cyan))",
                      }}
                    >
                      {avatar ? (
                        <span style={{ fontSize: "2rem", lineHeight: 1 }}>
                          {avatar}
                        </span>
                      ) : (
                        initial
                      )}
                      {/* Orbit ring */}
                      <div
                        className="absolute inset-[-4px] rounded-full"
                        style={{
                          border: "1px solid oklch(var(--neon-cyan) / 0.18)",
                        }}
                      />
                    </div>

                    {/* Name + badge */}
                    <div>
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full mb-1.5"
                        style={{
                          background: "oklch(var(--neon-violet) / 0.12)",
                          border: "1px solid oklch(var(--neon-violet) / 0.4)",
                        }}
                      >
                        <Trophy
                          className="w-2.5 h-2.5"
                          style={{ color: "oklch(var(--neon-violet))" }}
                        />
                        <span
                          className="font-mono text-[10px] tracking-widest uppercase"
                          style={{ color: "oklch(var(--neon-violet))" }}
                        >
                          Player Profile
                        </span>
                      </div>
                      <h2
                        className="font-display font-black text-2xl md:text-3xl leading-tight"
                        style={{
                          color: "oklch(var(--foreground))",
                          textShadow: "0 0 24px oklch(var(--neon-cyan) / 0.15)",
                        }}
                      >
                        {playerName}
                      </h2>
                    </div>
                  </div>

                  {/* Close button */}
                  <button
                    type="button"
                    className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                    style={{
                      background: "oklch(var(--foreground) / 0.06)",
                      border: "1px solid oklch(var(--border))",
                      color: "oklch(var(--foreground) / 0.55)",
                    }}
                    onClick={onClose}
                    aria-label="Close profile"
                    data-ocid="player.profile.close_button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  <StatCard
                    icon={<Gamepad2 className="w-4 h-4" />}
                    label="Games Played"
                    value={playerData.totalGames}
                    accentColor="oklch(var(--neon-cyan))"
                  />
                  <StatCard
                    icon={<Zap className="w-4 h-4" />}
                    label="Total Score"
                    value={playerData.totalScore.toLocaleString()}
                    accentColor="oklch(var(--neon-violet))"
                  />
                  <StatCard
                    icon={<Trophy className="w-4 h-4" />}
                    label="Best Score"
                    value={playerData.bestScore.toLocaleString()}
                    accentColor="oklch(var(--gold))"
                  />
                  <StatCard
                    icon={<Medal className="w-4 h-4" />}
                    label="Best Rank"
                    value={`#${playerData.bestRank}`}
                    accentColor="oklch(var(--bronze))"
                  />
                  <StatCard
                    icon={<Star className="w-4 h-4" />}
                    label="Fav. Game"
                    value={playerData.favoriteGame}
                    accentColor="oklch(var(--neon-cyan))"
                  />
                  <StatCard
                    icon={<Target className="w-4 h-4" />}
                    label="Avg. Score"
                    value={Math.round(
                      playerData.totalScore / playerData.totalGames,
                    ).toLocaleString()}
                    accentColor="oklch(var(--neon-violet))"
                  />
                </div>

                {/* Game History */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="h-px flex-1"
                      style={{
                        background:
                          "linear-gradient(90deg, oklch(var(--neon-cyan) / 0.4), transparent)",
                      }}
                    />
                    <span
                      className="font-mono text-xs tracking-widest uppercase px-3"
                      style={{ color: "oklch(var(--neon-cyan))" }}
                    >
                      Game History
                    </span>
                    <div
                      className="h-px flex-1"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, oklch(var(--neon-cyan) / 0.4))",
                      }}
                    />
                  </div>

                  <div
                    className="rounded-lg overflow-hidden"
                    style={{
                      border: "1px solid oklch(var(--border))",
                      boxShadow: "0 0 20px oklch(var(--neon-cyan) / 0.05)",
                    }}
                  >
                    {/* Table header */}
                    <div
                      className="grid grid-cols-4 px-4 py-2.5"
                      style={{
                        background: "oklch(0.12 0.025 270)",
                        borderBottom:
                          "1px solid oklch(var(--neon-cyan) / 0.15)",
                      }}
                    >
                      {["Game", "Score", "Rank", "Date"].map((col) => (
                        <span
                          key={col}
                          className="font-mono text-[10px] tracking-widest uppercase"
                          style={{ color: "oklch(var(--foreground) / 0.35)" }}
                        >
                          {col}
                        </span>
                      ))}
                    </div>

                    {/* Table rows */}
                    <div
                      className="divide-y"
                      style={{ borderColor: "oklch(var(--border))" }}
                    >
                      {playerData.gameHistory.map((entry, idx) => {
                        const rankNum = Number(entry.rank);
                        const isTopThree = rankNum <= 3;
                        return (
                          <motion.div
                            key={`${String(entry.rank)}-${entry.gameName}-${idx}`}
                            className="grid grid-cols-4 px-4 py-3 items-center transition-colors duration-150 hover:bg-foreground/[0.03]"
                            style={
                              isTopThree
                                ? {
                                    borderLeft: `2px solid oklch(var(--${rankNum === 1 ? "gold" : rankNum === 2 ? "silver" : "bronze"}) / 0.7)`,
                                  }
                                : {}
                            }
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: idx * 0.04,
                            }}
                            data-ocid={`player.profile.item.${idx + 1}`}
                          >
                            {/* Game name */}
                            <span
                              className="font-body text-sm font-medium pr-2 truncate"
                              style={{
                                color: "oklch(var(--foreground) / 0.85)",
                              }}
                            >
                              {entry.gameName}
                            </span>

                            {/* Score */}
                            <span
                              className="font-mono font-bold text-sm"
                              style={{
                                color:
                                  rankNum === 1
                                    ? "oklch(var(--gold))"
                                    : rankNum === 2
                                      ? "oklch(var(--silver))"
                                      : rankNum === 3
                                        ? "oklch(var(--bronze))"
                                        : "oklch(var(--neon-cyan) / 0.8)",
                              }}
                            >
                              {Number(entry.score).toLocaleString()}
                            </span>

                            {/* Rank */}
                            <div>
                              <RankBadge rank={entry.rank} />
                            </div>

                            {/* Date */}
                            <span
                              className="font-mono text-xs"
                              style={{
                                color: "oklch(var(--foreground) / 0.35)",
                              }}
                            >
                              {formatDate(entry.timestamp)}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative corner glows */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-tr-xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at top right, oklch(var(--neon-violet) / 0.08), transparent 70%)",
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-28 h-28 rounded-bl-xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at bottom left, oklch(var(--neon-cyan) / 0.07), transparent 70%)",
                }}
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
