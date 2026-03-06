import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ─── Constants ─────────────────────────────────────────────────────────────────
const GRAVITY = -0.018;
const JUMP_VEL = 0.35;
const MOVE_SPEED = 0.12;
const BALL_RADIUS = 0.5;
const START_POS: [number, number, number] = [0, 2, 0];
const FALL_Y = -10;

// ─── Platform definitions ──────────────────────────────────────────────────────
interface Platform {
  id: string;
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  isGoal?: boolean;
}

const PLATFORMS: Platform[] = [
  { id: "p0", pos: [0, 0, 0], size: [6, 0.5, 6], color: "#00f5ff" },
  { id: "p1", pos: [5, 0.5, 0], size: [4, 0.5, 4], color: "#c084fc" },
  { id: "p2", pos: [10, 1.5, 0], size: [4, 0.5, 4], color: "#00f5ff" },
  { id: "p3", pos: [15, 2.5, 2], size: [3.5, 0.5, 3.5], color: "#22d3ee" },
  { id: "p4", pos: [20, 4, -1], size: [3, 0.5, 3], color: "#a855f7" },
  { id: "p5", pos: [25, 5.5, 1], size: [3, 0.5, 3], color: "#00f5ff" },
  { id: "p6", pos: [30, 7, -2], size: [2.5, 0.5, 2.5], color: "#10b981" },
  { id: "p7", pos: [35, 8.5, 1], size: [2.5, 0.5, 2.5], color: "#c084fc" },
  { id: "p8", pos: [40, 10, -1], size: [2, 0.5, 2], color: "#00f5ff" },
  { id: "p9", pos: [45, 12, 0], size: [2, 0.5, 2], color: "#22d3ee" },
  { id: "p10", pos: [50, 14, 1], size: [2, 0.5, 2], color: "#a855f7" },
  { id: "p11", pos: [55, 16, -1], size: [2.5, 0.5, 2.5], color: "#00f5ff" },
  {
    id: "p12",
    pos: [60, 18, 0],
    size: [5, 0.5, 5],
    color: "#facc15",
    isGoal: true,
  },
];

// ─── Star collectibles ─────────────────────────────────────────────────────────
interface Star {
  id: string;
  pos: [number, number, number];
}

const STARS: Star[] = [
  { id: "s1", pos: [5, 2.5, 0] },
  { id: "s2", pos: [10, 3.5, 0] },
  { id: "s3", pos: [15, 4.5, 2] },
  { id: "s4", pos: [20, 6, -1] },
  { id: "s5", pos: [25, 7.5, 1] },
  { id: "s6", pos: [30, 9, -2] },
  { id: "s7", pos: [40, 12, -1] },
  { id: "s8", pos: [50, 16, 1] },
];

// ─── Ball player component ──────────────────────────────────────────────────────
interface BallProps {
  onScoreChange: (score: number) => void;
  onLivesChange: (lives: number) => void;
  onWin: () => void;
  onStarsChange: (collected: number) => void;
  keysRef: React.RefObject<Set<string>>;
  playing: boolean;
}

function Ball({
  onScoreChange,
  onLivesChange,
  onWin,
  onStarsChange,
  keysRef,
  playing,
}: BallProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const velRef = useRef({ x: 0, y: 0, z: 0 });
  const onGroundRef = useRef(false);
  const livesRef = useRef(3);
  const scoreRef = useRef(0);
  const collectedRef = useRef<Set<string>>(new Set());
  const winRef = useRef(false);
  const { camera } = useThree();

  const starsRef = useRef(
    STARS.map((s) => ({
      ...s,
      collected: false,
      mesh: null as THREE.Mesh | null,
    })),
  );

  const spawnAt = (pos: [number, number, number]) => {
    if (!meshRef.current) return;
    meshRef.current.position.set(...pos);
    velRef.current = { x: 0, y: 0, z: 0 };
    onGroundRef.current = false;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: spawnAt is stable, only needs to run once on mount
  useEffect(() => {
    spawnAt(START_POS);
  }, []);

  useFrame((_state, delta) => {
    if (!playing || !meshRef.current) return;
    const mesh = meshRef.current;
    const vel = velRef.current;
    const keys = keysRef.current ?? new Set();

    // Limit delta to prevent spiral of death
    const dt = Math.min(delta, 0.05);

    // Movement
    if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A"))
      vel.x -= MOVE_SPEED * dt * 60;
    if (keys.has("ArrowRight") || keys.has("d") || keys.has("D"))
      vel.x += MOVE_SPEED * dt * 60;
    if (keys.has("ArrowUp") || keys.has("w") || keys.has("W"))
      vel.z -= MOVE_SPEED * dt * 60;
    if (keys.has("ArrowDown") || keys.has("s") || keys.has("S"))
      vel.z += MOVE_SPEED * dt * 60;

    // Jump
    if ((keys.has(" ") || keys.has("Space")) && onGroundRef.current) {
      vel.y = JUMP_VEL;
      onGroundRef.current = false;
    }

    // Gravity
    vel.y += GRAVITY * dt * 60;

    // Clamp horizontal speed
    vel.x = Math.max(-0.4, Math.min(0.4, vel.x));
    vel.z = Math.max(-0.4, Math.min(0.4, vel.z));

    // Friction
    vel.x *= 0.88;
    vel.z *= 0.88;

    // Proposed new position
    const newX = mesh.position.x + vel.x;
    const newY = mesh.position.y + vel.y;
    const newZ = mesh.position.z + vel.z;

    // Platform collision
    let landed = false;
    for (const plat of PLATFORMS) {
      const [px, py, pz] = plat.pos;
      const [sw, sh, sd] = plat.size;
      const hw = sw / 2;
      const hd = sd / 2;
      const platTop = py + sh / 2;

      // Ball bottom
      const ballBottom = newY - BALL_RADIUS;

      if (
        newX > px - hw - BALL_RADIUS &&
        newX < px + hw + BALL_RADIUS &&
        newZ > pz - hd - BALL_RADIUS &&
        newZ < pz + hd + BALL_RADIUS &&
        ballBottom <= platTop &&
        mesh.position.y - BALL_RADIUS >= platTop - 0.2
      ) {
        mesh.position.y = platTop + BALL_RADIUS;
        vel.y = 0;
        onGroundRef.current = true;
        landed = true;

        // Goal platform
        if (plat.isGoal && !winRef.current) {
          winRef.current = true;
          onWin();
        }
        break;
      }
    }
    if (!landed) onGroundRef.current = false;

    mesh.position.x = newX;
    if (!landed) mesh.position.y = newY;
    mesh.position.z = newZ;

    // Fall detection
    if (mesh.position.y < FALL_Y) {
      livesRef.current = Math.max(0, livesRef.current - 1);
      onLivesChange(livesRef.current);
      spawnAt(START_POS);
      if (livesRef.current <= 0) {
        // Game over handled in parent
      }
    }

    // Star collection
    for (const star of starsRef.current) {
      if (star.collected || collectedRef.current.has(star.id)) continue;
      const dist = mesh.position.distanceTo(new THREE.Vector3(...star.pos));
      if (dist < BALL_RADIUS + 0.6) {
        star.collected = true;
        collectedRef.current.add(star.id);
        scoreRef.current += 100;
        onScoreChange(scoreRef.current);
        onStarsChange(collectedRef.current.size);
      }
    }

    // Camera follow (third-person)
    const targetCamX = mesh.position.x - 8;
    const targetCamY = mesh.position.y + 6;
    const targetCamZ = mesh.position.z + 10;
    camera.position.x += (targetCamX - camera.position.x) * 0.08;
    camera.position.y += (targetCamY - camera.position.y) * 0.08;
    camera.position.z += (targetCamZ - camera.position.z) * 0.08;
    camera.lookAt(mesh.position.x + 2, mesh.position.y + 1, mesh.position.z);
  });

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[BALL_RADIUS, 24, 24]} />
      <meshStandardMaterial
        color="#00f5ff"
        emissive="#00f5ff"
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.5}
      />
    </mesh>
  );
}

// ─── Platform mesh ─────────────────────────────────────────────────────────────
function PlatformMesh({ platform }: { platform: Platform }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!platform.isGoal || !meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
  });

  return (
    <mesh ref={meshRef} position={platform.pos} receiveShadow castShadow>
      <boxGeometry args={platform.size} />
      <meshStandardMaterial
        color={platform.color}
        emissive={platform.color}
        emissiveIntensity={platform.isGoal ? 0.4 : 0.1}
        roughness={0.5}
        metalness={0.3}
      />
    </mesh>
  );
}

// ─── Star collectible mesh ──────────────────────────────────────────────────────
function StarMesh({ star, collected }: { star: Star; collected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || collected) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 2;
    meshRef.current.position.y =
      star.pos[1] + Math.sin(state.clock.elapsedTime * 2) * 0.15;
  });

  if (collected) return null;

  return (
    <mesh ref={meshRef} position={star.pos}>
      <icosahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial
        color="#facc15"
        emissive="#facc15"
        emissiveIntensity={0.8}
        roughness={0.1}
        metalness={0.4}
      />
    </mesh>
  );
}

// ─── Stars tracking (needs to be synced from Ball) ─────────────────────────────
function StarMeshes({ collected }: { collected: Set<string> }) {
  return (
    <>
      {STARS.map((star) => (
        <StarMesh
          key={star.id}
          star={star}
          collected={collected.has(star.id)}
        />
      ))}
    </>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
interface SceneProps {
  keysRef: React.RefObject<Set<string>>;
  playing: boolean;
  onScoreChange: (s: number) => void;
  onLivesChange: (l: number) => void;
  onWin: () => void;
  onStarsChange: (n: number) => void;
  collectedStars: Set<string>;
}

function GameScene({
  keysRef,
  playing,
  onScoreChange,
  onLivesChange,
  onWin,
  onStarsChange,
  collectedStars,
}: SceneProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.25} color="#1a0d2e" />
      <pointLight
        position={[0, 20, 0]}
        intensity={1.5}
        color="#00f5ff"
        distance={80}
      />
      <pointLight
        position={[30, 15, 5]}
        intensity={1}
        color="#c084fc"
        distance={60}
      />
      <pointLight
        position={[60, 20, 0]}
        intensity={1.2}
        color="#facc15"
        distance={50}
      />
      <fog attach="fog" args={["#050810", 40, 100]} />

      {/* Stars background */}
      <Stars />

      {/* Platforms */}
      {PLATFORMS.map((p) => (
        <PlatformMesh key={p.id} platform={p} />
      ))}

      {/* Collectibles */}
      <StarMeshes collected={collectedStars} />

      {/* Ball */}
      <Ball
        keysRef={keysRef}
        playing={playing}
        onScoreChange={onScoreChange}
        onLivesChange={onLivesChange}
        onWin={onWin}
        onStarsChange={onStarsChange}
      />
    </>
  );
}

// ─── Background stars ──────────────────────────────────────────────────────────
function Stars() {
  const meshRef = useRef<THREE.Points>(null);

  const positions = (() => {
    const count = 600;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 200;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 100;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    return arr;
  })();

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        color="#c084fc"
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
type GameStatus = "start" | "playing" | "gameover" | "win";

export default function Platformer3D() {
  const [status, setStatus] = useState<GameStatus>("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [starsCollected, setStarsCollected] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [collectedStars, setCollectedStars] = useState<Set<string>>(new Set());
  const keysRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playingRef = useRef(false);

  useEffect(() => {
    playingRef.current = status === "playing";
  }, [status]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (
        playingRef.current &&
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Timer
  useEffect(() => {
    if (status === "playing") {
      timerRef.current = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const handleStart = () => {
    setScore(0);
    setLives(3);
    setStarsCollected(0);
    setTimeElapsed(0);
    setCollectedStars(new Set());
    setStatus("playing");
  };

  const handleLivesChange = (l: number) => {
    setLives(l);
    if (l <= 0) setStatus("gameover");
  };

  const handleScoreChange = (s: number) => setScore(s);

  const handleStarsChange = (n: number) => {
    setStarsCollected(n);
    // Update collected set — track by count (simple sync)
    setCollectedStars((prev) => {
      const updated = new Set(prev);
      // Add stars by index since we can't get ids from Ball directly
      const toAdd = STARS.slice(0, n).map((s) => s.id);
      for (const id of toAdd) updated.add(id);
      return updated;
    });
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* HUD */}
      {status === "playing" && (
        <div
          className="flex flex-wrap items-center gap-4 px-5 py-3 rounded-lg font-mono text-sm"
          style={{
            background: "oklch(0.09 0.025 270 / 0.9)",
            border: "1px solid oklch(0.82 0.18 200 / 0.2)",
            boxShadow: "0 0 20px oklch(0.82 0.18 200 / 0.08)",
          }}
        >
          <span style={{ color: "oklch(0.78 0.17 60)" }}>⭐ {score}</span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <span style={{ color: "oklch(0.82 0.18 200)" }}>
            🌟 {starsCollected}/8
          </span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>
            ⏱ {formatTime(timeElapsed)}
          </span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <span style={{ color: "#f87171" }}>❤️ {lives}</span>
        </div>
      )}

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden"
        style={{
          width: "100%",
          maxWidth: 800,
          height: 480,
          border: "1px solid oklch(0.82 0.18 200 / 0.2)",
          boxShadow: "0 0 40px oklch(0.82 0.18 200 / 0.08)",
          background: "#050810",
          outline: "2px solid transparent",
          cursor: status === "playing" ? "none" : "default",
        }}
        data-ocid="platformer.canvas_target"
      >
        <Canvas
          camera={{ position: START_POS[0] - 8, fov: 60 }}
          gl={{ antialias: true, alpha: false }}
          style={{ background: "#050810" }}
        >
          <GameScene
            keysRef={keysRef}
            playing={status === "playing"}
            onScoreChange={handleScoreChange}
            onLivesChange={handleLivesChange}
            onWin={() => setStatus("win")}
            onStarsChange={handleStarsChange}
            collectedStars={collectedStars}
          />
        </Canvas>

        {/* Start overlay */}
        {status === "start" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-5"
            style={{ background: "rgba(5,8,16,0.88)" }}
          >
            <div
              className="font-display font-black text-3xl md:text-4xl text-center"
              style={{
                color: "#00f5ff",
                textShadow: "0 0 30px #00f5ff80",
              }}
            >
              NEON PLATFORMER 3D
            </div>
            <div
              className="flex flex-col gap-1.5 text-center font-mono text-sm"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              <p>WASD / Arrow Keys: Move</p>
              <p>Space: Jump (on platform)</p>
              <p>Collect 8 Stars — Reach the Gold Platform!</p>
            </div>
            <button
              type="button"
              className="px-8 py-3 rounded font-display font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: "oklch(0.82 0.18 200 / 0.15)",
                border: "1.5px solid oklch(0.82 0.18 200 / 0.6)",
                color: "oklch(0.82 0.18 200)",
                boxShadow: "0 0 20px oklch(0.82 0.18 200 / 0.2)",
              }}
              onClick={handleStart}
              data-ocid="platformer.start.button"
            >
              ▶ Play
            </button>
            <p
              className="font-mono text-xs"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              Click the game area to enable keyboard controls
            </p>
          </div>
        )}

        {/* Game Over overlay */}
        {status === "gameover" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-5"
            style={{ background: "rgba(5,8,16,0.88)" }}
          >
            <div
              className="font-display font-black text-4xl"
              style={{ color: "#f87171", textShadow: "0 0 20px #f8717180" }}
            >
              GAME OVER
            </div>
            <div
              className="font-mono text-base"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Score: {score} · Stars: {starsCollected}/8 · Time:{" "}
              {formatTime(timeElapsed)}
            </div>
            <button
              type="button"
              className="px-8 py-3 rounded font-display font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: "oklch(0.45 0.15 25 / 0.15)",
                border: "1.5px solid oklch(0.55 0.18 25 / 0.6)",
                color: "#f87171",
              }}
              onClick={handleStart}
              data-ocid="platformer.restart.button"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Win overlay */}
        {status === "win" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-5"
            style={{ background: "rgba(5,8,16,0.88)" }}
          >
            <div
              className="text-5xl"
              style={{ filter: "drop-shadow(0 0 12px #facc15)" }}
            >
              🏆
            </div>
            <div
              className="font-display font-black text-3xl text-center"
              style={{ color: "#facc15", textShadow: "0 0 20px #facc1580" }}
            >
              LEVEL COMPLETE!
            </div>
            <div
              className="font-mono text-base"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Score: {score} · Stars: {starsCollected}/8 · Time:{" "}
              {formatTime(timeElapsed)}
            </div>
            <button
              type="button"
              className="px-8 py-3 rounded font-display font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: "oklch(0.78 0.17 60 / 0.15)",
                border: "1.5px solid oklch(0.78 0.17 60 / 0.6)",
                color: "oklch(0.78 0.17 60)",
              }}
              onClick={handleStart}
              data-ocid="platformer.play_again.button"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Focused indicator — unused but kept for future use */}
      </div>

      {/* Controls reference */}
      <div
        className="flex flex-wrap gap-4 justify-center text-xs font-mono"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        <span>WASD / Arrows: Move</span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
        <span>Space: Jump</span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
        <span>Collect ⭐ stars · Reach 🟡 gold platform</span>
      </div>
    </div>
  );
}
