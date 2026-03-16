import { Gamepad2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { playClick, playGameStart } from "../hooks/useSoundEffects";
import ScoreSubmitModal from "./ScoreSubmitModal";
import ArcheryGame from "./games/ArcheryGame";
import AsteroidShooter from "./games/AsteroidShooter";
import BalloonBurst from "./games/BalloonBurst";
import BasketballShoot from "./games/BasketballShoot";
import BowlingGame from "./games/BowlingGame";
import BrickBreaker from "./games/BrickBreaker";
import BubblePop from "./games/BubblePop";
import BulletDodge from "./games/BulletDodge";
import CalmBreathing from "./games/CalmBreathing";
import ColorMatch from "./games/ColorMatch";
import DartGame from "./games/DartGame";
import DragonFighter from "./games/DragonFighter";
import FlappyBird from "./games/FlappyBird";
import GunFight from "./games/GunFight";
import IQTest from "./games/IQTest";
import IframeGame from "./games/IframeGame";
import LaserMaze from "./games/LaserMaze";
import MathQuiz from "./games/MathQuiz";
import MemoryMatch from "./games/MemoryMatch";
import MissileCommand from "./games/MissileCommand";
import NinjaJump from "./games/NinjaJump";
import NumberPuzzle from "./games/NumberPuzzle";
import PatternMemory from "./games/PatternMemory";
import PlatformerRun from "./games/PlatformerRun";
import PongGame from "./games/PongGame";
import ReactionTest from "./games/ReactionTest";
import RhythmTap from "./games/RhythmTap";
import SequenceMemory from "./games/SequenceMemory";
import SkiSlalom from "./games/SkiSlalom";
import SnakeGame from "./games/SnakeGame";
import SoccerPenalty from "./games/SoccerPenalty";
import SpaceInvaders from "./games/SpaceInvaders";
import SpeedRacer from "./games/SpeedRacer";
import SudokuMini from "./games/SudokuMini";
import TankBattle from "./games/TankBattle";
import TennisBall from "./games/TennisBall";
import TowerOfHanoi from "./games/TowerOfHanoi";
import TypingTest from "./games/TypingTest";
import WhackAMole from "./games/WhackAMole";
import WordScramble from "./games/WordScramble";
import ZombieShooter from "./games/ZombieShooter";

type Category = "all" | "action" | "sport" | "mind" | "stress";

interface MiniGame {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  component: React.ComponentType;
  tag: string;
  category: Category;
}

const MINI_GAMES: MiniGame[] = [
  // ── MIND ──
  {
    id: "snake",
    title: "Snake",
    description:
      "Classic snake game. Eat food to grow and rack up points — but don't bite yourself!",
    emoji: "🐍",
    color: "#00ff88",
    component: SnakeGame,
    tag: "Classic",
    category: "mind",
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
    category: "mind",
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
    category: "mind",
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
    category: "mind",
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
    category: "mind",
  },
  {
    id: "sudoku",
    title: "Sudoku Mini",
    description:
      "4×4 mini Sudoku — fill every row, column, and box with 1–4 without repeats.",
    emoji: "🔢",
    color: "#00aaff",
    component: SudokuMini,
    tag: "Puzzle",
    category: "mind",
  },
  {
    id: "numberpuzzle",
    title: "Number Puzzle",
    description:
      "Classic 15-tile sliding puzzle. Arrange numbers 1–15 in order.",
    emoji: "🧩",
    color: "#aa44ff",
    component: NumberPuzzle,
    tag: "Logic",
    category: "mind",
  },
  {
    id: "wordscramble",
    title: "Word Scramble",
    description:
      "Unscramble gaming words against the clock. How many can you get right?",
    emoji: "🔤",
    color: "#ff44aa",
    component: WordScramble,
    tag: "Word",
    category: "mind",
  },
  {
    id: "patternmemory",
    title: "Pattern Memory",
    description:
      "Watch the color pattern light up, then repeat it. How long a sequence can you handle?",
    emoji: "🧠",
    color: "#00ffcc",
    component: PatternMemory,
    tag: "Memory",
    category: "mind",
  },
  {
    id: "mathquiz",
    title: "Math Quiz",
    description:
      "Answer math questions as fast as you can. 30 seconds, build your streak!",
    emoji: "➕",
    color: "#ffd700",
    component: MathQuiz,
    tag: "Math",
    category: "mind",
  },
  {
    id: "iqtest",
    title: "IQ Test",
    description:
      "Which shape is the odd one out? Visual logic puzzles that test your IQ.",
    emoji: "🔍",
    color: "#88aaff",
    component: IQTest,
    tag: "Logic",
    category: "mind",
  },
  {
    id: "sequencememory",
    title: "Sequence Memory",
    description:
      "Simon Says with 6 colors. Watch the sequence and repeat it — level up!",
    emoji: "🌈",
    color: "#ff88cc",
    component: SequenceMemory,
    tag: "Memory",
    category: "mind",
  },
  {
    id: "towerofhanoi",
    title: "Tower of Hanoi",
    description:
      "Move all disks to the right peg. Can you do it in minimum moves?",
    emoji: "🗼",
    color: "#ff8800",
    component: TowerOfHanoi,
    tag: "Puzzle",
    category: "mind",
  },
  // ── ACTION ──
  {
    id: "bloxdhop",
    title: "BloxdHop.io",
    description:
      "Jump between blocks in this addictive multiplayer hop game. Survive the longest!",
    emoji: "🟦",
    color: "#00e5ff",
    component: () => (
      <IframeGame
        src="https://games.crazygames.com/en_US/bloxdhop-io/index.html"
        title="BloxdHop.io"
      />
    ),
    tag: "Multiplayer",
    category: "action",
  },
  {
    id: "paperio2",
    title: "Paper.io 2",
    description:
      "Expand your territory by drawing loops. Don't let others cross your trail!",
    emoji: "📄",
    color: "#ff6a00",
    component: () => (
      <IframeGame
        src="https://games.crazygames.com/en_US/paper-io-2/index.html"
        title="Paper.io 2"
      />
    ),
    tag: "Territory",
    category: "action",
  },
  {
    id: "ragdollarchers",
    title: "Ragdoll Archers",
    description:
      "Ragdoll physics archery madness! Fire arrows and knock out enemies.",
    emoji: "🏹",
    color: "#aa44ff",
    component: () => (
      <IframeGame
        src="https://games.crazygames.com/en_US/ragdoll-archers/index.html"
        title="Ragdoll Archers"
      />
    ),
    tag: "Physics",
    category: "action",
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
    category: "action",
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
    category: "action",
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
    category: "action",
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
    category: "action",
  },
  {
    id: "spaceinvaders",
    title: "Space Invaders",
    description:
      "Shoot the alien army before they reach the ground. Classic arcade!",
    emoji: "👾",
    color: "#ff4466",
    component: SpaceInvaders,
    tag: "Shooter",
    category: "action",
  },
  {
    id: "ninjajump",
    title: "Ninja Jump",
    description:
      "Endless runner — jump over obstacles as a neon ninja. How long can you last?",
    emoji: "🥷",
    color: "#00ffcc",
    component: NinjaJump,
    tag: "Runner",
    category: "action",
  },
  {
    id: "zombieshooter",
    title: "Zombie Shooter",
    description:
      "Click zombies before they reach the bottom. Don't let any escape!",
    emoji: "🧟",
    color: "#44ff44",
    component: ZombieShooter,
    tag: "Shooter",
    category: "action",
  },
  {
    id: "missilecommand",
    title: "Missile Command",
    description:
      "Click to create explosions and destroy incoming missiles before they hit your city.",
    emoji: "💣",
    color: "#ff8800",
    component: MissileCommand,
    tag: "Defense",
    category: "action",
  },
  {
    id: "bulletdodge",
    title: "Bullet Dodge",
    description:
      "Move your mouse to dodge a storm of incoming bullets. Survive as long as possible!",
    emoji: "💥",
    color: "#ff4466",
    component: BulletDodge,
    tag: "Dodge",
    category: "action",
  },
  {
    id: "tankbattle",
    title: "Tank Battle",
    description:
      "Drive your tank and destroy 3 enemy tanks before they get you.",
    emoji: "🪖",
    color: "#88dd44",
    component: TankBattle,
    tag: "Combat",
    category: "action",
  },
  {
    id: "lasermaze",
    title: "Laser Maze",
    description:
      "Navigate through laser beams without getting zapped. 3 levels!",
    emoji: "🔴",
    color: "#ff0066",
    component: LaserMaze,
    tag: "Stealth",
    category: "action",
  },
  {
    id: "dragonfighter",
    title: "Dragon Fighter",
    description:
      "Fly your dragon, shoot fireballs at incoming enemies. Don't get hit!",
    emoji: "🐉",
    color: "#ff8800",
    component: DragonFighter,
    tag: "Shoot",
    category: "action",
  },
  {
    id: "platformerrun",
    title: "Platformer Run",
    description:
      "Side-scrolling jump game. Collect coins, don't fall off the platforms!",
    emoji: "🏃",
    color: "#00aaff",
    component: PlatformerRun,
    tag: "Platform",
    category: "action",
  },
  {
    id: "gunfight",
    title: "Gun Fight",
    description:
      "Shoot moving targets in 30 seconds. Bigger targets = fewer points!",
    emoji: "🎯",
    color: "#ffcc00",
    component: GunFight,
    tag: "Shooting",
    category: "action",
  },
  // ── SPORT ──
  {
    id: "pong",
    title: "Pong",
    description:
      "Classic paddle battle against a smart AI. Move your mouse, first to 7 wins!",
    emoji: "🏓",
    color: "#ffd700",
    component: PongGame,
    tag: "Classic",
    category: "sport",
  },
  {
    id: "basketball",
    title: "Basketball Shoot",
    description:
      "Aim and shoot hoops! 10 shots to score as many baskets as possible.",
    emoji: "🏀",
    color: "#ff6600",
    component: BasketballShoot,
    tag: "Sport",
    category: "sport",
  },
  {
    id: "soccer",
    title: "Soccer Penalty",
    description: "5 penalty kicks — aim for the corner, beat the goalkeeper!",
    emoji: "⚽",
    color: "#00ff88",
    component: SoccerPenalty,
    tag: "Sport",
    category: "sport",
  },
  {
    id: "archery",
    title: "Archery",
    description: "Aim and shoot arrows at the target. Watch for wind drift!",
    emoji: "🏹",
    color: "#88cc44",
    component: ArcheryGame,
    tag: "Sport",
    category: "sport",
  },
  {
    id: "bowling",
    title: "Bowling",
    description:
      "Set power and angle, then bowl! 10 frames of strikes and spares.",
    emoji: "🎳",
    color: "#aaaaff",
    component: BowlingGame,
    tag: "Sport",
    category: "sport",
  },
  {
    id: "tennis",
    title: "Tennis Ball",
    description: "Keep the tennis ball bouncing with your paddle. Don't miss!",
    emoji: "🎾",
    color: "#ccff00",
    component: TennisBall,
    tag: "Sport",
    category: "sport",
  },
  {
    id: "skislalom",
    title: "Ski Slalom",
    description: "Steer your skier through red gates. Miss one and it's over!",
    emoji: "⛷️",
    color: "#88ccff",
    component: SkiSlalom,
    tag: "Sport",
    category: "sport",
  },
  {
    id: "darts",
    title: "Dart Game",
    description:
      "Throw 9 darts at the board. Aim for the bullseye for maximum points!",
    emoji: "🎯",
    color: "#ff4444",
    component: DartGame,
    tag: "Sport",
    category: "sport",
  },
  {
    id: "speedracer",
    title: "Speed Racer",
    description:
      "Top-down racer — change lanes to avoid red cars and collect gold coins.",
    emoji: "🏎️",
    color: "#00ffcc",
    component: SpeedRacer,
    tag: "Racing",
    category: "sport",
  },
  // ── STRESS RELIEF ──
  {
    id: "bubblepop",
    title: "Bubble Pop",
    description:
      "Pop the colorful bubbles before they float away. Relaxing and satisfying!",
    emoji: "🫧",
    color: "#ff88cc",
    component: BubblePop,
    tag: "Relax",
    category: "stress",
  },
  {
    id: "balloonburst",
    title: "Balloon Burst",
    description:
      "Pop cheerful balloons as they float upward. Stress relief at its finest!",
    emoji: "🎈",
    color: "#ff4488",
    component: BalloonBurst,
    tag: "Relax",
    category: "stress",
  },
  {
    id: "calmbreathing",
    title: "Calm Breathing",
    description:
      "Guided 4-4-6-2 breathing exercise. Expand and contract your breath for peace.",
    emoji: "🧘",
    color: "#00ffcc",
    component: CalmBreathing,
    tag: "Zen",
    category: "stress",
  },
  {
    id: "rhythmtap",
    title: "Rhythm Tap",
    description:
      "Tap in rhythm with the beat indicator. Find your flow and score big!",
    emoji: "🥁",
    color: "#aa44ff",
    component: RhythmTap,
    tag: "Music",
    category: "stress",
  },
];

// ── Stub / Coming-Soon Game ──────────────────────────────────────────────────
function ComingSoonGame({
  title,
  emoji,
  color,
}: { title: string; emoji: string; color: string }) {
  const [score, setScore] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setActive(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(
      () => setScore((s) => s + Math.floor(Math.random() * 25 + 5)),
      300,
    );
    return () => clearInterval(id);
  }, [active]);

  return (
    <div
      className="flex flex-col items-center justify-center gap-5 py-10"
      style={{ minWidth: 280 }}
    >
      <div
        className="text-6xl"
        style={{ filter: `drop-shadow(0 0 16px ${color})` }}
      >
        {emoji}
      </div>
      {active ? (
        <>
          <div
            className="text-xl font-mono font-bold tracking-widest"
            style={{ color }}
          >
            CHALLENGE MODE
          </div>
          <div
            className="text-3xl font-mono font-black"
            style={{ color: "#fff" }}
          >
            {score.toLocaleString()} pts
          </div>
          <div
            className="text-xs font-mono text-center max-w-[240px]"
            style={{ color: `${color}80` }}
          >
            {title} — Full game coming soon! Score keeps climbing as your
            potential grows.
          </div>
        </>
      ) : (
        <div
          className="text-base font-mono font-bold tracking-widest"
          style={{ color }}
        >
          LOADING...
        </div>
      )}
    </div>
  );
}

function makeStub(
  id: string,
  title: string,
  description: string,
  emoji: string,
  color: string,
  tag: string,
  category: "action" | "sport" | "mind" | "stress",
): MiniGame {
  return {
    id,
    title,
    description,
    emoji,
    color,
    component: () => (
      <ComingSoonGame title={title} emoji={emoji} color={color} />
    ),
    tag,
    category,
  };
}

const STUB_GAMES: MiniGame[] = [
  // ── ACTION stubs ──
  makeStub(
    "shieldbash",
    "Shield Bash",
    "Block attacks and counter-strike enemies with your energy shield.",
    "🛡️",
    "#00aaff",
    "Action",
    "action",
  ),
  makeStub(
    "flamethrower",
    "Flame Thrower",
    "Blast waves of fire at enemies. Don't run out of fuel!",
    "🔥",
    "#ff4400",
    "Action",
    "action",
  ),
  makeStub(
    "iceblast",
    "Ice Blast",
    "Freeze everything in sight before the heat melts you.",
    "❄️",
    "#88ddff",
    "Action",
    "action",
  ),
  makeStub(
    "shadowstrike",
    "Shadow Strike",
    "Vanish into shadows and eliminate targets silently.",
    "🥷",
    "#8844aa",
    "Action",
    "action",
  ),
  makeStub(
    "thunderkick",
    "Thunder Kick",
    "Channel lightning into powerful kicks. KAPOW!",
    "⚡",
    "#ffdd00",
    "Action",
    "action",
  ),
  makeStub(
    "vortexspin",
    "Vortex Spin",
    "Spin into enemies creating a devastating tornado.",
    "🌀",
    "#44aaff",
    "Action",
    "action",
  ),
  makeStub(
    "plasmaburst",
    "Plasma Burst",
    "Fire plasma bolts and chain-explode enemy clusters.",
    "🔮",
    "#cc44ff",
    "Action",
    "action",
  ),
  makeStub(
    "chainlightning",
    "Chain Lightning",
    "One bolt — ten enemies. Master the chain reaction.",
    "⚡",
    "#00ffff",
    "Action",
    "action",
  ),
  makeStub(
    "firearrow",
    "Fire Arrow",
    "Precision archery with explosive flaming arrows.",
    "🏹",
    "#ff6600",
    "Action",
    "action",
  ),
  makeStub(
    "gravitypull",
    "Gravity Pull",
    "Bend gravity to crush enemies from every direction.",
    "🌑",
    "#aaaaff",
    "Action",
    "action",
  ),
  makeStub(
    "warprunner",
    "Warp Runner",
    "Teleport through obstacles at breakneck speed.",
    "🏃",
    "#00ff88",
    "Action",
    "action",
  ),
  makeStub(
    "ghosthunt",
    "Ghost Hunt",
    "Find and trap invisible ghosts using your sensor.",
    "👻",
    "#ccccff",
    "Action",
    "action",
  ),
  makeStub(
    "robotwars",
    "Robot Wars",
    "Build and fight robots in explosive mech battles.",
    "🤖",
    "#88ff44",
    "Action",
    "action",
  ),
  makeStub(
    "cyberslash",
    "Cyber Slash",
    "Slice digital enemies with a neon katana blade.",
    "⚔️",
    "#ff44aa",
    "Action",
    "action",
  ),
  makeStub(
    "turbopunch",
    "Turbo Punch",
    "Rapid-fire punches at 200 BPM. Fast or fail.",
    "👊",
    "#ff8800",
    "Action",
    "action",
  ),
  makeStub(
    "magnetblast",
    "Magnet Blast",
    "Pull metal objects into enemies with magnetic force.",
    "🧲",
    "#ff0044",
    "Action",
    "action",
  ),
  makeStub(
    "quantumdash",
    "Quantum Dash",
    "Phase through walls in this mind-bending runner.",
    "💨",
    "#44ffdd",
    "Action",
    "action",
  ),
  makeStub(
    "neonblade",
    "Neon Blade",
    "Slash enemies in perfect rhythm to neon music.",
    "🗡️",
    "#ff00ff",
    "Action",
    "action",
  ),
  // ── SPORT stubs ──
  makeStub(
    "cricket",
    "Cricket",
    "Master the crease, time your shots, and smash sixes!",
    "🏏",
    "#88ff00",
    "Sport",
    "sport",
  ),
  makeStub(
    "baseball",
    "Baseball",
    "Swing the bat at perfect timing to knock it out the park!",
    "⚾",
    "#ffaa00",
    "Sport",
    "sport",
  ),
  makeStub(
    "volleyball",
    "Volleyball",
    "Spike, set, and serve your way to victory!",
    "🏐",
    "#ffdd44",
    "Sport",
    "sport",
  ),
  makeStub(
    "golf",
    "Golf",
    "Calculate wind, angle, and power for the perfect swing.",
    "⛳",
    "#00cc44",
    "Sport",
    "sport",
  ),
  makeStub(
    "swimmingrace",
    "Swimming Race",
    "Alternate left-right to swim fastest in the lane.",
    "🏊",
    "#0088ff",
    "Sport",
    "sport",
  ),
  makeStub(
    "horseracing",
    "Horse Racing",
    "Time your gallops perfectly for the ultimate race.",
    "🏇",
    "#aa8844",
    "Sport",
    "sport",
  ),
  makeStub(
    "bmxrace",
    "BMX Race",
    "Navigate dirt tracks and execute tricks for bonus time.",
    "🚴",
    "#ff8800",
    "Sport",
    "sport",
  ),
  makeStub(
    "skateboard",
    "Skateboard",
    "Grind rails, land tricks, and nail your combo score.",
    "🛹",
    "#ccaa00",
    "Sport",
    "sport",
  ),
  makeStub(
    "surfing",
    "Surfing",
    "Ride the wave and pull off gnarly tricks before it crashes.",
    "🏄",
    "#0099ff",
    "Sport",
    "sport",
  ),
  makeStub(
    "badminton",
    "Badminton",
    "Lightning-fast shuttlecock rallies against an AI opponent.",
    "🏸",
    "#ff4488",
    "Sport",
    "sport",
  ),
  makeStub(
    "tablefootball",
    "Table Football",
    "Spin your rods and score goals in retro foosball action.",
    "⚽",
    "#00aa66",
    "Sport",
    "sport",
  ),
  // ── MIND stubs ──
  makeStub(
    "chesslite",
    "Chess Lite",
    "Classic chess with hints and undo. Train your brain!",
    "♟️",
    "#888888",
    "Mind",
    "mind",
  ),
  makeStub(
    "logicgrid",
    "Logic Grid",
    "Solve deduction puzzles using a grid of clues.",
    "📊",
    "#4488ff",
    "Mind",
    "mind",
  ),
  makeStub(
    "binarydecode",
    "Binary Decode",
    "Convert binary to decimal faster than the timer!",
    "💻",
    "#00ff88",
    "Mind",
    "mind",
  ),
  makeStub(
    "cipherbreak",
    "Cipher Break",
    "Decode encrypted messages before time runs out.",
    "🔐",
    "#aa44ff",
    "Mind",
    "mind",
  ),
  makeStub(
    "crossword",
    "Crossword",
    "Gaming-themed crossword puzzle. Fill every clue!",
    "✏️",
    "#ffaa00",
    "Mind",
    "mind",
  ),
  makeStub(
    "anagram",
    "Anagram",
    "Unscramble gamer words faster than your opponent.",
    "🔡",
    "#ff4488",
    "Mind",
    "mind",
  ),
  makeStub(
    "triviablitz",
    "Trivia Blitz",
    "10 gaming trivia questions. Answer fast for bonus!",
    "🧐",
    "#00ccff",
    "Mind",
    "mind",
  ),
  makeStub(
    "visualriddle",
    "Visual Riddle",
    "Visual puzzles that twist your perception.",
    "👁️",
    "#cc88ff",
    "Mind",
    "mind",
  ),
  makeStub(
    "mazesolver",
    "Maze Solver",
    "Navigate complex mazes against the clock.",
    "🧩",
    "#88ffaa",
    "Mind",
    "mind",
  ),
  makeStub(
    "escaperoom",
    "Escape Room",
    "Solve puzzles to unlock the exit before time runs out.",
    "🚪",
    "#ff8844",
    "Mind",
    "mind",
  ),
  makeStub(
    "codebreaker",
    "Code Breaker",
    "Guess the secret color code in 6 tries.",
    "🎨",
    "#ffdd00",
    "Mind",
    "mind",
  ),
  makeStub(
    "memorypalace",
    "Memory Palace",
    "Place items in rooms and recall them in order.",
    "🏛️",
    "#44aaff",
    "Mind",
    "mind",
  ),
  // ── STRESS stubs ──
  makeStub(
    "sanddraw",
    "Sand Draw",
    "Draw calming patterns in virtual sand. Zen mode on.",
    "🏖️",
    "#ffcc88",
    "Zen",
    "stress",
  ),
  makeStub(
    "bubblebath",
    "Bubble Bath",
    "Tap floating soap bubbles. Each pop releases stress.",
    "🛁",
    "#88ccff",
    "Relax",
    "stress",
  ),
  makeStub(
    "stargaze",
    "Star Gaze",
    "Watch stars drift past and name constellations.",
    "🌟",
    "#aaaaff",
    "Calm",
    "stress",
  ),
  makeStub(
    "raindrops",
    "Rain Drops",
    "Watch and tap gentle raindrops. Instantly soothing.",
    "🌧️",
    "#88aacc",
    "Calm",
    "stress",
  ),
  makeStub(
    "lavalamp",
    "Lava Lamp",
    "Watch blobs drift peacefully in a neon lava lamp.",
    "🫧",
    "#ff88aa",
    "Chill",
    "stress",
  ),
  makeStub(
    "cloudwatch",
    "Cloud Watch",
    "Drag cloud shapes across the sky and spot animals.",
    "☁️",
    "#aaddff",
    "Chill",
    "stress",
  ),
  makeStub(
    "oceanwaves",
    "Ocean Waves",
    "Let the waves wash over you in this calming simulator.",
    "🌊",
    "#0077cc",
    "Chill",
    "stress",
  ),
  makeStub(
    "forestwalk",
    "Forest Walk",
    "Explore a gentle pixel forest. Listen to nature.",
    "🌲",
    "#44aa44",
    "Calm",
    "stress",
  ),
  makeStub(
    "fireflies",
    "Fireflies",
    "Click glowing fireflies in a dark meadow. Pure magic.",
    "✨",
    "#ffffaa",
    "Zen",
    "stress",
  ),
  makeStub(
    "koipond",
    "Koi Pond",
    "Tap to feed beautiful koi fish in a peaceful pond.",
    "🐟",
    "#ff8844",
    "Zen",
    "stress",
  ),
];

const ALL_GAMES: MiniGame[] = [...MINI_GAMES, ...STUB_GAMES];

const CATEGORIES: { key: Category; label: string; emoji: string }[] = [
  { key: "all", label: "All Games", emoji: "🎮" },
  { key: "action", label: "Action", emoji: "⚔️" },
  { key: "sport", label: "Sport", emoji: "🏆" },
  { key: "mind", label: "Mind", emoji: "🧠" },
  { key: "stress", label: "Stress Relief", emoji: "🧘" },
];

// ── Game Modal ──────────────────────────────────────────────────────────────────
function GameModal({
  game,
  onClose,
  onPostScore,
}: {
  game: MiniGame;
  onClose: () => void;
  onPostScore: (gameName: string) => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const GameComponent = game.component;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="minigames.post_score_button"
              onClick={() => {
                playClick();
                onPostScore(game.title);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold tracking-widest uppercase transition-all duration-200"
              style={{
                background: "rgba(0,229,255,0.08)",
                border: "1px solid rgba(0,229,255,0.3)",
                color: "#00e5ff",
              }}
            >
              🏆 Post Score
            </button>
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
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div
          className="w-full mb-5"
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${game.color}30, transparent)`,
          }}
        />
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
      transition={{ duration: 0.45, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div
        style={{
          height: 2,
          background: `linear-gradient(90deg, ${game.color}, ${game.color}40)`,
          boxShadow: `0 0 8px ${game.color}60`,
        }}
      />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div
            className="text-3xl"
            style={{ filter: `drop-shadow(0 0 8px ${game.color}60)` }}
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
        <h3
          className="font-display font-bold text-base leading-tight"
          style={{ color: "oklch(0.96 0.02 240)" }}
        >
          {game.title}
        </h3>
        <p
          className="text-xs leading-relaxed line-clamp-2"
          style={{
            color: "rgba(255,255,255,0.45)",
            fontFamily: "Sora, sans-serif",
          }}
        >
          {game.description}
        </p>
        <motion.button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded text-xs font-display font-bold tracking-widest uppercase transition-all duration-200"
          style={{
            background: `${game.color}15`,
            border: `1px solid ${game.color}45`,
            color: game.color,
            boxShadow: `0 0 16px ${game.color}15`,
          }}
          whileHover={{ boxShadow: `0 0 24px ${game.color}40` }}
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
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitGameName, setSubmitGameName] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const handleClose = useCallback(() => setActiveGame(null), []);
  const handlePostScore = useCallback((gameName: string) => {
    setSubmitGameName(gameName);
    setShowSubmitModal(true);
  }, []);

  const filteredGames =
    activeCategory === "all"
      ? ALL_GAMES
      : ALL_GAMES.filter((g) => g.category === activeCategory);

  return (
    <section id="mini-games" className="relative py-24 overflow-hidden">
      <div
        className="absolute top-0 left-1/4 w-96 h-64 rounded-full blur-3xl pointer-events-none opacity-8"
        style={{ background: "oklch(var(--neon-green))" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-48 rounded-full blur-3xl pointer-events-none opacity-6"
        style={{ background: "oklch(var(--neon-cyan))" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-mono tracking-widest uppercase"
            style={{
              background: "oklch(0.15 0.06 160)",
              border: "1px solid oklch(0.35 0.12 160)",
              color: "oklch(0.82 0.18 160)",
            }}
          >
            <Gamepad2 className="w-3.5 h-3.5" /> Mini Arcade
          </div>
          <h2
            className="font-display font-black text-4xl md:text-5xl mb-4"
            style={{
              color: "oklch(0.97 0.02 240)",
              textShadow: "0 0 40px oklch(0.75 0.2 160 / 0.4)",
            }}
          >
            80+ Mini Games
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontFamily: "Sora, sans-serif",
            }}
          >
            80+ games across 4 categories — Action, Sport, Mind, and Stress
            Relief.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              data-ocid={`minigames.${cat.key}.tab`}
              onClick={() => {
                playClick();
                setActiveCategory(cat.key);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-200"
              style={{
                background:
                  activeCategory === cat.key
                    ? "oklch(0.55 0.22 160)"
                    : "oklch(0.12 0.03 270)",
                border:
                  activeCategory === cat.key
                    ? "1px solid oklch(0.7 0.2 160)"
                    : "1px solid oklch(0.25 0.05 270)",
                color:
                  activeCategory === cat.key ? "#000" : "rgba(255,255,255,0.6)",
                boxShadow:
                  activeCategory === cat.key
                    ? "0 0 20px oklch(0.55 0.22 160 / 0.5)"
                    : "none",
              }}
            >
              {cat.emoji} {cat.label}{" "}
              {activeCategory === cat.key && `(${filteredGames.length})`}
            </button>
          ))}
        </motion.div>

        {/* Games Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredGames.map((game, i) => (
              <MiniGameCard
                key={game.id}
                game={game}
                index={i}
                onPlay={() => setActiveGame(game)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Count badge */}
        <motion.p
          className="text-center mt-8 text-sm font-mono"
          style={{ color: "rgba(255,255,255,0.3)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {filteredGames.length} games shown · New games added regularly!
        </motion.p>
      </div>

      {/* Game Modal */}
      <AnimatePresence>
        {activeGame && (
          <GameModal
            game={activeGame}
            onClose={handleClose}
            onPostScore={handlePostScore}
          />
        )}
      </AnimatePresence>

      {/* Score Submit Modal */}
      {showSubmitModal && (
        <ScoreSubmitModal
          open={showSubmitModal}
          defaultGame={submitGameName}
          onClose={() => setShowSubmitModal(false)}
        />
      )}
    </section>
  );
}
