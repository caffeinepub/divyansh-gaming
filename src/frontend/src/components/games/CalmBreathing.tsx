import { useEffect, useState } from "react";

const PHASES = [
  { label: "Inhale", duration: 4, color: "#00ffcc", targetScale: 1.6 },
  { label: "Hold", duration: 4, color: "#ffd700", targetScale: 1.6 },
  { label: "Exhale", duration: 6, color: "#aa44ff", targetScale: 0.6 },
  { label: "Hold", duration: 2, color: "#ff8844", targetScale: 0.6 },
];

export default function CalmBreathing() {
  const [active, setActive] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scale, setScale] = useState(1);
  const [cycles, setCycles] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: phaseIdx dep causes infinite loop
  useEffect(() => {
    if (!active) return;
    const phase = PHASES[phaseIdx];
    const startScale = scale;
    const endScale = phase.targetScale;
    const totalMs = phase.duration * 1000;
    let start: number | null = null;

    const anim = (t: number) => {
      if (!start) start = t;
      const elapsed = t - start;
      const p = Math.min(elapsed / totalMs, 1);
      setProgress(p);
      setScale(startScale + (endScale - startScale) * p);
      if (p < 1) requestAnimationFrame(anim);
      else {
        const next = (phaseIdx + 1) % PHASES.length;
        if (next === 0) setCycles((c) => c + 1);
        setPhaseIdx(next);
      }
    };
    const raf = requestAnimationFrame(anim);
    return () => cancelAnimationFrame(raf);
  }, [active, phaseIdx]);

  const phase = PHASES[phaseIdx];

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="text-sm font-mono text-white/50">
        Cycles completed: {cycles}
      </div>
      <div
        className="relative flex items-center justify-center"
        style={{ width: 240, height: 240 }}
      >
        {/* Outer ring */}
        <div
          className="absolute rounded-full"
          style={{
            width: 220,
            height: 220,
            border: `2px solid ${phase.color}20`,
          }}
        />
        {/* Breathing circle */}
        <div
          className="rounded-full flex items-center justify-center transition-none"
          style={{
            width: 80,
            height: 80,
            background: `${phase.color}20`,
            border: `3px solid ${phase.color}`,
            transform: `scale(${scale})`,
            boxShadow: `0 0 ${40 * scale}px ${phase.color}60`,
            transition: "none",
          }}
        >
          <span className="text-2xl select-none">🧘</span>
        </div>
        {/* Progress arc */}
        <svg
          className="absolute"
          width={220}
          height={220}
          aria-hidden="true"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={110}
            cy={110}
            r={105}
            fill="none"
            stroke={phase.color}
            strokeWidth={4}
            strokeDasharray={`${2 * Math.PI * 105 * progress} ${2 * Math.PI * 105 * (1 - progress)}`}
            strokeLinecap="round"
            opacity={0.8}
          />
        </svg>
      </div>
      <div className="text-center">
        <p
          className="text-3xl font-bold"
          style={{ color: phase.color, textShadow: `0 0 20px ${phase.color}` }}
        >
          {phase.label}
        </p>
        <p className="text-white/40 text-sm">{phase.duration} seconds</p>
      </div>
      <button
        type="button"
        onClick={() => {
          setActive((a) => !a);
          if (active) {
            setPhaseIdx(0);
            setProgress(0);
            setScale(1);
          }
        }}
        className="px-6 py-3 rounded-full font-bold text-sm transition-all"
        style={{
          background: active ? "rgba(255,100,100,0.2)" : "rgba(0,255,200,0.2)",
          border: `1px solid ${active ? "#ff6666" : "#00ffcc"}`,
          color: active ? "#ff6666" : "#00ffcc",
        }}
      >
        {active ? "⏹ Stop" : "▶ Begin"}
      </button>
      <p className="text-xs text-white/30 text-center max-w-48">
        4-4-6-2 breathing pattern. Helps reduce stress and anxiety.
      </p>
    </div>
  );
}
