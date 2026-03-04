import { Gamepad2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { playClick, playGameStart } from "../hooks/useSoundEffects";
import AsteroidShooter from "./games/AsteroidShooter";
import BrickBreaker from "./games/BrickBreaker";
import ColorMatch from "./games/ColorMatch";
import FlappyBird from "./games/FlappyBird";
import MemoryMatch from "./games/MemoryMatch";
import PongGame from "./games/PongGame";
import ReactionTest from "./games/ReactionTest";
import SnakeGame from "./games/SnakeGame";
import TypingTest from "./games/TypingTest";
import WhackAMole from "./games/WhackAMole";

interface MiniGame {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  component: React.ComponentType;
  tag: string;
}

const MINI_GAMES: MiniGame[] = [
  {
    id: "snake",
    title: "Snake",
    description:
      "Classic snake game. Eat food to grow and rack up points — but don't bite yourself!",
    emoji: "🐍",
    color: "#00ff88",
    component: SnakeGame,
    tag: "Classic",
  },
  {
    id: "brickbreaker",
    title: "Brick Breaker",
    description:
      "Smash all the bricks with a bouncing ball and paddle. Don't let the ball fall!",
    emoji: "🧱",
    color: "#a855f7",
    component: BrickBreaker,
    tag: "Action",
  },
  {
    id: "flappybird",
    title: "Flappy Bird",
    description:
      "Tap to flap through increasingly tricky pipe gaps. How far can you go?",
    emoji: "🐦",
    color: "#ffd700",
    component: FlappyBird,
    tag: "Arcade",
  },
  {
    id: "whackamole",
    title: "Whack-A-Mole",
    description:
      "30 seconds of pure reflex chaos. Whack as many moles as you can!",
    emoji: "🐹",
    color: "#ff6a00",
    component: WhackAMole,
    tag: "Reflex",
  },
  {
    id: "memorymatch",
    title: "Memory Match",
    description:
      "Flip cards to find all 8 matching emoji pairs. Fewest moves wins!",
    emoji: "🃏",
    color: "#00e5ff",
    component: MemoryMatch,
    tag: "Puzzle",
  },
  {
    id: "reactiontest",
    title: "Reaction Test",
    description:
      "How fast are your reflexes? Click when the screen turns green. 5 rounds, then average.",
    emoji: "⚡",
    color: "#ff4466",
    component: ReactionTest,
    tag: "Speed",
  },
  {
    id: "typingtest",
    title: "Typing Test",
    description:
      "Type the phrase as fast as possible. Track your WPM and accuracy in 60 seconds.",
    emoji: "⌨️",
    color: "#00e5ff",
    component: TypingTest,
    tag: "Skill",
  },
  {
    id: "asteroids",
    title: "Asteroid Shooter",
    description:
      "Pilot a neon ship and blast asteroids before they destroy you. Dodge and shoot!",
    emoji: "🚀",
    color: "#c084fc",
    component: AsteroidShooter,
    tag: "Shooter",
  },
  {
    id: "pong",
    title: "Pong",
    description:
      "Classic paddle battle against a smart AI. Move your mouse, first to 7 wins!",
    emoji: "🏓",
    color: "#ffd700",
    component: PongGame,
    tag: "Classic",
  },
  {
    id: "colormatch",
    title: "Color Match",
    description:
      "The Stroop challenge! Click the button matching the text, not the ink color.",
    emoji: "🎨",
    color: "#ff6a00",
    component: ColorMatch,
    tag: "Brain",
  },
];

// ── Game Modal ──────────────────────────────────────────────────────────────────
function GameModal({ game, onClose }: { game: MiniGame; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const GameComponent = game.component;

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose],
  );

  return (
    <motion.div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,5,0.92)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={handleOverlayClick}
    >
      <motion.div
        className="relative w-full flex flex-col items-center"
        style={{
          maxWidth: 600,
          maxHeight: "95vh",
          overflowY: "auto",
          borderRadius: 14,
          border: `1.5px solid ${game.color}40`,
          background: "oklch(0.085 0.02 270)",
          boxShadow: `0 0 0 1px ${game.color}20, 0 0 60px ${game.color}18, 0 24px 80px rgba(0,0,0,0.7)`,
          padding: "20px 16px 24px",
        }}
        initial={{ scale: 0.92, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 20, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-4 px-2">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 28 }}>{game.emoji}</span>
            <div>
              <h2
                className="font-display font-black text-xl leading-tight"
                style={{
                  color: game.color,
                  textShadow: `0 0 16px ${game.color}60`,
                }}
              >
                {game.title}
              </h2>
              <div
                className="text-xs font-mono tracking-widest"
                style={{ color: `${game.color}80` }}
              >
                {game.tag}
              </div>
            </div>
          </div>
          <button
            type="button"
            data-ocid="minigames.close_button"
            onClick={() => {
              playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,68,102,0.2)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,68,102,0.5)";
              (e.currentTarget as HTMLButtonElement).style.color = "#ff4466";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.12)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.5)";
            }}
            aria-label="Close game"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div
          className="w-full mb-5"
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${game.color}30, transparent)`,
          }}
        />

        {/* Game */}
        <div className="flex justify-center w-full">
          <GameComponent />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Mini Game Card ──────────────────────────────────────────────────────────────
function MiniGameCard({
  game,
  index,
  onPlay,
}: { game: MiniGame; index: number; onPlay: () => void }) {
  return (
    <motion.article
      className="group relative rounded-lg overflow-hidden cursor-pointer"
      style={{
        background: "oklch(0.11 0.02 270)",
        border: "1px solid oklch(0.22 0.04 275)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      {/* Color accent top */}
      <div
        style={{
          height: 2,
          background: `linear-gradient(90deg, ${game.color}, ${game.color}40)`,
          boxShadow: `0 0 8px ${game.color}60`,
        }}
      />

      <div className="p-4 flex flex-col gap-3">
        {/* Icon + Tag */}
        <div className="flex items-start justify-between">
          <div
            className="text-3xl"
            style={{
              filter: `drop-shadow(0 0 8px ${game.color}60)`,
            }}
          >
            {game.emoji}
          </div>
          <span
            className="text-xs font-mono font-semibold tracking-widest uppercase px-2 py-0.5 rounded"
            style={{
              background: `${game.color}15`,
              border: `1px solid ${game.color}30`,
              color: game.color,
            }}
          >
            {game.tag}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-display font-bold text-base leading-tight transition-colors duration-200 group-hover:text-neon-cyan"
          style={{ color: "oklch(0.96 0.02 240)" }}
        >
          {game.title}
        </h3>

        {/* Description */}
        <p
          className="text-xs leading-relaxed line-clamp-2"
          style={{
            color: "rgba(255,255,255,0.45)",
            fontFamily: "Sora, sans-serif",
          }}
        >
          {game.description}
        </p>

        {/* Play button */}
        <motion.button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded text-xs font-display font-bold tracking-widest uppercase transition-all duration-200"
          style={{
            background: `${game.color}15`,
            border: `1px solid ${game.color}45`,
            color: game.color,
            boxShadow: `0 0 16px ${game.color}15`,
          }}
          whileHover={{
            boxShadow: `0 0 24px ${game.color}40`,
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            playGameStart();
            onPlay();
          }}
        >
          <span>▶</span> Play
        </motion.button>
      </div>
    </motion.article>
  );
}

// ── MiniGamesSection ────────────────────────────────────────────────────────────
export default function MiniGamesSection() {
  const [activeGame, setActiveGame] = useState<MiniGame | null>(null);

  const handleClose = useCallback(() => setActiveGame(null), []);

  return (
    <section id="mini-games" className="relative py-24 overflow-hidden">
      {/* Decorative glows */}
      <div
        className="absolute top-0 left-1/4 w-96 h-64 rounded-full blur-3xl pointer-events-none opacity-8"
        style={{ background: "oklch(var(--neon-green))" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-64 rounded-full blur-3xl pointer-events-none opacity-6"
        style={{ background: "oklch(var(--neon-violet))" }}
      />

      <div className="container px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase mb-4"
            style={{
              background: "oklch(var(--neon-green) / 0.08)",
              border: "1px solid oklch(var(--neon-green) / 0.3)",
              color: "oklch(var(--neon-green))",
            }}
          >
            <Gamepad2 className="w-3 h-3" />
            Instant Play
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-foreground mb-4">
            Mini{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--neon-green)), oklch(var(--neon-cyan)))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 20px oklch(var(--neon-green) / 0.4))",
              }}
            >
              Games
            </span>
          </h2>
          <p className="font-body text-foreground/50 max-w-xl mx-auto">
            10 fully playable mini games, right in your browser. No downloads,
            no waiting — just instant fun.
          </p>
        </motion.div>

        {/* Games grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {MINI_GAMES.map((game, i) => (
            <MiniGameCard
              key={game.id}
              game={game}
              index={i}
              onPlay={() => setActiveGame(game)}
            />
          ))}
        </div>
      </div>

      {/* Game modal */}
      <AnimatePresence>
        {activeGame && <GameModal game={activeGame} onClose={handleClose} />}
      </AnimatePresence>
    </section>
  );
}
