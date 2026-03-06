import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { getAchievements } from "../hooks/useAchievements";
import {
  type LevelInfo,
  type XPProfile,
  getProfile,
} from "../hooks/useXPSystem";

const RARITY_COLOR_MAP: Record<string, string> = {
  common: "oklch(0.82 0.18 200)",
  rare: "oklch(0.62 0.22 295)",
  epic: "oklch(0.68 0.25 340)",
  legendary: "oklch(0.78 0.17 60)",
};

function getLevelTitle(level: number): string {
  if (level <= 4) return "Rookie";
  if (level <= 9) return "Warrior";
  if (level <= 14) return "Elite";
  if (level <= 19) return "Champion";
  if (level <= 24) return "Legend";
  return "Grandmaster";
}

function calcLevelInfo(profile: XPProfile): LevelInfo {
  const level = profile.level;
  const xpCurrentLevel = level * level * 100;
  const xpNextLevel = (level + 1) * (level + 1) * 100;
  const progress =
    xpNextLevel > xpCurrentLevel
      ? Math.min(
          100,
          ((profile.xp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) *
            100,
        )
      : 100;

  return {
    level,
    title: getLevelTitle(level),
    progress,
    xpForNextLevel: xpNextLevel,
    xpCurrent: profile.xp,
    xpNeeded: Math.max(0, xpNextLevel - profile.xp),
  };
}

// ─── XP Progress Bar ──────────────────────────────────────────────────────────
function XPProgressBar({
  progress,
  animated = true,
}: { progress: number; animated?: boolean }) {
  return (
    <div
      data-ocid="xp.progress_bar"
      className="w-full h-3 rounded-full overflow-hidden relative"
      style={{
        background: "oklch(0.12 0.03 60 / 0.8)",
        border: "1px solid oklch(0.78 0.17 60 / 0.2)",
      }}
      role="progressbar"
      // biome-ignore lint/a11y/useFocusableInteractive: progress bar is decorative but needs role for screen readers
      tabIndex={0}
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.82 0.18 200), oklch(0.78 0.17 60))",
          boxShadow:
            "0 0 8px oklch(0.78 0.17 60 / 0.6), 0 0 16px oklch(0.78 0.17 60 / 0.3)",
        }}
        initial={animated ? { width: 0 } : { width: `${progress}%` }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
      />
      {/* Shimmer */}
      <motion.div
        className="absolute inset-y-0 w-16 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.15), transparent)",
        }}
        animate={{ x: ["-60px", "calc(100% + 60px)"] }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 1.5,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// ─── Full XP Level Card ───────────────────────────────────────────────────────
export function XPLevelCardFull() {
  const [profile, setProfile] = useState<XPProfile>(getProfile);

  useEffect(() => {
    const handler = () => setProfile(getProfile());
    window.addEventListener("xp-awarded", handler);
    return () => window.removeEventListener("xp-awarded", handler);
  }, []);

  const levelInfo = calcLevelInfo(profile);
  const avatar =
    typeof window !== "undefined"
      ? (localStorage.getItem("divyansh_avatar") ??
        localStorage.getItem("dg_player_avatar") ??
        "🎮")
      : "🎮";
  const playerName =
    typeof window !== "undefined"
      ? (localStorage.getItem("divyansh_username") ??
        localStorage.getItem("dg_player_name") ??
        "Player")
      : "Player";

  const titleColors: Record<string, string> = {
    Rookie: "oklch(0.65 0.10 60)",
    Warrior: "oklch(0.70 0.14 60)",
    Elite: "oklch(0.82 0.18 200)",
    Champion: "oklch(0.75 0.20 295)",
    Legend: "oklch(0.78 0.17 60)",
    Grandmaster: "oklch(0.80 0.18 45)",
  };
  const titleColor = titleColors[levelInfo.title] ?? "oklch(0.78 0.17 60)";

  return (
    <motion.div
      data-ocid="xp.level_card"
      className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden relative"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.11 0.04 60 / 0.95), oklch(0.09 0.03 270 / 0.95))",
        border: "2px solid oklch(0.78 0.17 60 / 0.5)",
        boxShadow:
          "0 0 60px oklch(0.78 0.17 60 / 0.12), 0 0 120px oklch(0.78 0.17 60 / 0.06), 0 16px 48px oklch(0 0 0 / 0.6)",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Gold corner glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top right, oklch(0.78 0.17 60 / 0.12), transparent 60%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at bottom left, oklch(0.82 0.18 200 / 0.08), transparent 60%)",
        }}
      />

      {/* Top shimmer line */}
      <div
        className="w-full h-0.5"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.78 0.17 60 / 0.8), oklch(0.82 0.18 200 / 0.6), transparent)",
        }}
      />

      <div className="px-8 py-8 relative z-10">
        {/* Header: avatar + player info + level badge */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
              style={{
                background: "oklch(0.78 0.17 60 / 0.1)",
                border: "2px solid oklch(0.78 0.17 60 / 0.4)",
                boxShadow: "0 0 20px oklch(0.78 0.17 60 / 0.2)",
              }}
            >
              {avatar}
            </div>

            {/* Name + title */}
            <div>
              <p
                className="font-mono text-xs tracking-widest uppercase mb-1"
                style={{ color: "oklch(0.78 0.17 60 / 0.6)" }}
              >
                Player Profile
              </p>
              <h3
                className="font-display font-black text-2xl"
                style={{ color: "oklch(0.96 0.04 60)" }}
              >
                {playerName}
              </h3>
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase mt-1"
                style={{
                  background: `${titleColor.replace(")", " / 0.12)")}`,
                  border: `1px solid ${titleColor.replace(")", " / 0.4)")}`,
                  color: titleColor,
                }}
              >
                {levelInfo.title}
              </div>
            </div>
          </div>

          {/* Level badge */}
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.17 60 / 0.2), oklch(0.78 0.17 60 / 0.08))",
                border: "2px solid oklch(0.78 0.17 60 / 0.5)",
                boxShadow: "0 0 30px oklch(0.78 0.17 60 / 0.25)",
              }}
            >
              <span
                className="font-mono text-xs tracking-widest uppercase"
                style={{ color: "oklch(0.78 0.17 60 / 0.7)" }}
              >
                LVL
              </span>
              <motion.span
                className="font-display font-black text-3xl"
                style={{
                  color: "oklch(0.78 0.17 60)",
                  textShadow: "0 0 16px oklch(0.78 0.17 60 / 0.6)",
                }}
                key={levelInfo.level}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {levelInfo.level}
              </motion.span>
            </div>
            <span
              className="font-mono text-xs"
              style={{ color: "oklch(0.78 0.17 60 / 0.5)" }}
            >
              {profile.totalXpEarned.toLocaleString()} XP Total
            </span>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: "oklch(0.78 0.17 60 / 0.7)" }}
            >
              Progress to Level {levelInfo.level + 1}
            </span>
            <span
              className="font-mono text-xs font-bold"
              style={{ color: "oklch(0.78 0.17 60)" }}
            >
              {levelInfo.xpCurrent.toLocaleString()} /{" "}
              {levelInfo.xpForNextLevel.toLocaleString()} XP
            </span>
          </div>
          <XPProgressBar progress={levelInfo.progress} animated />
          <div className="flex items-center justify-between mt-1.5">
            <span
              className="font-mono text-xs"
              style={{ color: "oklch(0.78 0.17 60 / 0.45)" }}
            >
              Level {levelInfo.level}
            </span>
            <span
              className="font-mono text-xs"
              style={{ color: "oklch(0.78 0.17 60 / 0.45)" }}
            >
              {levelInfo.xpNeeded.toLocaleString()} XP needed
            </span>
            <span
              className="font-mono text-xs"
              style={{ color: "oklch(0.78 0.17 60 / 0.45)" }}
            >
              Level {levelInfo.level + 1}
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          <div
            data-ocid="xp.challenges.stat"
            className="flex flex-col items-center gap-1.5 p-4 rounded-xl"
            style={{
              background: "oklch(0.78 0.17 60 / 0.05)",
              border: "1px solid oklch(0.78 0.17 60 / 0.2)",
            }}
          >
            <span className="text-2xl">🔥</span>
            <motion.span
              className="font-display font-black text-xl"
              style={{ color: "oklch(0.78 0.17 60)" }}
              key={profile.completedChallenges}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {profile.completedChallenges}
            </motion.span>
            <span
              className="font-mono text-xs tracking-widest uppercase text-center"
              style={{ color: "oklch(0.78 0.17 60 / 0.55)" }}
            >
              Challenges
            </span>
          </div>

          <div
            data-ocid="xp.tournaments.stat"
            className="flex flex-col items-center gap-1.5 p-4 rounded-xl"
            style={{
              background: "oklch(0.78 0.17 60 / 0.05)",
              border: "1px solid oklch(0.78 0.17 60 / 0.2)",
            }}
          >
            <span className="text-2xl">🏆</span>
            <motion.span
              className="font-display font-black text-xl"
              style={{ color: "oklch(0.78 0.17 60)" }}
              key={profile.tournamentsWon}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {profile.tournamentsWon}
            </motion.span>
            <span
              className="font-mono text-xs tracking-widest uppercase text-center"
              style={{ color: "oklch(0.78 0.17 60 / 0.55)" }}
            >
              Tournaments Won
            </span>
          </div>

          <div
            data-ocid="xp.total_xp.stat"
            className="flex flex-col items-center gap-1.5 p-4 rounded-xl"
            style={{
              background: "oklch(0.78 0.17 60 / 0.05)",
              border: "1px solid oklch(0.78 0.17 60 / 0.2)",
            }}
          >
            <span className="text-2xl">⭐</span>
            <motion.span
              className="font-display font-black text-xl"
              style={{ color: "oklch(0.78 0.17 60)" }}
              key={profile.totalXpEarned}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {profile.totalXpEarned.toLocaleString()}
            </motion.span>
            <span
              className="font-mono text-xs tracking-widest uppercase text-center"
              style={{ color: "oklch(0.78 0.17 60 / 0.55)" }}
            >
              Total XP
            </span>
          </div>
        </div>

        {/* Recent Achievements mini strip */}
        {(() => {
          const allAchievements = getAchievements();
          const recentUnlocked = allAchievements
            .filter((a) => a.unlocked && a.unlockedAt)
            .sort(
              (a, b) =>
                new Date(b.unlockedAt!).getTime() -
                new Date(a.unlockedAt!).getTime(),
            )
            .slice(0, 3);

          return (
            <div
              className="mt-6 p-4 rounded-xl"
              style={{
                background: "oklch(0.08 0.02 60 / 0.8)",
                border: "1px solid oklch(0.78 0.17 60 / 0.15)",
              }}
            >
              <p
                className="font-mono text-xs tracking-widest uppercase mb-3"
                style={{ color: "oklch(0.78 0.17 60 / 0.6)" }}
              >
                Recent Achievements
              </p>
              {recentUnlocked.length === 0 ? (
                <p
                  className="font-body text-xs"
                  style={{ color: "oklch(0.50 0.03 270)" }}
                >
                  No achievements yet — start earning XP!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {recentUnlocked.map((a) => {
                    const color =
                      RARITY_COLOR_MAP[a.rarity] ?? RARITY_COLOR_MAP.common;
                    return (
                      <div
                        key={a.id}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                        style={{
                          background: `${color.replace(")", " / 0.1)")}`,
                          border: `1px solid ${color.replace(")", " / 0.35)")}`,
                          boxShadow: `0 0 8px ${color.replace(")", " / 0.15)")}`,
                        }}
                        title={a.description}
                      >
                        <span className="text-sm">{a.icon}</span>
                        <span
                          className="font-mono text-xs font-bold"
                          style={{ color }}
                        >
                          {a.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* XP earn guide */}
        <div
          className="mt-6 p-4 rounded-xl"
          style={{
            background: "oklch(0.08 0.02 60 / 0.8)",
            border: "1px solid oklch(0.78 0.17 60 / 0.15)",
          }}
        >
          <p
            className="font-mono text-xs tracking-widest uppercase mb-3"
            style={{ color: "oklch(0.78 0.17 60 / 0.6)" }}
          >
            How to Earn XP
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Daily Challenge", xp: "+150 XP", icon: "🔥" },
              { label: "Tournament Win", xp: "+500 XP", icon: "🏆" },
              { label: "Tournament Match", xp: "+50 XP", icon: "⚔️" },
              { label: "Score Submitted", xp: "+25 XP", icon: "📊" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{
                  background: "oklch(0.78 0.17 60 / 0.04)",
                  border: "1px solid oklch(0.78 0.17 60 / 0.1)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{item.icon}</span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {item.label}
                  </span>
                </div>
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: "oklch(0.78 0.17 60)" }}
                >
                  {item.xp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Compact XP Widget ────────────────────────────────────────────────────────
export function XPLevelCardWidget() {
  const [profile, setProfile] = useState<XPProfile>(getProfile);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handler = () => setProfile(getProfile());
    window.addEventListener("xp-awarded", handler);
    return () => window.removeEventListener("xp-awarded", handler);
  }, []);

  const levelInfo = calcLevelInfo(profile);

  return (
    <div
      className="fixed bottom-20 left-4 z-40"
      style={{ filter: "drop-shadow(0 4px 16px oklch(0 0 0 / 0.5))" }}
    >
      {/* Expanded panel */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="mb-2 rounded-xl p-4 w-56"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.12 0.04 60 / 0.98), oklch(0.09 0.03 270 / 0.98))",
            border: "1.5px solid oklch(0.78 0.17 60 / 0.45)",
            boxShadow:
              "0 0 30px oklch(0.78 0.17 60 / 0.2), 0 8px 32px oklch(0 0 0 / 0.6)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Level + Title */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div
                className="font-mono text-xs tracking-widest uppercase"
                style={{ color: "oklch(0.78 0.17 60 / 0.6)" }}
              >
                Level {levelInfo.level}
              </div>
              <div
                className="font-display font-black text-base"
                style={{ color: "oklch(0.78 0.17 60)" }}
              >
                {levelInfo.title}
              </div>
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-black text-lg"
              style={{
                background: "oklch(0.78 0.17 60 / 0.15)",
                border: "1.5px solid oklch(0.78 0.17 60 / 0.5)",
                color: "oklch(0.78 0.17 60)",
                boxShadow: "0 0 16px oklch(0.78 0.17 60 / 0.3)",
              }}
            >
              {levelInfo.level}
            </div>
          </div>

          {/* XP bar */}
          <XPProgressBar progress={levelInfo.progress} animated={false} />
          <div className="flex justify-between mt-1.5">
            <span
              className="font-mono text-xs"
              style={{ color: "oklch(0.78 0.17 60 / 0.5)" }}
            >
              {levelInfo.xpCurrent.toLocaleString()} XP
            </span>
            <span
              className="font-mono text-xs"
              style={{ color: "oklch(0.78 0.17 60 / 0.5)" }}
            >
              Next: {levelInfo.xpForNextLevel.toLocaleString()}
            </span>
          </div>

          {/* Quick stats */}
          <div className="mt-3 flex gap-2">
            <div
              className="flex-1 flex flex-col items-center py-2 rounded-lg"
              style={{ background: "oklch(0.78 0.17 60 / 0.06)" }}
            >
              <span className="text-sm">🔥</span>
              <span
                className="font-display font-black text-sm"
                style={{ color: "oklch(0.78 0.17 60)" }}
              >
                {profile.completedChallenges}
              </span>
              <span
                className="font-mono text-[10px] text-center"
                style={{ color: "oklch(0.78 0.17 60 / 0.5)" }}
              >
                Challenges
              </span>
            </div>
            <div
              className="flex-1 flex flex-col items-center py-2 rounded-lg"
              style={{ background: "oklch(0.78 0.17 60 / 0.06)" }}
            >
              <span className="text-sm">🏆</span>
              <span
                className="font-display font-black text-sm"
                style={{ color: "oklch(0.78 0.17 60)" }}
              >
                {profile.tournamentsWon}
              </span>
              <span
                className="font-mono text-[10px] text-center"
                style={{ color: "oklch(0.78 0.17 60 / 0.5)" }}
              >
                Wins
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Toggle button */}
      <motion.button
        type="button"
        data-ocid="xp.widget.toggle"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{
          background: expanded
            ? "linear-gradient(135deg, oklch(0.14 0.05 60 / 0.98), oklch(0.10 0.04 270 / 0.98))"
            : "linear-gradient(135deg, oklch(0.12 0.04 60 / 0.95), oklch(0.09 0.03 270 / 0.95))",
          border: "1.5px solid oklch(0.78 0.17 60 / 0.45)",
          boxShadow: "0 0 16px oklch(0.78 0.17 60 / 0.2)",
          backdropFilter: "blur(12px)",
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Toggle XP widget"
        aria-expanded={expanded}
      >
        {/* Level circle */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center font-display font-black text-sm shrink-0"
          style={{
            background: "oklch(0.78 0.17 60 / 0.2)",
            border: "1.5px solid oklch(0.78 0.17 60 / 0.6)",
            color: "oklch(0.78 0.17 60)",
            boxShadow: "0 0 10px oklch(0.78 0.17 60 / 0.3)",
          }}
        >
          {levelInfo.level}
        </div>

        {/* Mini XP bar */}
        <div className="flex flex-col gap-0.5 min-w-[60px]">
          <div className="flex items-center gap-1.5">
            <span
              className="font-mono text-xs font-bold leading-none"
              style={{ color: "oklch(0.78 0.17 60)" }}
            >
              {levelInfo.title}
            </span>
            {/* Badge count pill */}
            {(() => {
              const unlockedCount = getAchievements().filter(
                (a) => a.unlocked,
              ).length;
              if (unlockedCount === 0) return null;
              return (
                <span
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-mono text-[10px] font-bold leading-none"
                  style={{
                    background: "oklch(0.78 0.17 60 / 0.15)",
                    border: "1px solid oklch(0.78 0.17 60 / 0.4)",
                    color: "oklch(0.78 0.17 60)",
                  }}
                >
                  🏅 {unlockedCount}
                </span>
              );
            })()}
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "oklch(0.12 0.03 60 / 0.8)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${levelInfo.progress}%`,
                background:
                  "linear-gradient(90deg, oklch(0.82 0.18 200), oklch(0.78 0.17 60))",
                boxShadow: "0 0 4px oklch(0.78 0.17 60 / 0.5)",
              }}
            />
          </div>
        </div>

        <span
          className="font-mono text-xs"
          style={{ color: "oklch(0.78 0.17 60 / 0.6)" }}
        >
          {expanded ? "▼" : "▲"}
        </span>
      </motion.button>
    </div>
  );
}
