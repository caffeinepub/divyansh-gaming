import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const PARTICLE_COUNT = 16;
const SPARK_COUNT = 12;

const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: `particle-${i}`,
  index: i,
}));

const SPARKS = Array.from({ length: SPARK_COUNT }, (_, i) => ({
  id: `spark-${i}`,
  angle: (i / SPARK_COUNT) * 360,
  delay: (i / SPARK_COUNT) * 1.5,
  color: i % 3 === 0 ? "#f97316" : i % 3 === 1 ? "#38bdf8" : "#a78bfa",
}));

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 3000;
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

    // Random glitch flashes
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 700);

    const timer = setTimeout(() => setVisible(false), 3500);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, transition: { duration: 0.7 } }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#030712",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
            overflow: "hidden",
          }}
        >
          {/* Animated grid background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(56,189,248,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.07) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              animation: "grid-move 4s linear infinite",
            }}
          />

          {/* Radial glow behind logo */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(249,115,22,0.25) 0%, rgba(56,189,248,0.15) 50%, transparent 75%)",
              pointerEvents: "none",
            }}
          />

          {/* Electric ring sparks */}
          <div
            style={{
              position: "absolute",
              width: 380,
              height: 380,
              pointerEvents: "none",
            }}
          >
            {SPARKS.map(({ id, angle, delay, color }) => (
              <div
                key={id}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 4,
                  height: 18,
                  marginTop: -9,
                  marginLeft: -2,
                  background: `linear-gradient(to bottom, ${color}, transparent)`,
                  boxShadow: `0 0 8px 2px ${color}`,
                  borderRadius: 2,
                  transform: `rotate(${angle}deg) translateY(-170px)`,
                  animation: "spark-flash 1.5s ease-in-out infinite",
                  animationDelay: `${delay}s`,
                  opacity: 0,
                }}
              />
            ))}
          </div>

          {/* Orbiting particles */}
          <div
            style={{
              position: "absolute",
              width: 300,
              height: 300,
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
                  width: i % 4 === 0 ? 10 : 6,
                  height: i % 4 === 0 ? 10 : 6,
                  marginTop: i % 4 === 0 ? -5 : -3,
                  marginLeft: i % 4 === 0 ? -5 : -3,
                  borderRadius: "50%",
                  background:
                    i % 3 === 0
                      ? "#f97316"
                      : i % 3 === 1
                        ? "#38bdf8"
                        : "#a78bfa",
                  boxShadow:
                    i % 3 === 0
                      ? "0 0 10px 3px rgba(249,115,22,0.9)"
                      : i % 3 === 1
                        ? "0 0 10px 3px rgba(56,189,248,0.9)"
                        : "0 0 10px 3px rgba(167,139,250,0.9)",
                  animation: `orbit-ring ${2.5 + (i % 4) * 0.4}s linear infinite`,
                  animationDelay: `${(i / PARTICLE_COUNT) * -(2.5 + (i % 4) * 0.4)}s`,
                  transform: `rotate(${(i / PARTICLE_COUNT) * 360}deg) translateX(${120 + (i % 3) * 20}px) rotate(-${(i / PARTICLE_COUNT) * 360}deg)`,
                }}
              />
            ))}
          </div>

          {/* Logo image with glitch & glow */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              position: "relative",
              width: 260,
              height: 260,
              filter: glitch
                ? "drop-shadow(0 0 30px #f97316) drop-shadow(0 0 60px #38bdf8) hue-rotate(20deg) brightness(1.4)"
                : "drop-shadow(0 0 20px rgba(249,115,22,0.7)) drop-shadow(0 0 40px rgba(56,189,248,0.5))",
              transition: "filter 0.08s",
              zIndex: 2,
            }}
          >
            {/* Glitch clone offset layers */}
            {glitch && (
              <>
                <img
                  src="/assets/uploads/file_000000001a24720ba27abc4f48779ad5-1.png"
                  alt=""
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    opacity: 0.5,
                    transform: "translate(-6px, 2px)",
                    filter: "hue-rotate(180deg) saturate(3)",
                    mixBlendMode: "screen",
                  }}
                />
                <img
                  src="/assets/uploads/file_000000001a24720ba27abc4f48779ad5-1.png"
                  alt=""
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    opacity: 0.5,
                    transform: "translate(6px, -2px)",
                    filter: "hue-rotate(90deg) saturate(3)",
                    mixBlendMode: "screen",
                  }}
                />
              </>
            )}
            <img
              src="/assets/uploads/file_000000001a24720ba27abc4f48779ad5-1.png"
              alt="DIVYANSH GAMING Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                position: "relative",
                zIndex: 1,
              }}
            />
          </motion.div>

          {/* Title with glitch */}
          <motion.div
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY }}
            style={{
              fontSize: "1.8rem",
              fontWeight: 900,
              fontFamily: '"Bricolage Grotesque", sans-serif',
              letterSpacing: "0.14em",
              background:
                "linear-gradient(135deg, #f97316 0%, #38bdf8 50%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: glitch ? "3px 0 #f97316, -3px 0 #38bdf8" : "none",
              filter: glitch ? "brightness(1.5)" : "none",
              transition: "filter 0.08s",
              position: "relative",
              zIndex: 2,
            }}
          >
            DIVYANSH GAMING
          </motion.div>

          {/* Progress bar */}
          <div
            style={{
              width: 320,
              height: 5,
              borderRadius: 999,
              background: "rgba(255,255,255,0.07)",
              overflow: "hidden",
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.5)",
              position: "relative",
              zIndex: 2,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #f97316, #38bdf8, #a78bfa)",
                boxShadow: "0 0 14px rgba(56,189,248,0.8)",
                borderRadius: 999,
                transition: "width 0.05s linear",
              }}
            />
          </div>

          {/* Loading text */}
          <p
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.65rem",
              color: "rgba(148,163,184,0.7)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              zIndex: 2,
            }}
          >
            {progress < 40
              ? "Initializing..."
              : progress < 80
                ? "Loading Assets..."
                : "Ready!"}
          </p>

          <style>{`
            @keyframes grid-move {
              0% { backgroundPosition: 0 0; }
              100% { backgroundPosition: 40px 40px; }
            }
            @keyframes orbit-ring {
              from { transform: rotate(var(--start-angle, 0deg)) translateX(var(--radius, 90px)) rotate(calc(-1 * var(--start-angle, 0deg))); }
              to { transform: rotate(calc(var(--start-angle, 0deg) + 360deg)) translateX(var(--radius, 90px)) rotate(calc(-1 * (var(--start-angle, 0deg) + 360deg))); }
            }
            @keyframes spark-flash {
              0%, 100% { opacity: 0; transform: rotate(var(--angle, 0deg)) translateY(-170px) scaleY(0.5); }
              50% { opacity: 1; transform: rotate(var(--angle, 0deg)) translateY(-155px) scaleY(1.5); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
