import { Moon, Sun } from "lucide-react";
import type { ThemeColor } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";

const SWATCHES: { color: ThemeColor; hex: string; label: string }[] = [
  { color: "cyan", hex: "oklch(0.82 0.18 200)", label: "Cyan" },
  { color: "red", hex: "oklch(0.65 0.25 25)", label: "Red Neon" },
  { color: "green", hex: "oklch(0.82 0.25 145)", label: "Green Neon" },
  { color: "purple", hex: "oklch(0.72 0.28 295)", label: "Purple Neon" },
];

export default function ThemeControls() {
  const { isDark, setIsDark, theme, setTheme } = useTheme();

  return (
    <div
      style={{
        position: "fixed",
        top: "5rem",
        right: "1rem",
        zIndex: 45,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.625rem 0.5rem",
        borderRadius: "9999px",
        background: "oklch(0.1 0.02 270 / 0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid oklch(0.82 0.18 200 / 0.25)",
        boxShadow:
          "0 4px 24px oklch(0 0 0 / 0.4), 0 0 0 1px oklch(0.82 0.18 200 / 0.08) inset",
      }}
    >
      {/* Day/Night toggle */}
      <button
        type="button"
        title={isDark ? "Switch to Day mode" : "Switch to Night mode"}
        data-ocid="theme.toggle"
        onClick={() => setIsDark(!isDark)}
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid oklch(0.82 0.18 200 / 0.3)",
          background: isDark
            ? "oklch(0.15 0.03 270)"
            : "oklch(0.88 0.12 75 / 0.2)",
          color: isDark ? "oklch(0.75 0.04 260)" : "oklch(0.88 0.18 75)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: isDark ? "none" : "0 0 12px oklch(0.88 0.18 75 / 0.4)",
        }}
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </button>

      {/* Divider */}
      <div
        style={{
          width: 20,
          height: 1,
          background: "oklch(0.82 0.18 200 / 0.2)",
          borderRadius: 999,
        }}
      />

      {/* Theme swatches — 2×2 grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 4,
        }}
      >
        {SWATCHES.map((s) => (
          <button
            key={s.color}
            type="button"
            title={s.label}
            data-ocid={`theme.${s.color}_button`}
            onClick={() => setTheme(s.color)}
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: s.hex,
              border:
                theme === s.color ? "2px solid white" : "2px solid transparent",
              cursor: "pointer",
              boxShadow:
                theme === s.color
                  ? `0 0 8px ${s.hex.replace("oklch(", "oklch(").replace(")", " / 0.7)")}`
                  : "none",
              transition: "all 0.15s ease",
              outline: "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}
