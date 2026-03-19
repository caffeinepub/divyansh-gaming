import { motion } from "motion/react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { AVATARS_LIST, useProfile } from "../hooks/useProfile";
import { playClick } from "../hooks/useSoundEffects";

export default function GuestPrompt({ onDismiss }: { onDismiss: () => void }) {
  const { t } = useLanguage();
  const { setupGuest, setupPlayer } = useProfile();
  const [mode, setMode] = useState<"choice" | "setup">("choice");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🎮");

  const handleGuest = () => {
    playClick();
    setupGuest();
    onDismiss();
  };

  const handleSetup = () => {
    playClick();
    if (mode === "choice") {
      setMode("setup");
    } else {
      setupPlayer(name, avatar);
      onDismiss();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl border border-cyan-400/40 p-8 relative overflow-hidden"
        style={{
          background: "oklch(0.09 0.015 270)",
          boxShadow:
            "0 0 60px oklch(var(--neon-cyan) / 0.25), 0 0 120px oklch(var(--neon-cyan) / 0.1), inset 0 1px 0 oklch(var(--neon-cyan) / 0.15)",
        }}
        data-ocid="guest_prompt.modal"
      >
        {/* Glow accent */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: "oklch(var(--neon-cyan) / 0.08)" }}
        />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎮</div>
          <h2
            className="text-2xl font-display font-extrabold tracking-wider mb-2"
            style={{
              color: "oklch(var(--neon-cyan))",
              textShadow: "0 0 20px oklch(var(--neon-cyan) / 0.6)",
            }}
          >
            {t.welcome.title}
          </h2>
          <p className="text-foreground/50 text-sm">{t.welcome.subtitle}</p>
        </div>

        {mode === "choice" ? (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              data-ocid="guest_prompt.continue_as_guest.button"
              onClick={handleGuest}
              className="w-full py-3.5 rounded-xl border border-cyan-400/40 text-cyan-300 font-semibold text-base hover:bg-cyan-400/10 hover:border-cyan-400/70 transition-all duration-200 tracking-wide"
            >
              {t.welcome.continueAsGuest}
            </button>
            <button
              type="button"
              data-ocid="guest_prompt.setup_profile.button"
              onClick={handleSetup}
              className="w-full py-3.5 rounded-xl font-semibold text-base tracking-wide transition-all duration-200 text-gray-900 hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--neon-cyan)), oklch(var(--neon-violet)))",
                boxShadow: "0 0 20px oklch(var(--neon-cyan) / 0.4)",
              }}
            >
              {t.welcome.setupProfile}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="gp-name"
                className="block text-xs text-foreground/50 uppercase tracking-wider mb-2"
              >
                {t.welcome.yourName}
              </label>
              <input
                id="gp-name"
                data-ocid="guest_prompt.name.input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full bg-gray-900/60 border border-cyan-400/30 rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-cyan-400/70 transition-colors"
              />
            </div>
            <div>
              <p className="block text-xs text-foreground/50 uppercase tracking-wider mb-2">
                {t.welcome.pickAvatar}
              </p>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS_LIST.map((em) => (
                  <button
                    key={em}
                    type="button"
                    aria-label={`Avatar ${em}`}
                    onClick={() => {
                      playClick();
                      setAvatar(em);
                    }}
                    className={`text-2xl p-2 rounded-lg transition-all duration-150 ${
                      avatar === em
                        ? "bg-cyan-400/20 border border-cyan-400/60 scale-110"
                        : "hover:bg-gray-800 border border-transparent"
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              data-ocid="guest_prompt.lets_play.button"
              onClick={handleSetup}
              className="w-full py-3.5 rounded-xl font-semibold text-base tracking-wide transition-all duration-200 text-gray-900 hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--neon-cyan)), oklch(var(--neon-violet)))",
                boxShadow: "0 0 20px oklch(var(--neon-cyan) / 0.4)",
              }}
            >
              {t.welcome.letsPlay}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
