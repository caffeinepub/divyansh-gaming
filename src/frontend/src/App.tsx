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
  Bot,
  Brain,
  Car,
  ChevronDown,
  ExternalLink,
  Gamepad2,
  Layers,
  Menu,
  Newspaper,
  Play,
  Quote,
  Rocket,
  Search,
  Shield,
  Star,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Game, LeaderboardEntry, NewsPost } from "./backend.d";
import AIChatBot from "./components/AIChatBot";
import GlowingCrosshairCursor from "./components/GlowingCrosshairCursor";
import LoadingScreen from "./components/LoadingScreen";
import MiniGamesSection from "./components/MiniGamesSection";
import PlayerProfileModal from "./components/PlayerProfileModal";
import RacingGame from "./components/RacingGame";
import Scene3D, { LobbyCanvas } from "./components/Scene3D";
import ScoreSubmitModal from "./components/ScoreSubmitModal";
import SoundToggle from "./components/SoundToggle";
import SpaceShooter3D from "./components/SpaceShooter3D";
import ThemeControls from "./components/ThemeControls";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { useGetGames, useGetLeaderboard, useGetNews } from "./hooks/useQueries";
import { playClick, playHover } from "./hooks/useSoundEffects";

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
    timestamp: "2026-02-28T00:00:00.000Z",
    avatar: "",
  },
  {
    rank: BigInt(2),
    playerName: "NeonReaper",
    gameName: "Neon Phantoms",
    score: BigInt(87420),
    timestamp: "2026-02-27T00:00:00.000Z",
    avatar: "",
  },
  {
    rank: BigInt(3),
    playerName: "VoidStrike",
    gameName: "Void Corsairs",
    score: BigInt(75300),
    timestamp: "2026-02-26T00:00:00.000Z",
    avatar: "",
  },
  {
    rank: BigInt(4),
    playerName: "ArcaneHunter",
    gameName: "Dragon's Ascent",
    score: BigInt(62100),
    timestamp: "2026-02-25T00:00:00.000Z",
    avatar: "",
  },
  {
    rank: BigInt(5),
    playerName: "TurboBlaze",
    gameName: "Hyperdrive X",
    score: BigInt(55890),
    timestamp: "2026-02-24T00:00:00.000Z",
    avatar: "",
  },
  {
    rank: BigInt(6),
    playerName: "ShadowByte",
    gameName: "Ghost Protocol",
    score: BigInt(48600),
    timestamp: "2026-02-23T00:00:00.000Z",
    avatar: "",
  },
  {
    rank: BigInt(7),
    playerName: "CyberPhantom",
    gameName: "Neon Phantoms",
    score: BigInt(41200),
    timestamp: "2026-02-22T00:00:00.000Z",
    avatar: "",
  },
  {
    rank: BigInt(8),
    playerName: "QuantumAce",
    gameName: "Void Corsairs",
    score: BigInt(38750),
    timestamp: "2026-02-21T00:00:00.000Z",
    avatar: "",
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

// ─── Hero streaks ─────────────────────────────────────────────────────────────
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

// ─── Section Divider ──────────────────────────────────────────────────────────
function SectionDivider() {
  return (
    <div
      style={{
        width: "100%",
        height: 24,
        position: "relative",
        transform: "perspective(400px) rotateX(45deg)",
        transformOrigin: "center top",
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 3,
      }}
    >
      {/* Neon gradient line */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0.82 0.18 200) 20%, oklch(0.62 0.22 295) 50%, oklch(0.82 0.18 200) 80%, transparent 100%)",
          opacity: 0.5,
        }}
      />
      {/* Traveling orb */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, oklch(0.82 0.18 200) 0%, oklch(0.82 0.18 200 / 0.3) 60%, transparent 100%)",
          boxShadow: "0 0 12px 4px oklch(0.82 0.18 200 / 0.6)",
          filter: "blur(1px)",
        }}
        animate={{ x: ["0%", "calc(100vw - 8px)"] }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  );
}

// AnimatedBackground is replaced by LiveWallpaper canvas + this CSS overlay
function BackgroundOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Aurora orbs — sit above canvas */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "-10%",
          left: "-5%",
          width: 700,
          height: 700,
          background:
            "radial-gradient(circle, oklch(var(--neon-cyan) / 0.08) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{ x: [-40, 60, -40], y: [-20, 30, -20] }}
        transition={{
          duration: 14,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "-8%",
          right: "-8%",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, oklch(var(--neon-violet) / 0.07) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{ x: [30, -60, 30], y: [-10, 40, -10] }}
        transition={{
          duration: 17,
          delay: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Scanlines */}
      <div className="absolute inset-0 bg-scanlines opacity-15" />

      {/* Circuit overlay */}
      <div className="absolute inset-0 bg-circuit" style={{ opacity: 0.025 }} />
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
      label: "Lobby",
      href: "#lobby",
      icon: <Layers className="w-3.5 h-3.5" />,
    },
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
      label: "3D Game",
      href: "#3d-game",
      icon: <Rocket className="w-3.5 h-3.5" />,
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
    {
      label: "Thoughts",
      href: "#positive-thoughts",
      icon: <Brain className="w-3.5 h-3.5" />,
    },
    {
      label: "AI Chat",
      href: "#ai-chat",
      icon: <Bot className="w-3.5 h-3.5" />,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("openAIChat"));
      },
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
              data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "-")}.link`}
              onMouseEnter={() => playHover()}
              onClick={(e) => {
                playClick();
                link.onClick?.(e);
              }}
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
                  onClick={(e) => {
                    setMobileOpen(false);
                    link.onClick?.(e);
                  }}
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
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!headingRef.current) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1; // -1 to 1
      const rotY = nx * 6;
      const rotX = ny * -4;
      headingRef.current.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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

        {/* Main heading — 3D parallax wrapper */}
        <div
          ref={headingRef}
          style={{
            transition: "transform 0.15s ease-out",
            willChange: "transform",
            display: "inline-block",
          }}
        >
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
        </div>

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
          {/* biome-ignore lint/a11y/useValidAnchor: hash anchor navigates to section */}
          <a
            href="#games"
            className="gaming-btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded font-display font-bold text-sm tracking-widest uppercase"
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
          >
            <Gamepad2 className="w-4 h-4" />
            Explore Games
          </a>
          {/* biome-ignore lint/a11y/useValidAnchor: hash anchor navigates to section */}
          <a
            href="#leaderboard"
            className="gaming-btn-accent inline-flex items-center gap-2 px-8 py-3.5 rounded font-display font-bold text-sm tracking-widest uppercase"
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
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
                {/* 3D spinning icon */}
                <div className="spin3d-icon">{stat.icon}</div>
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
  const cardRef = useRef<HTMLElement>(null);

  const imgSrc = imgError || !game.imageUrl ? fallbackImg : game.imageUrl;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotX = dy * -8;
    const rotY = dx * 8;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.02)`;
    card.style.transition = "transform 0.05s ease";
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
    card.style.transition = "transform 0.4s ease";
  };

  return (
    <motion.article
      ref={cardRef}
      className="group relative rounded-lg overflow-hidden cursor-pointer"
      style={{
        background: "oklch(var(--card))",
        border: "1px solid oklch(var(--border))",
        boxShadow: "0 4px 24px oklch(0 0 0 / 0.5)",
        willChange: "transform",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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

// ─── 3D Space Shooter Section ─────────────────────────────────────────────────
function SpaceShooter3DSection() {
  return (
    <section
      id="3d-game"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(0.07 0.02 240 / 0.8)" }}
    >
      {/* Decorative glows */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-8"
        style={{ background: "oklch(var(--neon-cyan))" }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-6"
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
            <Rocket className="w-3 h-3" />
            3D Playable Game
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-foreground mb-4">
            Space{" "}
            <span className="gradient-text-gaming glow-cyan">Shooter 3D</span>
          </h2>
          <p className="font-body text-foreground/50 max-w-xl mx-auto">
            A fully playable 3D space shooter built with React Three Fiber. Move
            your mouse to pilot your ship, hold Space or click to fire. Survive
            the waves!
          </p>
        </motion.div>

        {/* Game */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SpaceShooter3D />
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
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [highlightedPlayer, setHighlightedPlayer] = useState<string | null>(
    null,
  );
  const [selectedGame, setSelectedGame] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [selectedPlayerAvatar, setSelectedPlayerAvatar] = useState<string>("");

  // Sorted unique game names from all entries
  const gameNames = useMemo<string[]>(() => {
    const names = new Set(entries.map((e) => e.gameName));
    return Array.from(names).sort();
  }, [entries]);

  // Filtered + re-ranked entries for display
  const filteredEntries = useMemo<LeaderboardEntry[]>(() => {
    if (searchQuery.trim() !== "") {
      // Cross-game player search: ignore game filter
      return entries.filter((e) =>
        e.playerName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (selectedGame === "All") return entries;
    return entries
      .filter((e) => e.gameName === selectedGame)
      .map((e, idx) => ({ ...e, rank: BigInt(idx + 1) }));
  }, [entries, selectedGame, searchQuery]);

  const handleSubmitSuccess = (
    updatedLB: LeaderboardEntry[],
    submittedName?: string,
  ) => {
    if (submittedName) {
      setHighlightedPlayer(submittedName);
      setTimeout(() => setHighlightedPlayer(null), 5000);
    } else if (updatedLB.length > 0) {
      // fallback: highlight rank 1 player briefly
      setHighlightedPlayer(updatedLB[0].playerName);
      setTimeout(() => setHighlightedPlayer(null), 5000);
    }
  };

  const rowStyle = (rank: bigint, playerName: string) => {
    const r = Number(rank);
    const isHighlighted = highlightedPlayer && playerName === highlightedPlayer;

    if (isHighlighted) {
      return {
        background: "oklch(0.82 0.18 200 / 0.12)",
        borderLeft: "3px solid oklch(0.82 0.18 200 / 0.9)",
        boxShadow: "0 0 20px oklch(0.82 0.18 200 / 0.15) inset",
        transition: "all 0.5s ease",
      };
    }
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
          <p className="font-body text-foreground/50 max-w-xl mx-auto mb-6">
            The elite players who have risen to the pinnacle of the DIVYANSH
            GAMING leaderboard. Filter by game to see the top champions for each
            title.
          </p>
          {/* Post Your Score CTA */}
          <motion.button
            type="button"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded font-display font-bold text-sm tracking-widest uppercase transition-all duration-200"
            style={{
              background: "oklch(0.82 0.18 200 / 0.12)",
              border: "1.5px solid oklch(0.82 0.18 200 / 0.45)",
              color: "oklch(0.82 0.18 200)",
              boxShadow: "0 0 20px oklch(0.82 0.18 200 / 0.15)",
            }}
            whileHover={{
              boxShadow: "0 0 32px oklch(0.82 0.18 200 / 0.3)",
              scale: 1.03,
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              playClick();
              setShowSubmitModal(true);
            }}
            onMouseEnter={() => playHover()}
            data-ocid="leaderboard.post_score_button"
          >
            <Trophy className="w-4 h-4" />
            Post Your Score
          </motion.button>

          {/* Per-game filter pills */}
          <div className="overflow-x-auto pb-2 mt-6">
            <div className="flex items-center gap-2 justify-center flex-wrap min-w-max mx-auto px-1">
              {/* "All Games" pill */}
              <button
                type="button"
                className="px-3 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-200 whitespace-nowrap"
                style={
                  selectedGame === "All"
                    ? {
                        background: "oklch(var(--neon-violet) / 0.18)",
                        border: "1.5px solid oklch(var(--neon-violet) / 0.8)",
                        color: "oklch(var(--neon-violet))",
                        boxShadow: "0 0 12px oklch(var(--neon-violet) / 0.3)",
                      }
                    : {
                        background: "transparent",
                        border: "1.5px solid oklch(var(--border))",
                        color: "oklch(var(--foreground) / 0.5)",
                      }
                }
                onClick={() => {
                  setSelectedGame("All");
                  playClick();
                }}
                onMouseEnter={() => playHover()}
                data-ocid="leaderboard.all_games.tab"
              >
                All Games
              </button>

              {/* Per-game pills */}
              {gameNames.map((name, n) => (
                <button
                  key={name}
                  type="button"
                  className="px-3 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-200 whitespace-nowrap"
                  style={
                    selectedGame === name
                      ? {
                          background: "oklch(var(--neon-violet) / 0.18)",
                          border: "1.5px solid oklch(var(--neon-violet) / 0.8)",
                          color: "oklch(var(--neon-violet))",
                          boxShadow: "0 0 12px oklch(var(--neon-violet) / 0.3)",
                        }
                      : {
                          background: "transparent",
                          border: "1.5px solid oklch(var(--border))",
                          color: "oklch(var(--foreground) / 0.5)",
                        }
                  }
                  onClick={() => {
                    setSelectedGame(name);
                    playClick();
                  }}
                  onMouseEnter={() => playHover()}
                  data-ocid={`leaderboard.filter.tab.${n + 1}`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Player search bar */}
          <div className="mt-6 relative">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
              style={{
                background: "oklch(0.12 0.03 295 / 0.8)",
                border: "1.5px solid oklch(var(--neon-violet) / 0.3)",
                boxShadow: "0 0 0 0 oklch(var(--neon-violet) / 0)",
              }}
              onFocusCapture={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "oklch(var(--neon-violet) / 0.7)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 0 18px oklch(var(--neon-violet) / 0.2)";
              }}
              onBlurCapture={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "oklch(var(--neon-violet) / 0.3)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 0 0 0 oklch(var(--neon-violet) / 0)";
              }}
            >
              <Search
                className="w-4 h-4 shrink-0"
                style={{ color: "oklch(var(--neon-violet) / 0.7)" }}
              />
              <input
                type="text"
                placeholder="Search player name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm font-mono placeholder:text-foreground/30"
                style={{ color: "oklch(var(--foreground))" }}
                data-ocid="leaderboard.search_input"
              />
              {searchQuery !== "" && (
                <button
                  type="button"
                  className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-colors duration-150 hover:bg-foreground/10"
                  style={{ color: "oklch(var(--foreground) / 0.5)" }}
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  data-ocid="leaderboard.search_clear.button"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
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
            <div
              className="p-6 space-y-3"
              data-ocid="leaderboard.loading_state"
            >
              {["l1", "l2", "l3", "l4", "l5", "l6"].map((k) => (
                <Skeleton key={k} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <Table data-ocid="leaderboard.table">
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
                {filteredEntries.length === 0 ? (
                  <tr data-ocid="leaderboard.empty_state">
                    <td colSpan={4} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Trophy className="w-10 h-10 text-foreground/20" />
                        <p className="font-body text-sm text-foreground/40">
                          {searchQuery.trim() !== ""
                            ? `No player found matching "${searchQuery}"`
                            : selectedGame === "All"
                              ? "No scores yet. Be the first to post!"
                              : `No scores yet for ${selectedGame}.`}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry, idx) => {
                    const displayRank = entry.rank;
                    const displayRankNum = Number(displayRank);
                    return (
                      <motion.tr
                        key={`${String(entry.rank)}-${entry.playerName}-${idx}`}
                        className="transition-colors hover:bg-foreground/3"
                        style={rowStyle(displayRank, entry.playerName)}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.06 }}
                        data-ocid={`leaderboard.item.${idx + 1}`}
                      >
                        <TableCell className="py-4">
                          <RankBadge rank={displayRank} />
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            {entry.avatar ? (
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
                                title={entry.playerName}
                                style={{
                                  background: `oklch(${displayRankNum <= 3 ? "var(--neon-violet)" : "var(--muted)"} / 0.2)`,
                                  border: `1px solid oklch(${displayRankNum <= 3 ? "var(--neon-violet)" : "var(--border)"} / 0.4)`,
                                  filter:
                                    displayRankNum <= 3
                                      ? "drop-shadow(0 0 6px oklch(var(--neon-violet) / 0.5))"
                                      : "none",
                                  lineHeight: 1,
                                }}
                              >
                                {entry.avatar}
                              </div>
                            ) : (
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-black shrink-0"
                                title={entry.playerName}
                                style={{
                                  background: `oklch(${displayRankNum <= 3 ? "var(--neon-violet)" : "var(--muted)"} / 0.3)`,
                                  border: `1px solid oklch(${displayRankNum <= 3 ? "var(--neon-violet)" : "var(--border)"} / 0.4)`,
                                  color:
                                    displayRankNum <= 3
                                      ? "oklch(var(--neon-violet))"
                                      : "oklch(var(--foreground) / 0.6)",
                                }}
                              >
                                {entry.playerName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <button
                              type="button"
                              className="font-display font-bold text-sm text-foreground hover:text-neon-cyan transition-colors duration-200 underline-offset-2 hover:underline text-left"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                playClick();
                                setSelectedPlayer(entry.playerName);
                                setSelectedPlayerAvatar(entry.avatar ?? "");
                              }}
                              onMouseEnter={() => playHover()}
                              data-ocid="player.profile.open_modal_button"
                            >
                              {entry.playerName}
                              {highlightedPlayer &&
                                entry.playerName === highlightedPlayer && (
                                  <span
                                    className="ml-2 text-xs font-mono font-normal tracking-wider"
                                    style={{ color: "oklch(0.82 0.18 200)" }}
                                  >
                                    ✦ NEW
                                  </span>
                                )}
                            </button>
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
                                displayRankNum === 1
                                  ? "oklch(var(--gold))"
                                  : displayRankNum === 2
                                    ? "oklch(var(--silver))"
                                    : displayRankNum === 3
                                      ? "oklch(var(--bronze))"
                                      : "oklch(var(--neon-cyan) / 0.8)",
                            }}
                          >
                            {Number(entry.score).toLocaleString()}
                          </span>
                        </TableCell>
                      </motion.tr>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </motion.div>
      </div>

      {/* Score Submit Modal */}
      <ScoreSubmitModal
        open={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSuccess={(updatedLB) => {
          // Find the highest-ranked NEW entry (not in FALLBACK_LEADERBOARD)
          const fallbackNames = new Set(
            FALLBACK_LEADERBOARD.map((e) => e.playerName),
          );
          const newEntry = updatedLB.find(
            (e) => !fallbackNames.has(e.playerName),
          );
          handleSubmitSuccess(updatedLB, newEntry?.playerName);
          setShowSubmitModal(false);
        }}
      />

      {/* Player Profile Modal */}
      <PlayerProfileModal
        playerName={selectedPlayer}
        entries={entries}
        onClose={() => {
          setSelectedPlayer(null);
          setSelectedPlayerAvatar("");
        }}
        avatar={selectedPlayerAvatar}
      />
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
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(800px) rotateX(${dy * -5}deg) rotateY(${dx * 5}deg) translateY(-4px)`;
    card.style.transition = "transform 0.05s ease";
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    card.style.transition = "transform 0.4s ease";
  };

  return (
    <motion.article
      ref={cardRef}
      className="group rounded-lg overflow-hidden cursor-pointer"
      style={{
        background: "oklch(var(--card))",
        border: "1px solid oklch(var(--border))",
        boxShadow: "0 4px 24px oklch(0 0 0 / 0.4)",
        willChange: "transform",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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

// ─── Positive Thoughts Section ────────────────────────────────────────────────
const GAMING_QUOTES = [
  {
    id: "quote-defeat-tutorial",
    quote: "Every defeat is a tutorial. Every victory is earned.",
    author: "XxDivyanshxX",
  },
  {
    id: "quote-obstacle-solution",
    quote: "Gaming teaches you that every obstacle has a solution.",
    author: "Divyansh Gaming",
  },
  {
    id: "quote-grind-great",
    quote: "The best players aren't born — they grind until they're great.",
    author: "NeonReaper",
  },
  {
    id: "quote-save-point",
    quote: "In games, failure is just another save point before success.",
    author: "Divyansh Gaming",
  },
  {
    id: "quote-focus-strategy",
    quote: "Gaming builds focus, strategy, and unstoppable determination.",
    author: "VoidStrike",
  },
  {
    id: "quote-main-character",
    quote: "Press start and remember: you are the main character.",
    author: "Divyansh Gaming",
  },
  {
    id: "quote-high-score",
    quote:
      "Every high score you chase makes you a stronger version of yourself.",
    author: "ArcaneHunter",
  },
  {
    id: "quote-imagination",
    quote: "Gaming is the art of turning imagination into reality.",
    author: "Divyansh Gaming",
  },
  {
    id: "quote-champions-respawn",
    quote: "Champions respawn. Quitters don't get the loot.",
    author: "TurboBlaze",
  },
];

const QUOTE_ACCENT_COLORS = [
  "oklch(var(--neon-cyan))",
  "oklch(var(--neon-violet))",
  "oklch(var(--gold))",
  "oklch(var(--neon-cyan))",
  "oklch(var(--neon-violet))",
  "oklch(var(--gold))",
  "oklch(var(--neon-cyan))",
  "oklch(var(--neon-violet))",
  "oklch(var(--gold))",
];

function QuoteCard({
  quote,
  author,
  index,
  accentColor,
}: {
  quote: string;
  author: string;
  index: number;
  accentColor: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(800px) rotateX(${dy * -5}deg) rotateY(${dx * 5}deg) translateY(-6px)`;
    card.style.transition = "transform 0.05s ease";
    card.style.boxShadow = `0 12px 40px oklch(0 0 0 / 0.55), 0 0 24px ${accentColor.replace(")", " / 0.12)")}`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    card.style.transition = "transform 0.4s ease";
    card.style.boxShadow = "0 4px 24px oklch(0 0 0 / 0.45)";
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative group rounded-lg p-6 flex flex-col gap-4 h-full"
      style={{
        background: "oklch(var(--card))",
        border: `1px solid ${accentColor.replace(")", " / 0.25)")}`,
        boxShadow: "0 4px 24px oklch(0 0 0 / 0.45)",
        willChange: "transform",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-ocid={`thoughts.item.${index + 1}`}
    >
      {/* Neon quote icon */}
      <div
        className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
        style={{
          background: accentColor.replace(")", " / 0.1)"),
          border: `1px solid ${accentColor.replace(")", " / 0.3)")}`,
          color: accentColor,
          filter: `drop-shadow(0 0 6px ${accentColor.replace(")", " / 0.5)")})`,
        }}
      >
        <Quote className="w-5 h-5" />
      </div>

      {/* Quote text */}
      <p
        className="font-body text-sm leading-relaxed text-foreground/80 flex-1 italic"
        style={{ lineHeight: "1.7" }}
      >
        "{quote}"
      </p>

      {/* Attribution */}
      <div
        className="flex items-center gap-2 mt-auto pt-3"
        style={{
          borderTop: `1px solid ${accentColor.replace(")", " / 0.12)")}`,
        }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black font-display shrink-0"
          style={{
            background: accentColor.replace(")", " / 0.15)"),
            color: accentColor,
          }}
        >
          {author.charAt(0).toUpperCase()}
        </div>
        <span
          className="font-mono text-xs font-semibold tracking-wider"
          style={{ color: accentColor }}
        >
          — {author}
        </span>
      </div>

      {/* Hover glow corner */}
      <div
        className="absolute top-0 right-0 w-16 h-16 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${accentColor.replace(")", " / 0.1)")}, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}

function PositiveThoughtsSection() {
  return (
    <section
      id="positive-thoughts"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(0.09 0.02 270 / 0.75)" }}
    >
      {/* Decorative blurred glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-10"
        style={{
          background:
            "radial-gradient(circle, oklch(var(--neon-cyan)) 0%, oklch(var(--neon-violet)) 50%, transparent 70%)",
        }}
      />
      {/* Corner accent orbs */}
      <div
        className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-8"
        style={{ background: "oklch(var(--neon-violet))" }}
      />
      <div
        className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-8"
        style={{ background: "oklch(var(--gold))" }}
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
            <Brain className="w-3 h-3" />
            Gamer Mindset
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-foreground mb-4">
            Level Up Your{" "}
            <span className="gradient-text-gaming glow-cyan">Mindset</span>
          </h2>
          <p
            className="font-body text-lg text-foreground/60 max-w-xl mx-auto"
            style={{ fontStyle: "italic" }}
          >
            Gaming isn't just play — it's where legends are made.
          </p>
        </motion.div>

        {/* Quotes grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
          {GAMING_QUOTES.map((item, i) => (
            <QuoteCard
              key={item.id}
              quote={item.quote}
              author={item.author}
              index={i}
              accentColor={QUOTE_ACCENT_COLORS[i]}
            />
          ))}
        </div>
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
            Made with <span className="text-neon-cyan/60">♥</span> by{" "}
            <span className="text-neon-cyan/60">Divyansh Yadav (Creator)</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Theme color hex helper ───────────────────────────────────────────────────
const THEME_HEX: Record<string, number> = {
  cyan: 0x00f5ff,
  red: 0xff4422,
  green: 0x22ff88,
  purple: 0xaa44ff,
};

// ─── Lobby Section ────────────────────────────────────────────────────────────
function LobbySection() {
  const { theme } = useTheme();
  const themeColor = THEME_HEX[theme] ?? 0x00f5ff;

  return (
    <section
      id="lobby"
      className="relative overflow-hidden"
      style={{
        minHeight: "70vh",
        display: "flex",
        background: "oklch(0.08 0.02 270 / 0.9)",
        borderTop: "1px solid oklch(var(--neon-cyan) / 0.12)",
        borderBottom: "1px solid oklch(var(--neon-violet) / 0.12)",
      }}
    >
      {/* Decorative glow blobs */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          background: "oklch(var(--neon-cyan) / 0.06)",
          transform: "translate(-30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{
          background: "oklch(var(--neon-violet) / 0.07)",
          transform: "translate(30%, 30%)",
        }}
      />

      <div
        className="container px-4 md:px-6 relative z-10"
        style={{ display: "flex", alignItems: "center", width: "100%" }}
      >
        {/* Left side — text */}
        <motion.div
          className="flex-1 flex flex-col justify-center py-16 pr-8"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase mb-6 w-fit"
            style={{
              background: "oklch(var(--neon-cyan) / 0.08)",
              border: "1px solid oklch(var(--neon-cyan) / 0.3)",
              color: "oklch(var(--neon-cyan))",
            }}
          >
            <Layers className="w-3 h-3" />
            3D Lobby
          </div>

          <h2
            className="font-display font-black text-4xl md:text-6xl mb-4 leading-none"
            style={{ color: "oklch(var(--foreground))" }}
          >
            ENTER THE
            <br />
            <span className="gradient-text-gaming glow-cyan">LOBBY</span>
          </h2>

          <p className="font-body text-foreground/55 text-lg mb-8 max-w-md leading-relaxed">
            Your 3D gaming universe awaits. Explore the arena, check the
            leaderboard, and dominate the competition.
          </p>

          {/* biome-ignore lint/a11y/useValidAnchor: hash anchor navigates to section */}
          <motion.a
            href="#games"
            className="gaming-btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded font-display font-bold text-sm tracking-widest uppercase w-fit"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            data-ocid="lobby.primary_button"
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
          >
            <Play className="w-4 h-4 fill-current" />
            Play Now
          </motion.a>

          {/* Stats row */}
          <div className="flex gap-8 mt-10">
            {[
              { label: "Live 3D Objects", value: "12+" },
              { label: "FPS", value: "60" },
              { label: "Effects", value: "Neon" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="font-display font-black text-xl glow-cyan text-neon-cyan">
                  {s.value}
                </span>
                <span className="font-mono text-xs text-foreground/40 tracking-widest uppercase">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right side — inline 3D canvas */}
        <motion.div
          className="hidden lg:flex flex-1 items-stretch"
          style={{
            minHeight: "70vh",
            position: "relative",
            borderLeft: "1px solid oklch(var(--neon-cyan) / 0.1)",
          }}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        >
          <div style={{ position: "absolute", inset: 0 }}>
            <LobbyCanvas themeColor={themeColor} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Inner App (consumes ThemeProvider) ──────────────────────────────────────
function InnerApp() {
  const { theme } = useTheme();
  const themeColor = THEME_HEX[theme] ?? 0x00f5ff;

  return (
    <div
      className="min-h-screen font-body"
      style={{ background: "oklch(var(--background))" }}
    >
      {/* Loading screen */}
      <LoadingScreen />
      {/* Custom glowing crosshair cursor */}
      <GlowingCrosshairCursor />
      {/* Sound toggle button */}
      <SoundToggle />
      {/* Theme controls — day/night + color swatches */}
      <ThemeControls />
      {/* AI Chatbot widget */}
      <AIChatBot />
      {/* 3D scene background — theme-aware */}
      <Scene3D themeColor={themeColor} />
      {/* CSS overlay (aurora orbs, scanlines, circuit) — z-index 1 */}
      <BackgroundOverlay />

      <Navbar />
      <main style={{ position: "relative", zIndex: 2 }}>
        <HeroSection />
        {/* 3D Lobby section — right after hero */}
        <LobbySection />
        <SectionDivider />
        <GamesSection />
        <SectionDivider />
        <RacingGameSection />
        <SectionDivider />
        <MiniGamesSection />
        <SectionDivider />
        <SpaceShooter3DSection />
        <SectionDivider />
        <LeaderboardSection />
        <SectionDivider />
        <NewsSection />
        <SectionDivider />
        <PositiveThoughtsSection />
      </main>
      <Footer />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <InnerApp />
    </ThemeProvider>
  );
}
