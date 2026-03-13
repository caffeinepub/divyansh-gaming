import { useEffect, useRef, useState } from "react";

interface CinematicIntroProps {
  onComplete: () => void;
  forceShow?: boolean;
}

const TOTAL_DURATION = 60000; // 60 seconds

interface Scene {
  id: number;
  startMs: number;
  endMs: number;
  chapter: string;
  lines: string[];
  bg: string;
  accent: string;
  mood: string;
  visualType: string;
}

const SCENES: Scene[] = [
  {
    id: 1,
    startMs: 0,
    endMs: 6000,
    chapter: "Chapter 1: A Normal Boy",
    lines: [
      "In a small town in India...",
      "...lived a 12-year-old boy named",
      "Divyansh Yadav.",
    ],
    bg: "radial-gradient(ellipse at center, oklch(0.18 0.04 60) 0%, oklch(0.08 0.02 40) 100%)",
    accent: "oklch(0.75 0.12 60)",
    mood: "sepia",
    visualType: "bedroom",
  },
  {
    id: 2,
    startMs: 6000,
    endMs: 12000,
    chapter: "The First Spark",
    lines: [
      "One night, he discovered something...",
      "...a world beyond the ordinary.",
    ],
    bg: "radial-gradient(ellipse at 30% 60%, oklch(0.15 0.08 230) 0%, oklch(0.06 0.02 230) 80%)",
    accent: "oklch(0.72 0.18 230)",
    mood: "blue",
    visualType: "screen-glow",
  },
  {
    id: 3,
    startMs: 12000,
    endMs: 18000,
    chapter: "The Game Begins",
    lines: [
      "He played his first game...",
      "...and something inside him",
      "changed forever.",
    ],
    bg: "radial-gradient(ellipse at center, oklch(0.12 0.06 160) 0%, oklch(0.06 0.02 200) 100%)",
    accent: "oklch(0.82 0.18 160)",
    mood: "neon-green",
    visualType: "controller",
  },
  {
    id: 4,
    startMs: 18000,
    endMs: 26000,
    chapter: "The Obsession",
    lines: [
      "Hours turned into days...",
      "He practiced. He failed.",
      "He practiced again.",
    ],
    bg: "radial-gradient(ellipse at center, oklch(0.10 0.08 200) 0%, oklch(0.06 0.03 195) 100%)",
    accent: "oklch(0.82 0.18 200)",
    mood: "cyan",
    visualType: "clock",
  },
  {
    id: 5,
    startMs: 26000,
    endMs: 34000,
    chapter: "The Discovery: Code",
    lines: [
      "Then he asked:",
      "'How are games made?'",
      "He opened a code editor for the first time.",
      "And the real journey began.",
    ],
    bg: "radial-gradient(ellipse at center, oklch(0.10 0.06 145) 0%, oklch(0.05 0.02 145) 100%)",
    accent: "oklch(0.72 0.22 145)",
    mood: "matrix",
    visualType: "matrix",
  },
  {
    id: 6,
    startMs: 34000,
    endMs: 42000,
    chapter: "The Builder",
    lines: [
      "Line by line, he built his worlds.",
      "Bugs. Crashes. Restarts.",
      "But he never stopped.",
    ],
    bg: "radial-gradient(ellipse at center, oklch(0.10 0.10 295) 0%, oklch(0.06 0.04 295) 100%)",
    accent: "oklch(0.72 0.22 295)",
    mood: "purple",
    visualType: "wireframe",
  },
  {
    id: 7,
    startMs: 42000,
    endMs: 50000,
    chapter: "The Creator",
    lines: [
      "From a student to a gamer.",
      "From a gamer to a developer.",
      "From a developer to a CREATOR.",
    ],
    bg: "radial-gradient(ellipse at center, oklch(0.20 0.12 80) 0%, oklch(0.08 0.04 60) 100%)",
    accent: "oklch(0.85 0.18 80)",
    mood: "gold",
    visualType: "rocket",
  },
  {
    id: 8,
    startMs: 50000,
    endMs: 57000,
    chapter: "His Legacy",
    lines: [
      "At just 12 years old...",
      "Divyansh Yadav built something extraordinary.",
      "This is his world. Welcome to it.",
    ],
    bg: "radial-gradient(ellipse at center, oklch(0.22 0.14 70) 0%, oklch(0.08 0.04 60) 100%)",
    accent: "oklch(0.85 0.18 80)",
    mood: "epic-gold",
    visualType: "trophy",
  },
  {
    id: 9,
    startMs: 57000,
    endMs: 60000,
    chapter: "",
    lines: ["DIVYANSH GAMING"],
    bg: "radial-gradient(ellipse at center, oklch(0.12 0.10 200) 0%, oklch(0.04 0.02 200) 100%)",
    accent: "oklch(0.82 0.18 200)",
    mood: "logo",
    visualType: "logo",
  },
];

// ─── Web Audio helpers ────────────────────────────────────────────────────────
function getAudioCtx(): AudioContext | null {
  try {
    return new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
  } catch {
    return null;
  }
}

function playHeartbeat(ctx: AudioContext) {
  const pump = (delay: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 55;
    osc.type = "sine";
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + delay + 0.05);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + 0.2);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.3);
  };
  for (let i = 0; i < 3; i++) pump(i * 0.75);
}

function playGameChime(ctx: AudioContext) {
  const notes = [261, 329, 392, 523];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = "square";
    gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.12 + 0.25);
    osc.start(ctx.currentTime + i * 0.12);
    osc.stop(ctx.currentTime + i * 0.12 + 0.3);
  });
}

function playMatrixZap(ctx: AudioContext) {
  for (let i = 0; i < 6; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800 + Math.random() * 1200;
    osc.type = "sawtooth";
    const t = ctx.currentTime + i * 0.08;
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.06);
    osc.start(t);
    osc.stop(t + 0.1);
  }
}

function playTriumphantFanfare(ctx: AudioContext) {
  const chord = [261, 329, 392, 523, 659];
  for (const freq of chord) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = "square";
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.5);
  }

  const melody = [392, 440, 523, 659];
  for (let mi = 0; mi < melody.length; mi++) {
    const freq = melody[mi];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = "triangle";
    const t = ctx.currentTime + 0.4 + mi * 0.18;
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.3);
    osc.start(t);
    osc.stop(t + 0.4);
  }
}

function playEpicBoom(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(80, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.8);
  osc.type = "sine";
  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 2.5);
}

// ─── Visual components per scene ─────────────────────────────────────────────
function BedroomVisual() {
  return (
    <div style={{ position: "relative", width: 200, height: 160 }}>
      {/* Desk */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          width: 160,
          height: 8,
          background: "oklch(0.45 0.08 50)",
          borderRadius: 2,
        }}
      />
      {/* Book stack */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: 28 + i * 10,
            left: 30 + i * 2,
            width: 50,
            height: 8,
            background: `oklch(${0.55 + i * 0.05} 0.12 ${30 + i * 20})`,
            borderRadius: 1,
          }}
        />
      ))}
      {/* Lamp */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          right: 30,
          width: 6,
          height: 40,
          background: "oklch(0.55 0.05 50)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 65,
          right: 18,
          width: 30,
          height: 18,
          borderRadius: "50% 50% 0 0",
          background: "oklch(0.75 0.12 60)",
          boxShadow: "0 0 20px oklch(0.85 0.18 80 / 0.5)",
        }}
      />
      {/* Window */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 70,
          width: 60,
          height: 50,
          border: "2px solid oklch(0.55 0.06 50)",
          background: "oklch(0.15 0.04 230 / 0.6)",
        }}
      />
    </div>
  );
}

function ScreenGlowVisual() {
  return (
    <div style={{ position: "relative", width: 200, height: 160 }}>
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 40,
          width: 120,
          height: 80,
          background: "oklch(0.15 0.06 230)",
          border: "2px solid oklch(0.52 0.14 230 / 0.6)",
          borderRadius: 4,
          boxShadow:
            "0 0 30px oklch(0.62 0.18 230 / 0.7), 0 0 60px oklch(0.52 0.14 230 / 0.4)",
          animation: "screenPulse 2s ease-in-out infinite",
        }}
      />
      {/* Scan lines */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={`scan-line-${i}`}
          style={{
            position: "absolute",
            top: 28 + i * 12,
            left: 48,
            width: 104,
            height: 1,
            background: "oklch(0.72 0.18 230 / 0.2)",
          }}
        />
      ))}
      {/* Stand */}
      <div
        style={{
          position: "absolute",
          top: 102,
          left: 95,
          width: 10,
          height: 20,
          background: "oklch(0.35 0.04 230)",
        }}
      />
    </div>
  );
}

function ControllerVisual() {
  return (
    <div
      style={{
        width: 160,
        height: 100,
        background: "oklch(0.18 0.04 200)",
        borderRadius: "40px 40px 30px 30px",
        border: "2px solid oklch(0.52 0.18 160 / 0.8)",
        boxShadow: "0 0 30px oklch(0.72 0.22 160 / 0.5)",
        position: "relative",
        animation: "controllerFloat 2s ease-in-out infinite",
      }}
    >
      {/* D-pad */}
      <div
        style={{
          position: "absolute",
          top: 35,
          left: 28,
          width: 36,
          height: 12,
          background: "oklch(0.72 0.18 160)",
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 23,
          left: 40,
          width: 12,
          height: 36,
          background: "oklch(0.72 0.18 160)",
          borderRadius: 2,
        }}
      />
      {/* Buttons */}
      {[
        { top: 25, left: 98, color: "oklch(0.72 0.22 0)" },
        { top: 25, left: 116, color: "oklch(0.72 0.18 200)" },
        { top: 37, left: 107, color: "oklch(0.82 0.18 160)" },
        { top: 37, left: 89, color: "oklch(0.85 0.18 80)" },
      ].map((b) => (
        <div
          key={b.color}
          style={{
            position: "absolute",
            top: b.top,
            left: b.left,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: b.color,
            boxShadow: `0 0 6px ${b.color}`,
          }}
        />
      ))}
    </div>
  );
}

function ClockVisual() {
  return (
    <div
      style={{
        width: 100,
        height: 100,
        borderRadius: "50%",
        border: "3px solid oklch(0.82 0.18 200)",
        boxShadow: "0 0 20px oklch(0.72 0.18 200 / 0.6)",
        position: "relative",
        animation: "spin 0.8s linear infinite",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 2,
          height: 35,
          background: "oklch(0.82 0.18 200)",
          transformOrigin: "50% 100%",
          transform: "translateX(-50%) translateY(-100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 2,
          height: 25,
          background: "oklch(0.92 0.10 200)",
          transformOrigin: "50% 100%",
          transform: "translateX(-50%) translateY(-100%) rotate(45deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "oklch(0.82 0.18 200)",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}

function MatrixVisual({ chars }: { chars: string[] }) {
  return (
    <div
      style={{
        width: 220,
        height: 140,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
        color: "oklch(0.72 0.22 145)",
        textShadow: "0 0 8px oklch(0.72 0.22 145)",
        overflow: "hidden",
        lineHeight: 1.4,
        letterSpacing: "0.08em",
        display: "grid",
        gridTemplateColumns: "repeat(16, 1fr)",
        gap: 2,
      }}
    >
      {chars.map((c, idx) => (
        <span
          key={`char-${idx}-${c}`}
          style={{
            opacity: 0.3 + Math.random() * 0.7,
            animation: `matrixFade ${0.5 + Math.random() * 1.5}s ease-in-out infinite alternate`,
          }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}

function WireframeVisual() {
  return (
    <svg
      width="200"
      height="150"
      viewBox="0 0 200 150"
      role="img"
      aria-label="Wireframe cube"
      style={{ filter: "drop-shadow(0 0 8px oklch(0.62 0.22 295))" }}
    >
      <g
        stroke="oklch(0.62 0.22 295)"
        strokeWidth="1"
        fill="none"
        opacity="0.7"
      >
        {/* Cube wireframe */}
        <rect
          x="60"
          y="40"
          width="80"
          height="70"
          style={{ animation: "wireframeBuild 0.4s ease-out forwards" }}
        />
        <rect
          x="80"
          y="25"
          width="80"
          height="70"
          opacity="0.5"
          style={{ animation: "wireframeBuild 0.8s ease-out forwards" }}
        />
        <line
          x1="60"
          y1="40"
          x2="80"
          y2="25"
          style={{ animation: "wireframeBuild 1.2s ease-out forwards" }}
        />
        <line
          x1="140"
          y1="40"
          x2="160"
          y2="25"
          style={{ animation: "wireframeBuild 1.4s ease-out forwards" }}
        />
        <line
          x1="60"
          y1="110"
          x2="80"
          y2="95"
          style={{ animation: "wireframeBuild 1.6s ease-out forwards" }}
        />
        <line
          x1="140"
          y1="110"
          x2="160"
          y2="95"
          style={{ animation: "wireframeBuild 1.8s ease-out forwards" }}
        />
      </g>
      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`grid-line-${i}`}
          x1={20 + i * 40}
          y1="140"
          x2={20 + i * 40}
          y2="120"
          stroke="oklch(0.62 0.22 295)"
          strokeWidth="0.5"
          opacity="0.3"
        />
      ))}
    </svg>
  );
}

function RocketVisual() {
  return (
    <div
      style={{
        position: "relative",
        width: 80,
        height: 160,
        animation: "rocketLaunch 3s ease-in infinite",
      }}
    >
      {/* Rocket body */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 25,
          width: 30,
          height: 80,
          background:
            "linear-gradient(to bottom, oklch(0.85 0.18 80), oklch(0.65 0.14 70))",
          borderRadius: "15px 15px 5px 5px",
          boxShadow: "0 0 20px oklch(0.85 0.18 80 / 0.6)",
        }}
      />
      {/* Nose */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 25,
          width: 0,
          height: 0,
          borderLeft: "15px solid transparent",
          borderRight: "15px solid transparent",
          borderBottom: "25px solid oklch(0.85 0.18 80)",
        }}
      />
      {/* Fins */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 10,
          width: 0,
          height: 0,
          borderRight: "18px solid oklch(0.72 0.14 70)",
          borderTop: "30px solid transparent",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 52,
          width: 0,
          height: 0,
          borderLeft: "18px solid oklch(0.72 0.14 70)",
          borderTop: "30px solid transparent",
        }}
      />
      {/* Flame */}
      <div
        style={{
          position: "absolute",
          top: 108,
          left: 28,
          width: 24,
          height: 35,
          background:
            "radial-gradient(ellipse at top, oklch(0.92 0.18 60), oklch(0.72 0.22 30), transparent)",
          borderRadius: "0 0 50% 50%",
          animation: "flameFlicker 0.15s ease-in-out infinite alternate",
        }}
      />
    </div>
  );
}

function TrophyVisual() {
  return (
    <div
      style={{
        position: "relative",
        width: 120,
        height: 160,
        animation: "trophyGlow 1.5s ease-in-out infinite alternate",
      }}
    >
      {/* Cup */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 20,
          width: 80,
          height: 80,
          background:
            "linear-gradient(135deg, oklch(0.92 0.18 80), oklch(0.72 0.22 70), oklch(0.85 0.18 75))",
          borderRadius: "0 0 50% 50%",
          boxShadow:
            "0 0 30px oklch(0.85 0.18 80 / 0.7), inset 0 4px 8px oklch(0.95 0.12 90 / 0.3)",
        }}
      />
      {/* Handles */}
      <div
        style={{
          position: "absolute",
          top: 25,
          left: 5,
          width: 20,
          height: 30,
          border: "6px solid oklch(0.75 0.18 80)",
          borderRadius: "50%",
          borderRight: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 25,
          left: 95,
          width: 20,
          height: 30,
          border: "6px solid oklch(0.75 0.18 80)",
          borderRadius: "50%",
          borderLeft: "none",
        }}
      />
      {/* Stem */}
      <div
        style={{
          position: "absolute",
          top: 88,
          left: 52,
          width: 16,
          height: 30,
          background: "oklch(0.72 0.18 80)",
        }}
      />
      {/* Base */}
      <div
        style={{
          position: "absolute",
          top: 116,
          left: 25,
          width: 70,
          height: 14,
          background:
            "linear-gradient(to right, oklch(0.65 0.18 80), oklch(0.85 0.22 75), oklch(0.65 0.18 80))",
          borderRadius: 3,
          boxShadow: "0 0 20px oklch(0.85 0.18 80 / 0.5)",
        }}
      />
      {/* Star */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 47,
          fontSize: 24,
          lineHeight: 1,
          filter: "drop-shadow(0 0 6px oklch(0.95 0.18 90))",
        }}
      >
        ⭐
      </div>
    </div>
  );
}

function LogoVisual() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        animation: "logoReveal 1s ease-out forwards",
      }}
    >
      <div
        style={{
          fontSize: 64,
          lineHeight: 1,
          filter: "drop-shadow(0 0 20px oklch(0.82 0.18 200))",
        }}
      >
        🎮
      </div>
    </div>
  );
}

// ─── Scene visual renderer ────────────────────────────────────────────────────
function SceneVisual({
  visualType,
  matrixChars,
}: {
  visualType: string;
  matrixChars: string[];
}) {
  switch (visualType) {
    case "bedroom":
      return <BedroomVisual />;
    case "screen-glow":
      return <ScreenGlowVisual />;
    case "controller":
      return <ControllerVisual />;
    case "clock":
      return <ClockVisual />;
    case "matrix":
      return <MatrixVisual chars={matrixChars} />;
    case "wireframe":
      return <WireframeVisual />;
    case "rocket":
      return <RocketVisual />;
    case "trophy":
      return <TrophyVisual />;
    case "logo":
      return <LogoVisual />;
    default:
      return null;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CinematicIntro({
  onComplete,
  forceShow = false,
}: CinematicIntroProps) {
  const alreadyPlayed =
    typeof sessionStorage !== "undefined" &&
    sessionStorage.getItem("intro_played") === "1";

  const [visible, setVisible] = useState(forceShow || !alreadyPlayed);
  const [elapsed, setElapsed] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const lastSceneRef = useRef(-1);
  const soundEnabledRef = useRef(true);

  // Matrix rain characters
  const matrixCharsRef = useRef<string[]>(
    Array.from({ length: 80 }, () =>
      String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96)),
    ),
  );

  const complete = () => {
    sessionStorage.setItem("intro_played", "1");
    setFadeOut(true);
    setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 800);
  };

  // Check sound preference
  useEffect(() => {
    const pref = localStorage.getItem("sound_enabled");
    soundEnabledRef.current = pref !== "false";
  }, []);

  // Reset and replay when forceShow changes to true
  useEffect(() => {
    if (forceShow) {
      setVisible(true);
      setElapsed(0);
      setCurrentSceneIndex(0);
      setLineIndex(0);
      setFadeOut(false);
    }
  }, [forceShow]);

  const completeRef = useRef(complete);
  completeRef.current = complete;

  useEffect(() => {
    if (!visible) return;

    startTimeRef.current = performance.now();
    audioCtxRef.current = getAudioCtx();

    const tick = (now: number) => {
      const ms = now - startTimeRef.current;
      setElapsed(Math.min(ms, TOTAL_DURATION));

      // Find current scene
      const sceneIdx = SCENES.findIndex((s) => ms >= s.startMs && ms < s.endMs);
      if (sceneIdx !== -1) {
        setCurrentSceneIndex(sceneIdx);

        // Scene entry sounds
        if (sceneIdx !== lastSceneRef.current) {
          lastSceneRef.current = sceneIdx;
          setLineIndex(0);
          const ctx = audioCtxRef.current;
          if (ctx && soundEnabledRef.current) {
            if (sceneIdx === 0) playHeartbeat(ctx);
            if (sceneIdx === 2) playGameChime(ctx);
            if (sceneIdx === 4) playMatrixZap(ctx);
            if (sceneIdx === 6) playTriumphantFanfare(ctx);
            if (sceneIdx === 8) playEpicBoom(ctx);
          }
        }

        // Stagger lines within scene
        const scene = SCENES[sceneIdx];
        const sceneProgress = ms - scene.startMs;
        const lineDuration = (scene.endMs - scene.startMs) / scene.lines.length;
        const newLineIdx = Math.min(
          Math.floor(sceneProgress / lineDuration),
          scene.lines.length - 1,
        );
        setLineIndex(newLineIdx);
      }

      if (ms >= TOTAL_DURATION) {
        completeRef.current();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      audioCtxRef.current?.close();
    };
  }, [visible]);

  if (!visible) return null;

  const currentScene = SCENES[currentSceneIndex];
  const progress = (elapsed / TOTAL_DURATION) * 100;

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInWord {
          from { opacity: 0; transform: translateY(8px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes glitchText {
          0%, 90%, 100% { clip-path: none; transform: none; }
          91% { clip-path: inset(40% 0 20% 0); transform: translate(-3px, 2px); }
          93% { clip-path: inset(10% 0 60% 0); transform: translate(3px, -2px); }
          95% { clip-path: inset(70% 0 5% 0); transform: translate(-2px, 1px); }
        }
        @keyframes matrixFade {
          from { opacity: 0.2; color: oklch(0.52 0.18 145); }
          to   { opacity: 0.9; color: oklch(0.82 0.22 145); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes controllerFloat {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50%       { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes flameFlicker {
          from { transform: scaleX(0.85) scaleY(1.1); opacity: 0.9; }
          to   { transform: scaleX(1.15) scaleY(0.9); opacity: 1; }
        }
        @keyframes rocketLaunch {
          0%   { transform: translateY(0) scale(1); opacity: 1; }
          70%  { transform: translateY(-20px) scale(1.02); opacity: 1; }
          100% { transform: translateY(-40px) scale(1.05); opacity: 0.8; }
        }
        @keyframes trophyGlow {
          from { filter: drop-shadow(0 0 10px oklch(0.85 0.18 80 / 0.5)); }
          to   { filter: drop-shadow(0 0 30px oklch(0.85 0.18 80 / 0.9)); }
        }
        @keyframes logoReveal {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes screenPulse {
          0%, 100% { box-shadow: 0 0 30px oklch(0.62 0.18 230 / 0.7), 0 0 60px oklch(0.52 0.14 230 / 0.4); }
          50%       { box-shadow: 0 0 50px oklch(0.72 0.22 230 / 0.9), 0 0 90px oklch(0.62 0.18 230 / 0.6); }
        }
        @keyframes wireframeBuild {
          from { stroke-dashoffset: 400; opacity: 0; }
          to   { stroke-dashoffset: 0; opacity: 0.7; }
        }
        @keyframes chapterSlide {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes progressGlow {
          0%, 100% { box-shadow: 0 0 6px oklch(0.82 0.18 200 / 0.8); }
          50%       { box-shadow: 0 0 14px oklch(0.82 0.18 200); }
        }
        @keyframes introFadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        .intro-line-visible {
          animation: fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .intro-line-hidden {
          opacity: 0;
          pointer-events: none;
        }
        .logo-glitch {
          animation: glitchText 2s ease-in-out infinite;
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: currentScene.bg,
          transition: "background 1.5s ease",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          animation: fadeOut ? "introFadeOut 0.8s ease forwards" : undefined,
        }}
      >
        {/* Noise texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />

        {/* Skip button */}
        <button
          type="button"
          data-ocid="intro.close_button"
          onClick={complete}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            padding: "8px 20px",
            background: "transparent",
            border: `1px solid ${currentScene.accent}`,
            color: currentScene.accent,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            letterSpacing: "0.12em",
            cursor: "pointer",
            borderRadius: 4,
            textTransform: "uppercase",
            transition: "all 0.2s ease",
            zIndex: 10,
            boxShadow: `0 0 10px ${currentScene.accent}40`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              `${currentScene.accent}22`;
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              `0 0 20px ${currentScene.accent}80`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              `0 0 10px ${currentScene.accent}40`;
          }}
        >
          SKIP ▶
        </button>

        {/* Scene content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 40,
            padding: "0 24px",
            maxWidth: 700,
            width: "100%",
            textAlign: "center",
          }}
        >
          {/* Visual element */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 160,
            }}
          >
            <SceneVisual
              visualType={currentScene.visualType}
              matrixChars={matrixCharsRef.current}
            />
          </div>

          {/* Chapter title */}
          {currentScene.chapter && (
            <div
              key={`chapter-${currentScene.id}`}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: currentScene.accent,
                opacity: 0.8,
                animation: "chapterSlide 0.5s ease forwards",
              }}
            >
              {currentScene.chapter}
            </div>
          )}

          {/* Story lines */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: currentScene.visualType === "logo" ? 16 : 12,
              minHeight: 120,
              justifyContent: "center",
            }}
          >
            {currentScene.visualType === "logo" ? (
              // Logo scene special rendering
              <div
                key="logo-title"
                className="logo-glitch"
                style={{
                  fontFamily: "'Mona Sans', 'Cabinet Grotesk', sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(36px, 8vw, 72px)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: currentScene.accent,
                  textShadow: `0 0 20px ${currentScene.accent}, 0 0 60px ${currentScene.accent}80`,
                  animation:
                    "fadeInUp 0.8s ease forwards, glitchText 2s 0.5s infinite",
                }}
              >
                DIVYANSH GAMING
              </div>
            ) : (
              currentScene.lines.map((line, i) => (
                <div
                  key={`${currentScene.id}-line-${i}`}
                  className={
                    i <= lineIndex ? "intro-line-visible" : "intro-line-hidden"
                  }
                  style={{
                    fontFamily:
                      currentScene.visualType === "matrix"
                        ? "'JetBrains Mono', monospace"
                        : "'Mona Sans', 'Cabinet Grotesk', sans-serif",
                    fontWeight:
                      currentScene.visualType === "matrix" ? 400 : 700,
                    fontSize:
                      line.toUpperCase() === line && line.length < 20
                        ? "clamp(28px, 5vw, 48px)"
                        : "clamp(18px, 3.5vw, 28px)",
                    color:
                      i === currentScene.lines.length - 1 &&
                      currentScene.mood === "gold"
                        ? currentScene.accent
                        : "oklch(0.92 0.02 200)",
                    textShadow:
                      i === currentScene.lines.length - 1
                        ? `0 0 20px ${currentScene.accent}80`
                        : undefined,
                    lineHeight: 1.3,
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  {line}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "oklch(0.15 0.02 200)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: currentScene.accent,
              transition: "width 0.1s linear, background 1.5s ease",
              animation: "progressGlow 2s ease-in-out infinite",
            }}
          />
        </div>

        {/* Scene dots */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 6,
          }}
        >
          {SCENES.map((s, i) => (
            <div
              key={s.id}
              style={{
                width: i === currentSceneIndex ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background:
                  i <= currentSceneIndex
                    ? currentScene.accent
                    : "oklch(0.35 0.04 200)",
                transition: "all 0.4s ease",
                boxShadow:
                  i === currentSceneIndex
                    ? `0 0 8px ${currentScene.accent}`
                    : "none",
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
