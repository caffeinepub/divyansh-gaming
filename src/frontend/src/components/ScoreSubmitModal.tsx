import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Loader2, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { LeaderboardEntry } from "../backend.d";
import { useSubmitScore } from "../hooks/useQueries";

export interface ScoreSubmitModalProps {
  open: boolean;
  onClose: () => void;
  defaultScore?: number;
  defaultGame?: string;
  onSuccess?: (updatedLeaderboard: LeaderboardEntry[]) => void;
}

const GAME_OPTIONS = [
  "Car Racing",
  "Space Shooter 3D",
  "Snake",
  "Brick Breaker",
  "Flappy Bird",
  "Whack-A-Mole",
  "Memory Match",
  "Reaction Test",
  "Typing Test",
  "Asteroid Shooter",
  "Pong",
  "Color Match",
];

const AVATAR_OPTIONS = [
  "🎮",
  "🕹️",
  "🚀",
  "⚔️",
  "🛡️",
  "🎯",
  "🏆",
  "👾",
  "🤖",
  "🐉",
  "💥",
  "⚡",
];

export default function ScoreSubmitModal({
  open,
  onClose,
  defaultScore,
  defaultGame,
  onSuccess,
}: ScoreSubmitModalProps) {
  const [playerName, setPlayerName] = useState(
    () => localStorage.getItem("dg_player_name") ?? "",
  );
  const [avatar, setAvatar] = useState(
    () => localStorage.getItem("dg_player_avatar") ?? "🎮",
  );
  const [score, setScore] = useState<number>(defaultScore ?? 0);
  const [gameName, setGameName] = useState<string>(defaultGame ?? "");
  const [submittedRank, setSubmittedRank] = useState<number | null>(null);

  const { mutate, isPending, isError, error, reset } = useSubmitScore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !gameName) return;
    mutate(
      { playerName: playerName.trim(), score, gameName, avatar },
      {
        onSuccess: (updatedLB) => {
          const myEntry = updatedLB.find(
            (e) => e.playerName === playerName.trim(),
          );
          setSubmittedRank(myEntry ? Number(myEntry.rank) : null);
          localStorage.setItem("dg_player_name", playerName.trim());
          localStorage.setItem("dg_player_avatar", avatar);
          onSuccess?.(updatedLB);
        },
      },
    );
  };

  const handleClose = () => {
    onClose();
    // Reset state after close animation
    setTimeout(() => {
      setPlayerName(localStorage.getItem("dg_player_name") ?? "");
      setAvatar(localStorage.getItem("dg_player_avatar") ?? "🎮");
      setScore(defaultScore ?? 0);
      setGameName(defaultGame ?? "");
      setSubmittedRank(null);
      reset();
    }, 300);
  };

  const isScorePreset = defaultScore !== undefined;
  const isGamePreset = defaultGame !== undefined;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="p-0 overflow-hidden max-w-md w-full"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.09 0.025 270), oklch(0.07 0.02 240))",
          border: "1.5px solid oklch(0.82 0.18 200 / 0.3)",
          boxShadow:
            "0 0 0 1px oklch(0.82 0.18 200 / 0.1), 0 0 60px oklch(0.82 0.18 200 / 0.12), 0 32px 80px oklch(0 0 0 / 0.7)",
        }}
      >
        {/* Glow orb */}
        <div
          className="absolute top-0 right-0 w-56 h-56 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.82 0.18 200 / 0.08) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "oklch(0.82 0.18 200 / 0.12)",
                border: "1px solid oklch(0.82 0.18 200 / 0.35)",
                boxShadow: "0 0 16px oklch(0.82 0.18 200 / 0.25)",
              }}
            >
              <Trophy
                className="w-5 h-5"
                style={{ color: "oklch(0.82 0.18 200)" }}
              />
            </div>
            <DialogTitle
              className="font-display font-black text-xl tracking-wide"
              style={{ color: "oklch(0.96 0.03 220)" }}
            >
              Post Your Score
            </DialogTitle>
          </div>
          <p
            className="font-body text-sm ml-13"
            style={{ color: "oklch(0.96 0.03 220 / 0.45)" }}
          >
            Claim your rank on the global leaderboard
          </p>
        </DialogHeader>

        <div className="px-6 py-5">
          <AnimatePresence mode="wait">
            {submittedRank !== null ? (
              /* ── Success state ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col items-center text-center gap-5 py-4"
                data-ocid="score_submit.success_state"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 18,
                    delay: 0.1,
                  }}
                >
                  <CheckCircle
                    className="w-14 h-14"
                    style={{ color: "oklch(0.82 0.18 200)" }}
                  />
                </motion.div>
                <div>
                  <p
                    className="font-display font-black text-3xl mb-1"
                    style={{ color: "oklch(0.82 0.18 200)" }}
                  >
                    Rank #{submittedRank}
                  </p>
                  <p
                    className="font-body text-sm"
                    style={{ color: "oklch(0.96 0.03 220 / 0.55)" }}
                  >
                    <span
                      className="font-bold"
                      style={{ color: "oklch(0.96 0.03 220 / 0.85)" }}
                    >
                      {avatar} {playerName}
                    </span>{" "}
                    is now on the leaderboard!
                  </p>
                </div>
                <div className="flex gap-3 w-full">
                  {/* biome-ignore lint/a11y/useValidAnchor: hash anchor navigates to section */}
                  <a
                    href="#leaderboard"
                    onClick={handleClose}
                    className="flex-1 py-2.5 rounded text-sm font-display font-bold tracking-widest uppercase text-center transition-all duration-200"
                    style={{
                      background: "oklch(0.82 0.18 200 / 0.12)",
                      border: "1px solid oklch(0.82 0.18 200 / 0.4)",
                      color: "oklch(0.82 0.18 200)",
                      boxShadow: "0 0 16px oklch(0.82 0.18 200 / 0.15)",
                    }}
                  >
                    View Leaderboard
                  </a>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-2.5 rounded text-sm font-display font-bold tracking-widest uppercase transition-all duration-200"
                    style={{
                      background: "oklch(0.15 0.02 270)",
                      border: "1px solid oklch(0.25 0.03 270)",
                      color: "oklch(0.96 0.03 220 / 0.5)",
                    }}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ── Form state ── */
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                {/* Avatar Picker */}
                <div className="flex flex-col gap-2">
                  <span
                    className="font-mono text-xs tracking-widest uppercase"
                    style={{ color: "oklch(0.82 0.18 200 / 0.7)" }}
                  >
                    Choose Avatar
                  </span>
                  <div
                    className="grid grid-cols-6 gap-2"
                    data-ocid="score_submit.avatar_picker"
                  >
                    {AVATAR_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setAvatar(emoji)}
                        aria-label={`Select avatar ${emoji}`}
                        aria-pressed={avatar === emoji}
                        className="flex items-center justify-center rounded-lg text-xl transition-all duration-150 select-none"
                        style={{
                          width: "40px",
                          height: "40px",
                          lineHeight: 1,
                          background:
                            avatar === emoji
                              ? "oklch(0.82 0.18 200 / 0.18)"
                              : "oklch(0.12 0.02 270)",
                          border:
                            avatar === emoji
                              ? "1.5px solid oklch(0.82 0.18 200 / 0.7)"
                              : "1px solid oklch(0.82 0.18 200 / 0.2)",
                          boxShadow:
                            avatar === emoji
                              ? "0 0 10px oklch(0.82 0.18 200 / 0.3)"
                              : "none",
                          transform:
                            avatar === emoji ? "scale(1.1)" : "scale(1)",
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Player Name */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="player-name-modal"
                    className="font-mono text-xs tracking-widest uppercase"
                    style={{ color: "oklch(0.82 0.18 200 / 0.7)" }}
                  >
                    Player Name
                  </label>
                  <input
                    id="player-name-modal"
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value.slice(0, 20))}
                    placeholder="Enter your name..."
                    maxLength={20}
                    required
                    autoComplete="off"
                    data-ocid="score_submit.input"
                    className="w-full px-4 py-2.5 rounded text-sm font-body outline-none transition-all duration-200"
                    style={{
                      background: "oklch(0.12 0.02 270)",
                      border: "1px solid oklch(0.82 0.18 200 / 0.25)",
                      color: "oklch(0.96 0.03 220)",
                      caretColor: "oklch(0.82 0.18 200)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "oklch(0.82 0.18 200 / 0.6)";
                      e.currentTarget.style.boxShadow =
                        "0 0 12px oklch(0.82 0.18 200 / 0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        "oklch(0.82 0.18 200 / 0.25)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  <span
                    className="font-mono text-xs text-right"
                    style={{ color: "oklch(0.96 0.03 220 / 0.3)" }}
                  >
                    {playerName.length}/20
                  </span>
                </div>

                {/* Score */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="score-modal"
                    className="font-mono text-xs tracking-widest uppercase"
                    style={{ color: "oklch(0.82 0.18 200 / 0.7)" }}
                  >
                    Score
                  </label>
                  <input
                    id="score-modal"
                    type="number"
                    value={score}
                    onChange={(e) =>
                      !isScorePreset && setScore(Number(e.target.value))
                    }
                    disabled={isScorePreset}
                    min={0}
                    required
                    data-ocid="score_submit.score_input"
                    className="w-full px-4 py-2.5 rounded text-sm font-mono font-bold outline-none transition-all duration-200"
                    style={{
                      background: isScorePreset
                        ? "oklch(0.1 0.015 270)"
                        : "oklch(0.12 0.02 270)",
                      border: "1px solid oklch(0.82 0.18 200 / 0.2)",
                      color: isScorePreset
                        ? "oklch(0.82 0.18 200 / 0.7)"
                        : "oklch(0.82 0.18 200)",
                      cursor: isScorePreset ? "not-allowed" : "text",
                    }}
                  />
                </div>

                {/* Game */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="game-modal"
                    className="font-mono text-xs tracking-widest uppercase"
                    style={{ color: "oklch(0.82 0.18 200 / 0.7)" }}
                  >
                    Game
                  </label>
                  <select
                    id="game-modal"
                    value={gameName}
                    onChange={(e) =>
                      !isGamePreset && setGameName(e.target.value)
                    }
                    disabled={isGamePreset}
                    required
                    data-ocid="score_submit.select"
                    className="w-full px-4 py-2.5 rounded text-sm font-body outline-none transition-all duration-200"
                    style={{
                      background: isGamePreset
                        ? "oklch(0.1 0.015 270)"
                        : "oklch(0.12 0.02 270)",
                      border: "1px solid oklch(0.82 0.18 200 / 0.2)",
                      color: gameName
                        ? "oklch(0.96 0.03 220)"
                        : "oklch(0.96 0.03 220 / 0.4)",
                      cursor: isGamePreset ? "not-allowed" : "pointer",
                      appearance: "auto",
                    }}
                  >
                    <option value="" disabled>
                      Select a game...
                    </option>
                    {GAME_OPTIONS.map((g) => (
                      <option
                        key={g}
                        value={g}
                        style={{ background: "oklch(0.1 0.02 270)" }}
                      >
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Error */}
                {isError && (
                  <div
                    className="px-4 py-2.5 rounded text-xs font-mono"
                    data-ocid="score_submit.error_state"
                    style={{
                      background: "oklch(0.55 0.22 22 / 0.1)",
                      border: "1px solid oklch(0.55 0.22 22 / 0.4)",
                      color: "oklch(0.75 0.22 22)",
                    }}
                  >
                    {error?.message ?? "Failed to submit score. Try again."}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isPending || !playerName.trim() || !gameName}
                  data-ocid="score_submit.submit_button"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded font-display font-bold text-sm tracking-widest uppercase transition-all duration-200"
                  style={{
                    background:
                      isPending || !playerName.trim() || !gameName
                        ? "oklch(0.82 0.18 200 / 0.1)"
                        : "oklch(0.82 0.18 200 / 0.18)",
                    border: `1px solid oklch(0.82 0.18 200 / ${isPending || !playerName.trim() || !gameName ? "0.2" : "0.55"})`,
                    color:
                      isPending || !playerName.trim() || !gameName
                        ? "oklch(0.82 0.18 200 / 0.4)"
                        : "oklch(0.82 0.18 200)",
                    boxShadow:
                      isPending || !playerName.trim() || !gameName
                        ? "none"
                        : "0 0 20px oklch(0.82 0.18 200 / 0.2)",
                    cursor:
                      isPending || !playerName.trim() || !gameName
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Trophy className="w-4 h-4" />
                      Post Score
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
