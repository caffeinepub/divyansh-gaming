import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Car,
  ChevronDown,
  ExternalLink,
  Gamepad2,
  Menu,
  Newspaper,
  Play,
  Shield,
  Star,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import type { Game, LeaderboardEntry, NewsPost } from "./backend.d";
import MiniGamesSection from "./components/MiniGamesSection";
import RacingGame from "./components/RacingGame";
import { useGetGames, useGetLeaderboard, useGetNews } from "./hooks/useQueries";

// ─── Fallback game images ────────────────────────────────────────────────────
const FALLBACK_GAME_IMAGES = [
  "/assets/generated/game-cyberpunk-rpg.dim_400x560.jpg",
  "/assets/generated/game-space-combat.dim_400x560.jpg",
  "/assets/generated/game-fantasy-arena.dim_400x560.jpg",
  "/assets/generated/game-neon-racing.dim_400x560.jpg",
  "/assets/generated/game-tactical-shooter.dim_400x560.jpg",
];

const FALLBACK_GRADIENT_CLASSES = [
  "from-cyan-900 via-blue-900 to-violet-900",
  "from-violet-900 via-purple-900 to-pink-900",
  "from-emerald-900 via-teal-900 to-cyan-900",
  "from-orange-900 via-red-900 to-pink-900",
  "from-blue-900 via-indigo-900 to-violet-900",
];

// ─── Hardcoded fallback data ─────────────────────────────────────────────────
const FALLBACK_GAMES: Game[] = [
  {
    id: BigInt(1),
    title: "Neon Phantoms",
    description:
      "Cyberpunk action RPG set in a dystopian megacity. Hack, slash, and outsmart your enemies across neon-drenched alleyways.",
    imageUrl: "/assets/generated/game-cyberpunk-rpg.dim_400x560.jpg",
    genre: "Action RPG",
    rating: BigInt(9),
  },
  {
    id: BigInt(2),
    title: "Void Corsairs",
    description:
      "Lead your fleet through treacherous asteroid fields and deep-space warzones in this epic space combat simulator.",
    imageUrl: "/assets/generated/game-space-combat.dim_400x560.jpg",
    genre: "Space Combat",
    rating: BigInt(8),
  },
  {
    id: BigInt(3),
    title: "Dragon's Ascent",
    description:
      "Forge your legend in the world of Aethermoor. Battle fearsome dragons and uncover ancient arcane secrets.",
    imageUrl: "/assets/generated/game-fantasy-arena.dim_400x560.jpg",
    genre: "Fantasy",
    rating: BigInt(9),
  },
  {
    id: BigInt(4),
    title: "Hyperdrive X",
    description:
      "Push your reflexes to the limit in blazing neon race circuits at speeds exceeding Mach 3.",
    imageUrl: "/assets/generated/game-neon-racing.dim_400x560.jpg",
    genre: "Racing",
    rating: BigInt(8),
  },
  {
    id: BigInt(5),
    title: "Ghost Protocol",
    description:
      "Precision tactical shooter with deep loadout customization and intense 5v5 ranked matches.",
    imageUrl: "/assets/generated/game-tactical-shooter.dim_400x560.jpg",
    genre: "Tactical FPS",
    rating: BigInt(10),
  },
];

const FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: BigInt(1),
    playerName: "XxDivyanshxX",
    gameName: "Ghost Protocol",
    score: BigInt(98750),
  },
  {
    rank: BigInt(2),
    playerName: "NeonReaper",
    gameName: "Neon Phantoms",
    score: BigInt(87420),
  },
  {
    rank: BigInt(3),
    playerName: "VoidStrike",
    gameName: "Void Corsairs",
    score: BigInt(75300),
  },
  {
    rank: BigInt(4),
    playerName: "ArcaneHunter",
    gameName: "Dragon's Ascent",
    score: BigInt(62100),
  },
  {
    rank: BigInt(5),
    playerName: "TurboBlaze",
    gameName: "Hyperdrive X",
    score: BigInt(55890),
  },
  {
    rank: BigInt(6),
    playerName: "ShadowByte",
    gameName: "Ghost Protocol",
    score: BigInt(48600),
  },
  {
    rank: BigInt(7),
    playerName: "CyberPhantom",
    gameName: "Neon Phantoms",
    score: BigInt(41200),
  },
  {
    rank: BigInt(8),
    playerName: "QuantumAce",
    gameName: "Void Corsairs",
    score: BigInt(38750),
  },
];

const FALLBACK_NEWS: NewsPost[] = [
  {
    id: BigInt(1),
    title: "Season 5 Battle Pass Now Live: Cyber Awakening",
    date: "2026-02-28",
    summary:
      "The biggest season yet has arrived! Unlock 100 tiers of exclusive rewards including legendary skins, weapon blueprints, and the brand-new Phantom Drone companion.",
  },
  {
    id: BigInt(2),
    title: "Ghost Protocol Championship — $50,000 Prize Pool",
    date: "2026-02-22",
    summary:
      "Register your team now for the biggest Ghost Protocol tournament of the year. 128 teams, 3 weeks of intense competition, and glory eternal.",
  },
  {
    id: BigInt(3),
    title: "Dragon's Ascent: The Void Expansion Announced",
    date: "2026-02-15",
    summary:
      "A whole new continent awaits. The Void expansion brings 50+ hours of new story content, 3 new playable classes, and the feared Lich Emperor boss.",
  },
  {
    id: BigInt(4),
    title: "Weekly Leaderboard Reset & Rank Rewards",
    date: "2026-02-10",
    summary:
      "Claim your rank rewards from last season before the reset! Diamond and above players receive exclusive profile borders and animated banners.",
  },
];

// ─── Animated Background ─────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: (i * 13.7 + 7) % 100,
  y: (i * 19.3 + 11) % 100,
  size: (i % 3) * 1.5 + 1.5,
  duration: (i % 5) * 1.5 + 5,
  delay: (i % 7) * 0.6,
  opacity: (i % 4) * 0.08 + 0.12,
  color:
    i % 3 === 0
      ? "oklch(var(--neon-cyan))"
      : i % 3 === 1
        ? "oklch(var(--neon-violet))"
        : "oklch(var(--neon-green))",
}));

const BEAM_CONFIGS = [
  {
    id: "beam-1",
    delay: 0,
    duration: 9,
    gradient:
      "linear-gradient(105deg, transparent 0%, oklch(var(--neon-cyan) / 0.06) 50%, transparent 100%)",
    width: "60vw",
    height: "100vh",
  },
  {
    id: "beam-2",
    delay: 3,
    duration: 11,
    gradient:
      "linear-gradient(105deg, transparent 0%, oklch(var(--neon-violet) / 0.04) 50%, transparent 100%)",
    width: "50vw",
    height: "100vh",
  },
  {
    id: "beam-3",
    delay: 6,
    duration: 8,
    gradient:
      "linear-gradient(105deg, transparent 0%, oklch(var(--neon-cyan) / 0.04) 50%, transparent 100%)",
    width: "40vw",
    height: "100vh",
  },
];

const HERO_STREAKS = [
  {
    id: "streak-1",
    delay: 0.5,
    duration: 6,
    color: "oklch(var(--neon-cyan) / 0.07)",
    top: "10%",
  },
  {
    id: "streak-2",
    delay: 2,
    duration: 7,
    color: "oklch(var(--neon-violet) / 0.05)",
    top: "40%",
  },
  {
    id: "streak-3",
    delay: 3.5,
    duration: 5,
    color: "oklch(var(--neon-cyan) / 0.05)",
    top: "70%",
  },
];

function AnimatedBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Layer 1 — Hex grid breathing */}
      <motion.div
        className="absolute inset-0 bg-hex-grid"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Layer 2 — Aurora orbs */}
      {/* Top-left cyan orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "-10%",
          left: "-5%",
          width: 700,
          height: 700,
          background:
            "radial-gradient(circle, oklch(var(--neon-cyan) / 0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          x: [-40, 60, -40],
          y: [-20, 30, -20],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      {/* Top-right violet orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "-8%",
          right: "-8%",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, oklch(var(--neon-violet) / 0.10) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          x: [30, -60, 30],
          y: [-10, 40, -10],
        }}
        transition={{
          duration: 15,
          delay: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      {/* Bottom-center green orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          bottom: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 500,
          background:
            "radial-gradient(ellipse, oklch(var(--neon-green) / 0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [-50, 50, -50],
        }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      {/* Center gold orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "40%",
          left: "45%",
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, oklch(var(--gold) / 0.05) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.15, 1] }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Layer 3 — Diagonal beam sweeps */}
      {BEAM_CONFIGS.map((beam) => (
        <motion.div
          key={beam.id}
          className="absolute top-0 bottom-0"
          style={{
            width: beam.width,
            height: beam.height,
            background: beam.gradient,
            skewX: "-15deg",
            transformOrigin: "center",
          }}
          animate={{ x: ["-200%", "250%"] }}
          transition={{
            duration: beam.duration,
            delay: beam.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 4,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Layer 4 — Particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -35, 0],
            opacity: [p.opacity, p.opacity * 0.25, p.opacity],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Layer 5 — Scanlines */}
      <div className="absolute inset-0 bg-scanlines opacity-20" />

      {/* Layer 6 — Circuit overlay */}
      <div className="absolute inset-0 bg-circuit" style={{ opacity: 0.035 }} />
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "#hero", icon: <Zap className="w-3.5 h-3.5" /> },
    {
      label: "Games",
      href: "#games",
      icon: <Gamepad2 className="w-3.5 h-3.5" />,
    },
    {
      label: "Race",
      href: "#race",
      icon: <Car className="w-3.5 h-3.5" />,
    },
    {
      label: "Mini Games",
      href: "#mini-games",
      icon: <Gamepad2 className="w-3.5 h-3.5" />,
    },
    {
      label: "Leaderboard",
      href: "#leaderboard",
      icon: <Trophy className="w-3.5 h-3.5" />,
    },
    {
      label: "News",
      href: "#news",
      icon: <Newspaper className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: isScrolled
          ? "oklch(0.085 0.015 270 / 0.95)"
          : "transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        borderBottom: isScrolled
          ? "1px solid oklch(var(--neon-cyan) / 0.15)"
          : "1px solid transparent",
      }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="relative">
            <Gamepad2
              className="w-7 h-7 text-neon-cyan group-hover:scale-110 transition-transform duration-200"
              style={{
                filter: "drop-shadow(0 0 8px oklch(var(--neon-cyan) / 0.8))",
              }}
            />
            <div
              className="absolute inset-0 blur-md opacity-60"
              style={{ background: "oklch(var(--neon-cyan) / 0.3)" }}
            />
          </div>
          <span
            className="font-display font-extrabold text-lg tracking-widest gradient-text-gaming"
            style={{ letterSpacing: "0.12em" }}
          >
            DIVYANSH GAMING
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-1.5 px-4 py-2 rounded text-sm font-body font-medium text-foreground/70 hover:text-neon-cyan transition-all duration-200 hover:bg-neon-cyan/5 group relative"
            >
              <span className="text-neon-cyan/50 group-hover:text-neon-cyan transition-colors">
                {link.icon}
              </span>
              {link.label}
              <span
                className="absolute bottom-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(var(--neon-cyan)), transparent)",
                }}
              />
            </a>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2 text-neon-cyan hover:bg-neon-cyan/10 rounded transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{
              background: "oklch(0.085 0.015 270 / 0.98)",
              borderBottom: "1px solid oklch(var(--neon-cyan) / 0.2)",
            }}
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded text-sm font-medium text-foreground/70 hover:text-neon-cyan hover:bg-neon-cyan/5 transition-all"
                >
                  <span className="text-neon-cyan/60">{link.icon}</span>
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="/assets/generated/hero-gaming-banner.dim_1920x1080.jpg"
          alt="Gaming Background"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.085 0.015 270 / 0.65) 0%, oklch(0.085 0.015 270 / 0.75) 50%, oklch(0.085 0.015 270 / 1) 100%)",
          }}
        />
      </motion.div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Hero diagonal light streaks */}
      {HERO_STREAKS.map((streak) => (
        <motion.div
          key={streak.id}
          className="absolute pointer-events-none"
          style={{
            top: streak.top,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${streak.color} 40%, ${streak.color} 60%, transparent 100%)`,
          }}
          animate={{ x: ["-110%", "110%"] }}
          transition={{
            duration: streak.duration,
            delay: streak.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto"
        style={{ opacity }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium mb-8 tracking-widest uppercase"
            style={{
              background: "oklch(var(--neon-cyan) / 0.1)",
              border: "1px solid oklch(var(--neon-cyan) / 0.4)",
              color: "oklch(var(--neon-cyan))",
            }}
          >
            <Zap className="w-3 h-3 animate-pulse-glow" />
            Season 5 — Cyber Awakening
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="font-display font-black text-5xl sm:text-6xl md:text-8xl lg:text-9xl tracking-tight mb-4 leading-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="block"
            style={{
              color: "oklch(var(--foreground))",
              textShadow: "0 0 40px oklch(var(--neon-cyan) / 0.2)",
            }}
          >
            DIVYANSH
          </span>
          <span className="block gradient-text-gaming glow-cyan glitch-text">
            GAMING
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="font-body text-base sm:text-xl md:text-2xl text-foreground/70 mb-10 max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Level Up Your Game.{" "}
          <span className="text-neon-cyan font-semibold">
            Dominate the Leaderboard.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          <a
            href="#games"
            className="gaming-btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded font-display font-bold text-sm tracking-widest uppercase"
          >
            <Gamepad2 className="w-4 h-4" />
            Explore Games
          </a>
          <a
            href="#leaderboard"
            className="gaming-btn-accent inline-flex items-center gap-2 px-8 py-3.5 rounded font-display font-bold text-sm tracking-widest uppercase"
          >
            <Trophy className="w-4 h-4" />
            View Leaderboard
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {[
            {
              label: "Active Players",
              value: "50K+",
              icon: <Shield className="w-4 h-4" />,
            },
            {
              label: "Games Available",
              value: "120+",
              icon: <Gamepad2 className="w-4 h-4" />,
            },
            {
              label: "Tournaments Won",
              value: "1,200+",
              icon: <Trophy className="w-4 h-4" />,
            },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-neon-cyan mb-1">
                {stat.icon}
                <span className="font-display font-black text-2xl glow-cyan">
                  {stat.value}
                </span>
              </div>
              <span className="font-body text-xs text-foreground/50 tracking-widest uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-foreground/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="font-mono text-xs tracking-widest uppercase">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
}

// ─── Genre badge color helper ─────────────────────────────────────────────────
function GenreBadge({ genre }: { genre: string }) {
  const colorMap: Record<string, string> = {
    "Action RPG": "oklch(var(--neon-cyan) / 0.15)",
    "Space Combat": "oklch(var(--neon-violet) / 0.15)",
    Fantasy: "oklch(var(--neon-green) / 0.15)",
    Racing: "oklch(var(--gold) / 0.15)",
    "Tactical FPS": "oklch(var(--destructive) / 0.2)",
  };
  const textMap: Record<string, string> = {
    "Action RPG": "oklch(var(--neon-cyan))",
    "Space Combat": "oklch(var(--neon-violet))",
    Fantasy: "oklch(var(--neon-green))",
    Racing: "oklch(var(--gold))",
    "Tactical FPS": "oklch(var(--destructive))",
  };
  const bg = colorMap[genre] || "oklch(var(--neon-cyan) / 0.15)";
  const text = textMap[genre] || "oklch(var(--neon-cyan))";

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-mono font-semibold tracking-wider"
      style={{ background: bg, color: text }}
    >
      {genre}
    </span>
  );
}

// ─── Game Card ────────────────────────────────────────────────────────────────
function GameCard({ game, index }: { game: Game; index: number }) {
  const isRacing = game.genre === "Racing" || game.title === "Hyperdrive X";
  const [imgError, setImgError] = useState(false);
  const fallbackImg = FALLBACK_GAME_IMAGES[index % FALLBACK_GAME_IMAGES.length];
  const gradientClass =
    FALLBACK_GRADIENT_CLASSES[index % FALLBACK_GRADIENT_CLASSES.length];

  const imgSrc = imgError || !game.imageUrl ? fallbackImg : game.imageUrl;

  return (
    <motion.article
      className="group relative rounded-lg overflow-hidden cursor-pointer"
      style={{
        background: "oklch(var(--card))",
        border: "1px solid oklch(var(--border))",
        boxShadow: "0 4px 24px oklch(0 0 0 / 0.5)",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02 }}
    >
      {/* Image */}
      <div className="relative aspect-[5/7] overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
          >
            <Gamepad2 className="w-16 h-16 text-white/20" />
          </div>
        )}
        {/* Overlay on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(180deg, transparent 30%, oklch(var(--void) / 0.9) 100%)",
          }}
        >
          <motion.button
            type="button"
            className="gaming-btn-primary flex items-center gap-2 px-6 py-2.5 rounded font-display font-bold text-sm tracking-widest uppercase"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (isRacing) {
                document
                  .getElementById("race")
                  ?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <Play className="w-4 h-4 fill-current" />
            Play Now
          </motion.button>
        </div>
        {/* Rating badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded"
          style={{
            background: "oklch(0.085 0.015 270 / 0.9)",
            border: "1px solid oklch(var(--neon-cyan) / 0.3)",
          }}
        >
          <Star className="w-3 h-3 fill-current text-neon-cyan" />
          <span className="font-mono text-xs font-bold text-neon-cyan">
            {Number(game.rating)}/10
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-4">
        <div className="mb-2">
          <GenreBadge genre={game.genre} />
        </div>
        <h3 className="font-display font-bold text-base text-foreground mb-1 line-clamp-1 group-hover:text-neon-cyan transition-colors">
          {game.title}
        </h3>
        <p className="font-body text-xs text-foreground/50 line-clamp-2 mb-3 leading-relaxed">
          {game.description}
        </p>
        <button
          type="button"
          className="w-full gaming-btn-primary flex items-center justify-center gap-2 px-4 py-2 rounded text-xs font-display font-bold tracking-widest uppercase"
          onClick={() => {
            if (isRacing) {
              document
                .getElementById("race")
                ?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Play Now
        </button>
      </div>
    </motion.article>
  );
}

// ─── Game Card Skeleton ────────────────────────────────────────────────────────
function GameCardSkeleton() {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        background: "oklch(var(--card))",
        border: "1px solid oklch(var(--border))",
      }}
    >
      <Skeleton className="aspect-[5/7] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

// ─── Games Section ────────────────────────────────────────────────────────────
function GamesSection() {
  const { data: gamesData, isLoading } = useGetGames();
  const games = gamesData && gamesData.length > 0 ? gamesData : FALLBACK_GAMES;

  return (
    <section
      id="games"
      className="relative py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(var(--background) / 0.6) 0%, oklch(var(--background) / 0.75) 100%)",
      }}
    >
      {/* Decorative glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: "oklch(var(--neon-cyan))" }}
      />

      <div className="container px-4 md:px-6 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase mb-4"
            style={{
              background: "oklch(var(--neon-cyan) / 0.08)",
              border: "1px solid oklch(var(--neon-cyan) / 0.3)",
              color: "oklch(var(--neon-cyan))",
            }}
          >
            <Gamepad2 className="w-3 h-3" />
            Featured Games
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-foreground mb-4">
            Choose Your{" "}
            <span className="gradient-text-gaming glow-cyan">Arena</span>
          </h2>
          <p className="font-body text-foreground/50 max-w-xl mx-auto">
            Handpicked titles across every genre — from pulse-pounding action to
            deep strategy epics.
          </p>
        </motion.div>

        {/* Games grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {isLoading
            ? ["g1", "g2", "g3", "g4", "g5"].map((k) => (
                <GameCardSkeleton key={k} />
              ))
            : games.map((game, i) => (
                <GameCard key={Number(game.id)} game={game} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}

// ─── Racing Game Section ──────────────────────────────────────────────────────
function RacingGameSection() {
  return (
    <section
      id="race"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(0.09 0.02 200 / 0.75)" }}
    >
      {/* Decorative glows */}
      <div
        className="absolute top-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-8"
        style={{ background: "oklch(var(--neon-cyan))" }}
      />
      <div
        className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-6"
        style={{ background: "oklch(var(--neon-violet))" }}
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
              background: "oklch(var(--neon-cyan) / 0.08)",
              border: "1px solid oklch(var(--neon-cyan) / 0.3)",
              color: "oklch(var(--neon-cyan))",
            }}
          >
            <Car className="w-3 h-3" />
            Playable Game
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-foreground mb-4">
            Play{" "}
            <span className="gradient-text-gaming glow-cyan">Car Racing</span>
          </h2>
          <p className="font-body text-foreground/50 max-w-xl mx-auto">
            Dodge enemy cars at blistering speeds. How long can you survive?
            Your high score goes straight to the leaderboard.
          </p>
        </motion.div>

        {/* Game canvas */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <RacingGame />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Rank badge ───────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: bigint }) {
  const r = Number(rank);
  if (r === 1)
    return (
      <div
        className="rank-gold w-10 h-10 rounded-full flex items-center justify-center border font-display font-black text-sm"
        style={{
          boxShadow: "0 0 12px oklch(var(--gold) / 0.5)",
        }}
      >
        #1
      </div>
    );
  if (r === 2)
    return (
      <div
        className="rank-silver w-10 h-10 rounded-full flex items-center justify-center border font-display font-black text-sm"
        style={{
          boxShadow: "0 0 10px oklch(var(--silver) / 0.4)",
        }}
      >
        #2
      </div>
    );
  if (r === 3)
    return (
      <div
        className="rank-bronze w-10 h-10 rounded-full flex items-center justify-center border font-display font-black text-sm"
        style={{
          boxShadow: "0 0 10px oklch(var(--bronze) / 0.4)",
        }}
      >
        #3
      </div>
    );
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm text-foreground/40 bg-foreground/5 border border-border">
      #{r}
    </div>
  );
}

// ─── Leaderboard Section ──────────────────────────────────────────────────────
function LeaderboardSection() {
  const { data: lbData, isLoading } = useGetLeaderboard();
  const entries = lbData && lbData.length > 0 ? lbData : FALLBACK_LEADERBOARD;

  const rowStyle = (rank: bigint) => {
    const r = Number(rank);
    if (r === 1)
      return {
        background: "oklch(var(--gold) / 0.06)",
        borderLeft: "3px solid oklch(var(--gold) / 0.7)",
      };
    if (r === 2)
      return {
        background: "oklch(var(--silver) / 0.05)",
        borderLeft: "3px solid oklch(var(--silver) / 0.5)",
      };
    if (r === 3)
      return {
        background: "oklch(var(--bronze) / 0.06)",
        borderLeft: "3px solid oklch(var(--bronze) / 0.6)",
      };
    return {};
  };

  return (
    <section
      id="leaderboard"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(0.09 0.02 295 / 0.8)" }}
    >
      {/* Decorative glow */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: "oklch(var(--neon-violet))" }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-8"
        style={{ background: "oklch(var(--gold))" }}
      />

      <div className="container px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase mb-4"
            style={{
              background: "oklch(var(--gold) / 0.1)",
              border: "1px solid oklch(var(--gold) / 0.4)",
              color: "oklch(var(--gold))",
            }}
          >
            <Trophy className="w-3 h-3" />
            Hall of Fame
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-foreground mb-4">
            Top{" "}
            <span
              className="glow-violet"
              style={{ color: "oklch(var(--neon-violet))" }}
            >
              Champions
            </span>
          </h2>
          <p className="font-body text-foreground/50 max-w-xl mx-auto">
            The elite players who have risen to the pinnacle of the DIVYANSH
            GAMING leaderboard.
          </p>
        </motion.div>

        {/* Leaderboard table */}
        <motion.div
          className="rounded-lg overflow-hidden"
          style={{
            border: "1px solid oklch(var(--border))",
            boxShadow: "0 0 40px oklch(var(--neon-violet) / 0.08)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {isLoading ? (
            <div className="p-6 space-y-3">
              {["l1", "l2", "l3", "l4", "l5", "l6"].map((k) => (
                <Skeleton key={k} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow
                  style={{
                    background: "oklch(var(--secondary))",
                    borderBottom: "1px solid oklch(var(--neon-violet) / 0.2)",
                  }}
                >
                  <TableHead className="font-mono text-xs tracking-widest uppercase text-foreground/40 w-20">
                    Rank
                  </TableHead>
                  <TableHead className="font-mono text-xs tracking-widest uppercase text-foreground/40">
                    Player
                  </TableHead>
                  <TableHead className="font-mono text-xs tracking-widest uppercase text-foreground/40 hidden sm:table-cell">
                    Game
                  </TableHead>
                  <TableHead className="font-mono text-xs tracking-widest uppercase text-foreground/40 text-right">
                    Score
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, idx) => (
                  <motion.tr
                    key={Number(entry.rank)}
                    className="transition-colors hover:bg-foreground/3"
                    style={rowStyle(entry.rank)}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                  >
                    <TableCell className="py-4">
                      <RankBadge rank={entry.rank} />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-black"
                          style={{
                            background: `oklch(${Number(entry.rank) <= 3 ? "var(--neon-violet)" : "var(--muted)"} / 0.3)`,
                            border: `1px solid oklch(${Number(entry.rank) <= 3 ? "var(--neon-violet)" : "var(--border)"} / 0.4)`,
                            color:
                              Number(entry.rank) <= 3
                                ? "oklch(var(--neon-violet))"
                                : "oklch(var(--foreground) / 0.6)",
                          }}
                        >
                          {entry.playerName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-display font-bold text-sm text-foreground">
                          {entry.playerName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 hidden sm:table-cell">
                      <span className="font-body text-sm text-foreground/60">
                        {entry.gameName}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <span
                        className="font-mono font-bold text-sm"
                        style={{
                          color:
                            Number(entry.rank) === 1
                              ? "oklch(var(--gold))"
                              : Number(entry.rank) === 2
                                ? "oklch(var(--silver))"
                                : Number(entry.rank) === 3
                                  ? "oklch(var(--bronze))"
                                  : "oklch(var(--neon-cyan) / 0.8)",
                        }}
                      >
                        {Number(entry.score).toLocaleString()}
                      </span>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ─── News Card ────────────────────────────────────────────────────────────────
function NewsCard({ post, index }: { post: NewsPost; index: number }) {
  const formattedDate = (() => {
    try {
      return new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return post.date;
    }
  })();

  return (
    <motion.article
      className="group rounded-lg overflow-hidden cursor-pointer"
      style={{
        background: "oklch(var(--card))",
        border: "1px solid oklch(var(--border))",
        boxShadow: "0 4px 24px oklch(0 0 0 / 0.4)",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      {/* Top accent line */}
      <div
        className="h-0.5 w-full transition-all duration-300"
        style={{
          background:
            index % 2 === 0
              ? "linear-gradient(90deg, oklch(var(--neon-cyan)), oklch(var(--neon-violet)))"
              : "linear-gradient(90deg, oklch(var(--neon-violet)), oklch(var(--neon-cyan)))",
        }}
      />
      <div className="p-6">
        {/* Date */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="font-mono text-xs"
            style={{ color: "oklch(var(--neon-cyan) / 0.7)" }}
          >
            {formattedDate}
          </span>
          <div
            className="w-1 h-1 rounded-full"
            style={{ background: "oklch(var(--neon-cyan) / 0.4)" }}
          />
          <span className="font-mono text-xs text-foreground/30">Update</span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-base text-foreground mb-3 leading-snug group-hover:text-neon-cyan transition-colors">
          {post.title}
        </h3>

        {/* Summary */}
        <p className="font-body text-sm text-foreground/55 leading-relaxed line-clamp-3 mb-4">
          {post.summary}
        </p>

        {/* Read more */}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold tracking-widest uppercase text-neon-cyan hover:gap-3 transition-all duration-200"
        >
          Read More
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </motion.article>
  );
}

// ─── News Section ─────────────────────────────────────────────────────────────
function NewsSection() {
  const { data: newsData, isLoading } = useGetNews();
  const posts = newsData && newsData.length > 0 ? newsData : FALLBACK_NEWS;

  return (
    <section
      id="news"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(var(--background) / 0.65)" }}
    >
      {/* Decorative glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 blur-3xl pointer-events-none opacity-8"
        style={{
          background:
            "linear-gradient(90deg, oklch(var(--neon-cyan)), oklch(var(--neon-violet)))",
        }}
      />

      <div className="container px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase mb-4"
            style={{
              background: "oklch(var(--neon-violet) / 0.08)",
              border: "1px solid oklch(var(--neon-violet) / 0.3)",
              color: "oklch(var(--neon-violet))",
            }}
          >
            <Newspaper className="w-3 h-3" />
            Latest Updates
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-foreground mb-4">
            Gaming <span className="gradient-text-gaming">News</span>
          </h2>
          <p className="font-body text-foreground/50 max-w-xl mx-auto">
            Stay ahead of the competition with the latest updates, patch notes,
            and tournament announcements.
          </p>
        </motion.div>

        {/* News grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["n1", "n2", "n3", "n4"].map((k) => (
              <div
                key={k}
                className="rounded-lg p-6 space-y-3"
                style={{
                  background: "oklch(var(--card))",
                  border: "1px solid oklch(var(--border))",
                }}
              >
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post, i) => (
              <NewsCard key={Number(post.id)} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const footerLinks = {
    Games: ["Action RPG", "Space Combat", "Fantasy", "Racing", "FPS"],
    Community: ["Leaderboard", "Tournaments", "Discord", "Forums"],
    Support: ["Help Center", "Contact Us", "Bug Reports", "Privacy Policy"],
  };

  return (
    <footer
      className="relative overflow-hidden pt-16 pb-8"
      style={{
        position: "relative",
        zIndex: 1,
        background: "oklch(0.065 0.015 270)",
        borderTop: "1px solid oklch(var(--neon-cyan) / 0.1)",
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(var(--neon-cyan) / 0.4), oklch(var(--neon-violet) / 0.4), transparent)",
        }}
      />

      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2
                className="w-8 h-8 text-neon-cyan"
                style={{
                  filter: "drop-shadow(0 0 8px oklch(var(--neon-cyan) / 0.8))",
                }}
              />
              <span className="font-display font-black text-xl gradient-text-gaming tracking-widest">
                DIVYANSH GAMING
              </span>
            </div>
            <p className="font-body text-sm text-foreground/45 leading-relaxed max-w-xs">
              Your ultimate gaming destination. Compete, dominate, and rise to
              the top of the DIVYANSH GAMING leaderboard.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {["Discord", "Twitter/X", "YouTube", "Twitch"].map((platform) => (
                <button
                  key={platform}
                  type="button"
                  className="w-8 h-8 rounded flex items-center justify-center text-foreground/40 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all duration-200"
                  style={{
                    border: "1px solid oklch(var(--border))",
                  }}
                  aria-label={platform}
                >
                  <Target className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-bold text-sm text-foreground/60 mb-4 tracking-widest uppercase">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^\w-]/g, "")}`}
                      className="font-body text-sm text-foreground/40 hover:text-neon-cyan transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid oklch(var(--border))" }}
        >
          <p className="font-body text-xs text-foreground/30">
            © {year} DIVYANSH GAMING. All rights reserved.
          </p>
          <p className="font-body text-xs text-foreground/30">
            Built with <span className="text-neon-cyan/60">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan/60 hover:text-neon-cyan transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div
      className="dark min-h-screen font-body"
      style={{ background: "oklch(var(--background))" }}
    >
      {/* Fixed immersive background — renders behind everything */}
      <AnimatedBackground />

      <Navbar />
      <main style={{ position: "relative", zIndex: 1 }}>
        <HeroSection />
        <GamesSection />
        <RacingGameSection />
        <MiniGamesSection />
        <LeaderboardSection />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
}
