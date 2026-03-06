import { AdaptiveDpr } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { Color, InstancedBufferAttribute, Object3D } from "three";
import type { Group, InstancedMesh } from "three";

// ─── Neon color hex constants ─────────────────────────────────────────────────
const NEON_COLORS = [
  0x00f5ff, // neon cyan
  0xa855f7, // neon violet
  0xff00aa, // hot pink
  0x00ff9f, // neon green
  0xffd700, // gold
];

// ─── Warp Star Field ──────────────────────────────────────────────────────────
const COUNT_STARS = 600;
const COUNT_SPARKS = 100;

function WarpStarField() {
  const meshRef = useRef<InstancedMesh>(null);

  const { posRef, colorAttr } = useMemo(() => {
    const positions = Array.from(
      { length: COUNT_STARS },
      () =>
        [
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 120,
        ] as [number, number, number],
    );

    const colorArr = new Float32Array(COUNT_STARS * 3);
    const c = new Color();
    for (let i = 0; i < COUNT_STARS; i++) {
      c.setHex(NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)]);
      colorArr[i * 3] = c.r;
      colorArr[i * 3 + 1] = c.g;
      colorArr[i * 3 + 2] = c.b;
    }
    const colorAttr = new InstancedBufferAttribute(colorArr, 3);
    return { posRef: { current: positions }, colorAttr };
  }, []);

  const tempObj = useMemo(() => new Object3D(), []);

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const speed = 22 * delta;
    const pos = posRef.current;
    for (let i = 0; i < COUNT_STARS; i++) {
      pos[i][2] += speed;
      if (pos[i][2] > 10) {
        pos[i][0] = (Math.random() - 0.5) * 60;
        pos[i][1] = (Math.random() - 0.5) * 40;
        pos[i][2] = -120;
      }
      tempObj.position.set(pos[i][0], pos[i][1], pos[i][2]);
      tempObj.updateMatrix();
      mesh.setMatrixAt(i, tempObj.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT_STARS]}>
      <sphereGeometry args={[0.04, 4, 4]}>
        <primitive attach="attributes-color" object={colorAttr} />
      </sphereGeometry>
      <meshStandardMaterial
        emissive={0x00f5ff}
        emissiveIntensity={2.5}
        color={0x111111}
        vertexColors
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// ─── Neon Grid Floor ──────────────────────────────────────────────────────────
function NeonGrid({ themeColor }: { themeColor: number }) {
  const groupRef = useRef<Group>(null);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.z += delta * 4;
    if (groupRef.current.position.z > 4) {
      groupRef.current.position.z -= 4;
    }
  });

  return (
    <group ref={groupRef} position={[0, -3.5, -20]}>
      <gridHelper args={[80, 40, themeColor, themeColor]} />
    </group>
  );
}

// ─── Floating 3D Gamepad ──────────────────────────────────────────────────────
function FloatingGamepad({ themeColor }: { themeColor: number }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.4;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    groupRef.current.position.y = 1.5 + Math.sin(t * 0.8) * 0.2;
  });

  return (
    <group ref={groupRef} position={[3.5, 1.5, -2]}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[2.2, 0.9, 0.35]} />
        <meshStandardMaterial
          color={0x0a0820}
          emissive={themeColor}
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Left handle */}
      <mesh position={[-0.8, -0.55, 0]}>
        <boxGeometry args={[0.65, 0.65, 0.3]} />
        <meshStandardMaterial
          color={0x0a0820}
          emissive={themeColor}
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Right handle */}
      <mesh position={[0.8, -0.55, 0]}>
        <boxGeometry args={[0.65, 0.65, 0.3]} />
        <meshStandardMaterial
          color={0x0a0820}
          emissive={themeColor}
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Left joystick base */}
      <mesh position={[-0.55, 0.1, 0.2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.08, 16]} />
        <meshStandardMaterial
          color={0x000000}
          emissive={0xa855f7}
          emissiveIntensity={1.2}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      {/* Left joystick cap */}
      <mesh position={[-0.55, 0.22, 0.2]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial
          color={0x000000}
          emissive={0xa855f7}
          emissiveIntensity={1.2}
        />
      </mesh>
      {/* Right joystick base */}
      <mesh position={[0.2, -0.18, 0.2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.08, 16]} />
        <meshStandardMaterial
          color={0x000000}
          emissive={0xa855f7}
          emissiveIntensity={1.2}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      {/* Right joystick cap */}
      <mesh position={[0.2, -0.06, 0.2]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial
          color={0x000000}
          emissive={0xa855f7}
          emissiveIntensity={1.2}
        />
      </mesh>
      {/* Button A — red */}
      <mesh position={[0.65, 0.08, 0.2]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          emissive={0xff2266}
          emissiveIntensity={1.8}
          color={0x050510}
          toneMapped={false}
        />
      </mesh>
      {/* Button B — green */}
      <mesh position={[0.85, 0.22, 0.2]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          emissive={0x00ff9f}
          emissiveIntensity={1.8}
          color={0x050510}
          toneMapped={false}
        />
      </mesh>
      {/* Button X — blue */}
      <mesh position={[0.65, 0.36, 0.2]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          emissive={0x3399ff}
          emissiveIntensity={1.8}
          color={0x050510}
          toneMapped={false}
        />
      </mesh>
      {/* Button Y — yellow */}
      <mesh position={[0.45, 0.22, 0.2]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          emissive={0xffcc00}
          emissiveIntensity={1.8}
          color={0x050510}
          toneMapped={false}
        />
      </mesh>
      {/* D-pad horizontal */}
      <mesh position={[-0.22, -0.1, 0.2]}>
        <boxGeometry args={[0.35, 0.12, 0.06]} />
        <meshStandardMaterial
          color={0x000000}
          emissive={0xa855f7}
          emissiveIntensity={1.2}
        />
      </mesh>
      {/* D-pad vertical */}
      <mesh position={[-0.22, -0.1, 0.2]}>
        <boxGeometry args={[0.12, 0.35, 0.06]} />
        <meshStandardMaterial
          color={0x000000}
          emissive={0xa855f7}
          emissiveIntensity={1.2}
        />
      </mesh>
      {/* Glowing edge trim */}
      <mesh position={[0, 0, -0.18]}>
        <boxGeometry args={[2.25, 0.92, 0.02]} />
        <meshStandardMaterial
          color={0x000000}
          emissive={themeColor}
          emissiveIntensity={0.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ─── Particle Sparks ──────────────────────────────────────────────────────────
function ParticleSparks() {
  const meshRef = useRef<InstancedMesh>(null);

  const posRef = useRef(
    Array.from(
      { length: COUNT_SPARKS },
      () =>
        [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 30,
        ] as [number, number, number],
    ),
  );

  const velRef = useRef(
    Array.from(
      { length: COUNT_SPARKS },
      () =>
        [
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5,
        ] as [number, number, number],
    ),
  );

  const tempObj = useMemo(() => new Object3D(), []);

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const pos = posRef.current;
    const vel = velRef.current;
    for (let i = 0; i < COUNT_SPARKS; i++) {
      pos[i][0] += vel[i][0] * delta;
      pos[i][1] += vel[i][1] * delta;
      pos[i][2] += vel[i][2] * delta;

      const dist = Math.sqrt(pos[i][0] ** 2 + pos[i][1] ** 2 + pos[i][2] ** 2);
      if (dist > 18) {
        pos[i] = [
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
        ];
        vel[i] = [
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5,
        ];
      }
      tempObj.position.set(pos[i][0], pos[i][1], pos[i][2]);
      tempObj.updateMatrix();
      mesh.setMatrixAt(i, tempObj.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT_SPARKS]}>
      <sphereGeometry args={[0.02, 4, 4]} />
      <meshStandardMaterial
        color={0x00f5ff}
        emissive={0x00f5ff}
        emissiveIntensity={3}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// ─── Floating Trophy ──────────────────────────────────────────────────────────
function FloatingTrophy() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.35;
    groupRef.current.position.y = 1.5 + Math.sin(t * 0.7 + 1) * 0.18;
  });

  return (
    <group ref={groupRef} position={[-3.5, 1.5, -2]}>
      {/* Base */}
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[0.7, 0.12, 0.3]} />
        <meshStandardMaterial
          color={0x1a1000}
          emissive={0xffd700}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Stem */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.3, 12]} />
        <meshStandardMaterial
          color={0x1a1000}
          emissive={0xffd700}
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Cup lower */}
      <mesh position={[0, 0.0, 0]}>
        <cylinderGeometry args={[0.22, 0.12, 0.35, 16]} />
        <meshStandardMaterial
          color={0x1a1000}
          emissive={0xffd700}
          emissiveIntensity={1.2}
          metalness={0.9}
          roughness={0.08}
        />
      </mesh>
      {/* Cup upper */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.28, 0.22, 0.22, 16]} />
        <meshStandardMaterial
          color={0x1a1000}
          emissive={0xffd700}
          emissiveIntensity={1.2}
          metalness={0.9}
          roughness={0.08}
        />
      </mesh>
      {/* Left handle */}
      <mesh position={[-0.38, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.14, 0.035, 8, 16, Math.PI]} />
        <meshStandardMaterial
          color={0x1a1000}
          emissive={0xffd700}
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Right handle */}
      <mesh position={[0.38, 0.15, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.14, 0.035, 8, 16, Math.PI]} />
        <meshStandardMaterial
          color={0x1a1000}
          emissive={0xffd700}
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Star on top */}
      <mesh position={[0, 0.52, 0]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial
          color={0x1a1000}
          emissive={0xffd700}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ─── Orbiting Crystal Gems ────────────────────────────────────────────────────
const CRYSTAL_CONFIG = [
  { id: "c0", radius: 1.5, speed: 0.7, yOffset: 0.3, colorIdx: 0 },
  { id: "c1", radius: 2.0, speed: 0.5, yOffset: -0.2, colorIdx: 1 },
  { id: "c2", radius: 2.5, speed: 0.6, yOffset: 0.5, colorIdx: 2 },
  { id: "c3", radius: 2.2, speed: 0.45, yOffset: -0.4, colorIdx: 3 },
  { id: "c4", radius: 3.0, speed: 0.55, yOffset: 0.1, colorIdx: 4 },
  { id: "c5", radius: 3.5, speed: 0.4, yOffset: -0.1, colorIdx: 0 },
];

function OrbitingCrystals() {
  const groupRef = useRef<Group>(null);
  const crystalRefs = useRef<(Group | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    CRYSTAL_CONFIG.forEach((cfg, i) => {
      const c = crystalRefs.current[i];
      if (!c) return;
      const angle = t * cfg.speed + (i / CRYSTAL_CONFIG.length) * Math.PI * 2;
      c.position.x = Math.cos(angle) * cfg.radius;
      c.position.z = Math.sin(angle) * cfg.radius;
      c.position.y = cfg.yOffset + Math.sin(t * 0.8 + i) * 0.12;
      c.rotation.y += 0.02;
      c.rotation.x += 0.01;
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {CRYSTAL_CONFIG.map((cfg, i) => (
        <group
          key={cfg.id}
          ref={(el) => {
            crystalRefs.current[i] = el;
          }}
        >
          <mesh>
            <octahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial
              color={0x000000}
              emissive={NEON_COLORS[cfg.colorIdx % NEON_COLORS.length]}
              emissiveIntensity={2.5}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Helix Strand ─────────────────────────────────────────────────────────────
const HELIX_COUNT = 12;

function HelixStrand() {
  const groupRef = useRef<Group>(null);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.25;
  });

  const orbs: { id: string; x: number; y: number; z: number; color: number }[] =
    [];
  for (let i = 0; i < HELIX_COUNT; i++) {
    const t = (i / HELIX_COUNT) * Math.PI * 4;
    const y = (i / HELIX_COUNT) * 4 - 2;
    orbs.push({
      id: `ha${i}`,
      x: Math.cos(t) * 0.5,
      y,
      z: Math.sin(t) * 0.5,
      color: 0x00f5ff,
    });
    orbs.push({
      id: `hb${i}`,
      x: Math.cos(t + Math.PI) * 0.5,
      y,
      z: Math.sin(t + Math.PI) * 0.5,
      color: 0xa855f7,
    });
  }

  return (
    <group ref={groupRef} position={[-4.5, 0, -6]}>
      {orbs.map((orb) => (
        <mesh key={orb.id} position={[orb.x, orb.y, orb.z]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color={0x000000}
            emissive={orb.color}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Scene Contents ───────────────────────────────────────────────────────────
function SceneContents({ themeColor }: { themeColor: number }) {
  return (
    <>
      <ambientLight color={0x111133} intensity={0.5} />
      <pointLight
        color={themeColor}
        position={[0, 5, 0]}
        intensity={3}
        distance={30}
      />
      <pointLight
        color={0xa855f7}
        position={[5, 0, -3]}
        intensity={2.5}
        distance={25}
      />
      <pointLight
        color={0xff0066}
        position={[-5, 2, 2]}
        intensity={1.5}
        distance={20}
      />

      <WarpStarField />
      <NeonGrid themeColor={themeColor} />
      <FloatingGamepad themeColor={themeColor} />
      <FloatingTrophy />
      <OrbitingCrystals />
      <HelixStrand />
      <ParticleSparks />
      <AdaptiveDpr pixelated />
    </>
  );
}

// ─── Compact scene for inline lobby canvas ────────────────────────────────────
function LobbySceneContents({ themeColor }: { themeColor: number }) {
  return (
    <>
      <ambientLight color={0x111133} intensity={0.6} />
      <pointLight
        color={themeColor}
        position={[0, 4, 0]}
        intensity={4}
        distance={20}
      />
      <pointLight
        color={0xa855f7}
        position={[3, 0, -2]}
        intensity={2}
        distance={15}
      />
      <FloatingGamepad themeColor={themeColor} />
      <OrbitingCrystals />
      <ParticleSparks />
      <AdaptiveDpr pixelated />
    </>
  );
}

// ─── Main Scene3D Component ───────────────────────────────────────────────────
export default function Scene3D({
  themeColor = 0x00f5ff,
}: { themeColor?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 300 }}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "#0a0810",
      }}
    >
      <Suspense fallback={null}>
        <SceneContents themeColor={themeColor} />
      </Suspense>
    </Canvas>
  );
}

// ─── Lobby inline canvas ──────────────────────────────────────────────────────
export function LobbyCanvas({
  themeColor = 0x00f5ff,
}: { themeColor?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 1, 6], fov: 65, near: 0.1, far: 100 }}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
      style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
    >
      <Suspense fallback={null}>
        <LobbySceneContents themeColor={themeColor} />
      </Suspense>
    </Canvas>
  );
}
