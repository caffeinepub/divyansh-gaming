import { useState } from "react";
import BusSimulatorGame from "./games/BusSimulatorGame";
import MarioPlatformerGame from "./games/MarioPlatformerGame";

const GAMES = [
  {
    id: "mario",
    title: "Mario World",
    description: "Classic platformer! Jump over platforms, collect coins.",
    emoji: "🍄",
    accent: "#ff0055",
    component: <MarioPlatformerGame key="mario" />,
  },
  {
    id: "bus",
    title: "Bus Simulator",
    description: "Drive the bus, pick up all passengers to win!",
    emoji: "🚌",
    accent: "#00ffcc",
    component: <BusSimulatorGame key="bus" />,
  },
];

export default function SpecialGamesSection() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const active = GAMES.find((g) => g.id === activeGame);

  return (
    <section
      id="special-games"
      style={{
        padding: "60px 20px",
        background:
          "radial-gradient(ellipse at 50% 0%, oklch(0.12 0.04 240 / 0.5) 0%, transparent 70%)",
        position: "relative",
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div
          style={{
            display: "inline-block",
            background: "oklch(0.82 0.18 200 / 0.12)",
            border: "1px solid oklch(0.82 0.18 200 / 0.4)",
            borderRadius: 20,
            padding: "6px 20px",
            fontSize: 13,
            color: "oklch(0.82 0.18 200)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          🎮 Divyansh Special Games
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 900,
            color: "#fff",
            margin: 0,
            textShadow: "0 0 30px oklch(0.82 0.18 200 / 0.6)",
            letterSpacing: "-0.02em",
          }}
        >
          CREATOR'S GAMES
        </h2>
        <p
          style={{
            color: "oklch(0.7 0.05 240)",
            marginTop: 12,
            fontSize: 16,
          }}
        >
          Hand-crafted games built by Divyansh Yadav
        </p>
      </div>

      {/* Game Selector */}
      {!activeGame && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {GAMES.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => setActiveGame(game.id)}
              style={{
                background: `radial-gradient(ellipse at top, ${game.accent}15 0%, oklch(0.10 0.02 240) 70%)`,
                border: `2px solid ${game.accent}40`,
                borderRadius: 16,
                padding: "32px 24px",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.border = `2px solid ${game.accent}`;
                el.style.boxShadow = `0 0 30px ${game.accent}50`;
                el.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.border = `2px solid ${game.accent}40`;
                el.style.boxShadow = "none";
                el.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: 56, marginBottom: 12 }}>{game.emoji}</div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: game.accent,
                  textShadow: `0 0 10px ${game.accent}`,
                  marginBottom: 8,
                  letterSpacing: "0.05em",
                }}
              >
                {game.title}
              </div>
              <div
                style={{
                  color: "oklch(0.7 0.05 240)",
                  fontSize: 14,
                  marginBottom: 20,
                  lineHeight: 1.5,
                }}
              >
                {game.description}
              </div>
              <div
                style={{
                  display: "inline-block",
                  background: game.accent,
                  color: game.id === "bus" ? "#000" : "#fff",
                  padding: "8px 24px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  boxShadow: `0 0 15px ${game.accent}80`,
                }}
              >
                PLAY NOW
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Active Game */}
      {activeGame && active && (
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveGame(null)}
              style={{
                background: "oklch(0.18 0.03 240)",
                border: "1px solid oklch(0.3 0.05 240)",
                color: "#fff",
                padding: "8px 18px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              ← Back to Games
            </button>
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {GAMES.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setActiveGame(g.id)}
                  style={{
                    background:
                      g.id === activeGame
                        ? `${g.accent}30`
                        : "oklch(0.15 0.02 240)",
                    border: `1px solid ${g.id === activeGame ? g.accent : "oklch(0.3 0.05 240)"}`,
                    color: g.id === activeGame ? g.accent : "#aaa",
                    padding: "6px 16px",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: g.id === activeGame ? 700 : 400,
                  }}
                >
                  {g.emoji} {g.title}
                </button>
              ))}
            </div>
          </div>
          {active.component}
        </div>
      )}
    </section>
  );
}
