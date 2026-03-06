import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { XPProfile } from "../hooks/useXPSystem";

interface XPToastItem {
  id: number;
  amount: number;
  reason: string;
  leveledUp: boolean;
  newLevel: number;
  newTitle: string;
}

let toastId = 0;

export default function XPToast() {
  const [toasts, setToasts] = useState<XPToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvt = e as CustomEvent<{
        amount: number;
        reason: string;
        newProfile: XPProfile;
        leveledUp: boolean;
        oldLevel: number;
      }>;

      const { amount, reason, newProfile, leveledUp } = customEvt.detail;

      const levelTitles: Record<string, string> = {
        Rookie: "Rookie",
        Warrior: "Warrior",
        Elite: "Elite",
        Champion: "Champion",
        Legend: "Legend",
        Grandmaster: "Grandmaster",
      };

      function getLevelTitle(level: number): string {
        if (level <= 4) return "Rookie";
        if (level <= 9) return "Warrior";
        if (level <= 14) return "Elite";
        if (level <= 19) return "Champion";
        if (level <= 24) return "Legend";
        return "Grandmaster";
      }

      const newToast: XPToastItem = {
        id: toastId++,
        amount,
        reason,
        leveledUp,
        newLevel: newProfile.level,
        newTitle: levelTitles[getLevelTitle(newProfile.level)] ?? "Rookie",
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss after 2.5s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 2500);
    };

    window.addEventListener("xp-awarded", handler);
    return () => window.removeEventListener("xp-awarded", handler);
  }, []);

  return (
    <div
      className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-label="XP notifications"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            data-ocid="xp.toast"
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="relative overflow-hidden rounded-lg px-4 py-3 min-w-[220px] max-w-[280px]"
            style={
              toast.leveledUp
                ? {
                    background:
                      "linear-gradient(135deg, oklch(0.12 0.05 60), oklch(0.10 0.04 50))",
                    border: "1.5px solid oklch(0.78 0.17 60 / 0.8)",
                    boxShadow:
                      "0 0 30px oklch(0.78 0.17 60 / 0.4), 0 8px 24px oklch(0 0 0 / 0.5)",
                  }
                : {
                    background:
                      "linear-gradient(135deg, oklch(0.11 0.03 60), oklch(0.09 0.02 55))",
                    border: "1px solid oklch(0.78 0.17 60 / 0.45)",
                    boxShadow:
                      "0 0 16px oklch(0.78 0.17 60 / 0.2), 0 4px 16px oklch(0 0 0 / 0.5)",
                  }
            }
          >
            {/* Shimmer line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.17 60 / 0.8), transparent)",
              }}
            />

            {toast.leveledUp ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <motion.span
                    className="text-lg"
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6 }}
                  >
                    🏆
                  </motion.span>
                  <span
                    className="font-display font-black text-sm tracking-widest uppercase"
                    style={{
                      color: "oklch(0.78 0.17 60)",
                      textShadow: "0 0 12px oklch(0.78 0.17 60 / 0.6)",
                    }}
                  >
                    LEVEL UP!
                  </span>
                </div>
                <p
                  className="font-display font-bold text-xs"
                  style={{ color: "oklch(0.95 0.05 60)" }}
                >
                  Level {toast.newLevel} — {toast.newTitle}
                </p>
                <p
                  className="font-mono text-xs"
                  style={{ color: "oklch(0.78 0.17 60 / 0.75)" }}
                >
                  +{toast.amount} XP · {toast.reason}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <motion.div
                  className="flex items-center justify-center w-8 h-8 rounded-full shrink-0"
                  style={{
                    background: "oklch(0.78 0.17 60 / 0.15)",
                    border: "1px solid oklch(0.78 0.17 60 / 0.5)",
                  }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 0.4 }}
                >
                  <span
                    className="font-mono font-black text-xs"
                    style={{ color: "oklch(0.78 0.17 60)" }}
                  >
                    ⭐
                  </span>
                </motion.div>
                <div className="flex flex-col gap-0.5">
                  <span
                    className="font-display font-black text-sm"
                    style={{ color: "oklch(0.78 0.17 60)" }}
                  >
                    +{toast.amount} XP
                  </span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: "oklch(0.85 0.08 60 / 0.7)" }}
                  >
                    {toast.reason}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
