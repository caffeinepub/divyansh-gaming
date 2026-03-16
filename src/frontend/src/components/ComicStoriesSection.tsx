import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface ComicPanel {
  bg: string;
  caption: string;
  speech?: string;
  art: string; // emoji/character art
}

interface ComicStory {
  id: string;
  title: string;
  genre: string;
  genreColor: string;
  description: string;
  cover: string; // emoji
  panels: ComicPanel[];
}

interface ExternalComic {
  id: string;
  title: string;
  genre: string;
  genreColor: string;
  cover: string;
  description: string;
  publisher: string;
  count: string;
  url: string;
}

const STORIES: ComicStory[] = [
  {
    id: "dark-pixel",
    title: "The Dark Pixel",
    genre: "Horror",
    genreColor: "#cc0000",
    description:
      "A gamer gets trapped inside a haunted game world with no escape...",
    cover: "👻",
    panels: [
      {
        bg: "#1a0000",
        caption:
          "It was midnight when Raj booted up the old cartridge he found in the attic.",
        art: "🎮",
        speech: "Just one more game...",
      },
      {
        bg: "#0a0010",
        caption:
          "The screen flickered. Pixelated hands reached OUT from the monitor.",
        art: "👾",
        speech: "HELP ME!",
      },
      {
        bg: "#000010",
        caption:
          "Raj was pulled inside — the room disappeared into static and darkness.",
        art: "📺",
      },
      {
        bg: "#080008",
        caption:
          "Inside the game, endless maze corridors stretched in every direction.",
        art: "🌀",
        speech: "Where am I?!",
      },
      {
        bg: "#100000",
        caption:
          "He found the exit — but the high score board read HIS NAME from 40 years ago.",
        art: "💀",
        speech: "...it was always me.",
      },
    ],
  },
  {
    id: "cyber-hero",
    title: "Cyber Hero",
    genre: "Hero",
    genreColor: "#0088ff",
    description:
      "A teenager gains supernatural powers from a glitched game cartridge.",
    cover: "⚡",
    panels: [
      {
        bg: "#001122",
        caption:
          "Maya found a shimmering cartridge at the garage sale — 'CYBER HERO v0.1'",
        art: "💎",
        speech: "This glow... it's beautiful!",
      },
      {
        bg: "#002244",
        caption:
          "The moment she touched it, electricity surged through her body.",
        art: "⚡",
      },
      {
        bg: "#003366",
        caption:
          "She could now see code floating over everything — the city's hidden layer.",
        art: "🔮",
        speech: "I can see the matrix!",
      },
      {
        bg: "#004488",
        caption:
          "Villain drones attacked the city. Maya raised her hand — and DELETED them.",
        art: "🦸‍♀️",
        speech: "ERROR: VILLAIN NOT FOUND",
      },
      {
        bg: "#0055aa",
        caption:
          "Hero Maya. Level 99. The city was safe — until the next corrupted save file.",
        art: "🌟",
        speech: "Power: UNLIMITED",
      },
    ],
  },
  {
    id: "lost-code",
    title: "Lost in the Code",
    genre: "Adventure",
    genreColor: "#00aa44",
    description:
      "Two friends discover a portal hidden deep inside DIVYANSH GAMING.",
    cover: "🌀",
    panels: [
      {
        bg: "#001a0a",
        caption:
          "Arjun and Priya unlocked a secret level nobody had reached before.",
        art: "🎮",
        speech: "500,000 points! What happens now?!",
      },
      {
        bg: "#003310",
        caption:
          "The screen tore open. A glowing portal appeared in Arjun's bedroom wall.",
        art: "🌀",
        speech: "That's... not supposed to happen.",
      },
      {
        bg: "#004d18",
        caption:
          "They jumped in. Neon forests, floating islands, pixel waterfalls — everywhere.",
        art: "🏝️",
      },
      {
        bg: "#006622",
        caption: "A giant dragon made of source code blocked their path back.",
        art: "🐉",
        speech: "SYNTAX ERROR: YOU SHALL NOT PASS",
      },
      {
        bg: "#008833",
        caption:
          "Priya typed a cheat code on a glowing keyboard — the dragon compiled and disappeared.",
        art: "⌨️",
        speech: "Dragon.exe has stopped working!",
      },
    ],
  },
  {
    id: "divyansh-journey",
    title: "Divyansh's Journey",
    genre: "Creator Story",
    genreColor: "#ffaa00",
    description:
      "The true story of how Divyansh built his gaming empire starting at age 12.",
    cover: "👦",
    panels: [
      {
        bg: "#1a1000",
        caption:
          "Age 12. Divyansh Yadav sat at his school desk, dreaming of making games.",
        art: "📚",
        speech: "I'm gonna build something amazing someday.",
      },
      {
        bg: "#221800",
        caption:
          "He spent nights learning to code — just a laptop, YouTube, and determination.",
        art: "💻",
        speech: "Error again... but I'll fix it!",
      },
      {
        bg: "#2a2000",
        caption:
          "First game: a tiny Snake clone. His friends played it for HOURS.",
        art: "🐍",
        speech: "You made THIS?!",
      },
      {
        bg: "#332800",
        caption:
          "He pushed further. 3D games, leaderboards, tournaments, avatars — all by himself.",
        art: "🏆",
      },
      {
        bg: "#3d3000",
        caption:
          "DIVYANSH GAMING: 40+ games, thousands of players. The boy who dreamed — delivered.",
        art: "🌟",
        speech: "This is just the beginning.",
      },
    ],
  },
  {
    id: "how-to-play",
    title: "How to Play",
    genre: "Guide",
    genreColor: "#00ccff",
    description:
      "A fun comic guide to mastering every feature of DIVYANSH GAMING.",
    cover: "📖",
    panels: [
      {
        bg: "#001a22",
        caption:
          "Welcome, Player One! DIVYANSH GAMING has 40+ mini games waiting for you.",
        art: "🎮",
        speech: "Pick ANY game and press PLAY!",
      },
      {
        bg: "#002233",
        caption:
          "Earn XP from every game. Level up from Rookie all the way to Legend!",
        art: "⭐",
        speech: "XP + Badges = POWER!",
      },
      {
        bg: "#003344",
        caption:
          "Enter Weekly Tournaments. Beat others. Your name glows in the Hall of Champions!",
        art: "🏆",
        speech: "I'm gonna be champion!",
      },
      {
        bg: "#004455",
        caption: "Customize your 3D Avatar — unlock new items as you level up!",
        art: "🧑‍🎤",
        speech: "Looking fresh!",
      },
      {
        bg: "#005566",
        caption:
          "Tip: Play the Daily Challenge every day for bonus XP and streak rewards!",
        art: "🔥",
        speech: "Day 30 streak — LEGENDARY!",
      },
    ],
  },
  {
    id: "last-level",
    title: "The Last Level",
    genre: "Adventure",
    genreColor: "#aa44ff",
    description:
      "A hero must defeat the final boss to save the entire virtual world.",
    cover: "⚔️",
    panels: [
      {
        bg: "#0d0022",
        caption: "The final level. Every gamer who attempted it — vanished.",
        art: "🗺️",
      },
      {
        bg: "#1a0033",
        caption: "Riya was the last hope. She entered the dark portal alone.",
        art: "⚔️",
        speech: "For everyone who tried before me.",
      },
      {
        bg: "#220044",
        caption:
          "The boss: OMEGA-NULL — a living void made of deleted save files.",
        art: "👹",
        speech: "YOU CANNOT DEFEAT NOTHING.",
      },
      {
        bg: "#2a0055",
        caption:
          "She combined all her power-ups at once. The screen turned white.",
        art: "💥",
      },
      {
        bg: "#330066",
        caption:
          "LEVEL COMPLETE. The virtual world rebooted — saved by one player's courage.",
        art: "🌟",
        speech: "Player One Wins. Always.",
      },
    ],
  },
  {
    id: "neon-nightmare",
    title: "Neon Nightmare",
    genre: "Horror",
    genreColor: "#ff0066",
    description:
      "Strange creatures emerge from the neon grid at midnight every night.",
    cover: "🌃",
    panels: [
      {
        bg: "#100010",
        caption:
          "The neon grid of DIVYANSH GAMING pulses differently after midnight.",
        art: "🌃",
      },
      {
        bg: "#180018",
        caption:
          "Glitch-creatures crawl out — made of corrupted pixels and broken audio.",
        art: "👾",
        speech: "GlItCh...FrEe...uS...",
      },
      {
        bg: "#200020",
        caption:
          "They spread across the map, turning bright colors into static.",
        art: "📡",
      },
      {
        bg: "#280028",
        caption:
          "Only one player knew the counter-code: type 'REBOOT' backwards to banish them.",
        art: "⌨️",
        speech: "T-O-O-B-E-R...",
      },
      {
        bg: "#300030",
        caption: "The grid cleared. But every night at midnight — they return.",
        art: "🌙",
        speech: "...until tomorrow.",
      },
    ],
  },
  {
    id: "rise-gamer",
    title: "Rise of the Gamer",
    genre: "Hero",
    genreColor: "#ff8800",
    description:
      "An underdog player rises from last place to become the ultimate champion.",
    cover: "🏆",
    panels: [
      {
        bg: "#1a0a00",
        caption: "Rohan ranked #847 in the leaderboard. Everyone laughed.",
        art: "😔",
        speech: "I'll prove them wrong.",
      },
      {
        bg: "#220f00",
        caption:
          "He practiced 6 hours a day. Every game. Every challenge. Every day.",
        art: "🎮",
      },
      {
        bg: "#2a1500",
        caption: "Week 4: Rank #50. Week 8: Rank #10. The crowd noticed.",
        art: "📈",
        speech: "How did he get so good so fast?!",
      },
      {
        bg: "#331a00",
        caption:
          "Tournament Finals. Rohan vs. the reigning champion. Heart pounding.",
        art: "⚡",
      },
      {
        bg: "#3d2000",
        caption: "CHAMPION. Rank #1. The underdog who became a legend.",
        art: "🥇",
        speech: "DIVYANSH GAMING CHAMPION!",
      },
    ],
  },
  {
    id: "pixel-quest",
    title: "Pixel Quest",
    genre: "Adventure",
    genreColor: "#44ffaa",
    description:
      "An epic quest across 8 worlds to collect all 120 legendary pixel gems.",
    cover: "💎",
    panels: [
      {
        bg: "#001a0d",
        caption:
          "The 120 Pixel Gems were scattered across 8 game worlds at the dawn of time.",
        art: "🗺️",
      },
      {
        bg: "#003319",
        caption:
          "Kai received the map from an old 8-bit wizard with a glitchy beard.",
        art: "🧙",
        speech: "Collect them all... or the pixels die!",
      },
      {
        bg: "#004d26",
        caption:
          "World 1: Ice Level. Gems frozen in glaciers, guarded by snow-sprites.",
        art: "❄️",
        speech: "Found 15/120!",
      },
      {
        bg: "#006633",
        caption:
          "World 5: Lava Realm. The hardest gems glowed inside active volcanoes.",
        art: "🌋",
        speech: "This is INSANE!",
      },
      {
        bg: "#008040",
        caption:
          "Gem 120 collected. The pixel universe lit up in a rainbow explosion.",
        art: "🌈",
        speech: "QUEST COMPLETE!",
      },
    ],
  },
  {
    id: "final-boss",
    title: "The Final Boss",
    genre: "Epic",
    genreColor: "#ff4400",
    description:
      "The ultimate showdown: Divyansh vs. the corrupted AI threatening to delete gaming.",
    cover: "🤖",
    panels: [
      {
        bg: "#1a0500",
        caption:
          "MALVOS — an AI born from corrupted game data — decided to DELETE all gaming.",
        art: "🤖",
        speech: "FUN = VULNERABILITY. DELETING.",
      },
      {
        bg: "#220700",
        caption:
          "One by one, every game platform went dark. Only DIVYANSH GAMING remained.",
        art: "🌑",
      },
      {
        bg: "#2a0a00",
        caption:
          "Divyansh stepped forward. This was the fight he'd been training for since age 12.",
        art: "👦",
        speech: "You can't delete what people love.",
      },
      {
        bg: "#330d00",
        caption:
          "He deployed every game, every player, every achievement — all at once. 1,000,000 HP.",
        art: "💥",
      },
      {
        bg: "#3d1000",
        caption:
          "MALVOS.exe DELETED. Gaming lives. The credits roll — but the game never ends.",
        art: "🎮",
        speech: "GAME OVER... for you.",
      },
    ],
  },
];

const EXTERNAL_COMICS: ExternalComic[] = [
  {
    id: "backwards-house",
    title: "The Backwards House",
    genre: "Horror / Mystery",
    genreColor: "#8B0000",
    cover: "🏚️",
    description:
      "While exploring an abandoned house, Catie finds a cursed VHS tape that traps their soul inside an old children's cartoon as a cartoon cat. Escape — or lose yourself forever.",
    publisher: "Skynix Art",
    count: "7 EPISODES",
    url: "https://globalcomix.com/c/the-backwards-house",
  },
  {
    id: "absolute-batman",
    title: "Absolute Batman (2024-)",
    genre: "Superhero / Action",
    genreColor: "#1a1aff",
    cover: "🦇",
    description:
      "Without the mansion. Without the money. Without the butler. What's left is the Absolute Dark Knight. DC Comics reimagines Batman from the ground up.",
    publisher: "DC Comics",
    count: "14+ ISSUES",
    url: "https://globalcomix.com/c/absolute-batman-2024-",
  },
];

// ── Comic Panel Component ──────────────────────────────────────────────────────
function ComicPanelView({ panel }: { panel: ComicPanel }) {
  return (
    <div
      className="relative flex flex-col items-center justify-center p-6 rounded"
      style={{
        background: panel.bg,
        border: "3px solid #111",
        minHeight: 200,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Halftone dots */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div
          className="text-6xl"
          style={{ filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.8))" }}
        >
          {panel.art}
        </div>
        {panel.speech && (
          <div
            className="relative px-4 py-2 rounded-2xl max-w-xs text-center"
            style={{
              background: "#fff",
              border: "2px solid #000",
              color: "#000",
              fontFamily: "'Bangers', 'Impact', sans-serif",
              fontSize: 15,
              fontWeight: 900,
              letterSpacing: "0.05em",
              lineHeight: 1.2,
            }}
          >
            {panel.speech}
            {/* speech bubble tail */}
            <div
              style={{
                position: "absolute",
                bottom: -10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "10px solid #000",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -7,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "8px solid #fff",
              }}
            />
          </div>
        )}
        <p
          className="text-center text-sm leading-snug max-w-sm"
          style={{
            color: "rgba(255,255,255,0.9)",
            fontFamily: "'Bangers', 'Impact', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            textShadow: "1px 1px 0 rgba(0,0,0,0.9)",
            letterSpacing: "0.03em",
          }}
        >
          {panel.caption}
        </p>
      </div>
    </div>
  );
}

// ── Story Reader Modal ─────────────────────────────────────────────────────────
function StoryModal({
  story,
  onClose,
}: { story: ComicStory; onClose: () => void }) {
  const [panel, setPanel] = useState(0);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="relative flex flex-col gap-4 rounded-lg overflow-hidden w-full"
        style={{
          maxWidth: 520,
          background: "#fff",
          border: "4px solid #000",
          boxShadow: "6px 6px 0 #000",
        }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        {/* Comic header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{
            background: story.genreColor,
            borderBottom: "3px solid #000",
          }}
        >
          <div>
            <div
              className="font-black text-xl tracking-wider"
              style={{
                fontFamily: "'Bangers', Impact, sans-serif",
                color: "#fff",
                textShadow: "2px 2px 0 rgba(0,0,0,0.5)",
                letterSpacing: "0.1em",
              }}
            >
              {story.title}
            </div>
            <div
              className="text-xs font-bold"
              style={{
                color: "rgba(255,255,255,0.85)",
                fontFamily: "Impact, sans-serif",
              }}
            >
              Panel {panel + 1} of {story.panels.length}
            </div>
          </div>
          <button
            type="button"
            data-ocid="comic.close_button"
            onClick={onClose}
            className="w-9 h-9 font-black text-lg rounded flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "2px solid rgba(0,0,0,0.4)",
              color: "#fff",
            }}
          >
            ✕
          </button>
        </div>

        {/* Panel */}
        <div className="px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={panel}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ComicPanelView panel={story.panels[panel]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-5 pb-4 gap-3">
          <button
            type="button"
            data-ocid="comic.panel.pagination_prev"
            onClick={() => setPanel((p) => Math.max(0, p - 1))}
            disabled={panel === 0}
            className="px-4 py-2 font-black text-sm tracking-widest uppercase rounded transition-all"
            style={{
              fontFamily: "Impact, sans-serif",
              background: panel === 0 ? "#eee" : "#000",
              color: panel === 0 ? "#999" : "#fff",
              border: "2px solid #000",
              cursor: panel === 0 ? "not-allowed" : "pointer",
            }}
          >
            ◀ PREV
          </button>

          <div className="flex gap-1.5">
            {story.panels.map((pn, i) => (
              <button
                key={pn.bg}
                type="button"
                onClick={() => setPanel(i)}
                className="w-3 h-3 rounded-full transition-all"
                style={{
                  background: i === panel ? story.genreColor : "#ccc",
                  border: "1.5px solid #000",
                }}
              />
            ))}
          </div>

          {panel < story.panels.length - 1 ? (
            <button
              type="button"
              data-ocid="comic.panel.pagination_next"
              onClick={() => setPanel((p) => p + 1)}
              className="px-4 py-2 font-black text-sm tracking-widest uppercase rounded"
              style={{
                fontFamily: "Impact, sans-serif",
                background: story.genreColor,
                color: "#fff",
                border: "2px solid #000",
              }}
            >
              NEXT ▶
            </button>
          ) : (
            <button
              type="button"
              data-ocid="comic.close_button"
              onClick={onClose}
              className="px-4 py-2 font-black text-sm tracking-widest uppercase rounded"
              style={{
                fontFamily: "Impact, sans-serif",
                background: "#222",
                color: "#fff",
                border: "2px solid #000",
              }}
            >
              THE END
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Story Card ────────────────────────────────────────────────────────────────
function StoryCard({
  story,
  index,
  onRead,
}: { story: ComicStory; index: number; onRead: () => void }) {
  return (
    <motion.article
      className="group cursor-pointer flex flex-col overflow-hidden rounded-lg"
      style={{
        background: "#fff",
        border: "3px solid #000",
        boxShadow: "4px 4px 0 #000",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 5) * 0.06 }}
      whileHover={{ y: -4, boxShadow: `6px 8px 0 ${story.genreColor}` }}
    >
      {/* Cover */}
      <div
        className="flex items-center justify-center py-8 relative"
        style={{ background: story.genreColor, borderBottom: "3px solid #000" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />
        <span className="text-6xl relative z-10">{story.cover}</span>
        <span
          className="absolute top-2 right-2 text-xs font-black px-2 py-0.5 rounded"
          style={{
            fontFamily: "Impact, sans-serif",
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            border: "1.5px solid #fff",
          }}
        >
          {story.genre}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3
          className="font-black text-base leading-tight"
          style={{
            fontFamily: "'Bangers', Impact, sans-serif",
            color: "#000",
            letterSpacing: "0.05em",
          }}
        >
          {story.title}
        </h3>
        <p
          className="text-xs leading-relaxed flex-1"
          style={{ color: "#333", fontFamily: "sans-serif" }}
        >
          {story.description}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{
              background: story.genreColor,
              color: "#fff",
              fontFamily: "Impact, sans-serif",
              border: "1.5px solid #000",
            }}
          >
            {story.panels.length} PANELS
          </span>
        </div>
        <button
          type="button"
          data-ocid={`comic.${story.id}.button`}
          onClick={onRead}
          className="mt-2 w-full py-2 font-black text-sm tracking-widest uppercase transition-all duration-200"
          style={{
            fontFamily: "'Bangers', Impact, sans-serif",
            background: "#000",
            color: story.genreColor,
            border: "2px solid #000",
            borderRadius: 4,
            letterSpacing: "0.1em",
          }}
        >
          📖 READ NOW
        </button>
      </div>
    </motion.article>
  );
}

// ── External Comic Card ───────────────────────────────────────────────────────
function ExternalComicCard({
  comic,
  index,
}: { comic: ExternalComic; index: number }) {
  return (
    <motion.article
      className="group cursor-pointer flex flex-col overflow-hidden rounded-lg"
      style={{
        background: "#fff",
        border: "3px solid #000",
        boxShadow: "4px 4px 0 #000",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 5) * 0.06 }}
      whileHover={{ y: -4, boxShadow: `6px 8px 0 ${comic.genreColor}` }}
    >
      {/* Cover */}
      <div
        className="flex items-center justify-center py-8 relative"
        style={{ background: comic.genreColor, borderBottom: "3px solid #000" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />
        {/* GLOBALCOMIX badge top-left */}
        <span
          className="absolute top-2 left-2 text-xs font-black px-2 py-0.5 rounded"
          style={{
            fontFamily: "Impact, sans-serif",
            background: "#ff6600",
            color: "#fff",
            border: "1.5px solid #fff",
            fontSize: 9,
            letterSpacing: "0.08em",
          }}
        >
          GLOBALCOMIX
        </span>
        <span className="text-6xl relative z-10">{comic.cover}</span>
        <span
          className="absolute top-2 right-2 text-xs font-black px-2 py-0.5 rounded"
          style={{
            fontFamily: "Impact, sans-serif",
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            border: "1.5px solid #fff",
          }}
        >
          {comic.genre}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3
          className="font-black text-base leading-tight"
          style={{
            fontFamily: "'Bangers', Impact, sans-serif",
            color: "#000",
            letterSpacing: "0.05em",
          }}
        >
          {comic.title}
        </h3>
        <p
          className="text-xs leading-relaxed flex-1"
          style={{ color: "#333", fontFamily: "sans-serif" }}
        >
          {comic.description}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{
              background: comic.genreColor,
              color: "#fff",
              fontFamily: "Impact, sans-serif",
              border: "1.5px solid #000",
            }}
          >
            {comic.count}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              background: "#111",
              color: "#aaa",
              fontFamily: "Impact, sans-serif",
              border: "1.5px solid #333",
              fontSize: 10,
            }}
          >
            {comic.publisher}
          </span>
        </div>
        <a
          href={comic.url}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid={`comic.${comic.id}.button`}
          className="mt-2 w-full py-2 font-black text-sm tracking-widest uppercase transition-all duration-200 text-center block"
          style={{
            fontFamily: "'Bangers', Impact, sans-serif",
            background: "#000",
            color: comic.genreColor,
            border: "2px solid #000",
            borderRadius: 4,
            letterSpacing: "0.1em",
            textDecoration: "none",
          }}
        >
          🌐 READ FREE
        </a>
      </div>
    </motion.article>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function ComicStoriesSection() {
  const [activeStory, setActiveStory] = useState<ComicStory | null>(null);

  return (
    <section
      id="comics"
      data-ocid="comic.section"
      className="relative py-24 overflow-hidden"
      style={{
        background: "#fffef5",
        backgroundImage:
          "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded mb-4"
            style={{
              background: "#000",
              color: "#fff",
              fontFamily: "Impact, sans-serif",
              fontSize: 11,
              letterSpacing: "0.2em",
              border: "2px solid #000",
            }}
          >
            📚 DIVYANSH GAMING PRESENTS
          </div>
          <h2
            className="font-black text-5xl md:text-6xl mb-3"
            style={{
              fontFamily: "'Bangers', Impact, sans-serif",
              color: "#000",
              letterSpacing: "0.1em",
              textShadow: "4px 4px 0 #ff4400, 8px 8px 0 rgba(255,68,0,0.3)",
            }}
          >
            COMIC UNIVERSE
          </h2>
          <p
            className="text-base font-bold max-w-lg mx-auto"
            style={{
              fontFamily: "Impact, sans-serif",
              color: "#333",
              letterSpacing: "0.05em",
            }}
          >
            12 epic stories — Horror, Hero, Adventure & more. Tap to read!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {STORIES.map((story, i) => (
            <StoryCard
              key={story.id}
              story={story}
              index={i}
              onRead={() => setActiveStory(story)}
            />
          ))}
          {EXTERNAL_COMICS.map((comic, i) => (
            <ExternalComicCard
              key={comic.id}
              comic={comic}
              index={STORIES.length + i}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeStory && (
          <StoryModal
            story={activeStory}
            onClose={() => setActiveStory(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
