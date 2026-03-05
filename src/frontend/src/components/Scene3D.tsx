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
function NeonGrid() {
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
      <gridHelper args={[80, 40, 0x00f5ff, 0x00f5ff]} />
    </group>
  );
}

// ─── Floating 3D Gamepad ──────────────────────────────────────────────────────
function FloatingGamepad() {
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
          emissive={0x00f5ff}
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
          emissive={0x00f5ff}
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
          emissive={0x00f5ff}
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
          emissive={0x00f5ff}
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

// ─── Scene Contents ───────────────────────────────────────────────────────────
function SceneContents() {
  return (
    <>
      <ambientLight color={0x111133} intensity={0.5} />
      <pointLight
        color={0x00f5ff}
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
      <NeonGrid />
      <FloatingGamepad />
      <ParticleSparks />
      <AdaptiveDpr pixelated />
    </>
  );
}

// ─── Main Scene3D Component ───────────────────────────────────────────────────
export default function Scene3D() {
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
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
