import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function GlowingCrosshairCursor() {
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  // Smooth trailing dot lags behind the raw cursor
  const trailX = useSpring(rawX, { stiffness: 180, damping: 22, mass: 0.5 });
  const trailY = useSpring(rawY, { stiffness: 180, damping: 22, mass: 0.5 });

  // Pulse ring animation ref
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    // Hide the default OS cursor
    document.documentElement.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.documentElement.style.cursor = "";
    };
  }, [rawX, rawY, visible]);

  const SIZE = 32; // crosshair outer size (px)
  const GAP = 7; // gap between center and lines

  return (
    <>
      {/* ── Crosshair ── */}
      <motion.div
        data-ocid="cursor.canvas_target"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: rawX,
          y: rawY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 9999,
          pointerEvents: "none",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.15s",
        }}
        animate={{ scale: clicking ? 0.7 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {/* Outer glow halo */}
        <div
          style={{
            position: "absolute",
            inset: -10,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, oklch(0.8 0.25 195 / 0.18) 0%, transparent 70%)",
            filter: "blur(6px)",
            animation: "cursor-pulse 2s ease-in-out infinite",
          }}
        />

        {/* SVG crosshair lines */}
        <svg
          role="img"
          aria-label="Crosshair cursor"
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ display: "block" }}
        >
          {/* Center dot */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={2}
            fill="oklch(0.9 0.3 195)"
            style={{ filter: "drop-shadow(0 0 4px oklch(0.8 0.3 195))" }}
          />

          {/* Top line */}
          <line
            x1={SIZE / 2}
            y1={0}
            x2={SIZE / 2}
            y2={SIZE / 2 - GAP}
            stroke="oklch(0.9 0.3 195)"
            strokeWidth={1.5}
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 3px oklch(0.8 0.3 195))" }}
          />
          {/* Bottom line */}
          <line
            x1={SIZE / 2}
            y1={SIZE / 2 + GAP}
            x2={SIZE / 2}
            y2={SIZE}
            stroke="oklch(0.9 0.3 195)"
            strokeWidth={1.5}
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 3px oklch(0.8 0.3 195))" }}
          />
          {/* Left line */}
          <line
            x1={0}
            y1={SIZE / 2}
            x2={SIZE / 2 - GAP}
            y2={SIZE / 2}
            stroke="oklch(0.9 0.3 195)"
            strokeWidth={1.5}
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 3px oklch(0.8 0.3 195))" }}
          />
          {/* Right line */}
          <line
            x1={SIZE / 2 + GAP}
            y1={SIZE / 2}
            x2={SIZE}
            y2={SIZE / 2}
            stroke="oklch(0.9 0.3 195)"
            strokeWidth={1.5}
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 3px oklch(0.8 0.3 195))" }}
          />

          {/* Corner brackets */}
          {/* Top-left */}
          <path
            d="M 4 10 L 4 4 L 10 4"
            stroke="oklch(0.75 0.25 195 / 0.8)"
            strokeWidth={1.2}
            fill="none"
            strokeLinecap="round"
          />
          {/* Top-right */}
          <path
            d="M 22 4 L 28 4 L 28 10"
            stroke="oklch(0.75 0.25 195 / 0.8)"
            strokeWidth={1.2}
            fill="none"
            strokeLinecap="round"
          />
          {/* Bottom-left */}
          <path
            d="M 4 22 L 4 28 L 10 28"
            stroke="oklch(0.75 0.25 195 / 0.8)"
            strokeWidth={1.2}
            fill="none"
            strokeLinecap="round"
          />
          {/* Bottom-right */}
          <path
            d="M 22 28 L 28 28 L 28 22"
            stroke="oklch(0.75 0.25 195 / 0.8)"
            strokeWidth={1.2}
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* Expanding ring on click */}
        {clicking && (
          <motion.div
            ref={ringRef}
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              border: "1.5px solid oklch(0.85 0.3 195 / 0.7)",
              boxShadow: "0 0 12px oklch(0.8 0.3 195 / 0.5)",
            }}
            initial={{ scale: 0.4, opacity: 1 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        )}
      </motion.div>

      {/* ── Trailing glow dot ── */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 9998,
          pointerEvents: "none",
          opacity: visible ? 0.55 : 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "oklch(0.85 0.3 195)",
          boxShadow:
            "0 0 8px 4px oklch(0.8 0.3 195 / 0.4), 0 0 18px 6px oklch(0.75 0.28 195 / 0.2)",
          transition: "opacity 0.15s",
        }}
      />

      {/* ── Keyframe injection ── */}
      <style>{`
        @keyframes cursor-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.25); }
        }
        /* Hide cursor everywhere except canvas/game elements that need it */
        *, *::before, *::after { cursor: none !important; }
      `}</style>
    </>
  );
}
