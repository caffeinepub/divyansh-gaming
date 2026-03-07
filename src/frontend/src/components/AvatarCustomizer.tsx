import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { playClick } from "../hooks/useSoundEffects";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AvatarConfig {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  shirtStyle: string;
  shirtColor: string;
  pantsStyle: string;
  pantsColor: string;
  hatStyle: string;
  hatColor: string;
  shoeStyle: string;
  shoeColor: string;
  accessory: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SKIN_TONES = [
  { label: "Pale", color: "#FDDBB4" },
  { label: "Light", color: "#F5C28A" },
  { label: "Medium Light", color: "#D9956A" },
  { label: "Medium", color: "#C27245" },
  { label: "Medium Dark", color: "#8B4A2E" },
  { label: "Dark", color: "#4A2310" },
];

const HAIR_STYLES = [
  { id: "short", label: "Short" },
  { id: "long", label: "Long" },
  { id: "spiky", label: "Spiky" },
  { id: "bun", label: "Bun" },
  { id: "fade", label: "Fade" },
  { id: "bald", label: "Bald" },
];

const HAIR_COLORS = [
  { label: "Black", color: "#1A1A1A" },
  { label: "Brown", color: "#6B3E26" },
  { label: "Blonde", color: "#D4A818" },
  { label: "Red", color: "#C0392B" },
  { label: "Cyan", color: "#00E5FF" },
  { label: "Violet", color: "#9B59B6" },
];

const SHIRT_STYLES = [
  { id: "t-shirt", label: "T-Shirt" },
  { id: "hoodie", label: "Hoodie" },
  { id: "jersey", label: "Jersey" },
];

const SHIRT_COLORS = [
  { label: "Cyan", color: "#00E5FF" },
  { label: "Violet", color: "#7C3AED" },
  { label: "Red", color: "#EF4444" },
  { label: "White", color: "#F1F5F9" },
  { label: "Black", color: "#0F172A" },
];

const PANTS_STYLES = [
  { id: "joggers", label: "Joggers" },
  { id: "cargo", label: "Cargo" },
  { id: "shorts", label: "Shorts" },
];

const PANTS_COLORS = [
  { label: "Navy", color: "#1E3A5F" },
  { label: "Black", color: "#111827" },
  { label: "Khaki", color: "#B5A07A" },
  { label: "Red", color: "#991B1B" },
];

const HAT_STYLES = [
  { id: "none", label: "No Hat" },
  { id: "cap", label: "Cap" },
  { id: "beanie", label: "Beanie" },
  { id: "headband", label: "Headband" },
];

const HAT_COLORS = [
  { label: "Black", color: "#111827" },
  { label: "Red", color: "#EF4444" },
  { label: "Cyan", color: "#00E5FF" },
  { label: "White", color: "#F1F5F9" },
  { label: "Violet", color: "#7C3AED" },
];

const SHOE_STYLES = [
  { id: "sneakers", label: "Sneakers" },
  { id: "boots", label: "Boots" },
  { id: "slides", label: "Slides" },
];

const SHOE_COLORS = [
  { label: "Black", color: "#1A1A2E" },
  { label: "White", color: "#E8E8E8" },
  { label: "Red", color: "#C0392B" },
  { label: "Cyan", color: "#00B4D8" },
  { label: "Gold", color: "#D4A017" },
];

const ACCESSORIES = [
  { id: "none", label: "None" },
  { id: "glasses", label: "Glasses" },
  { id: "chain", label: "Chain" },
  { id: "headphones", label: "Headphones" },
];

const DEFAULT_CONFIG: AvatarConfig = {
  skinTone: "#F5C28A",
  hairStyle: "short",
  hairColor: "#1A1A1A",
  shirtStyle: "t-shirt",
  shirtColor: "#00E5FF",
  pantsStyle: "joggers",
  pantsColor: "#1E3A5F",
  hatStyle: "none",
  hatColor: "#111827",
  shoeStyle: "sneakers",
  shoeColor: "#1A1A2E",
  accessory: "none",
};

const LS_CONFIG_KEY = "divyansh_avatar_config";
const LS_EMOJI_KEY = "divyansh_avatar_emoji";

// ─── Hair Component ───────────────────────────────────────────────────────────
function AvatarHair({
  hairStyle,
  hairColor,
}: {
  hairStyle: string;
  hairColor: string;
}) {
  const color = hairColor;

  if (hairStyle === "bald") return null;

  if (hairStyle === "short") {
    return (
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry
          args={[0.44, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4]}
        />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.05}
          side={THREE.FrontSide}
        />
      </mesh>
    );
  }

  if (hairStyle === "long") {
    return (
      <group>
        {/* Top cap */}
        <mesh position={[0, 1.85, 0]}>
          <sphereGeometry
            args={[0.44, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42]}
          />
          <meshStandardMaterial
            color={color}
            roughness={0.7}
            metalness={0.05}
            side={THREE.FrontSide}
          />
        </mesh>
        {/* Left strand */}
        <mesh position={[-0.38, 1.3, 0]} rotation={[0, 0, 0.18]}>
          <cylinderGeometry args={[0.055, 0.04, 0.7, 8]} />
          <meshStandardMaterial
            color={color}
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
        {/* Right strand */}
        <mesh position={[0.38, 1.3, 0]} rotation={[0, 0, -0.18]}>
          <cylinderGeometry args={[0.055, 0.04, 0.7, 8]} />
          <meshStandardMaterial
            color={color}
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
      </group>
    );
  }

  if (hairStyle === "spiky") {
    return (
      <group position={[0, 1.55, 0]}>
        {/* Base cap */}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry
            args={[0.44, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.38]}
          />
          <meshStandardMaterial
            color={color}
            roughness={0.7}
            metalness={0.05}
            side={THREE.FrontSide}
          />
        </mesh>
        {/* Spikes — individual meshes to avoid array index key */}
        <mesh position={[0, 0.59, 0.1]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.07, 0.28, 6]} />
          <meshStandardMaterial
            color={color}
            roughness={0.6}
            metalness={0.05}
          />
        </mesh>
        <mesh position={[0.15, 0.54, 0]} rotation={[0, 0, -0.4]}>
          <coneGeometry args={[0.07, 0.28, 6]} />
          <meshStandardMaterial
            color={color}
            roughness={0.6}
            metalness={0.05}
          />
        </mesh>
        <mesh position={[-0.15, 0.54, 0]} rotation={[0, 0, 0.4]}>
          <coneGeometry args={[0.07, 0.28, 6]} />
          <meshStandardMaterial
            color={color}
            roughness={0.6}
            metalness={0.05}
          />
        </mesh>
        <mesh position={[0.1, 0.56, -0.1]} rotation={[-0.3, 0.3, -0.3]}>
          <coneGeometry args={[0.07, 0.28, 6]} />
          <meshStandardMaterial
            color={color}
            roughness={0.6}
            metalness={0.05}
          />
        </mesh>
        <mesh position={[-0.1, 0.56, -0.1]} rotation={[-0.3, -0.3, 0.3]}>
          <coneGeometry args={[0.07, 0.28, 6]} />
          <meshStandardMaterial
            color={color}
            roughness={0.6}
            metalness={0.05}
          />
        </mesh>
        <mesh position={[0.05, 0.59, 0.05]} rotation={[0.2, 0.2, 0.1]}>
          <coneGeometry args={[0.07, 0.28, 6]} />
          <meshStandardMaterial
            color={color}
            roughness={0.6}
            metalness={0.05}
          />
        </mesh>
        <mesh position={[-0.05, 0.59, 0.05]} rotation={[0.2, -0.2, -0.1]}>
          <coneGeometry args={[0.07, 0.28, 6]} />
          <meshStandardMaterial
            color={color}
            roughness={0.6}
            metalness={0.05}
          />
        </mesh>
      </group>
    );
  }

  if (hairStyle === "bun") {
    return (
      <group>
        {/* Base cap */}
        <mesh position={[0, 1.85, 0]}>
          <sphereGeometry
            args={[0.44, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4]}
          />
          <meshStandardMaterial
            color={color}
            roughness={0.7}
            metalness={0.05}
            side={THREE.FrontSide}
          />
        </mesh>
        {/* Bun */}
        <mesh position={[0, 2.05, 0]} scale={[1.1, 0.7, 1.1]}>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial
            color={color}
            roughness={0.6}
            metalness={0.05}
          />
        </mesh>
      </group>
    );
  }

  if (hairStyle === "fade") {
    return (
      <group>
        {/* Top cap */}
        <mesh position={[0, 1.85, 0]}>
          <sphereGeometry
            args={[0.44, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.38]}
          />
          <meshStandardMaterial
            color={color}
            roughness={0.7}
            metalness={0.05}
            side={THREE.FrontSide}
          />
        </mesh>
        {/* Side band (torus half) */}
        <mesh position={[0, 1.58, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.41, 0.06, 8, 20, Math.PI]} />
          <meshStandardMaterial
            color={color}
            roughness={0.8}
            metalness={0.05}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
    );
  }

  return null;
}

// ─── Hat Component ────────────────────────────────────────────────────────────
function AvatarHat({
  hatStyle,
  hatColor,
}: {
  hatStyle: string;
  hatColor: string;
}) {
  if (hatStyle === "none") return null;

  if (hatStyle === "cap") {
    return (
      <group>
        {/* Dome / crown */}
        <mesh position={[0, 2.06, 0]}>
          <sphereGeometry
            args={[0.46, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.52]}
          />
          <meshStandardMaterial
            color={hatColor}
            roughness={0.65}
            metalness={0.08}
            side={THREE.FrontSide}
          />
        </mesh>
        {/* Brim — sticks forward */}
        <mesh position={[0, 1.88, 0.32]} rotation={[-0.18, 0, 0]}>
          <boxGeometry args={[0.72, 0.05, 0.38]} />
          <meshStandardMaterial
            color={hatColor}
            roughness={0.65}
            metalness={0.08}
          />
        </mesh>
        {/* Cap button on top */}
        <mesh position={[0, 2.28, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.06, 10]} />
          <meshStandardMaterial
            color={hatColor}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  if (hatStyle === "beanie") {
    return (
      <group>
        {/* Main beanie body */}
        <mesh position={[0, 2.07, 0]} scale={[1, 0.72, 1]}>
          <sphereGeometry args={[0.46, 32, 24]} />
          <meshStandardMaterial
            color={hatColor}
            roughness={0.75}
            metalness={0.04}
          />
        </mesh>
        {/* Folded cuff band */}
        <mesh position={[0, 1.82, 0]}>
          <cylinderGeometry args={[0.448, 0.448, 0.12, 32]} />
          <meshStandardMaterial
            color={hatColor}
            roughness={0.8}
            metalness={0.04}
            emissive={hatColor}
            emissiveIntensity={0.06}
          />
        </mesh>
        {/* Pom-pom on top */}
        <mesh position={[0, 2.34, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial
            color={hatColor}
            roughness={0.9}
            metalness={0.0}
          />
        </mesh>
      </group>
    );
  }

  if (hatStyle === "headband") {
    return (
      <mesh position={[0, 1.68, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.055, 12, 32]} />
        <meshStandardMaterial
          color={hatColor}
          roughness={0.6}
          metalness={0.1}
          emissive={hatColor}
          emissiveIntensity={0.12}
        />
      </mesh>
    );
  }

  return null;
}

// ─── Accessory Component ──────────────────────────────────────────────────────
function AvatarAccessory({ accessory }: { accessory: string }) {
  if (accessory === "none") return null;

  if (accessory === "glasses") {
    return (
      <group>
        {/* Left lens ring */}
        <mesh position={[-0.155, 1.585, 0.395]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.082, 0.018, 8, 20]} />
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        {/* Right lens ring */}
        <mesh position={[0.155, 1.585, 0.395]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.082, 0.018, 8, 20]} />
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        {/* Bridge between lenses */}
        <mesh position={[0, 1.585, 0.415]}>
          <boxGeometry args={[0.14, 0.018, 0.018]} />
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        {/* Left temple arm */}
        <mesh position={[-0.28, 1.585, 0.32]} rotation={[0, 0.45, 0]}>
          <boxGeometry args={[0.14, 0.014, 0.014]} />
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        {/* Right temple arm */}
        <mesh position={[0.28, 1.585, 0.32]} rotation={[0, -0.45, 0]}>
          <boxGeometry args={[0.14, 0.014, 0.014]} />
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      </group>
    );
  }

  if (accessory === "chain") {
    return (
      <group>
        {/* Main chain ring around neck */}
        <mesh position={[0, 1.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.022, 8, 28]} />
          <meshStandardMaterial
            color="#D4A017"
            roughness={0.25}
            metalness={0.95}
            emissive="#D4A017"
            emissiveIntensity={0.12}
          />
        </mesh>
        {/* Pendant drop */}
        <mesh position={[0, 0.92, 0.2]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial
            color="#D4A017"
            roughness={0.2}
            metalness={0.95}
            emissive="#D4A017"
            emissiveIntensity={0.18}
          />
        </mesh>
      </group>
    );
  }

  if (accessory === "headphones") {
    return (
      <group>
        {/* Arc over head */}
        <mesh position={[0, 2.0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.55, 0.04, 8, 24, Math.PI]} />
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
        {/* Left ear cup */}
        <mesh position={[-0.52, 1.55, 0]} scale={[0.42, 0.52, 0.3]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial
            color="#0F172A"
            roughness={0.5}
            metalness={0.5}
            emissive="#00E5FF"
            emissiveIntensity={0.18}
          />
        </mesh>
        {/* Right ear cup */}
        <mesh position={[0.52, 1.55, 0]} scale={[0.42, 0.52, 0.3]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial
            color="#0F172A"
            roughness={0.5}
            metalness={0.5}
            emissive="#00E5FF"
            emissiveIntensity={0.18}
          />
        </mesh>
        {/* Left cushion pad */}
        <mesh position={[-0.56, 1.55, 0]} scale={[0.18, 0.42, 0.28]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        {/* Right cushion pad */}
        <mesh position={[0.56, 1.55, 0]} scale={[0.18, 0.42, 0.28]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  return null;
}

// ─── Avatar 3D Scene Component ────────────────────────────────────────────────
function Avatar3D({ config }: { config: AvatarConfig }) {
  const groupRef = useRef<THREE.Group>(null);
  const spinRef = useRef(0);
  const configKeyRef = useRef(JSON.stringify(config));
  const timeRef = useRef(0);

  const skinColor = config.skinTone;
  const shirtColor = config.shirtColor;
  const pantsColor = config.pantsColor;
  const shoeColor = config.shoeColor;

  // Detect config change → trigger spin
  const configKey = JSON.stringify(config);
  if (configKey !== configKeyRef.current) {
    configKeyRef.current = configKey;
    spinRef.current = 0.5; // seconds of spin time remaining
  }

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;

    // Idle breathing: subtle Y scale oscillation
    const breathScale = 1 + Math.sin(timeRef.current * 1.2) * 0.012;
    groupRef.current.scale.y = breathScale;

    // Slow continuous rotation (8s per revolution)
    if (spinRef.current > 0) {
      // Fast spin on config change (0.5s → full 360°)
      spinRef.current = Math.max(0, spinRef.current - delta);
      const spinProgress = 1 - spinRef.current / 0.5;
      groupRef.current.rotation.y = spinProgress * Math.PI * 2;
    } else {
      groupRef.current.rotation.y += (delta * (Math.PI * 2)) / 8;
    }
  });

  // Shirt collar/detail geometry based on style
  const renderShirtDetail = () => {
    if (config.shirtStyle === "hoodie") {
      // Hood shape behind head
      return (
        <mesh position={[0, 1.1, -0.26]}>
          <sphereGeometry
            args={[0.35, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]}
          />
          <meshStandardMaterial
            color={shirtColor}
            roughness={0.6}
            metalness={0.1}
            emissive={shirtColor}
            emissiveIntensity={0.06}
            side={THREE.BackSide}
          />
        </mesh>
      );
    }
    if (config.shirtStyle === "jersey") {
      // Shoulder number stripe
      return (
        <>
          <mesh position={[-0.32, 0.7, 0.23]}>
            <boxGeometry args={[0.12, 0.55, 0.02]} />
            <meshStandardMaterial
              color={shirtColor}
              roughness={0.5}
              metalness={0.1}
              emissive={shirtColor}
              emissiveIntensity={0.15}
              transparent
              opacity={0.5}
            />
          </mesh>
          <mesh position={[0.32, 0.7, 0.23]}>
            <boxGeometry args={[0.12, 0.55, 0.02]} />
            <meshStandardMaterial
              color={shirtColor}
              roughness={0.5}
              metalness={0.1}
              emissive={shirtColor}
              emissiveIntensity={0.15}
              transparent
              opacity={0.5}
            />
          </mesh>
        </>
      );
    }
    return null;
  };

  // Pants legs height adjustment for shorts
  const isShorts = config.pantsStyle === "shorts";
  const thighHeight = isShorts ? 0.32 : 0.55;
  const thighY = isShorts ? -0.08 : -0.15;
  const shinVisible = !isShorts;

  // Shoe Y positions
  const shoeBaseY = shinVisible ? -1.06 : -0.42;
  const soleBaseY = shinVisible ? -1.13 : -0.49;
  const shadowY = shinVisible ? -1.18 : -0.55;

  // Render shoe geometry based on style
  const renderShoes = () => {
    if (config.shoeStyle === "boots") {
      return (
        <>
          {/* Left boot — taller with wider toe */}
          <mesh position={[-0.24, shoeBaseY + 0.05, 0.05]}>
            <boxGeometry args={[0.25, 0.22, 0.38]} />
            <meshStandardMaterial
              color={shoeColor}
              roughness={0.65}
              metalness={0.18}
            />
          </mesh>
          {/* Left boot sole */}
          <mesh position={[-0.24, soleBaseY, 0.05]}>
            <boxGeometry args={[0.27, 0.04, 0.42]} />
            <meshStandardMaterial
              color="#111111"
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
          {/* Right boot */}
          <mesh position={[0.24, shoeBaseY + 0.05, 0.05]}>
            <boxGeometry args={[0.25, 0.22, 0.38]} />
            <meshStandardMaterial
              color={shoeColor}
              roughness={0.65}
              metalness={0.18}
            />
          </mesh>
          {/* Right boot sole */}
          <mesh position={[0.24, soleBaseY, 0.05]}>
            <boxGeometry args={[0.27, 0.04, 0.42]} />
            <meshStandardMaterial
              color="#111111"
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
        </>
      );
    }

    if (config.shoeStyle === "slides") {
      return (
        <>
          {/* Left slide — flat sole */}
          <mesh position={[-0.24, shoeBaseY - 0.025, 0.05]}>
            <boxGeometry args={[0.24, 0.07, 0.4]} />
            <meshStandardMaterial
              color={shoeColor}
              roughness={0.55}
              metalness={0.15}
            />
          </mesh>
          {/* Left strap */}
          <mesh position={[-0.24, shoeBaseY + 0.025, 0.06]}>
            <boxGeometry args={[0.24, 0.055, 0.1]} />
            <meshStandardMaterial
              color={shoeColor}
              roughness={0.55}
              metalness={0.2}
              emissive={shoeColor}
              emissiveIntensity={0.1}
            />
          </mesh>
          {/* Right slide — flat sole */}
          <mesh position={[0.24, shoeBaseY - 0.025, 0.05]}>
            <boxGeometry args={[0.24, 0.07, 0.4]} />
            <meshStandardMaterial
              color={shoeColor}
              roughness={0.55}
              metalness={0.15}
            />
          </mesh>
          {/* Right strap */}
          <mesh position={[0.24, shoeBaseY + 0.025, 0.06]}>
            <boxGeometry args={[0.24, 0.055, 0.1]} />
            <meshStandardMaterial
              color={shoeColor}
              roughness={0.55}
              metalness={0.2}
              emissive={shoeColor}
              emissiveIntensity={0.1}
            />
          </mesh>
        </>
      );
    }

    // sneakers (default)
    return (
      <>
        {/* Left sneaker */}
        <mesh position={[-0.24, shoeBaseY, 0.05]}>
          <boxGeometry args={[0.22, 0.12, 0.38]} />
          <meshStandardMaterial
            color={shoeColor}
            roughness={0.6}
            metalness={0.15}
          />
        </mesh>
        {/* Left sneaker sole */}
        <mesh position={[-0.24, soleBaseY, 0.05]}>
          <boxGeometry args={[0.23, 0.04, 0.4]} />
          <meshStandardMaterial
            color="#111111"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        {/* Right sneaker */}
        <mesh position={[0.24, shoeBaseY, 0.05]}>
          <boxGeometry args={[0.22, 0.12, 0.38]} />
          <meshStandardMaterial
            color={shoeColor}
            roughness={0.6}
            metalness={0.15}
          />
        </mesh>
        {/* Right sneaker sole */}
        <mesh position={[0.24, soleBaseY, 0.05]}>
          <boxGeometry args={[0.23, 0.04, 0.4]} />
          <meshStandardMaterial
            color="#111111"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      </>
    );
  };

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* ── Head ── */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.55}
          metalness={0.08}
        />
      </mesh>

      {/* ── Ears ── */}
      <mesh position={[-0.44, 1.54, 0]} scale={[0.5, 0.62, 0.45]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.55}
          metalness={0.08}
        />
      </mesh>
      <mesh position={[0.44, 1.54, 0]} scale={[0.5, 0.62, 0.45]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.55}
          metalness={0.08}
        />
      </mesh>

      {/* ── Eyes (whites) ── */}
      <mesh position={[-0.15, 1.58, 0.36]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.0} />
      </mesh>
      <mesh position={[0.15, 1.58, 0.36]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.0} />
      </mesh>
      {/* ── Pupils ── */}
      <mesh position={[-0.15, 1.58, 0.415]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.0} />
      </mesh>
      <mesh position={[0.15, 1.58, 0.415]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.0} />
      </mesh>
      {/* ── Eye shine ── */}
      <mesh position={[-0.13, 1.6, 0.43]}>
        <sphereGeometry args={[0.018, 6, 6]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.0} metalness={0.0} />
      </mesh>
      <mesh position={[0.17, 1.6, 0.43]}>
        <sphereGeometry args={[0.018, 6, 6]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.0} metalness={0.0} />
      </mesh>

      {/* ── Nose ── */}
      <mesh position={[0, 1.48, 0.41]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* ── Mouth ── */}
      <mesh
        position={[0, 1.37, 0.37]}
        rotation={[0.3, 0, 0]}
        scale={[1, 0.5, 0.5]}
      >
        <torusGeometry args={[0.09, 0.02, 6, 12, Math.PI]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} metalness={0.0} />
      </mesh>

      {/* ── Hair ── */}
      <AvatarHair hairStyle={config.hairStyle} hairColor={config.hairColor} />

      {/* ── Hat (above hair) ── */}
      <AvatarHat hatStyle={config.hatStyle} hatColor={config.hatColor} />

      {/* ── Accessories ── */}
      <AvatarAccessory accessory={config.accessory} />

      {/* ── Neck ── */}
      <mesh position={[0, 1.22, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.25, 16]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.55}
          metalness={0.08}
        />
      </mesh>

      {/* ── Torso ── */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.9, 1.0, 0.45]} />
        <meshStandardMaterial
          color={shirtColor}
          roughness={0.55}
          metalness={0.1}
          emissive={shirtColor}
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Shirt detail */}
      {renderShirtDetail()}

      {/* ── Left Upper Arm ── */}
      <mesh position={[-0.58, 0.72, 0]} rotation={[0, 0, 0.28]}>
        <cylinderGeometry args={[0.13, 0.12, 0.5, 12]} />
        <meshStandardMaterial
          color={shirtColor}
          roughness={0.55}
          metalness={0.1}
          emissive={shirtColor}
          emissiveIntensity={0.06}
        />
      </mesh>
      {/* ── Right Upper Arm ── */}
      <mesh position={[0.58, 0.72, 0]} rotation={[0, 0, -0.28]}>
        <cylinderGeometry args={[0.13, 0.12, 0.5, 12]} />
        <meshStandardMaterial
          color={shirtColor}
          roughness={0.55}
          metalness={0.1}
          emissive={shirtColor}
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* ── Left Forearm ── */}
      <mesh position={[-0.72, 0.38, 0]} rotation={[0, 0, 0.18]}>
        <cylinderGeometry args={[0.11, 0.1, 0.45, 12]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.55}
          metalness={0.08}
        />
      </mesh>
      {/* ── Right Forearm ── */}
      <mesh position={[0.72, 0.38, 0]} rotation={[0, 0, -0.18]}>
        <cylinderGeometry args={[0.11, 0.1, 0.45, 12]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.55}
          metalness={0.08}
        />
      </mesh>

      {/* ── Left Hand ── */}
      <mesh position={[-0.82, 0.15, 0]}>
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.55}
          metalness={0.08}
        />
      </mesh>
      {/* ── Right Hand ── */}
      <mesh position={[0.82, 0.15, 0]}>
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.55}
          metalness={0.08}
        />
      </mesh>

      {/* ── Left Thigh ── */}
      <mesh position={[-0.24, thighY, 0]}>
        <cylinderGeometry args={[0.18, 0.16, thighHeight, 12]} />
        <meshStandardMaterial
          color={pantsColor}
          roughness={0.65}
          metalness={0.08}
          emissive={pantsColor}
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* ── Right Thigh ── */}
      <mesh position={[0.24, thighY, 0]}>
        <cylinderGeometry args={[0.18, 0.16, thighHeight, 12]} />
        <meshStandardMaterial
          color={pantsColor}
          roughness={0.65}
          metalness={0.08}
          emissive={pantsColor}
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* ── Cargo pockets (cargo style only) ── */}
      {config.pantsStyle === "cargo" && (
        <>
          <mesh position={[-0.32, -0.12, 0.17]}>
            <boxGeometry args={[0.18, 0.18, 0.05]} />
            <meshStandardMaterial
              color={pantsColor}
              roughness={0.7}
              metalness={0.05}
              emissive={pantsColor}
              emissiveIntensity={0.04}
            />
          </mesh>
          <mesh position={[0.32, -0.12, 0.17]}>
            <boxGeometry args={[0.18, 0.18, 0.05]} />
            <meshStandardMaterial
              color={pantsColor}
              roughness={0.7}
              metalness={0.05}
              emissive={pantsColor}
              emissiveIntensity={0.04}
            />
          </mesh>
        </>
      )}

      {/* ── Left Shin (hidden for shorts) ── */}
      {shinVisible && (
        <mesh position={[-0.24, -0.72, 0]}>
          <cylinderGeometry args={[0.14, 0.12, 0.55, 12]} />
          <meshStandardMaterial
            color={pantsColor}
            roughness={0.65}
            metalness={0.08}
            emissive={pantsColor}
            emissiveIntensity={0.05}
          />
        </mesh>
      )}
      {/* ── Right Shin (hidden for shorts) ── */}
      {shinVisible && (
        <mesh position={[0.24, -0.72, 0]}>
          <cylinderGeometry args={[0.14, 0.12, 0.55, 12]} />
          <meshStandardMaterial
            color={pantsColor}
            roughness={0.65}
            metalness={0.08}
            emissive={pantsColor}
            emissiveIntensity={0.05}
          />
        </mesh>
      )}

      {/* ── Shoes (dynamic by style) ── */}
      {renderShoes()}

      {/* ── Shadow disc on floor ── */}
      <mesh position={[0, shadowY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.45, 32]} />
        <meshStandardMaterial color="#00E5FF" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

// ─── 3D Canvas Wrapper ────────────────────────────────────────────────────────
function Avatar3DCanvas({ config }: { config: AvatarConfig }) {
  return (
    <div
      style={{
        width: "100%",
        height: 400,
        background: "oklch(0.06 0.02 270 / 0.95)",
        border: "1px solid oklch(0.82 0.18 200 / 0.25)",
        boxShadow: "0 0 40px oklch(0.82 0.18 200 / 0.1)",
        borderRadius: "1.25rem",
        overflow: "hidden",
      }}
    >
      <Suspense
        fallback={
          <div
            style={{
              height: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "oklch(0.82 0.18 200)",
                fontFamily: "monospace",
                fontSize: 12,
              }}
            >
              Loading avatar...
            </span>
          </div>
        }
      >
        <Canvas
          shadows
          gl={{ antialias: true, alpha: true }}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 0.4, 3.2]} fov={45} />

          {/* Orbit controls */}
          <OrbitControls
            enablePan={false}
            minDistance={2.2}
            maxDistance={5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.6}
          />

          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[3, 5, 3]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight
            position={[-3, 2, -2]}
            intensity={0.4}
            color="#a0c0ff"
          />
          <pointLight position={[0, -1.5, 1]} color="#00E5FF" intensity={0.8} />

          {/* Avatar */}
          <Avatar3D config={config} />
        </Canvas>
      </Suspense>
    </div>
  );
}

// ─── Option Button ────────────────────────────────────────────────────────────
function ColorSwatch({
  color,
  label,
  selected,
  onClick,
  "data-ocid": ocid,
}: {
  color: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  "data-ocid"?: string;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={() => {
        playClick();
        onClick();
      }}
      data-ocid={ocid}
      className="relative w-9 h-9 rounded-full transition-all duration-200 focus-visible:outline-none"
      style={{
        backgroundColor: color,
        boxShadow: selected
          ? "0 0 0 3px oklch(0.08 0.02 270), 0 0 0 5px #00E5FF, 0 0 12px 4px #00E5FF66"
          : "0 0 0 2px rgba(255,255,255,0.1)",
        transform: selected ? "scale(1.18)" : "scale(1)",
      }}
      aria-pressed={selected}
    >
      {selected && (
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: "rgba(255,255,255,0.15)" }}
        />
      )}
    </button>
  );
}

function StyleButton({
  label,
  selected,
  onClick,
  "data-ocid": ocid,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  "data-ocid"?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        playClick();
        onClick();
      }}
      data-ocid={ocid}
      aria-pressed={selected}
      className="px-4 py-2 rounded text-xs font-mono font-semibold tracking-wider uppercase transition-all duration-200 focus-visible:outline-none"
      style={{
        background: selected
          ? "oklch(0.82 0.18 200 / 0.18)"
          : "oklch(0.12 0.02 270 / 0.6)",
        border: selected
          ? "1.5px solid oklch(0.82 0.18 200 / 0.9)"
          : "1.5px solid oklch(0.3 0.03 270 / 0.4)",
        color: selected ? "oklch(0.82 0.18 200)" : "oklch(0.7 0.05 270)",
        boxShadow: selected ? "0 0 10px oklch(0.82 0.18 200 / 0.3)" : "none",
      }}
    >
      {label}
    </button>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────
function Panel({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{
        background: "oklch(0.1 0.02 270 / 0.7)",
        border: "1px solid oklch(0.3 0.05 270 / 0.3)",
        boxShadow: "0 4px 20px oklch(0 0 0 / 0.35)",
      }}
    >
      <h3
        className="font-mono text-xs font-bold tracking-widest uppercase"
        style={{ color: "oklch(0.82 0.18 200 / 0.8)" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

// ─── Avatar Customizer ────────────────────────────────────────────────────────
export default function AvatarCustomizer() {
  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_CONFIG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AvatarConfig>;
        setConfig((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore
    }
  }, []);

  const updateConfig = (patch: Partial<AvatarConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem(LS_CONFIG_KEY, JSON.stringify(config));
      // Generate a compact emoji string for leaderboard display
      const hairEmojis: Record<string, string> = {
        short: "✂️",
        long: "💇",
        spiky: "⚡",
        bun: "🎀",
        fade: "💈",
        bald: "🔅",
      };
      const shirtEmojis: Record<string, string> = {
        "t-shirt": "👕",
        hoodie: "🧥",
        jersey: "👔",
      };
      const pantsEmojis: Record<string, string> = {
        joggers: "🩳",
        cargo: "👖",
        shorts: "🩲",
      };
      const hatEmojis: Record<string, string> = {
        none: "",
        cap: "🧢",
        beanie: "🪖",
        headband: "🎀",
      };
      const shoeEmojis: Record<string, string> = {
        sneakers: "👟",
        boots: "🥾",
        slides: "🩴",
      };
      const emojiStr = `${hairEmojis[config.hairStyle] ?? "💁"}${shirtEmojis[config.shirtStyle] ?? "👕"}${pantsEmojis[config.pantsStyle] ?? "👖"}${hatEmojis[config.hatStyle] ?? ""}${shoeEmojis[config.shoeStyle] ?? "👟"}`;
      localStorage.setItem(LS_EMOJI_KEY, emojiStr);
      window.dispatchEvent(new CustomEvent("avatar-updated"));
    } catch {
      // ignore
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Avatar Preview — 3D Canvas */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="relative w-full max-w-lg">
          {/* Corner accents */}
          <div
            className="absolute top-3 left-3 w-5 h-5 z-10 pointer-events-none"
            style={{
              borderTop: "2px solid oklch(0.82 0.18 200 / 0.6)",
              borderLeft: "2px solid oklch(0.82 0.18 200 / 0.6)",
              borderRadius: "2px 0 0 0",
            }}
          />
          <div
            className="absolute top-3 right-3 w-5 h-5 z-10 pointer-events-none"
            style={{
              borderTop: "2px solid oklch(0.82 0.18 200 / 0.6)",
              borderRight: "2px solid oklch(0.82 0.18 200 / 0.6)",
              borderRadius: "0 2px 0 0",
            }}
          />
          <div
            className="absolute bottom-3 left-3 w-5 h-5 z-10 pointer-events-none"
            style={{
              borderBottom: "2px solid oklch(0.82 0.18 200 / 0.6)",
              borderLeft: "2px solid oklch(0.82 0.18 200 / 0.6)",
              borderRadius: "0 0 0 2px",
            }}
          />
          <div
            className="absolute bottom-3 right-3 w-5 h-5 z-10 pointer-events-none"
            style={{
              borderBottom: "2px solid oklch(0.82 0.18 200 / 0.6)",
              borderRight: "2px solid oklch(0.82 0.18 200 / 0.6)",
              borderRadius: "0 0 2px 0",
            }}
          />
          {/* Hint label */}
          <div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
            style={{
              color: "oklch(0.82 0.18 200 / 0.35)",
              fontSize: 10,
              fontFamily: "monospace",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Drag to rotate
          </div>

          <Avatar3DCanvas config={config} />
        </div>
      </motion.div>

      {/* Customization Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Face Tone */}
        <Panel title="Face Tone">
          <div className="flex flex-wrap gap-3">
            {SKIN_TONES.map((tone, i) => (
              <ColorSwatch
                key={tone.color}
                color={tone.color}
                label={tone.label}
                selected={config.skinTone === tone.color}
                onClick={() => updateConfig({ skinTone: tone.color })}
                data-ocid={`avatar.skin_tone.button.${i + 1}`}
              />
            ))}
          </div>
        </Panel>

        {/* Hair Style */}
        <Panel title="Hair Style">
          <div className="flex flex-wrap gap-2">
            {HAIR_STYLES.map((style, i) => (
              <StyleButton
                key={style.id}
                label={style.label}
                selected={config.hairStyle === style.id}
                onClick={() => updateConfig({ hairStyle: style.id })}
                data-ocid={`avatar.hair_style.button.${i + 1}`}
              />
            ))}
          </div>
          {config.hairStyle !== "bald" && (
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="font-mono text-xs text-foreground/40 tracking-wider uppercase w-full">
                Hair Color
              </span>
              {HAIR_COLORS.map((c) => (
                <ColorSwatch
                  key={c.color}
                  color={c.color}
                  label={c.label}
                  selected={config.hairColor === c.color}
                  onClick={() => updateConfig({ hairColor: c.color })}
                />
              ))}
            </div>
          )}
        </Panel>

        {/* Shirt / Top */}
        <Panel title="Shirt / Top">
          <div className="flex flex-wrap gap-2">
            {SHIRT_STYLES.map((style, i) => (
              <StyleButton
                key={style.id}
                label={style.label}
                selected={config.shirtStyle === style.id}
                onClick={() => updateConfig({ shirtStyle: style.id })}
                data-ocid={`avatar.shirt_style.button.${i + 1}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="font-mono text-xs text-foreground/40 tracking-wider uppercase w-full">
              Color
            </span>
            {SHIRT_COLORS.map((c, i) => (
              <ColorSwatch
                key={c.color}
                color={c.color}
                label={c.label}
                selected={config.shirtColor === c.color}
                onClick={() => updateConfig({ shirtColor: c.color })}
                data-ocid={`avatar.shirt_color.button.${i + 1}`}
              />
            ))}
          </div>
        </Panel>

        {/* Pants */}
        <Panel title="Pants">
          <div className="flex flex-wrap gap-2">
            {PANTS_STYLES.map((style, i) => (
              <StyleButton
                key={style.id}
                label={style.label}
                selected={config.pantsStyle === style.id}
                onClick={() => updateConfig({ pantsStyle: style.id })}
                data-ocid={`avatar.pants_style.button.${i + 1}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="font-mono text-xs text-foreground/40 tracking-wider uppercase w-full">
              Color
            </span>
            {PANTS_COLORS.map((c, i) => (
              <ColorSwatch
                key={c.color}
                color={c.color}
                label={c.label}
                selected={config.pantsColor === c.color}
                onClick={() => updateConfig({ pantsColor: c.color })}
                data-ocid={`avatar.pants_color.button.${i + 1}`}
              />
            ))}
          </div>
        </Panel>

        {/* Hat */}
        <Panel title="Hat">
          <div className="flex flex-wrap gap-2">
            {HAT_STYLES.map((style, i) => (
              <StyleButton
                key={style.id}
                label={style.label}
                selected={config.hatStyle === style.id}
                onClick={() => updateConfig({ hatStyle: style.id })}
                data-ocid={`avatar.hat_style.button.${i + 1}`}
              />
            ))}
          </div>
          {config.hatStyle !== "none" && (
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="font-mono text-xs text-foreground/40 tracking-wider uppercase w-full">
                Hat Color
              </span>
              {HAT_COLORS.map((c, i) => (
                <ColorSwatch
                  key={c.color}
                  color={c.color}
                  label={c.label}
                  selected={config.hatColor === c.color}
                  onClick={() => updateConfig({ hatColor: c.color })}
                  data-ocid={`avatar.hat_color.button.${i + 1}`}
                />
              ))}
            </div>
          )}
        </Panel>

        {/* Shoes */}
        <Panel title="Shoes">
          <div className="flex flex-wrap gap-2">
            {SHOE_STYLES.map((style, i) => (
              <StyleButton
                key={style.id}
                label={style.label}
                selected={config.shoeStyle === style.id}
                onClick={() => updateConfig({ shoeStyle: style.id })}
                data-ocid={`avatar.shoe_style.button.${i + 1}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="font-mono text-xs text-foreground/40 tracking-wider uppercase w-full">
              Color
            </span>
            {SHOE_COLORS.map((c, i) => (
              <ColorSwatch
                key={c.color}
                color={c.color}
                label={c.label}
                selected={config.shoeColor === c.color}
                onClick={() => updateConfig({ shoeColor: c.color })}
                data-ocid={`avatar.shoe_color.button.${i + 1}`}
              />
            ))}
          </div>
        </Panel>

        {/* Accessories */}
        <Panel title="Accessories">
          <div className="flex flex-wrap gap-2">
            {ACCESSORIES.map((acc, i) => (
              <StyleButton
                key={acc.id}
                label={acc.label}
                selected={config.accessory === acc.id}
                onClick={() => updateConfig({ accessory: acc.id })}
                data-ocid={`avatar.accessory.button.${i + 1}`}
              />
            ))}
          </div>
        </Panel>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <motion.button
          type="button"
          onClick={handleSave}
          data-ocid="avatar.save.primary_button"
          className="relative inline-flex items-center gap-3 px-10 py-4 rounded-lg font-display font-bold text-sm tracking-widest uppercase overflow-hidden"
          style={{
            background: "oklch(0.82 0.18 200 / 0.15)",
            border: "1.5px solid oklch(0.82 0.18 200 / 0.5)",
            color: "oklch(0.82 0.18 200)",
            boxShadow: "0 0 24px oklch(0.82 0.18 200 / 0.2)",
          }}
          whileHover={{
            scale: 1.04,
            boxShadow: "0 0 36px oklch(0.82 0.18 200 / 0.4)",
            borderColor: "oklch(0.82 0.18 200 / 0.9)",
          }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.82 0.18 200 / 0.08), transparent)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            role="presentation"
            aria-hidden="true"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Save Avatar
        </motion.button>
      </div>

      {/* Save Confirmation */}
      <AnimatePresence>
        {saved && (
          <motion.div
            data-ocid="avatar.success_state"
            className="flex justify-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-mono font-semibold tracking-wider"
              style={{
                background: "oklch(0.55 0.18 142 / 0.15)",
                border: "1px solid oklch(0.55 0.18 142 / 0.5)",
                color: "oklch(0.75 0.18 142)",
                boxShadow: "0 0 16px oklch(0.55 0.18 142 / 0.2)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                role="presentation"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Avatar saved!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
