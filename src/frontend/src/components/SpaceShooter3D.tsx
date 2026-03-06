import { AdaptiveDpr } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  CheckCircle,
  Heart,
  Loader2,
  Rocket,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useActor } from "../hooks/useActor";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Bullet {
  id: number;
  x: number;
  y: number;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  z: number;
  speed: number;
  size: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  type: "asteroid" | "drone" | "bomber";
  hp: number;
  zigzagPhase?: number;
}

interface PowerUp {
  id: number;
  x: number;
  y: number;
  type: "shield" | "rapidfire" | "nuke";
  rotY: number;
}

interface Boss {
  hp: number;
  maxHp: number;
  x: number;
  y: number;
  oscillatePhase: number;
  fireTimer: number;
  bullets: BossBullet[];
}

interface BossBullet {
  id: number;
  x: number;
  y: number;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
  z: number;
  age: number;
}

interface GameState {
  phase: "idle" | "playing" | "gameover";
  score: number;
  lives: number;
  wave: number;
  enemiesKilled: number;
}

// ─── Shared mutable ref for game data ─────────────────────────────────────────
interface GameData {
  playerX: number;
  bullets: Bullet[];
  enemies: Enemy[];
  powerUps: PowerUp[];
  explosions: Explosion[];
  boss: Boss | null;
  bossPhase: "none" | "incoming" | "active" | "defeated";
  nextId: number;
  spawnTimer: number;
  fireTimer: number;
  isAutoFiring: boolean;
  rapidFireUntil: number;
  onScoreHit: (points: number) => void;
  onLifeLost: () => void;
  onEnemyKilled: (points: number) => void;
  onPowerUp: (type: PowerUp["type"]) => void;
  onBossDefeated: (bossCount: number) => void;
  onBossIncoming: () => void;
}

// ─── Player Ship ──────────────────────────────────────────────────────────────
function PlayerShip({
  gameData,
}: { gameData: React.MutableRefObject<GameData> }) {
  const groupRef = useRef<THREE.Group>(null);
  const thrusterRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const targetX = gameData.current.playerX;
    groupRef.current.position.x +=
      (targetX - groupRef.current.position.x) * 0.12;
    groupRef.current.rotation.z =
      -(targetX - groupRef.current.position.x) * 0.3;

    if (thrusterRef.current) {
      const s = 0.8 + Math.sin(state.clock.elapsedTime * 12) * 0.2;
      thrusterRef.current.scale.y = s;
    }
  });

  return (
    <group ref={groupRef} position={[0, -3.5, 0]}>
      <mesh>
        <coneGeometry args={[0.25, 0.9, 6]} />
        <meshStandardMaterial
          color={0x050520}
          emissive={0x00f5ff}
          emissiveIntensity={0.9}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[-0.4, -0.25, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.5, 0.12, 0.08]} />
        <meshStandardMaterial
          color={0x050520}
          emissive={0x00f5ff}
          emissiveIntensity={0.7}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0.4, -0.25, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.5, 0.12, 0.08]} />
        <meshStandardMaterial
          color={0x050520}
          emissive={0x00f5ff}
          emissiveIntensity={0.7}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.15, 0.05]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color={0x000000}
          emissive={0xa855f7}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={thrusterRef} position={[0, -0.6, 0]}>
        <coneGeometry args={[0.12, 0.5, 8]} />
        <meshStandardMaterial
          color={0x000000}
          emissive={0xff6600}
          emissiveIntensity={3}
          transparent
          opacity={0.8}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-0.35, -0.5, 0]} scale={[0.6, 0.7, 0.6]}>
        <coneGeometry args={[0.08, 0.3, 6]} />
        <meshStandardMaterial
          color={0x000000}
          emissive={0xff4400}
          emissiveIntensity={2.5}
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.35, -0.5, 0]} scale={[0.6, 0.7, 0.6]}>
        <coneGeometry args={[0.08, 0.3, 6]} />
        <meshStandardMaterial
          color={0x000000}
          emissive={0xff4400}
          emissiveIntensity={2.5}
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ─── Bullets ──────────────────────────────────────────────────────────────────
function BulletsRenderer({
  gameData,
}: {
  gameData: React.MutableRefObject<GameData>;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const bullets = gameData.current.bullets;
    const alive: Bullet[] = [];
    for (const b of bullets) {
      const ny = b.y + delta * 18;
      if (ny < 7) alive.push({ ...b, y: ny });
    }
    gameData.current.bullets = alive;

    const count = alive.length;
    mesh.count = count;
    for (let i = 0; i < count; i++) {
      dummy.current.position.set(alive[i].x, alive[i].y, 0);
      dummy.current.updateMatrix();
      mesh.setMatrixAt(i, dummy.current.matrix);
    }
    if (count > 0) mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 80]}>
      <capsuleGeometry args={[0.04, 0.3, 4, 8]} />
      <meshStandardMaterial
        color={0x000000}
        emissive={0x00ffaa}
        emissiveIntensity={4}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// ─── Asteroid Enemies ─────────────────────────────────────────────────────────
function AsteroidEnemiesRenderer({
  gameData,
  playing,
}: {
  gameData: React.MutableRefObject<GameData>;
  playing: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh || !playing) return;

    const asteroids = gameData.current.enemies.filter(
      (e) => e.type === "asteroid",
    );
    const others = gameData.current.enemies.filter(
      (e) => e.type !== "asteroid",
    );
    const bullets = gameData.current.bullets;
    const aliveEnemies: Enemy[] = [];
    const aliveBullets: Bullet[] = [];
    const hitEnemyIds = new Set<number>();

    // Bullet collisions
    for (const bullet of bullets) {
      let hit = false;
      for (const enemy of asteroids) {
        if (hitEnemyIds.has(enemy.id)) continue;
        const dx = bullet.x - enemy.x;
        const dy = bullet.y - enemy.y;
        if (Math.sqrt(dx * dx + dy * dy) < enemy.size * 0.9) {
          const newHp = enemy.hp - 1;
          if (newHp <= 0) {
            hitEnemyIds.add(enemy.id);
            gameData.current.explosions.push({
              id: gameData.current.nextId++,
              x: enemy.x,
              y: enemy.y,
              z: 0,
              age: 0,
            });
            gameData.current.onEnemyKilled(10);
          } else {
            // Should not happen for asteroids (hp=1) but keep for safety
            const idx = gameData.current.enemies.findIndex(
              (e) => e.id === enemy.id,
            );
            if (idx !== -1) gameData.current.enemies[idx].hp = newHp;
          }
          hit = true;
          break;
        }
      }
      if (!hit) aliveBullets.push(bullet);
    }
    gameData.current.bullets = aliveBullets;

    for (const enemy of asteroids) {
      if (hitEnemyIds.has(enemy.id)) continue;
      const ny = enemy.y - enemy.speed * delta;
      if (ny < -5.5) {
        gameData.current.onLifeLost();
        continue;
      }
      const px = gameData.current.playerX;
      const dx = px - enemy.x;
      const dy = -3.5 - ny;
      if (Math.sqrt(dx * dx + dy * dy) < enemy.size * 0.8 + 0.3) {
        hitEnemyIds.add(enemy.id);
        gameData.current.explosions.push({
          id: gameData.current.nextId++,
          x: enemy.x,
          y: ny,
          z: 0,
          age: 0,
        });
        gameData.current.onLifeLost();
        continue;
      }
      aliveEnemies.push({
        ...enemy,
        y: ny,
        rotX: enemy.rotX + delta * 1.2,
        rotY: enemy.rotY + delta * 0.8,
        rotZ: enemy.rotZ + delta * 0.5,
      });
    }

    gameData.current.enemies = [...aliveEnemies, ...others];

    const count = aliveEnemies.length;
    mesh.count = count;
    for (let i = 0; i < count; i++) {
      dummy.current.position.set(
        aliveEnemies[i].x,
        aliveEnemies[i].y,
        aliveEnemies[i].z,
      );
      dummy.current.rotation.set(
        aliveEnemies[i].rotX,
        aliveEnemies[i].rotY,
        aliveEnemies[i].rotZ,
      );
      dummy.current.scale.setScalar(aliveEnemies[i].size);
      dummy.current.updateMatrix();
      mesh.setMatrixAt(i, dummy.current.matrix);
    }
    if (count > 0) mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 40]}>
      <icosahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial
        color={0x050510}
        emissive={0xff0066}
        emissiveIntensity={1.2}
        metalness={0.6}
        roughness={0.3}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// ─── Drone Enemies ─────────────────────────────────────────────────────────────
function DroneEnemiesRenderer({
  gameData,
  playing,
}: {
  gameData: React.MutableRefObject<GameData>;
  playing: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh || !playing) return;

    const drones = gameData.current.enemies.filter((e) => e.type === "drone");
    const others = gameData.current.enemies.filter((e) => e.type !== "drone");
    const bullets = gameData.current.bullets;
    const aliveEnemies: Enemy[] = [];
    const aliveBullets: Bullet[] = [];
    const hitEnemyIds = new Set<number>();

    for (const bullet of bullets) {
      let hit = false;
      for (const enemy of drones) {
        if (hitEnemyIds.has(enemy.id)) continue;
        const dx = bullet.x - enemy.x;
        const dy = bullet.y - enemy.y;
        if (Math.sqrt(dx * dx + dy * dy) < enemy.size * 0.9) {
          hitEnemyIds.add(enemy.id);
          gameData.current.explosions.push({
            id: gameData.current.nextId++,
            x: enemy.x,
            y: enemy.y,
            z: 0,
            age: 0,
          });
          gameData.current.onEnemyKilled(15);
          hit = true;
          break;
        }
      }
      if (!hit) aliveBullets.push(bullet);
    }
    gameData.current.bullets = aliveBullets;

    for (const enemy of drones) {
      if (hitEnemyIds.has(enemy.id)) continue;
      const ny = enemy.y - enemy.speed * delta;
      if (ny < -5.5) {
        gameData.current.onLifeLost();
        continue;
      }
      // Zigzag X
      const phase = (enemy.zigzagPhase ?? 0) + delta * 3;
      const nx = enemy.x + Math.sin(phase) * 0.08;
      const clampedX = Math.max(-4.5, Math.min(4.5, nx));

      const px = gameData.current.playerX;
      const dx = px - clampedX;
      const dy = -3.5 - ny;
      if (Math.sqrt(dx * dx + dy * dy) < enemy.size * 0.8 + 0.3) {
        hitEnemyIds.add(enemy.id);
        gameData.current.explosions.push({
          id: gameData.current.nextId++,
          x: clampedX,
          y: ny,
          z: 0,
          age: 0,
        });
        gameData.current.onLifeLost();
        continue;
      }
      aliveEnemies.push({
        ...enemy,
        x: clampedX,
        y: ny,
        zigzagPhase: phase,
        rotX: enemy.rotX + delta * 2.0,
        rotY: enemy.rotY + delta * 1.5,
        rotZ: enemy.rotZ + delta * 1.0,
      });
    }

    // Rebuild: non-drone enemies + alive drones
    gameData.current.enemies = [...others, ...aliveEnemies];

    const count = aliveEnemies.length;
    mesh.count = count;
    for (let i = 0; i < count; i++) {
      dummy.current.position.set(
        aliveEnemies[i].x,
        aliveEnemies[i].y,
        aliveEnemies[i].z,
      );
      dummy.current.rotation.set(
        aliveEnemies[i].rotX,
        aliveEnemies[i].rotY,
        aliveEnemies[i].rotZ,
      );
      dummy.current.scale.setScalar(aliveEnemies[i].size);
      dummy.current.updateMatrix();
      mesh.setMatrixAt(i, dummy.current.matrix);
    }
    if (count > 0) mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 30]}>
      <octahedronGeometry args={[0.45, 0]} />
      <meshStandardMaterial
        color={0x001a1a}
        emissive={0x00ffcc}
        emissiveIntensity={1.5}
        metalness={0.7}
        roughness={0.2}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// ─── Bomber Enemies ────────────────────────────────────────────────────────────
function BomberEnemiesRenderer({
  gameData,
  playing,
}: {
  gameData: React.MutableRefObject<GameData>;
  playing: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh || !playing) return;

    const bombers = gameData.current.enemies.filter((e) => e.type === "bomber");
    const others = gameData.current.enemies.filter((e) => e.type !== "bomber");
    const bullets = gameData.current.bullets;
    const aliveEnemies: Enemy[] = [];
    const aliveBullets: Bullet[] = [];
    const hitEnemyIds = new Set<number>();
    const damagedBombers = new Map<number, number>(); // id -> newHp

    for (const bullet of bullets) {
      let hit = false;
      for (const enemy of bombers) {
        if (hitEnemyIds.has(enemy.id)) continue;
        const dx = bullet.x - enemy.x;
        const dy = bullet.y - enemy.y;
        if (Math.sqrt(dx * dx + dy * dy) < enemy.size * 0.9) {
          const newHp = enemy.hp - 1;
          if (newHp <= 0) {
            hitEnemyIds.add(enemy.id);
            gameData.current.explosions.push({
              id: gameData.current.nextId++,
              x: enemy.x,
              y: enemy.y,
              z: 0,
              age: 0,
            });
            gameData.current.onEnemyKilled(25);
          } else {
            damagedBombers.set(enemy.id, newHp);
          }
          hit = true;
          break;
        }
      }
      if (!hit) aliveBullets.push(bullet);
    }
    gameData.current.bullets = aliveBullets;

    for (const enemy of bombers) {
      if (hitEnemyIds.has(enemy.id)) continue;
      const ny = enemy.y - enemy.speed * delta;
      if (ny < -5.5) {
        gameData.current.onLifeLost();
        continue;
      }
      const px = gameData.current.playerX;
      const dx = px - enemy.x;
      const dy = -3.5 - ny;
      if (Math.sqrt(dx * dx + dy * dy) < enemy.size * 0.8 + 0.3) {
        hitEnemyIds.add(enemy.id);
        gameData.current.explosions.push({
          id: gameData.current.nextId++,
          x: enemy.x,
          y: ny,
          z: 0,
          age: 0,
        });
        gameData.current.onLifeLost();
        continue;
      }
      const updatedHp = damagedBombers.has(enemy.id)
        ? (damagedBombers.get(enemy.id) ?? enemy.hp)
        : enemy.hp;
      aliveEnemies.push({
        ...enemy,
        hp: updatedHp,
        y: ny,
        rotX: enemy.rotX + delta * 0.8,
        rotY: enemy.rotY + delta * 0.5,
        rotZ: enemy.rotZ + delta * 0.3,
      });
    }

    gameData.current.enemies = [...others, ...aliveEnemies];

    const count = aliveEnemies.length;
    mesh.count = count;
    for (let i = 0; i < count; i++) {
      const bomber = aliveEnemies[i];
      const dimmed = bomber.hp < 2;
      dummy.current.position.set(bomber.x, bomber.y, bomber.z);
      dummy.current.rotation.set(bomber.rotX, bomber.rotY, bomber.rotZ);
      dummy.current.scale.setScalar(bomber.size);
      dummy.current.updateMatrix();
      mesh.setMatrixAt(i, dummy.current.matrix);
      // Use color to indicate damage (half opacity via emissive intensity)
      if (mesh.instanceColor) {
        mesh.instanceColor.setXYZ(i, dimmed ? 0.3 : 1.0, dimmed ? 0.2 : 0.4, 0);
      }
    }
    if (count > 0) {
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 20]}>
      <torusGeometry args={[0.4, 0.15, 6, 12]} />
      <meshStandardMaterial
        color={0x1a0800}
        emissive={0xff6600}
        emissiveIntensity={1.8}
        metalness={0.5}
        roughness={0.4}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// ─── Power-Ups Renderer ────────────────────────────────────────────────────────
function PowerUpsRenderer({
  gameData,
  playing,
}: {
  gameData: React.MutableRefObject<GameData>;
  playing: boolean;
}) {
  const shieldRef = useRef<THREE.InstancedMesh>(null);
  const rapidRef = useRef<THREE.InstancedMesh>(null);
  const nukeRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());

  useFrame((_state, delta) => {
    if (!playing) return;

    const powerUps = gameData.current.powerUps;
    const aliveShield: PowerUp[] = [];
    const aliveRapid: PowerUp[] = [];
    const aliveNuke: PowerUp[] = [];
    const px = gameData.current.playerX;
    const py = -3.5;

    for (const pu of powerUps) {
      const ny = pu.y - delta * 2;
      if (ny < -5.5) continue;

      const dx = px - pu.x;
      const dy = py - ny;
      if (Math.sqrt(dx * dx + dy * dy) < 0.7) {
        gameData.current.onPowerUp(pu.type);
        continue;
      }

      const updated = { ...pu, y: ny, rotY: pu.rotY + delta * 2 };
      if (pu.type === "shield") aliveShield.push(updated);
      else if (pu.type === "rapidfire") aliveRapid.push(updated);
      else aliveNuke.push(updated);
    }

    gameData.current.powerUps = [...aliveShield, ...aliveRapid, ...aliveNuke];

    const updateMesh = (mesh: THREE.InstancedMesh | null, list: PowerUp[]) => {
      if (!mesh) return;
      mesh.count = list.length;
      for (let i = 0; i < list.length; i++) {
        dummy.current.position.set(list[i].x, list[i].y, 0);
        dummy.current.rotation.set(0, list[i].rotY, 0);
        dummy.current.scale.setScalar(1);
        dummy.current.updateMatrix();
        mesh.setMatrixAt(i, dummy.current.matrix);
      }
      if (list.length > 0) mesh.instanceMatrix.needsUpdate = true;
    };

    updateMesh(shieldRef.current, aliveShield);
    updateMesh(rapidRef.current, aliveRapid);
    updateMesh(nukeRef.current, aliveNuke);
  });

  return (
    <>
      {/* Shield power-up (blue octahedron) */}
      <instancedMesh ref={shieldRef} args={[undefined, undefined, 5]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={0x000820}
          emissive={0x4488ff}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </instancedMesh>
      {/* Rapid fire power-up (gold tetrahedron) */}
      <instancedMesh ref={rapidRef} args={[undefined, undefined, 5]}>
        <tetrahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={0x100800}
          emissive={0xffcc00}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </instancedMesh>
      {/* Nuke power-up (red-orange sphere) */}
      <instancedMesh ref={nukeRef} args={[undefined, undefined, 5]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial
          color={0x100000}
          emissive={0xff2200}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </instancedMesh>
    </>
  );
}

// ─── Boss Renderer ─────────────────────────────────────────────────────────────
function BossRenderer({
  gameData,
  playing,
}: {
  gameData: React.MutableRefObject<GameData>;
  playing: boolean;
}) {
  const bossMeshRef = useRef<THREE.Mesh>(null);
  const bulletsMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());

  useFrame((_state, delta) => {
    if (!playing) return;
    const boss = gameData.current.boss;
    if (!boss || gameData.current.bossPhase !== "active") {
      if (bossMeshRef.current) bossMeshRef.current.visible = false;
      if (bulletsMeshRef.current) bulletsMeshRef.current.count = 0;
      return;
    }

    if (bossMeshRef.current) {
      bossMeshRef.current.visible = true;
    }

    // Move boss down to y=3.5 then oscillate
    const newPhase = boss.oscillatePhase + delta * 0.8;
    let newY = boss.y;
    if (boss.y > 3.5) {
      newY = Math.max(3.5, boss.y - delta * 2);
    }
    const newX = Math.sin(newPhase) * 3.5;

    if (bossMeshRef.current) {
      bossMeshRef.current.position.set(newX, newY, 0);
      bossMeshRef.current.rotation.y += delta * 1.0;
      bossMeshRef.current.rotation.x += delta * 0.5;
    }

    // Boss fires bullets
    let newFireTimer = boss.fireTimer + delta;
    const newBossBullets = [...boss.bullets];
    if (newFireTimer >= 1.5) {
      newFireTimer = 0;
      newBossBullets.push({
        id: gameData.current.nextId++,
        x: newX,
        y: newY - 0.8,
      });
    }

    // Move boss bullets
    const px = gameData.current.playerX;
    const aliveBossBullets: BossBullet[] = [];
    for (const bb of newBossBullets) {
      const by = bb.y - delta * 5;
      if (by < -6) continue;
      const dx = px - bb.x;
      const dy = -3.5 - by;
      if (Math.sqrt(dx * dx + dy * dy) < 0.4) {
        gameData.current.onLifeLost();
        continue;
      }
      aliveBossBullets.push({ ...bb, y: by });
    }

    // Check player bullets hitting boss
    const playerBullets = gameData.current.bullets;
    const alivePBullets: Bullet[] = [];
    let bossHp = boss.hp;
    for (const pb of playerBullets) {
      const dx = pb.x - newX;
      const dy = pb.y - newY;
      if (Math.sqrt(dx * dx + dy * dy) < 1.0) {
        bossHp -= 1;
        gameData.current.explosions.push({
          id: gameData.current.nextId++,
          x: pb.x,
          y: pb.y,
          z: 0,
          age: 0,
        });
      } else {
        alivePBullets.push(pb);
      }
    }
    gameData.current.bullets = alivePBullets;

    if (bossHp <= 0) {
      // Boss defeated
      gameData.current.bossPhase = "defeated";
      gameData.current.boss = null;
      if (bossMeshRef.current) bossMeshRef.current.visible = false;
      if (bulletsMeshRef.current) bulletsMeshRef.current.count = 0;
      gameData.current.onBossDefeated(Math.floor(boss.maxHp / 5));
      return;
    }

    gameData.current.boss = {
      ...boss,
      hp: bossHp,
      x: newX,
      y: newY,
      oscillatePhase: newPhase,
      fireTimer: newFireTimer,
      bullets: aliveBossBullets,
    };

    // Render boss bullets
    const bm = bulletsMeshRef.current;
    if (bm) {
      bm.count = aliveBossBullets.length;
      for (let i = 0; i < aliveBossBullets.length; i++) {
        dummy.current.position.set(
          aliveBossBullets[i].x,
          aliveBossBullets[i].y,
          0,
        );
        dummy.current.rotation.set(0, 0, 0);
        dummy.current.scale.setScalar(1);
        dummy.current.updateMatrix();
        bm.setMatrixAt(i, dummy.current.matrix);
      }
      if (aliveBossBullets.length > 0) bm.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <mesh ref={bossMeshRef} visible={false}>
        <dodecahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color={0x100010}
          emissive={0xff00cc}
          emissiveIntensity={2.0}
          metalness={0.8}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>
      <instancedMesh ref={bulletsMeshRef} args={[undefined, undefined, 20]}>
        <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
        <meshStandardMaterial
          color={0x100000}
          emissive={0xff0000}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </instancedMesh>
    </>
  );
}

// ─── Explosions ───────────────────────────────────────────────────────────────
function ExplosionsRenderer({
  gameData,
}: {
  gameData: React.MutableRefObject<GameData>;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const exps = gameData.current.explosions;
    const alive: Explosion[] = [];
    for (const e of exps) {
      const age = e.age + delta;
      if (age < 0.4) alive.push({ ...e, age });
    }
    gameData.current.explosions = alive;

    mesh.count = alive.length;
    for (let i = 0; i < alive.length; i++) {
      const t = alive[i].age / 0.4;
      dummy.current.position.set(alive[i].x, alive[i].y, alive[i].z);
      dummy.current.scale.setScalar(t * 1.5);
      dummy.current.updateMatrix();
      mesh.setMatrixAt(i, dummy.current.matrix);
    }
    if (alive.length > 0) mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 30]}>
      <sphereGeometry args={[0.5, 8, 8]} />
      <meshStandardMaterial
        color={0x000000}
        emissive={0xffaa00}
        emissiveIntensity={3}
        transparent
        opacity={0.6}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// ─── Game Loop (Spawner + Auto-fire) ──────────────────────────────────────────
function GameLoop({
  gameData,
  playing,
  wave,
  onBossIncoming,
}: {
  gameData: React.MutableRefObject<GameData>;
  playing: boolean;
  wave: number;
  onBossIncoming: () => void;
}) {
  const bossIncomingCalledRef = useRef(false);

  useFrame((_state, delta) => {
    if (!playing) return;
    const data = gameData.current;

    // Auto-fire
    data.fireTimer += delta;
    const isRapidFire = Date.now() < data.rapidFireUntil;
    const fireRate = isRapidFire ? 0.11 : 0.22;
    if (data.isAutoFiring && data.fireTimer >= fireRate) {
      data.fireTimer = 0;
      data.bullets.push({
        id: data.nextId++,
        x: data.playerX,
        y: -3.0,
      });
    }

    // Boss wave logic
    const isBossWave = wave > 0 && wave % 5 === 0;
    const bossPhase = data.bossPhase;

    if (isBossWave && bossPhase === "none" && !bossIncomingCalledRef.current) {
      bossIncomingCalledRef.current = true;
      data.bossPhase = "incoming";
      onBossIncoming();
      return;
    }

    if (
      bossPhase === "incoming" ||
      bossPhase === "active" ||
      bossPhase === "defeated"
    ) {
      // Don't spawn normal enemies during boss wave
      return;
    }

    // Reset for non-boss waves
    bossIncomingCalledRef.current = false;

    // Spawn enemies
    data.spawnTimer += delta;
    const spawnRate = Math.max(0.5, 1.8 - wave * 0.1);
    if (data.spawnTimer >= spawnRate) {
      data.spawnTimer = 0;
      const count = 1 + Math.floor(wave / 3);
      for (let i = 0; i < count; i++) {
        // Determine type based on wave
        const roll = Math.random();
        let type: Enemy["type"] = "asteroid";
        const droneFrac = wave >= 3 ? 0.25 : 0;
        const bomberFrac = wave >= 5 ? 0.15 : 0;
        const asteroidFrac = 1 - droneFrac - bomberFrac;
        if (roll < bomberFrac) type = "bomber";
        else if (roll < bomberFrac + droneFrac) type = "drone";
        else if (roll < asteroidFrac + bomberFrac + droneFrac)
          type = "asteroid";

        const baseSpeed = 2 + wave * 0.3 + Math.random() * 1.5;
        const speedMult =
          type === "drone" ? 1.6 : type === "bomber" ? 0.6 : 1.0;
        const hp = type === "bomber" ? 2 : 1;

        data.enemies.push({
          id: data.nextId++,
          x: (Math.random() - 0.5) * 8,
          y: 6,
          z: (Math.random() - 0.5) * 0.5,
          speed: baseSpeed * speedMult,
          size: 0.5 + Math.random() * 0.5,
          rotX: Math.random() * Math.PI * 2,
          rotY: Math.random() * Math.PI * 2,
          rotZ: Math.random() * Math.PI * 2,
          type,
          hp,
          zigzagPhase: type === "drone" ? Math.random() * Math.PI * 2 : 0,
        });
      }

      // Spawn power-up with 12% chance
      if (Math.random() < 0.12) {
        const puTypes: PowerUp["type"][] = ["shield", "rapidfire", "nuke"];
        const puType = puTypes[Math.floor(Math.random() * puTypes.length)];
        data.powerUps.push({
          id: data.nextId++,
          x: (Math.random() - 0.5) * 7,
          y: 6,
          type: puType,
          rotY: 0,
        });
      }
    }
  });

  return null;
}

// ─── Background Stars ─────────────────────────────────────────────────────────
function GameStarField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const posRef = useRef(
    Array.from({ length: 200 }, () => [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      -2 - Math.random() * 5,
    ]),
  );
  const dummy = useRef(new THREE.Object3D());

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const pos = posRef.current;
    for (let i = 0; i < pos.length; i++) {
      pos[i][1] -= delta * 2;
      if (pos[i][1] < -11) {
        pos[i][1] = 11;
        pos[i][0] = (Math.random() - 0.5) * 20;
      }
      dummy.current.position.set(pos[i][0], pos[i][1], pos[i][2]);
      dummy.current.updateMatrix();
      mesh.setMatrixAt(i, dummy.current.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 200]}>
      <sphereGeometry args={[0.03, 4, 4]} />
      <meshStandardMaterial
        color={0xffffff}
        emissive={0xffffff}
        emissiveIntensity={1}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// ─── Mouse Tracker ────────────────────────────────────────────────────────────
function MouseTracker({
  gameData,
  playing,
}: {
  gameData: React.MutableRefObject<GameData>;
  playing: boolean;
}) {
  const handlePointerMove = useCallback(
    (e: THREE.Event) => {
      if (!playing) return;
      const pe = e as unknown as PointerEvent & { point?: THREE.Vector3 };
      if (pe.point) {
        gameData.current.playerX = Math.max(-4.5, Math.min(4.5, pe.point.x));
      }
    },
    [playing, gameData],
  );

  return (
    <mesh
      position={[0, 0, -0.1]}
      onPointerMove={handlePointerMove}
      visible={false}
    >
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function GameScene({
  gameData,
  gameState,
  onBossIncoming,
}: {
  gameData: React.MutableRefObject<GameData>;
  gameState: GameState;
  onBossIncoming: () => void;
}) {
  const playing = gameState.phase === "playing";

  return (
    <>
      <ambientLight color={0x080820} intensity={0.8} />
      <pointLight
        color={0x00f5ff}
        position={[0, 0, 4]}
        intensity={3}
        distance={20}
      />
      <pointLight
        color={0xff0066}
        position={[3, 2, 3]}
        intensity={2}
        distance={15}
      />
      <pointLight
        color={0xa855f7}
        position={[-3, -2, 3]}
        intensity={2}
        distance={15}
      />

      <GameStarField />
      <MouseTracker gameData={gameData} playing={playing} />

      {playing && (
        <>
          <PlayerShip gameData={gameData} />
          <BulletsRenderer gameData={gameData} />
          <AsteroidEnemiesRenderer gameData={gameData} playing={playing} />
          <DroneEnemiesRenderer gameData={gameData} playing={playing} />
          <BomberEnemiesRenderer gameData={gameData} playing={playing} />
          <PowerUpsRenderer gameData={gameData} playing={playing} />
          <BossRenderer gameData={gameData} playing={playing} />
          <ExplosionsRenderer gameData={gameData} />
          <GameLoop
            gameData={gameData}
            playing={playing}
            wave={gameState.wave}
            onBossIncoming={onBossIncoming}
          />
        </>
      )}

      <AdaptiveDpr pixelated />
    </>
  );
}

// ─── HUD ──────────────────────────────────────────────────────────────────────
function HUD({
  score,
  lives,
  wave,
  bossHp,
  bossMaxHp,
  bossActive,
  rapidFireUntil,
}: {
  score: number;
  lives: number;
  wave: number;
  bossHp: number;
  bossMaxHp: number;
  bossActive: boolean;
  rapidFireUntil: number;
}) {
  const now = Date.now();
  const rapidActive = now < rapidFireUntil;
  const rapidRemaining = rapidActive
    ? Math.ceil((rapidFireUntil - now) / 1000)
    : 0;
  const rapidProgress = rapidActive ? ((rapidFireUntil - now) / 5000) * 100 : 0;

  return (
    <div
      className="absolute inset-x-0 top-0 pointer-events-none select-none"
      style={{ zIndex: 10 }}
    >
      {/* Main HUD row */}
      <div className="flex items-start justify-between px-4 pt-3">
        {/* Score */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded"
          style={{
            background: "oklch(0.08 0.02 270 / 0.85)",
            border: "1px solid oklch(var(--neon-cyan) / 0.3)",
          }}
        >
          <Star className="w-3.5 h-3.5 text-neon-cyan" />
          <span className="font-mono text-sm font-bold text-neon-cyan">
            {score.toLocaleString()}
          </span>
        </div>

        {/* Wave */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded"
          style={{
            background: "oklch(0.08 0.02 270 / 0.85)",
            border: "1px solid oklch(var(--neon-violet) / 0.3)",
          }}
        >
          <Zap
            className="w-3.5 h-3.5"
            style={{ color: "oklch(var(--neon-violet))" }}
          />
          <span
            className="font-mono text-sm font-bold"
            style={{ color: "oklch(var(--neon-violet))" }}
          >
            WAVE {wave}
          </span>
        </div>

        {/* Lives */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded"
          style={{
            background: "oklch(0.08 0.02 270 / 0.85)",
            border: "1px solid oklch(var(--destructive) / 0.3)",
          }}
        >
          {[1, 2, 3, 4, 5].map((heartNum) => (
            <Heart
              key={heartNum}
              className="w-3 h-3"
              style={{
                color:
                  heartNum <= lives
                    ? "oklch(var(--destructive))"
                    : "oklch(var(--border))",
                fill: heartNum <= lives ? "oklch(var(--destructive))" : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Boss HP bar */}
      <AnimatePresence>
        {bossActive && (
          <motion.div
            className="mx-4 mt-2 px-3 py-2 rounded"
            style={{
              background: "oklch(0.06 0.02 270 / 0.9)",
              border: "1px solid rgba(255, 0, 204, 0.4)",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className="font-mono text-xs font-black tracking-widest"
                style={{ color: "#ff00cc" }}
              >
                ⚠ BOSS
              </span>
              <span
                className="font-mono text-xs"
                style={{ color: "rgba(255,0,204,0.7)" }}
              >
                {bossHp} / {bossMaxHp}
              </span>
            </div>
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ background: "rgba(255,0,204,0.15)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #ff0000, #ff00cc)",
                  width: `${Math.max(0, (bossHp / bossMaxHp) * 100)}%`,
                }}
                animate={{
                  width: `${Math.max(0, (bossHp / bossMaxHp) * 100)}%`,
                }}
                transition={{ duration: 0.15 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rapid Fire indicator */}
      <AnimatePresence>
        {rapidActive && (
          <motion.div
            className="absolute bottom-8 left-4 flex items-center gap-2 px-3 py-1.5 rounded"
            style={{
              background: "oklch(0.08 0.02 60 / 0.9)",
              border: "1px solid rgba(255, 204, 0, 0.4)",
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <span style={{ color: "#ffcc00", fontSize: 13 }}>⚡</span>
            <span
              className="font-mono text-xs font-bold"
              style={{ color: "#ffcc00" }}
            >
              RAPID FIRE
            </span>
            <div
              className="w-16 h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,204,0,0.2)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #ffaa00, #ffcc00)",
                  width: `${rapidProgress}%`,
                }}
                animate={{ width: `${rapidProgress}%` }}
              />
            </div>
            <span
              className="font-mono text-xs"
              style={{ color: "rgba(255,204,0,0.7)" }}
            >
              {rapidRemaining}s
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function SpaceShooter3D() {
  const { actor } = useActor();
  const [gameState, setGameState] = useState<GameState>({
    phase: "idle",
    score: 0,
    lives: 3,
    wave: 1,
    enemiesKilled: 0,
  });
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number.parseInt(localStorage.getItem("ss3d_highscore") || "0", 10);
    } catch {
      return 0;
    }
  });
  const [overlayMessage, setOverlayMessage] = useState<string | null>(null);
  const [rapidFireUntil, setRapidFireUntil] = useState(0);
  const [bossHpDisplay, setBossHpDisplay] = useState({
    hp: 0,
    maxHp: 0,
    active: false,
  });

  // ── Score submission state ──
  const [showPostScore, setShowPostScore] = useState(false);
  const [postName, setPostName] = useState("");
  const [postStatus, setPostStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [postedRank, setPostedRank] = useState<number | null>(null);

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const gameData = useRef<GameData>({
    playerX: 0,
    bullets: [],
    enemies: [],
    powerUps: [],
    explosions: [],
    boss: null,
    bossPhase: "none",
    nextId: 0,
    spawnTimer: 0,
    fireTimer: 0,
    isAutoFiring: false,
    rapidFireUntil: 0,
    onScoreHit: (points: number) => {
      setGameState((prev) => {
        const newScore = prev.score + points;
        return { ...prev, score: newScore };
      });
    },
    onLifeLost: () => {
      setGameState((prev) => {
        const newLives = prev.lives - 1;
        if (newLives <= 0) {
          return { ...prev, lives: 0, phase: "gameover" };
        }
        return { ...prev, lives: newLives };
      });
    },
    onEnemyKilled: (points: number) => {
      setGameState((prev) => {
        const newKilled = prev.enemiesKilled + 1;
        const newScore = prev.score + points;
        const newWave = Math.floor(newKilled / 15) + 1;
        return {
          ...prev,
          score: newScore,
          enemiesKilled: newKilled,
          wave: newWave,
        };
      });
    },
    onPowerUp: (type: PowerUp["type"]) => {
      if (type === "shield") {
        setGameState((prev) => ({
          ...prev,
          lives: Math.min(5, prev.lives + 1),
        }));
      } else if (type === "rapidfire") {
        const until = Date.now() + 5000;
        gameData.current.rapidFireUntil = until;
        setRapidFireUntil(until);
      } else if (type === "nuke") {
        // Clear all enemies
        gameData.current.enemies = [];
        gameData.current.powerUps = [];
        // Add explosions for drama
        for (let i = 0; i < 8; i++) {
          gameData.current.explosions.push({
            id: gameData.current.nextId++,
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 6,
            z: 0,
            age: 0,
          });
        }
      }
    },
    onBossDefeated: (bossCount: number) => {
      const bonus = 200 * bossCount;
      setGameState((prev) => ({
        ...prev,
        score: prev.score + bonus,
        wave: prev.wave + 1,
      }));
      gameData.current.bossPhase = "none";
      setBossHpDisplay({ hp: 0, maxHp: 0, active: false });
      setOverlayMessage("BOSS DEFEATED!");
      setTimeout(() => setOverlayMessage(null), 1500);
    },
    onBossIncoming: () => {
      // This is a placeholder; actual call goes through React state
    },
  });

  const handleBossIncoming = useCallback(() => {
    const wave = gameStateRef.current.wave;
    const bossCount = Math.floor(wave / 5);
    const bossMaxHp = 15 + bossCount * 5;

    setOverlayMessage("BOSS INCOMING!");
    setTimeout(() => {
      setOverlayMessage(null);
      // Spawn boss
      gameData.current.boss = {
        hp: bossMaxHp,
        maxHp: bossMaxHp,
        x: 0,
        y: 6,
        oscillatePhase: 0,
        fireTimer: 0,
        bullets: [],
      };
      gameData.current.bossPhase = "active";
      setBossHpDisplay({ hp: bossMaxHp, maxHp: bossMaxHp, active: true });
    }, 2000);
  }, []);

  // Sync boss HP to display
  useEffect(() => {
    if (gameState.phase !== "playing") return;
    const interval = setInterval(() => {
      const boss = gameData.current.boss;
      const bossActive =
        gameData.current.bossPhase === "active" && boss !== null;
      if (bossActive && boss) {
        setBossHpDisplay({ hp: boss.hp, maxHp: boss.maxHp, active: true });
      } else if (!bossActive) {
        setBossHpDisplay((prev) =>
          prev.active ? { hp: 0, maxHp: 0, active: false } : prev,
        );
      }
    }, 100);
    return () => clearInterval(interval);
  }, [gameState.phase]);

  // Rapid fire display sync
  useEffect(() => {
    if (rapidFireUntil <= Date.now()) return;
    const interval = setInterval(() => {
      if (Date.now() >= rapidFireUntil) {
        setRapidFireUntil(0);
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [rapidFireUntil]);

  // Handle game over
  useEffect(() => {
    if (gameState.phase === "gameover") {
      if (gameState.score > highScore) {
        setHighScore(gameState.score);
        try {
          localStorage.setItem("ss3d_highscore", String(gameState.score));
        } catch {}
      }
      gameData.current.bullets = [];
      gameData.current.enemies = [];
      gameData.current.powerUps = [];
      gameData.current.explosions = [];
      gameData.current.boss = null;
      gameData.current.bossPhase = "none";
      gameData.current.spawnTimer = 0;
      gameData.current.fireTimer = 0;
      setBossHpDisplay({ hp: 0, maxHp: 0, active: false });
    }
  }, [gameState.phase, gameState.score, highScore]);

  const startGame = useCallback(() => {
    gameData.current.bullets = [];
    gameData.current.enemies = [];
    gameData.current.powerUps = [];
    gameData.current.explosions = [];
    gameData.current.boss = null;
    gameData.current.bossPhase = "none";
    gameData.current.spawnTimer = 0;
    gameData.current.fireTimer = 0;
    gameData.current.playerX = 0;
    gameData.current.rapidFireUntil = 0;
    setRapidFireUntil(0);
    setBossHpDisplay({ hp: 0, maxHp: 0, active: false });
    setGameState({
      phase: "playing",
      score: 0,
      lives: 3,
      wave: 1,
      enemiesKilled: 0,
    });
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (
          gameStateRef.current.phase === "idle" ||
          gameStateRef.current.phase === "gameover"
        ) {
          startGame();
        } else if (gameStateRef.current.phase === "playing") {
          gameData.current.isAutoFiring = true;
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        gameData.current.isAutoFiring = false;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [startGame]);

  const handlePointerDown = () => {
    if (gameState.phase === "playing") {
      gameData.current.isAutoFiring = true;
    }
  };

  const handlePointerUp = () => {
    gameData.current.isAutoFiring = false;
  };

  return (
    <div
      className="relative w-full rounded-lg overflow-hidden select-none"
      style={{
        maxWidth: 720,
        margin: "0 auto",
        height: 480,
        border: "1px solid oklch(var(--neon-cyan) / 0.25)",
        boxShadow:
          "0 0 40px oklch(var(--neon-cyan) / 0.1), 0 0 80px oklch(var(--neon-violet) / 0.05)",
        background: "#020210",
        cursor: gameState.phase === "playing" ? "crosshair" : "default",
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      data-ocid="space3d.canvas_target"
    >
      {/* R3F Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 100 }}
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        style={{ position: "absolute", inset: 0 }}
      >
        <GameScene
          gameData={gameData}
          gameState={gameState}
          onBossIncoming={handleBossIncoming}
        />
      </Canvas>

      {/* HUD (only when playing) */}
      {gameState.phase === "playing" && (
        <HUD
          score={gameState.score}
          lives={gameState.lives}
          wave={gameState.wave}
          bossHp={bossHpDisplay.hp}
          bossMaxHp={bossHpDisplay.maxHp}
          bossActive={bossHpDisplay.active}
          rapidFireUntil={rapidFireUntil}
        />
      )}

      {/* Controls hint when playing */}
      {gameState.phase === "playing" && (
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-xs text-foreground/30 pointer-events-none"
          style={{ zIndex: 10 }}
        >
          Move mouse to aim · Hold Space / Click to fire
        </div>
      )}

      {/* Boss Incoming / Defeated overlay */}
      <AnimatePresence>
        {overlayMessage && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{
              background: "oklch(0.04 0.02 270 / 0.75)",
              zIndex: 25,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.p
              className="font-display font-black text-4xl tracking-widest text-center px-4"
              style={{
                color:
                  overlayMessage === "BOSS INCOMING!" ? "#ff2244" : "#ffcc00",
                textShadow:
                  overlayMessage === "BOSS INCOMING!"
                    ? "0 0 30px rgba(255,34,68,0.8), 0 0 60px rgba(255,34,68,0.4)"
                    : "0 0 30px rgba(255,204,0,0.8), 0 0 60px rgba(255,0,204,0.4)",
              }}
              animate={
                overlayMessage === "BOSS INCOMING!"
                  ? { scale: [1, 1.06, 1], opacity: [1, 0.85, 1] }
                  : { scale: [0.8, 1.1, 1] }
              }
              transition={{
                duration: 0.5,
                repeat:
                  overlayMessage === "BOSS INCOMING!"
                    ? Number.POSITIVE_INFINITY
                    : 0,
              }}
            >
              {overlayMessage}
            </motion.p>
            {overlayMessage === "BOSS INCOMING!" && (
              <motion.p
                className="font-mono text-sm mt-3"
                style={{ color: "rgba(255,34,68,0.6)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Prepare for battle!
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start screen */}
      <AnimatePresence>
        {gameState.phase === "idle" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            style={{
              background: "oklch(0.05 0.02 270 / 0.88)",
              zIndex: 20,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Rocket
                className="w-16 h-16"
                style={{
                  color: "oklch(var(--neon-cyan))",
                  filter: "drop-shadow(0 0 16px oklch(var(--neon-cyan) / 0.8))",
                }}
              />
            </motion.div>
            <div className="text-center">
              <h3
                className="font-display font-black text-3xl mb-2 gradient-text-gaming"
                style={{ letterSpacing: "0.08em" }}
              >
                SPACE SHOOTER 3D
              </h3>
              <p className="font-body text-sm text-foreground/50 mb-1">
                Destroy enemies · Collect power-ups · Survive boss waves
              </p>
              <div className="flex items-center justify-center gap-4 mt-2 text-xs font-mono">
                <span style={{ color: "#ff0066" }}>● Asteroid</span>
                <span style={{ color: "#00ffcc" }}>◆ Drone</span>
                <span style={{ color: "#ff6600" }}>⊕ Bomber</span>
                <span style={{ color: "#ff00cc" }}>⬡ Boss</span>
              </div>
              <div className="flex items-center justify-center gap-4 mt-1 text-xs font-mono">
                <span style={{ color: "#4488ff" }}>♦ Shield</span>
                <span style={{ color: "#ffcc00" }}>▲ Rapid Fire</span>
                <span style={{ color: "#ff2200" }}>● Nuke</span>
              </div>
              {highScore > 0 && (
                <p
                  className="font-mono text-xs mt-2"
                  style={{ color: "oklch(var(--gold))" }}
                >
                  Best: {highScore.toLocaleString()}
                </p>
              )}
            </div>
            <button
              type="button"
              className="gaming-btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded font-display font-bold text-sm tracking-widest uppercase"
              onClick={startGame}
              data-ocid="space3d.primary_button"
            >
              <Rocket className="w-4 h-4" />
              LAUNCH MISSION
            </button>
            <p className="font-mono text-xs text-foreground/30">
              Or press Space to start
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over screen */}
      <AnimatePresence>
        {gameState.phase === "gameover" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6"
            style={{
              background: "oklch(0.05 0.02 270 / 0.9)",
              zIndex: 20,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p
              className="font-display font-black text-4xl tracking-widest"
              style={{
                color: "oklch(var(--destructive))",
                textShadow: "0 0 20px oklch(var(--destructive) / 0.6)",
              }}
            >
              GAME OVER
            </p>
            <div className="flex flex-col items-center gap-1">
              <p className="font-body text-foreground/50 text-sm">
                Final Score
              </p>
              <p
                className="font-mono font-black text-5xl"
                style={{ color: "oklch(var(--neon-cyan))" }}
              >
                {gameState.score.toLocaleString()}
              </p>
              {gameState.score >= highScore && gameState.score > 0 && (
                <p
                  className="font-mono text-xs tracking-widest uppercase"
                  style={{ color: "oklch(var(--gold))" }}
                >
                  New High Score!
                </p>
              )}
              {highScore > 0 && gameState.score < highScore && (
                <p
                  className="font-mono text-xs"
                  style={{ color: "oklch(var(--gold) / 0.6)" }}
                >
                  Best: {highScore.toLocaleString()}
                </p>
              )}
            </div>

            {/* Post to leaderboard inline form */}
            <AnimatePresence mode="wait">
              {postStatus === "success" ? (
                <motion.div
                  key="post-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-4 py-2 rounded"
                  style={{
                    background: "oklch(0.82 0.18 200 / 0.1)",
                    border: "1px solid oklch(0.82 0.18 200 / 0.4)",
                  }}
                  data-ocid="space3d.success_state"
                >
                  <CheckCircle
                    className="w-4 h-4"
                    style={{ color: "oklch(0.82 0.18 200)" }}
                  />
                  <span
                    className="font-mono text-sm font-bold"
                    style={{ color: "oklch(0.82 0.18 200)" }}
                  >
                    Posted! Rank #{postedRank}
                  </span>
                </motion.div>
              ) : showPostScore ? (
                <motion.form
                  key="post-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 w-full max-w-xs"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!postName.trim() || !actor) return;
                    setPostStatus("loading");
                    try {
                      const updated = await actor.submitScore(
                        postName.trim(),
                        BigInt(gameState.score),
                        "Space Shooter 3D",
                        new Date().toISOString(),
                        localStorage.getItem("dg_player_avatar") ?? "",
                      );
                      const myEntry = updated.find(
                        (en) => en.playerName === postName.trim(),
                      );
                      setPostedRank(myEntry ? Number(myEntry.rank) : null);
                      setPostStatus("success");
                    } catch {
                      setPostStatus("error");
                    }
                  }}
                >
                  <input
                    type="text"
                    value={postName}
                    onChange={(e) => setPostName(e.target.value.slice(0, 20))}
                    placeholder="Your name..."
                    maxLength={20}
                    required
                    className="flex-1 px-3 py-2 rounded text-sm font-mono outline-none"
                    style={{
                      background: "oklch(0.12 0.02 270)",
                      border: "1px solid oklch(0.82 0.18 200 / 0.35)",
                      color: "oklch(0.96 0.03 220)",
                    }}
                    data-ocid="space3d.input"
                  />
                  <button
                    type="submit"
                    disabled={postStatus === "loading" || !postName.trim()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-bold tracking-wider uppercase"
                    style={{
                      background: "oklch(0.82 0.18 200 / 0.15)",
                      border: "1px solid oklch(0.82 0.18 200 / 0.5)",
                      color: "oklch(0.82 0.18 200)",
                    }}
                    data-ocid="space3d.submit_button"
                  >
                    {postStatus === "loading" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trophy className="w-3.5 h-3.5" />
                    )}
                    Post
                  </button>
                </motion.form>
              ) : (
                <motion.button
                  key="post-trigger"
                  type="button"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded font-display font-bold text-xs tracking-widest uppercase"
                  style={{
                    background: "oklch(0.82 0.18 200 / 0.1)",
                    border: "1px solid oklch(0.82 0.18 200 / 0.35)",
                    color: "oklch(0.82 0.18 200)",
                  }}
                  onClick={() => {
                    setShowPostScore(true);
                    setPostStatus("idle");
                  }}
                  data-ocid="space3d.post_score_button"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  Post to Leaderboard
                </motion.button>
              )}
            </AnimatePresence>

            {postStatus === "error" && (
              <p
                className="font-mono text-xs"
                style={{ color: "oklch(0.65 0.2 22)" }}
                data-ocid="space3d.error_state"
              >
                Failed to post. Try again.
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                className="gaming-btn-primary inline-flex items-center gap-2 px-7 py-3 rounded font-display font-bold text-sm tracking-widest uppercase"
                onClick={() => {
                  startGame();
                  setShowPostScore(false);
                  setPostStatus("idle");
                  setPostName("");
                  setPostedRank(null);
                }}
                data-ocid="space3d.primary_button"
              >
                <Rocket className="w-4 h-4" />
                Play Again
              </button>
            </div>
            <p className="font-mono text-xs text-foreground/30">
              Wave Reached: {gameState.wave} · Enemies Killed:{" "}
              {gameState.enemiesKilled}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
