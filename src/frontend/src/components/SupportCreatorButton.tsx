import { Heart, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { playClick } from "../hooks/useSoundEffects";

const DONATION_OPTIONS = [
  {
    id: "coffee",
    label: "Buy Me a Coffee",
    amount: "₹49",
    icon: "☕",
    color: "oklch(0.75 0.2 60)",
    href: "https://buymeacoffee.com",
    cta: "Donate ☕",
  },
  {
    id: "boost",
    label: "Small Boost",
    amount: "₹99",
    icon: "⚡",
    color: "oklch(0.7 0.25 240)",
    upi: "divyansh@upi",
    cta: "Send ₹99",
  },
  {
    id: "big",
    label: "Big Support",
    amount: "₹249",
    icon: "🚀",
    color: "oklch(0.7 0.3 300)",
    upi: "divyansh@upi",
    cta: "Send ₹249",
  },
];

export default function SupportCreatorButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <motion.button
        type="button"
        data-ocid="support.open_modal_button"
        className="fixed bottom-36 right-4 sm:right-6 z-60 flex items-center gap-1.5 px-3 py-2.5 rounded-full font-bold text-xs"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.65 0.3 350), oklch(0.55 0.28 330))",
          border: "1.5px solid oklch(0.75 0.3 350 / 0.7)",
          color: "#fff",
          boxShadow: "0 0 20px oklch(0.65 0.3 350 / 0.5), 0 4px 16px black/0.4",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playClick();
          setOpen(true);
        }}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <Heart className="w-3.5 h-3.5" fill="currentColor" />
        <span className="hidden sm:inline">Support</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-ocid="support.dialog"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
              role="button"
              tabIndex={-1}
              aria-label="Close modal"
            />
            <motion.div
              className="relative rounded-2xl p-6 max-w-md w-full"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              style={{
                background: "oklch(0.09 0.03 270)",
                border: "2px solid oklch(0.65 0.3 350 / 0.6)",
                boxShadow:
                  "0 0 50px oklch(0.65 0.3 350 / 0.2), 0 20px 60px black/0.8",
              }}
            >
              <button
                type="button"
                data-ocid="support.close_button"
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: "oklch(0.15 0.04 270)",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <div className="text-4xl mb-2">❤️</div>
                <h3
                  className="text-xl font-black mb-2"
                  style={{ color: "oklch(0.97 0.02 240)" }}
                >
                  Support Divyansh Yadav
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Your support keeps this platform alive and growing!
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {DONATION_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    className="rounded-xl p-4 flex items-center gap-4"
                    style={{
                      background: `${opt.color}0f`,
                      border: `1.5px solid ${opt.color}44`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{
                        background: `${opt.color}18`,
                        border: `1px solid ${opt.color}33`,
                      }}
                    >
                      {opt.icon}
                    </div>
                    <div className="flex-1">
                      <div
                        className="font-bold text-sm"
                        style={{ color: "oklch(0.97 0.02 240)" }}
                      >
                        {opt.label}
                      </div>
                      {opt.upi && (
                        <div
                          className="text-xs mt-1 px-2 py-0.5 rounded font-mono inline-block"
                          style={{
                            background: `${opt.color}15`,
                            color: opt.color,
                            border: `1px solid ${opt.color}33`,
                          }}
                        >
                          UPI: {opt.upi}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className="text-lg font-black"
                        style={{ color: opt.color }}
                      >
                        {opt.amount}
                      </span>
                      {opt.href ? (
                        <a
                          href={opt.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-ocid="support.donate.button"
                          className="text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${opt.color}, oklch(0.65 0.3 300))`,
                            color: "#000",
                            boxShadow: `0 0 12px ${opt.color}55`,
                          }}
                        >
                          {opt.cta}
                        </a>
                      ) : (
                        <button
                          type="button"
                          data-ocid="support.donate.button"
                          className="text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95"
                          style={{
                            background: `linear-gradient(135deg, ${opt.color}, oklch(0.65 0.3 300))`,
                            color: "#000",
                            boxShadow: `0 0 12px ${opt.color}55`,
                          }}
                          onClick={() => playClick()}
                        >
                          {opt.cta}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
