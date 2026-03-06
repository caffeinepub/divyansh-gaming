import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  type AchievementCategory,
  type AchievementWithStatus,
  useAchievements,
} from "../hooks/useAchievements";

// ─── Rarity config ─────────────────────────────────────────────────────────
const RARITY_COLOR: Record<string, string> = {
  common: "oklch(0.82 0.18 200)", // cyan
  rare: "oklch(0.62 0.22 295)", // violet
  epic: "oklch(0.68 0.25 340)", // pink/magenta
  legendary: "oklch(0.78 0.17 60)", // gold/amber
  secret: "oklch(0.60 0.25 305)", // deep purple
};

const RARITY_LABEL: Record<string, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
  secret: "Secret",
};

const RARITY_ORDER: Record<string, number> = {
  common: 0,
  rare: 1,
  epic: 2,
  legendary: 3,
  secret: 4,
};

// ─── Filter tabs ─────────────────────────────────────────────────────────────
const FILTER_TABS: { label: string; value: AchievementCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Level", value: "level" },
  { label: "XP", value: "xp" },
  { label: "Challenge", value: "challenge" },
  { label: "Tournament", value: "tournament" },
  { label: "Social", value: "social" },
  { label: "🔮 Secret", value: "secret" },
];

// ─── Secret Mystery Card ────────────────────────────────────────────────────
function SecretMysteryCard({
  achievement,
  index,
}: {
  achievement: AchievementWithStatus;
  index: number;
}) {
  const secretColor = RARITY_COLOR.secret;

  return (
    <motion.div
      data-ocid={`achievements.secret.item.${index + 1}`}
      className="relative rounded-xl overflow-hidden cursor-default group"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.09 0.06 305 / 0.95), oklch(0.07 0.04 305 / 0.95))",
        border: `1.5px solid ${secretColor.replace(")", " / 0.45)")}`,
        boxShadow: `0 0 20px ${secretColor.replace(")", " / 0.12)")}, 0 4px 24px oklch(0 0 0 / 0.7)`,
        willChange: "transform",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
    >
      {/* Shimmer top line */}
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${secretColor}, transparent)`,
          animation: "shimmer-secret 3s ease-in-out infinite",
        }}
      />

      <div className="p-4 flex flex-col gap-3">
        {/* Icon + rarity */}
        <div className="relative flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 relative"
            style={{
              background: `${secretColor.replace(")", " / 0.12)")}`,
              border: `1.5px solid ${secretColor.replace(")", " / 0.35)")}`,
            }}
          >
            <motion.span
              animate={{
                filter: [
                  "drop-shadow(0 0 4px oklch(0.60 0.25 305 / 0.8))",
                  "drop-shadow(0 0 12px oklch(0.60 0.25 305 / 1))",
                  "drop-shadow(0 0 4px oklch(0.60 0.25 305 / 0.8))",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              🔮
            </motion.span>
          </div>

          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase ml-auto"
            style={{
              background: `${secretColor.replace(")", " / 0.15)")}`,
              border: `1px solid ${secretColor.replace(")", " / 0.45)")}`,
              color: secretColor,
              textShadow: `0 0 8px ${secretColor.replace(")", " / 0.6)")}`,
            }}
          >
            SECRET
          </span>
        </div>

        {/* Name — glitch style */}
        <h3
          className="font-display font-black text-sm leading-tight"
          style={{
            color: secretColor,
            textShadow: `0 0 10px ${secretColor.replace(")", " / 0.5)")}`,
            filter: "blur(0.3px)",
            letterSpacing: "0.05em",
          }}
        >
          {achievement.name}
        </h3>

        {/* Cryptic hint */}
        <p
          className="font-body text-xs leading-relaxed"
          style={{
            color: `${secretColor.replace(")", " / 0.65)")}`,
            fontStyle: "italic",
          }}
        >
          {achievement.description}
        </p>

        {/* Locked hint */}
        <div
          className="flex items-center gap-1.5 pt-2"
          style={{
            borderTop: `1px solid ${secretColor.replace(")", " / 0.15)")}`,
          }}
        >
          <span
            className="font-mono text-xs"
            style={{ color: `${secretColor.replace(")", " / 0.5)")}` }}
          >
            🔮 Discover to unlock
          </span>
        </div>
      </div>

      {/* Animated shimmer overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background: `linear-gradient(135deg, transparent 30%, ${secretColor.replace(")", " / 0.06)")} 50%, transparent 70%)`,
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          repeatDelay: 2,
        }}
      />
    </motion.div>
  );
}

// ─── Unlocked Secret Card ───────────────────────────────────────────────────
function UnlockedSecretCard({
  achievement,
  index,
}: {
  achievement: AchievementWithStatus;
  index: number;
}) {
  const cardRef = { current: null as HTMLDivElement | null };
  const goldColor = "oklch(0.78 0.17 60)";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(600px) rotateX(${dy * -7}deg) rotateY(${dx * 7}deg) translateY(-4px) scale(1.02)`;
    card.style.transition = "transform 0.05s ease";
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform =
      "perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
    card.style.transition = "transform 0.4s ease";
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <motion.div
      ref={(el) => {
        cardRef.current = el;
      }}
      data-ocid={`achievements.secret.item.${index + 1}`}
      className="relative rounded-xl overflow-hidden cursor-pointer group"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.13 0.08 60 / 0.95), oklch(0.09 0.05 305 / 0.95))",
        border: `1.5px solid ${goldColor.replace(")", " / 0.7)")}`,
        boxShadow: `0 0 28px ${goldColor.replace(")", " / 0.25)")}, 0 0 8px oklch(0.60 0.25 305 / 0.15), 0 4px 24px oklch(0 0 0 / 0.6)`,
        willChange: "transform",
      }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gold top line */}
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${goldColor}, oklch(0.60 0.25 305), ${goldColor}, transparent)`,
        }}
      />

      {/* SECRET UNLOCKED badge */}
      <div
        className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-black tracking-widest uppercase z-10"
        style={{
          background: `${goldColor.replace(")", " / 0.2)")}`,
          border: `1px solid ${goldColor.replace(")", " / 0.6)")}`,
          color: goldColor,
          textShadow: `0 0 8px ${goldColor.replace(")", " / 0.8)")}`,
        }}
      >
        ✦ SECRET UNLOCKED
      </div>

      <div className="p-4 flex flex-col gap-3 pt-3">
        {/* Icon + rarity */}
        <div className="relative flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{
              background: `${goldColor.replace(")", " / 0.15)")}`,
              border: `1.5px solid ${goldColor.replace(")", " / 0.5)")}`,
              boxShadow: `0 0 16px ${goldColor.replace(")", " / 0.3)")}`,
            }}
          >
            {achievement.icon}
          </div>

          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase ml-auto"
            style={{
              background: `${goldColor.replace(")", " / 0.12)")}`,
              border: `1px solid ${goldColor.replace(")", " / 0.45)")}`,
              color: goldColor,
            }}
          >
            {RARITY_LABEL[achievement.rarity] ?? achievement.rarity}
          </span>
        </div>

        <h3
          className="font-display font-black text-sm leading-tight"
          style={{
            color: goldColor,
            textShadow: `0 0 10px ${goldColor.replace(")", " / 0.4)")}`,
          }}
        >
          {achievement.name}
        </h3>

        <p
          className="font-body text-xs leading-relaxed"
          style={{ color: "oklch(0.75 0.05 60)" }}
        >
          {achievement.description}
        </p>

        {achievement.unlockedAt && (
          <div
            className="flex items-center gap-1.5 pt-2"
            style={{
              borderTop: `1px solid ${goldColor.replace(")", " / 0.15)")}`,
            }}
          >
            <span
              className="font-mono text-xs"
              style={{ color: `${goldColor.replace(")", " / 0.6)")}` }}
            >
              ✓ Discovered {formatDate(achievement.unlockedAt)}
            </span>
          </div>
        )}
      </div>

      <div
        className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at top right, ${goldColor.replace(")", " / 0.12)")}, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}

// ─── Single achievement card ───────────────────────────────────────────────
function AchievementCard({
  achievement,
  index,
}: {
  achievement: AchievementWithStatus;
  index: number;
}) {
  // Route secret achievements to appropriate card type
  if (achievement.isSecret) {
    if (!achievement.unlocked) {
      return <SecretMysteryCard achievement={achievement} index={index} />;
    }
    return <UnlockedSecretCard achievement={achievement} index={index} />;
  }

  const color = RARITY_COLOR[achievement.rarity] ?? RARITY_COLOR.common;
  const rarityLabel = RARITY_LABEL[achievement.rarity] ?? "Common";

  const cardRef = { current: null as HTMLDivElement | null };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(600px) rotateX(${dy * -7}deg) rotateY(${dx * 7}deg) translateY(-4px) scale(1.02)`;
    card.style.transition = "transform 0.05s ease";
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform =
      "perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
    card.style.transition = "transform 0.4s ease";
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <motion.div
      ref={(el) => {
        cardRef.current = el;
      }}
      data-ocid={`achievements.item.${index + 1}`}
      className="relative rounded-xl overflow-hidden cursor-pointer group"
      style={{
        background: achievement.unlocked
          ? "linear-gradient(135deg, oklch(0.11 0.04 270 / 0.95), oklch(0.09 0.03 270 / 0.95))"
          : "oklch(0.09 0.02 270 / 0.7)",
        border: achievement.unlocked
          ? `1.5px solid ${color.replace(")", " / 0.6)")}`
          : "1.5px solid oklch(0.20 0.03 270 / 0.6)",
        boxShadow: achievement.unlocked
          ? `0 0 20px ${color.replace(")", " / 0.15)")}, 0 4px 24px oklch(0 0 0 / 0.6)`
          : "0 4px 16px oklch(0 0 0 / 0.5)",
        opacity: achievement.unlocked ? 1 : 0.45,
        willChange: "transform",
        filter: achievement.unlocked ? "none" : "grayscale(0.8)",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: achievement.unlocked ? 1 : 0.45, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
      onMouseMove={achievement.unlocked ? handleMouseMove : undefined}
      onMouseLeave={achievement.unlocked ? handleMouseLeave : undefined}
    >
      {/* Rarity top glow line */}
      {achievement.unlocked && (
        <div
          className="h-0.5 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          }}
        />
      )}

      <div className="p-4 flex flex-col gap-3">
        {/* Icon + lock overlay */}
        <div className="relative flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 relative"
            style={{
              background: achievement.unlocked
                ? `${color.replace(")", " / 0.15)")}`
                : "oklch(0.14 0.02 270 / 0.8)",
              border: achievement.unlocked
                ? `1.5px solid ${color.replace(")", " / 0.4)")}`
                : "1.5px solid oklch(0.20 0.03 270 / 0.4)",
              boxShadow: achievement.unlocked
                ? `0 0 16px ${color.replace(")", " / 0.25)")}`
                : "none",
            }}
          >
            {achievement.unlocked ? (
              achievement.icon
            ) : (
              <span className="text-xl">🔒</span>
            )}
          </div>

          {/* Rarity chip */}
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase ml-auto"
            style={
              achievement.unlocked
                ? {
                    background: `${color.replace(")", " / 0.12)")}`,
                    border: `1px solid ${color.replace(")", " / 0.35)")}`,
                    color: color,
                  }
                : {
                    background: "oklch(0.14 0.02 270 / 0.6)",
                    border: "1px solid oklch(0.20 0.03 270 / 0.4)",
                    color: "oklch(0.40 0.03 270)",
                  }
            }
          >
            {rarityLabel}
          </span>
        </div>

        {/* Name */}
        <h3
          className="font-display font-black text-sm leading-tight"
          style={{
            color: achievement.unlocked
              ? "oklch(0.97 0.02 60)"
              : "oklch(0.50 0.03 270)",
            textShadow: achievement.unlocked
              ? `0 0 10px ${color.replace(")", " / 0.3)")}`
              : "none",
          }}
        >
          {achievement.name}
        </h3>

        {/* Description */}
        <p
          className="font-body text-xs leading-relaxed"
          style={{
            color: achievement.unlocked
              ? "oklch(0.75 0.03 270)"
              : "oklch(0.40 0.03 270)",
          }}
        >
          {achievement.description}
        </p>

        {/* Unlock date / locked hint */}
        {achievement.unlocked && achievement.unlockedAt ? (
          <div
            className="flex items-center gap-1.5 pt-2"
            style={{
              borderTop: `1px solid ${color.replace(")", " / 0.12)")}`,
            }}
          >
            <span
              className="font-mono text-xs"
              style={{ color: `${color.replace(")", " / 0.6)")}` }}
            >
              ✓ Unlocked {formatDate(achievement.unlockedAt)}
            </span>
          </div>
        ) : !achievement.unlocked ? (
          <div
            className="flex items-center gap-1.5 pt-2"
            style={{
              borderTop: "1px solid oklch(0.16 0.02 270 / 0.5)",
            }}
          >
            <span
              className="font-mono text-xs"
              style={{ color: "oklch(0.38 0.03 270)" }}
            >
              🔒 Locked — {achievement.description}
            </span>
          </div>
        ) : null}
      </div>

      {/* Hover glow corner (unlocked only) */}
      {achievement.unlocked && (
        <div
          className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at top right, ${color.replace(")", " / 0.12)")}, transparent 70%)`,
          }}
        />
      )}
    </motion.div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function AchievementsSection() {
  const { achievements, unlockedCount, totalCount } = useAchievements();
  const [activeFilter, setActiveFilter] = useState<AchievementCategory | "all">(
    "all",
  );
  const [, forceUpdate] = useState(0);

  // Re-render on achievement-unlocked
  useEffect(() => {
    const handler = () => forceUpdate((n) => n + 1);
    window.addEventListener("achievement-unlocked", handler);
    return () => window.removeEventListener("achievement-unlocked", handler);
  }, []);

  const filtered = achievements
    .filter((a) => activeFilter === "all" || a.category === activeFilter)
    .sort((a, b) => {
      // Unlocked first, then by rarity desc
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      return (RARITY_ORDER[b.rarity] ?? 0) - (RARITY_ORDER[a.rarity] ?? 0);
    });

  const progressPct = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <section
      id="achievements"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(0.08 0.025 280 / 0.85)" }}
    >
      {/* Background glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-72 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.17 60) 0%, oklch(0.62 0.22 295) 50%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-8"
        style={{ background: "oklch(0.68 0.25 340)" }}
      />
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-6"
        style={{ background: "oklch(0.82 0.18 200)" }}
      />

      <div className="container px-4 md:px-6 relative z-10">
        {/* Section header */}
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
              background: "oklch(0.78 0.17 60 / 0.1)",
              border: "1px solid oklch(0.78 0.17 60 / 0.4)",
              color: "oklch(0.78 0.17 60)",
            }}
          >
            🏅 Hall of Badges
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-foreground mb-4">
            Achievements &{" "}
            <span
              style={{
                color: "oklch(0.78 0.17 60)",
                textShadow: "0 0 24px oklch(0.78 0.17 60 / 0.45)",
              }}
            >
              Badges
            </span>
          </h2>
          <p className="font-body text-foreground/50 max-w-xl mx-auto">
            Unlock badges by leveling up, earning XP, completing challenges, and
            winning tournaments. Collect them all!
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: "oklch(0.78 0.17 60 / 0.7)" }}
            >
              Progress
            </span>
            <span
              className="font-display font-black text-lg"
              style={{ color: "oklch(0.78 0.17 60)" }}
              data-ocid="achievements.progress.panel"
            >
              {unlockedCount}{" "}
              <span
                className="font-mono text-xs font-normal"
                style={{ color: "oklch(0.78 0.17 60 / 0.5)" }}
              >
                / {totalCount} Unlocked
              </span>
            </span>
          </div>
          <div
            className="w-full h-2.5 rounded-full overflow-hidden"
            style={{
              background: "oklch(0.10 0.03 270 / 0.8)",
              border: "1px solid oklch(0.78 0.17 60 / 0.2)",
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.82 0.18 200), oklch(0.78 0.17 60))",
                boxShadow:
                  "0 0 8px oklch(0.78 0.17 60 / 0.6), 0 0 16px oklch(0.78 0.17 60 / 0.3)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            />
          </div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                data-ocid={`achievements.${tab.value}.tab`}
                className="px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-200"
                style={
                  isActive
                    ? {
                        background: "oklch(0.78 0.17 60 / 0.18)",
                        border: "1.5px solid oklch(0.78 0.17 60 / 0.8)",
                        color: "oklch(0.78 0.17 60)",
                        boxShadow: "0 0 12px oklch(0.78 0.17 60 / 0.25)",
                      }
                    : {
                        background: "transparent",
                        border: "1.5px solid oklch(0.20 0.03 270 / 0.6)",
                        color: "oklch(0.50 0.03 270)",
                      }
                }
                onClick={() => setActiveFilter(tab.value)}
              >
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Achievements grid */}
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center gap-3 py-16"
            data-ocid="achievements.empty_state"
          >
            <span className="text-4xl">🏅</span>
            <p
              className="font-mono text-sm"
              style={{ color: "oklch(0.40 0.03 270)" }}
            >
              No achievements in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((a, idx) => (
              <AchievementCard key={a.id} achievement={a} index={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
