import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Achievement } from "../hooks/useAchievements";
import type { XPProfile } from "../hooks/useXPSystem";

interface ToastItem {
  id: number;
  achievement: Achievement;
  profile: XPProfile;
}

interface AchievementUnlockedEvent extends Event {
  detail: { achievement: Achievement; profile: XPProfile };
}

const RARITY_COLORS: Record<string, string> = {
  common: "oklch(0.82 0.18 200)", // cyan
  rare: "oklch(0.62 0.22 295)", // violet
  epic: "oklch(0.68 0.25 340)", // pink/magenta
  legendary: "oklch(0.78 0.17 60)", // gold/amber
  secret: "oklch(0.60 0.25 305)", // deep purple
};

const RARITY_LABELS: Record<string, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
  secret: "Secret",
};

let toastCounter = 0;

export default function AchievementToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const evt = e as AchievementUnlockedEvent;
      const { achievement, profile } = evt.detail;
      const newToast: ToastItem = {
        id: ++toastCounter,
        achievement,
        profile,
      };
      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 4s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4000);
    };

    window.addEventListener("achievement-unlocked", handler);
    return () => window.removeEventListener("achievement-unlocked", handler);
  }, []);

  return (
    <div
      className="fixed top-20 right-4 z-[9998] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => {
          const color =
            RARITY_COLORS[toast.achievement.rarity] ?? RARITY_COLORS.common;
          const rarityLabel =
            RARITY_LABELS[toast.achievement.rarity] ?? "Common";

          return (
            <motion.div
              key={toast.id}
              data-ocid="achievement.toast"
              className="pointer-events-auto w-80 max-w-[calc(100vw-2rem)] rounded-xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.10 0.04 270 / 0.97), oklch(0.08 0.03 270 / 0.97))",
                border: `1.5px solid ${color.replace(")", " / 0.7)")}`,
                boxShadow: `0 0 24px ${color.replace(")", " / 0.35)")}, 0 8px 32px oklch(0 0 0 / 0.7)`,
                backdropFilter: "blur(16px)",
              }}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: 60,
                scale: 0.9,
                transition: { duration: 0.2 },
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            >
              {/* Top shimmer line */}
              <div
                className="h-0.5 w-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                }}
              />

              <div className="flex items-start gap-4 p-4">
                {/* Badge icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 relative"
                  style={{
                    background: `${color.replace(")", " / 0.12)")}`,
                    border: `1.5px solid ${color.replace(")", " / 0.4)")}`,
                    boxShadow: `0 0 20px ${color.replace(")", " / 0.3)")}`,
                  }}
                >
                  {toast.achievement.icon}

                  {/* Pulsing ring */}
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      border: `1px solid ${color.replace(")", " / 0.5)")}`,
                    }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-mono text-xs tracking-widest uppercase font-bold mb-1"
                    style={{ color: color }}
                  >
                    {toast.achievement.isSecret
                      ? "🔮 Secret Discovered!"
                      : "🏅 Achievement Unlocked!"}
                  </p>
                  <p
                    className="font-display font-black text-base leading-tight mb-1 truncate"
                    style={{
                      color: "oklch(0.97 0.02 60)",
                      textShadow: `0 0 12px ${color.replace(")", " / 0.4)")}`,
                    }}
                  >
                    {toast.achievement.name}
                  </p>
                  <p
                    className="font-body text-xs text-foreground/60 leading-relaxed mb-2"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {toast.achievement.description}
                  </p>
                  {/* Rarity chip */}
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase"
                    style={{
                      background: `${color.replace(")", " / 0.12)")}`,
                      border: `1px solid ${color.replace(")", " / 0.35)")}`,
                      color: color,
                    }}
                  >
                    {rarityLabel}
                  </span>
                </div>
              </div>

              {/* Progress bar (auto-dismiss timer) */}
              <div
                className="h-0.5 mx-4 mb-3 rounded-full overflow-hidden"
                style={{ background: `${color.replace(")", " / 0.15)")}` }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${color}, ${color.replace(")", " / 0.5)")})`,
                  }}
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 4, ease: "linear" }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
