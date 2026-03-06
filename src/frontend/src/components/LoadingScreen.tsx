import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const PARTICLE_COUNT = 8;

// Static particle descriptors so keys are deterministic
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: `particle-${i}`,
  index: i,
}));

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 2000;
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (elapsed < duration) {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);

    const timer = setTimeout(() => setVisible(false), 2500);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.6 } }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "oklch(0.05 0.015 270)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
          }}
        >
          {/* Orbiting particles */}
          <div
            style={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          >
            {PARTICLES.map(({ id, index: i }) => (
              <div
                key={id}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 7,
                  height: 7,
                  marginTop: -3.5,
                  marginLeft: -3.5,
                  borderRadius: "50%",
                  background:
                    i % 2 === 0
                      ? "oklch(0.82 0.18 200)"
                      : "oklch(0.62 0.22 295)",
                  boxShadow:
                    i % 2 === 0
                      ? "0 0 8px 2px oklch(0.82 0.18 200 / 0.8)"
                      : "0 0 8px 2px oklch(0.62 0.22 295 / 0.8)",
                  animation: `orbit-ring ${2 + i * 0.3}s linear infinite`,
                  animationDelay: `${(i / PARTICLE_COUNT) * -(2 + i * 0.3)}s`,
                  transform: `rotate(${(i / PARTICLE_COUNT) * 360}deg) translateX(90px) rotate(-${(i / PARTICLE_COUNT) * 360}deg)`,
                }}
              />
            ))}
          </div>

          {/* Logo */}
          <div
            style={{
              position: "relative",
              width: 200,
              height: 200,
              animation: "logo-pulse-glow 2s ease-in-out infinite",
            }}
          >
            <img
              src="/assets/generated/divyansh-gaming-logo-transparent.dim_400x400.png"
              alt="DIVYANSH GAMING Logo"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              fontFamily: '"Bricolage Grotesque", sans-serif',
              letterSpacing: "0.12em",
              background:
                "linear-gradient(135deg, oklch(0.82 0.18 200) 0%, oklch(0.62 0.22 295) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "loading-glitch 5s infinite",
              display: "inline-block",
            }}
          >
            DIVYANSH GAMING
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: 300,
              height: 4,
              borderRadius: 999,
              background: "oklch(0.15 0.02 270)",
              overflow: "hidden",
              boxShadow: "inset 0 0 6px oklch(0 0 0 / 0.4)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, oklch(0.82 0.18 200), oklch(0.62 0.22 295))",
                boxShadow: "0 0 10px oklch(0.82 0.18 200 / 0.6)",
                borderRadius: 999,
                transition: "width 0.05s linear",
              }}
            />
          </div>

          {/* Loading text */}
          <p
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.7rem",
              color: "oklch(0.5 0.04 270)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Loading...
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
