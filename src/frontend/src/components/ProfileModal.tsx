import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { LANGUAGES, useLanguage } from "../contexts/LanguageContext";
import { AVATARS_LIST, useProfile } from "../hooks/useProfile";
import { playClick } from "../hooks/useSoundEffects";
import { getProfile } from "../hooks/useXPSystem";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProfileModal({ open, onClose }: Props) {
  const { t, language, setLanguage } = useLanguage();
  const {
    profile,
    updateProfile,
    resetProgress,
    clearProfile,
    scoresSubmitted,
    achievementsUnlocked,
  } = useProfile();
  const [editName, setEditName] = useState(profile?.username || "");
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setEditName(profile?.username || "");
  }, [profile?.username]);

  useEffect(() => {
    if (open) {
      setConfirmReset(false);
      setConfirmClear(false);
      setSaved(false);
    }
  }, [open]);

  const xpProfile = getProfile();

  const handleSaveName = () => {
    playClick();
    if (editName.trim()) {
      updateProfile({ username: editName.trim(), accountType: "player" });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    playClick();
    resetProgress();
    setConfirmReset(false);
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    playClick();
    clearProfile();
    onClose();
  };

  if (!profile) return null;

  const isGuest = profile.accountType === "guest";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          data-ocid="profile.modal"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg rounded-2xl border border-cyan-400/40 overflow-hidden"
            style={{
              background: "oklch(0.09 0.015 270)",
              boxShadow:
                "0 0 60px oklch(var(--neon-cyan) / 0.2), 0 0 120px oklch(var(--neon-cyan) / 0.08), inset 0 1px 0 oklch(var(--neon-cyan) / 0.12)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {/* Header */}
            <div
              className="relative px-6 pt-8 pb-6 text-center"
              style={{
                background:
                  "linear-gradient(180deg, oklch(var(--neon-cyan) / 0.08) 0%, transparent 100%)",
              }}
            >
              <button
                type="button"
                data-ocid="profile.close_button"
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="absolute top-4 right-4 p-2 rounded-full text-foreground/50 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-6xl mb-3">{profile.avatar}</div>
              <h2
                className="text-xl font-display font-extrabold tracking-wider mb-2"
                style={{
                  color: "oklch(var(--neon-cyan))",
                  textShadow: "0 0 15px oklch(var(--neon-cyan) / 0.5)",
                }}
              >
                {profile.username}
              </h2>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                  isGuest
                    ? "bg-gray-700/60 text-gray-400 border border-gray-600"
                    : "border border-cyan-400/60 text-cyan-300"
                }`}
                style={
                  !isGuest
                    ? {
                        background: "oklch(var(--neon-cyan) / 0.12)",
                        boxShadow: "0 0 10px oklch(var(--neon-cyan) / 0.2)",
                      }
                    : {}
                }
              >
                {isGuest ? t.profile.guest : t.profile.player}
              </span>

              {isGuest && (
                <div className="mt-4">
                  <button
                    type="button"
                    data-ocid="profile.upgrade.button"
                    onClick={() => {
                      playClick();
                      updateProfile({ accountType: "player" });
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-900 transition-all hover:opacity-90"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(var(--neon-cyan)), oklch(var(--neon-violet)))",
                      boxShadow: "0 0 15px oklch(var(--neon-cyan) / 0.3)",
                    }}
                  >
                    {t.profile.upgradeProfile}
                  </button>
                </div>
              )}
            </div>

            {/* Stats Row */}
            <div
              className="grid grid-cols-3 gap-px mx-6 mb-6"
              style={{ background: "oklch(var(--neon-cyan) / 0.1)" }}
            >
              {[
                { label: t.profile.xpLevel, value: `Lv.${xpProfile.level}` },
                { label: t.profile.scoresSubmitted, value: scoresSubmitted },
                {
                  label: t.profile.achievementsUnlocked,
                  value: achievementsUnlocked,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="py-4 text-center"
                  style={{ background: "oklch(0.09 0.015 270)" }}
                >
                  <div
                    className="text-xl font-extrabold font-display"
                    style={{ color: "oklch(var(--neon-cyan))" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-foreground/40 uppercase tracking-wider mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Name */}
            <div className="px-6 mb-5">
              <label
                htmlFor="pm-display-name"
                className="block text-xs text-foreground/50 uppercase tracking-wider mb-2"
              >
                {t.profile.displayName}
              </label>
              <div className="flex gap-2">
                <input
                  id="pm-display-name"
                  data-ocid="profile.name.input"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 bg-gray-900/60 border border-cyan-400/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-400/70 transition-colors"
                />
                <button
                  type="button"
                  data-ocid="profile.save.button"
                  onClick={handleSaveName}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: saved
                      ? "oklch(0.55 0.18 145)"
                      : "oklch(var(--neon-cyan) / 0.2)",
                    border: "1px solid oklch(var(--neon-cyan) / 0.5)",
                    color: "oklch(var(--neon-cyan))",
                  }}
                >
                  {saved ? "✓" : t.profile.saveChanges}
                </button>
              </div>
            </div>

            {/* Avatar Picker */}
            <div className="px-6 mb-5">
              <p className="block text-xs text-foreground/50 uppercase tracking-wider mb-2">
                {t.profile.pickAvatar}
              </p>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS_LIST.map((em) => (
                  <button
                    key={em}
                    type="button"
                    aria-label={`Avatar ${em}`}
                    onClick={() => {
                      playClick();
                      updateProfile({ avatar: em });
                    }}
                    className={`text-2xl p-2 rounded-lg transition-all ${
                      profile.avatar === em
                        ? "bg-cyan-400/20 border border-cyan-400/60 scale-110"
                        : "hover:bg-gray-800 border border-transparent"
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="px-6 mb-6">
              <p className="block text-xs text-foreground/50 uppercase tracking-wider mb-2">
                {t.profile.language}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    data-ocid={`profile.language.${lang.code}.button`}
                    onClick={() => {
                      playClick();
                      setLanguage(lang.code);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border ${
                      language === lang.code
                        ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-300"
                        : "border-transparent bg-gray-800/60 text-foreground/60 hover:border-cyan-400/30 hover:text-cyan-300"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span className="truncate">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div
              className="mx-6 mb-6 rounded-xl border border-red-500/20 p-4"
              style={{ background: "oklch(0.12 0.02 25 / 0.5)" }}
            >
              <div className="text-xs text-red-400/70 uppercase tracking-wider mb-3 font-semibold">
                Danger Zone
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  data-ocid="profile.reset.button"
                  onClick={handleReset}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                    confirmReset
                      ? "bg-orange-500/20 border-orange-500/60 text-orange-300"
                      : "border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                  }`}
                >
                  {confirmReset
                    ? t.profile.confirmReset
                    : t.profile.resetProgress}
                </button>
                <button
                  type="button"
                  data-ocid="profile.clear.button"
                  onClick={handleClear}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                    confirmClear
                      ? "bg-red-500/30 border-red-500/70 text-red-200"
                      : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                  }`}
                >
                  {confirmClear
                    ? t.profile.confirmClear
                    : t.profile.clearProfile}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
