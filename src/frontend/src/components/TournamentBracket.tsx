import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { awardXP } from "../hooks/useXPSystem";

const BOT_NAMES = [
  "NeonReaper",
  "VoidStrike",
  "CyberAce",
  "PixelKing",
  "TurboBlaze",
  "ArcaneHunter",
  "ShadowByte",
];
const EMOJI_OPTIONS = [
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

interface Player {
  name: string;
  avatar: string;
  isUser: boolean;
}

interface Match {
  id: string;
  p1: Player | null;
  p2: Player | null;
  winner: Player | null;
}

interface TournamentState {
  phase: "register" | "bracket";
  userName: string;
  userAvatar: string;
  rounds: Match[][];
  entryPaid?: boolean;
}

const STORAGE_KEY = "divyansh_tournament";
const ENTRY_FEE = 25;

function makeInitialRound1(userName: string, userAvatar: string): Match[] {
  const players: Player[] = [
    { name: userName, avatar: userAvatar, isUser: true },
    ...BOT_NAMES.map((name) => ({
      name,
      avatar: EMOJI_OPTIONS[Math.floor(Math.random() * EMOJI_OPTIONS.length)],
      isUser: false,
    })),
  ];
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  return [
    { id: "r1m1", p1: shuffled[0], p2: shuffled[1], winner: null },
    { id: "r1m2", p1: shuffled[2], p2: shuffled[3], winner: null },
    { id: "r1m3", p1: shuffled[4], p2: shuffled[5], winner: null },
    { id: "r1m4", p1: shuffled[6], p2: shuffled[7], winner: null },
  ];
}

function loadState(): TournamentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TournamentState;
  } catch {
    return null;
  }
}

function saveState(s: TournamentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

const QR_CELLS = [
  { id: "qr0", dark: true },
  { id: "qr1", dark: true },
  { id: "qr2", dark: true },
  { id: "qr3", dark: true },
  { id: "qr4", dark: true },
  { id: "qr5", dark: true },
  { id: "qr6", dark: true },
  { id: "qr7", dark: true },
  { id: "qr8", dark: true },
  { id: "qr9", dark: false },
  { id: "qr10", dark: true },
  { id: "qr11", dark: false },
  { id: "qr12", dark: true },
  { id: "qr13", dark: false },
  { id: "qr14", dark: true },
  { id: "qr15", dark: true },
  { id: "qr16", dark: false },
  { id: "qr17", dark: true },
  { id: "qr18", dark: false },
  { id: "qr19", dark: true },
  { id: "qr20", dark: false },
  { id: "qr21", dark: true },
  { id: "qr22", dark: true },
  { id: "qr23", dark: false },
  { id: "qr24", dark: true },
  { id: "qr25", dark: true },
  { id: "qr26", dark: true },
  { id: "qr27", dark: false },
  { id: "qr28", dark: true },
  { id: "qr29", dark: true },
  { id: "qr30", dark: false },
  { id: "qr31", dark: false },
  { id: "qr32", dark: false },
  { id: "qr33", dark: false },
  { id: "qr34", dark: false },
  { id: "qr35", dark: true },
  { id: "qr36", dark: true },
  { id: "qr37", dark: false },
  { id: "qr38", dark: false },
  { id: "qr39", dark: false },
  { id: "qr40", dark: false },
  { id: "qr41", dark: false },
  { id: "qr42", dark: true },
  { id: "qr43", dark: true },
  { id: "qr44", dark: true },
  { id: "qr45", dark: true },
  { id: "qr46", dark: true },
  { id: "qr47", dark: true },
  { id: "qr48", dark: true },
];

const ROUND_LABELS = ["Quarterfinals", "Semifinals", "Final"];

function PlayerChip({
  player,
  isWinner = false,
}: { player: Player | null; isWinner?: boolean }) {
  if (!player) {
    return (
      <div
        className="flex items-center gap-2 px-3 py-2 rounded flex-1"
        style={{
          background: "oklch(0.10 0.02 270)",
          border: "1px dashed oklch(0.25 0.03 270)",
        }}
      >
        <span className="text-sm opacity-30">TBD</span>
      </div>
    );
  }
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded flex-1 transition-all duration-300"
      style={{
        background: isWinner
          ? "oklch(0.78 0.17 60 / 0.12)"
          : player.isUser
            ? "oklch(0.82 0.18 200 / 0.07)"
            : "oklch(0.10 0.02 270)",
        border: isWinner
          ? "1px solid oklch(0.78 0.17 60 / 0.5)"
          : player.isUser
            ? "1px solid oklch(0.82 0.18 200 / 0.3)"
            : "1px solid oklch(0.20 0.03 270)",
        boxShadow: isWinner ? "0 0 12px oklch(0.78 0.17 60 / 0.2)" : "none",
      }}
    >
      <span className="text-base shrink-0">{player.avatar}</span>
      <span
        className="font-display font-bold text-xs truncate"
        style={{
          color: isWinner
            ? "oklch(0.78 0.17 60)"
            : player.isUser
              ? "oklch(0.82 0.18 200)"
              : "rgba(255,255,255,0.75)",
        }}
      >
        {player.name}
        {player.isUser && (
          <span className="ml-1 text-xs opacity-60">(You)</span>
        )}
      </span>
      {isWinner && <span className="ml-auto text-sm shrink-0">👑</span>}
    </div>
  );
}

interface MatchCardProps {
  match: Match;
  onSimulate: (matchId: string) => void;
  isLast?: boolean;
}

function MatchCard({ match, onSimulate, isLast }: MatchCardProps) {
  const canSimulate = match.p1 && match.p2 && !match.winner;
  return (
    <motion.div
      className="flex flex-col gap-1 w-full"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      style={{ minWidth: isLast ? 220 : 180, maxWidth: 240 }}
    >
      <PlayerChip
        player={match.p1}
        isWinner={!!match.winner && match.winner?.name === match.p1?.name}
      />
      <div className="flex items-center gap-2">
        <div
          className="flex-1 h-px"
          style={{ background: "oklch(0.25 0.03 270)" }}
        />
        <span
          className="font-mono text-xs"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          vs
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: "oklch(0.25 0.03 270)" }}
        />
      </div>
      <PlayerChip
        player={match.p2}
        isWinner={!!match.winner && match.winner?.name === match.p2?.name}
      />
      {canSimulate && (
        <button
          type="button"
          className="mt-2 w-full py-1.5 rounded text-xs font-display font-bold tracking-widest uppercase transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
          style={{
            background: "oklch(0.62 0.22 295 / 0.12)",
            border: "1px solid oklch(0.62 0.22 295 / 0.4)",
            color: "oklch(0.62 0.22 295)",
          }}
          onClick={() => onSimulate(match.id)}
          data-ocid="tournament.simulate.button"
        >
          ▶ Simulate
        </button>
      )}
      {match.winner && !canSimulate && (
        <div
          className="mt-1 text-center text-xs font-mono py-1"
          style={{ color: "oklch(0.55 0.18 145 / 0.8)" }}
        >
          ✓ Done
        </div>
      )}
    </motion.div>
  );
}

function ConfettiParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ["#00f5ff", "#c084fc", "#facc15", "#4ade80", "#f87171"][i % 5],
    delay: Math.random() * 1,
    duration: 2 + Math.random() * 2,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${p.x}%`,
            top: -8,
            background: p.color,
            boxShadow: `0 0 6px ${p.color}`,
          }}
          animate={{ y: "110vh", rotate: 720, opacity: [1, 1, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ── UPI Payment Modal ─────────────────────────────────────────────────────────
function UPIPaymentModal({
  onPaid,
  onClose,
}: {
  onPaid: () => void;
  onClose: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      onPaid();
    }, 900);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-ocid="tournament.payment.dialog"
    >
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={!confirmed ? onClose : undefined}
        onKeyDown={(e) => e.key === "Escape" && !confirmed && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close"
      />
      <motion.div
        className="relative rounded-2xl w-full max-w-sm overflow-hidden"
        initial={{ scale: 0.88, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        style={{
          background: "oklch(0.09 0.025 270)",
          border: "2px solid oklch(0.62 0.22 295 / 0.5)",
          boxShadow: "0 0 60px oklch(0.62 0.22 295 / 0.2), 0 30px 80px black",
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{
            background: "oklch(0.12 0.04 295 / 0.6)",
            borderBottom: "1px solid oklch(0.22 0.06 295 / 0.4)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <span
              className="font-black text-sm"
              style={{ color: "oklch(0.75 0.22 295)" }}
            >
              Tournament Entry
            </span>
          </div>
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{
              background: "oklch(0.78 0.22 145 / 0.15)",
              color: "oklch(0.72 0.2 145)",
              border: "1px solid oklch(0.72 0.2 145 / 0.3)",
            }}
          >
            🔒 UPI Secure
          </span>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Amount */}
          <div
            className="flex items-center justify-between rounded-xl p-4"
            style={{
              background: "oklch(0.12 0.03 270)",
              border: "1px solid oklch(0.2 0.04 270)",
            }}
          >
            <div>
              <div
                className="text-xs font-mono tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Entry Fee
              </div>
              <div
                className="text-3xl font-black mt-0.5"
                style={{ color: "oklch(0.85 0.25 60)" }}
              >
                ₹{ENTRY_FEE}
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Prize pool
              </div>
              <div
                className="text-lg font-black"
                style={{ color: "oklch(0.75 0.22 295)" }}
              >
                ₹{ENTRY_FEE * 8}
              </div>
            </div>
          </div>

          {/* UPI ID */}
          <div className="flex flex-col gap-2">
            <div
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Pay to UPI ID
            </div>
            <div
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{
                background: "oklch(0.13 0.04 295 / 0.5)",
                border: "1.5px solid oklch(0.62 0.22 295 / 0.35)",
              }}
            >
              <span
                className="font-mono text-sm font-bold"
                style={{ color: "oklch(0.82 0.18 200)" }}
              >
                divyanshgaming@upi
              </span>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard?.writeText("divyanshgaming@upi")
                }
                className="text-xs px-2 py-1 rounded transition-all hover:scale-105"
                style={{
                  background: "oklch(0.18 0.05 295)",
                  color: "oklch(0.65 0.18 295)",
                }}
              >
                Copy
              </button>
            </div>
          </div>

          {/* QR Code placeholder */}
          <div
            className="rounded-xl p-4 flex flex-col items-center gap-2"
            style={{
              background: "oklch(0.11 0.02 270)",
              border: "1px dashed oklch(0.28 0.06 270)",
            }}
          >
            <div
              className="w-32 h-32 rounded-lg flex items-center justify-center relative overflow-hidden"
              style={{
                background: "oklch(0.96 0.01 270)",
                border: "3px solid oklch(0.62 0.22 295 / 0.5)",
              }}
            >
              {/* Stylized QR code pattern */}
              <div className="grid grid-cols-7 gap-0.5 p-2">
                {QR_CELLS.map((cell) => (
                  <div
                    key={cell.id}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      background: cell.dark
                        ? "oklch(0.1 0.02 270)"
                        : "oklch(0.94 0.01 270)",
                    }}
                  />
                ))}
              </div>
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "oklch(0.96 0.01 270 / 0.75)" }}
              >
                <span className="text-2xl">🔲</span>
              </div>
            </div>
            <span
              className="text-xs font-mono"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Scan QR to pay ₹{ENTRY_FEE}
            </span>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-1.5">
            {[
              "Open any UPI app (GPay, PhonePe, Paytm)",
              `Pay ₹${ENTRY_FEE} to divyanshgaming@upi`,
              "Tap the button below to enter",
            ].map((step, i) => (
              <div key={step} className="flex items-center gap-2.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                  style={{
                    background: "oklch(0.62 0.22 295 / 0.2)",
                    color: "oklch(0.75 0.22 295)",
                    border: "1px solid oklch(0.62 0.22 295 / 0.4)",
                  }}
                >
                  {i + 1}
                </div>
                <span
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              data-ocid="tournament.payment.cancel_button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: "oklch(0.14 0.03 270)",
                color: "rgba(255,255,255,0.5)",
                border: "1px solid oklch(0.24 0.05 270)",
              }}
              disabled={confirmed}
            >
              Cancel
            </button>
            <button
              type="button"
              data-ocid="tournament.payment.confirm_button"
              onClick={handleConfirm}
              disabled={confirmed}
              className="flex-1 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              style={{
                background: confirmed
                  ? "oklch(0.55 0.2 145 / 0.5)"
                  : "linear-gradient(135deg, oklch(0.75 0.22 295), oklch(0.62 0.22 295))",
                color: "#fff",
                boxShadow: confirmed
                  ? "none"
                  : "0 0 20px oklch(0.62 0.22 295 / 0.4)",
              }}
            >
              {confirmed ? "✓ Entering…" : "✅ I've Paid — Enter"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TournamentBracket() {
  const [state, setState] = useState<TournamentState>(() => {
    return (
      loadState() ?? {
        phase: "register",
        userName: "",
        userAvatar: "🎮",
        rounds: [],
        entryPaid: false,
      }
    );
  });
  const [flashMatch, setFlashMatch] = useState<string | null>(null);
  const [showChampion, setShowChampion] = useState(false);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const champion: Player | null = (() => {
    if (state.rounds.length < 3) return null;
    const finalRound = state.rounds[2];
    if (finalRound.length === 1 && finalRound[0].winner)
      return finalRound[0].winner;
    return null;
  })();

  useEffect(() => {
    saveState(state);
    if (champion && !showChampion) setShowChampion(true);
  }, [state, champion, showChampion]);

  const handleRegister = () => {
    if (!state.entryPaid) {
      setShowUPIModal(true);
      return;
    }
    doRegister();
  };

  const doRegister = () => {
    const name = state.userName.trim() || "Player";
    const round1 = makeInitialRound1(name, state.userAvatar);
    setState({
      phase: "bracket",
      userName: name,
      userAvatar: state.userAvatar,
      rounds: [round1],
      entryPaid: true,
    });
  };

  const handleUPIPaid = () => {
    setShowUPIModal(false);
    setState((prev) => ({ ...prev, entryPaid: true }));
    setTimeout(doRegister, 100);
  };

  const handleSimulate = (matchId: string) => {
    setState((prev) => {
      const newRounds = prev.rounds.map((round) =>
        round.map((m) => ({ ...m })),
      );
      let targetRoundIdx = -1;
      let targetMatchIdx = -1;
      for (let r = 0; r < newRounds.length; r++) {
        for (let m = 0; m < newRounds[r].length; m++) {
          if (newRounds[r][m].id === matchId) {
            targetRoundIdx = r;
            targetMatchIdx = m;
          }
        }
      }
      if (targetRoundIdx < 0) return prev;
      const match = newRounds[targetRoundIdx][targetMatchIdx];
      if (!match.p1 || !match.p2) return prev;
      const userInMatch = match.p1.isUser || match.p2.isUser;
      const userIsP1 = match.p1.isUser;
      let winner: Player;
      if (userInMatch) {
        winner =
          Math.random() < 0.6
            ? userIsP1
              ? match.p1
              : match.p2
            : userIsP1
              ? match.p2
              : match.p1;
      } else {
        winner = Math.random() < 0.5 ? match.p1 : match.p2;
      }
      match.winner = winner;
      setFlashMatch(matchId);
      setTimeout(() => setFlashMatch(null), 800);
      if (userInMatch) {
        const isFinalRound = targetRoundIdx === 2;
        if (winner.isUser && isFinalRound) awardXP(500, "Tournament Win");
        else awardXP(50, "Tournament Match");
      }
      const currentRound = newRounds[targetRoundIdx];
      const allDone = currentRound.every((m) => m.winner !== null);
      if (allDone) {
        const winners = currentRound.map((m) => m.winner as Player);
        const nextRound: Match[] = [];
        for (let i = 0; i < winners.length; i += 2) {
          const p1 = winners[i];
          const p2 = winners[i + 1] ?? null;
          nextRound.push({
            id: `r${targetRoundIdx + 2}m${i / 2 + 1}`,
            p1,
            p2,
            winner: null,
          });
        }
        if (nextRound.length > 0) newRounds.push(nextRound);
      }
      return { ...prev, rounds: newRounds };
    });
  };

  const handleReset = () => {
    clearState();
    setShowChampion(false);
    setState({
      phase: "register",
      userName: "",
      userAvatar: "🎮",
      rounds: [],
      entryPaid: false,
    });
  };

  if (state.phase === "register") {
    return (
      <>
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
          <div
            className="w-full rounded-xl p-6 flex flex-col gap-5"
            style={{
              background: "oklch(0.09 0.025 270 / 0.9)",
              border: "1px solid oklch(0.62 0.22 295 / 0.25)",
              boxShadow: "0 0 30px oklch(0.62 0.22 295 / 0.08)",
            }}
          >
            <div className="text-center">
              <p
                className="font-mono text-xs tracking-widest uppercase mb-2"
                style={{ color: "oklch(0.62 0.22 295 / 0.7)" }}
              >
                8-Player Tournament
              </p>
              <h3
                className="font-display font-black text-2xl"
                style={{ color: "oklch(0.95 0.03 270)" }}
              >
                Register to Compete
              </h3>
              {/* Entry fee badge */}
              <div className="mt-3 inline-flex items-center gap-2">
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5"
                  style={{
                    background: state.entryPaid
                      ? "oklch(0.55 0.2 145 / 0.15)"
                      : "oklch(0.62 0.22 295 / 0.12)",
                    border: state.entryPaid
                      ? "1px solid oklch(0.55 0.2 145 / 0.5)"
                      : "1px solid oklch(0.62 0.22 295 / 0.4)",
                    color: state.entryPaid
                      ? "oklch(0.72 0.2 145)"
                      : "oklch(0.75 0.22 295)",
                  }}
                >
                  {state.entryPaid ? (
                    <>
                      <span>✓</span>
                      <span>Entry Paid</span>
                    </>
                  ) : (
                    <>
                      <span>🎫</span>
                      <span>Entry Fee: ₹{ENTRY_FEE}</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="font-mono text-xs text-foreground/50 tracking-widest uppercase"
                htmlFor="tournament-name"
              >
                Your Name
              </label>
              <input
                id="tournament-name"
                ref={nameInputRef}
                type="text"
                placeholder="Enter your player name"
                value={state.userName}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, userName: e.target.value }))
                }
                maxLength={20}
                className="px-4 py-3 rounded-lg text-sm font-mono outline-none transition-all"
                style={{
                  background: "oklch(0.12 0.02 270)",
                  border: "1.5px solid oklch(0.62 0.22 295 / 0.25)",
                  color: "oklch(0.95 0.03 270)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "oklch(0.62 0.22 295 / 0.7)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "oklch(0.62 0.22 295 / 0.25)";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRegister();
                }}
                data-ocid="tournament.name.input"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-mono text-xs text-foreground/50 tracking-widest uppercase">
                Pick Your Avatar
              </p>
              <div className="grid grid-cols-6 gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="w-full aspect-square rounded-lg text-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                    style={{
                      background:
                        state.userAvatar === emoji
                          ? "oklch(0.62 0.22 295 / 0.2)"
                          : "oklch(0.12 0.02 270)",
                      border:
                        state.userAvatar === emoji
                          ? "1.5px solid oklch(0.62 0.22 295 / 0.7)"
                          : "1px solid oklch(0.20 0.03 270)",
                      boxShadow:
                        state.userAvatar === emoji
                          ? "0 0 10px oklch(0.62 0.22 295 / 0.3)"
                          : "none",
                    }}
                    onClick={() =>
                      setState((prev) => ({ ...prev, userAvatar: emoji }))
                    }
                    data-ocid="tournament.avatar.button"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-mono text-xs text-foreground/40 tracking-widest uppercase">
                Your Opponents
              </p>
              <div className="flex flex-wrap gap-2">
                {BOT_NAMES.map((bot) => (
                  <span
                    key={bot}
                    className="px-2.5 py-1 rounded text-xs font-mono"
                    style={{
                      background: "oklch(0.12 0.02 270)",
                      border: "1px solid oklch(0.20 0.03 270)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {bot}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3.5 rounded-lg font-display font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: state.entryPaid
                  ? "oklch(0.55 0.2 145 / 0.15)"
                  : "oklch(0.62 0.22 295 / 0.15)",
                border: state.entryPaid
                  ? "1.5px solid oklch(0.55 0.2 145 / 0.6)"
                  : "1.5px solid oklch(0.62 0.22 295 / 0.6)",
                color: state.entryPaid
                  ? "oklch(0.72 0.2 145)"
                  : "oklch(0.62 0.22 295)",
                boxShadow: "0 0 20px oklch(0.62 0.22 295 / 0.15)",
              }}
              onClick={handleRegister}
              data-ocid="tournament.start.button"
            >
              {state.entryPaid
                ? "🏆 Start Tournament"
                : `🎫 Pay ₹${ENTRY_FEE} & Join`}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showUPIModal && (
            <UPIPaymentModal
              onPaid={handleUPIPaid}
              onClose={() => setShowUPIModal(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <AnimatePresence>
        {showChampion && champion && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(5,8,16,0.92)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-ocid="tournament.champion.modal"
          >
            <ConfettiParticles />
            <motion.div
              className="flex flex-col items-center gap-4 text-center px-8 py-10 rounded-2xl max-w-sm relative z-10"
              style={{
                background: "oklch(0.10 0.03 60 / 0.95)",
                border: "2px solid oklch(0.78 0.17 60 / 0.6)",
                boxShadow: "0 0 60px oklch(0.78 0.17 60 / 0.3)",
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.div
                className="text-6xl"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 1, repeat: 3 }}
              >
                🏆
              </motion.div>
              <h2
                className="font-display font-black text-2xl"
                style={{
                  color: "oklch(0.78 0.17 60)",
                  textShadow: "0 0 20px oklch(0.78 0.17 60 / 0.5)",
                }}
              >
                TOURNAMENT CHAMPION!
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{champion.avatar}</span>
                <span
                  className="font-display font-black text-xl"
                  style={{ color: "oklch(0.95 0.05 60)" }}
                >
                  {champion.name}
                </span>
              </div>
              <p
                className="font-mono text-sm"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Prize: Legendary DIVYANSH GAMING Crown Badge
              </p>
              <span className="text-4xl">👑</span>
              <button
                type="button"
                className="px-6 py-2.5 rounded-lg font-display font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:scale-105"
                style={{
                  background: "oklch(0.78 0.17 60 / 0.15)",
                  border: "1.5px solid oklch(0.78 0.17 60 / 0.6)",
                  color: "oklch(0.78 0.17 60)",
                }}
                onClick={() => setShowChampion(false)}
                data-ocid="tournament.champion.close_button"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full overflow-x-auto pb-4">
        <div className="flex gap-8 items-start min-w-max px-2 py-2">
          {state.rounds.map((round, roundIdx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: round index is stable and deterministic
            <div key={`round-${roundIdx}`} className="flex flex-col gap-3">
              <div
                className="text-center font-mono text-xs tracking-widest uppercase pb-2"
                style={{
                  color: "oklch(0.62 0.22 295 / 0.7)",
                  borderBottom: "1px solid oklch(0.62 0.22 295 / 0.15)",
                }}
              >
                {ROUND_LABELS[roundIdx] ?? `Round ${roundIdx + 1}`}
              </div>
              <div
                className="flex flex-col"
                style={{
                  gap:
                    roundIdx === 0 ? "16px" : roundIdx === 1 ? "48px" : "80px",
                  justifyContent: "space-around",
                }}
              >
                {round.map((match) => (
                  <motion.div
                    key={match.id}
                    animate={
                      flashMatch === match.id ? { scale: [1, 1.05, 1] } : {}
                    }
                    transition={{ duration: 0.4 }}
                    className="relative"
                    style={{
                      padding: 8,
                      borderRadius: 10,
                      background:
                        flashMatch === match.id
                          ? "oklch(0.78 0.17 60 / 0.05)"
                          : "transparent",
                    }}
                    data-ocid="tournament.match.card"
                  >
                    <MatchCard
                      match={match}
                      onSimulate={handleSimulate}
                      isLast={roundIdx === 2}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {state.rounds.length < 3 && (
            <div className="flex flex-col gap-3 opacity-20">
              <div
                className="text-center font-mono text-xs tracking-widest uppercase pb-2"
                style={{ borderBottom: "1px dashed oklch(0.30 0.03 270)" }}
              >
                {ROUND_LABELS[state.rounds.length]}
              </div>
              <div
                className="rounded-lg w-48 py-4 flex items-center justify-center font-mono text-xs"
                style={{
                  border: "1px dashed oklch(0.25 0.03 270)",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                TBD
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        className="px-6 py-2.5 rounded-lg font-display font-bold text-xs tracking-widest uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
        style={{
          background: "oklch(0.45 0.15 25 / 0.1)",
          border: "1px solid oklch(0.45 0.15 25 / 0.35)",
          color: "oklch(0.65 0.15 25 / 0.9)",
        }}
        onClick={handleReset}
        data-ocid="tournament.reset.button"
      >
        ↺ Reset Tournament
      </button>
    </div>
  );
}
