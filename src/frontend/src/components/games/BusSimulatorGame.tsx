import { useEffect, useRef, useState } from "react";

export default function BusSimulatorGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const rafRef = useRef<number>(0);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    const state = {
      bus: { x: 400, y: 300, rotation: 0, velX: 0, velY: 0, speed: 0 },
      roadOffset: { x: 0, y: 0 },
      obstacles: Array.from({ length: 8 }, () => ({
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50,
        hit: false,
      })),
      passengers: Array.from({ length: 5 }, () => ({
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50,
        picked: false,
      })),
      score: 0,
      sparks: [] as {
        x: number;
        y: number;
        vx: number;
        vy: number;
        life: number;
      }[],
    };

    const drag = 0.95;
    const maxSpeed = 400;

    function update(dt: number) {
      const keys = keysRef.current;
      const bus = state.bus;

      if (keys.ArrowUp || keys.w || keys.W) {
        bus.velX += Math.sin(bus.rotation) * 8;
        bus.velY -= Math.cos(bus.rotation) * 8;
      }
      if (keys.ArrowDown || keys.s || keys.S) {
        bus.velX -= Math.sin(bus.rotation) * 4;
        bus.velY += Math.cos(bus.rotation) * 4;
      }

      const currentSpeed = Math.sqrt(bus.velX * bus.velX + bus.velY * bus.velY);
      if (currentSpeed > 10) {
        if (keys.ArrowLeft || keys.a || keys.A) {
          bus.rotation -= 0.04;
        }
        if (keys.ArrowRight || keys.d || keys.D) {
          bus.rotation += 0.04;
        }
      }

      bus.velX *= drag;
      bus.velY *= drag;

      // Clamp speed
      const spd = Math.sqrt(bus.velX ** 2 + bus.velY ** 2);
      if (spd > maxSpeed * dt) {
        bus.velX = (bus.velX / spd) * maxSpeed * dt;
        bus.velY = (bus.velY / spd) * maxSpeed * dt;
      }

      state.roadOffset.x += bus.velX * 0.01;
      state.roadOffset.y += bus.velY * 0.01;

      bus.speed = spd / dt;
      setSpeed(Math.round(bus.speed));

      // Passenger pickup
      for (const p of state.passengers) {
        if (!p.picked) {
          const dx = bus.x - p.x;
          const dy = bus.y - p.y;
          if (Math.sqrt(dx * dx + dy * dy) < 40) {
            p.picked = true;
            state.score += 50;
            // Spawn spark effect
            for (let i = 0; i < 8; i++) {
              state.sparks.push({
                x: bus.x,
                y: bus.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 1,
              });
            }
          }
        }
      }

      // Update sparks
      state.sparks = state.sparks
        .map((s) => ({
          ...s,
          x: s.x + s.vx,
          y: s.y + s.vy,
          life: s.life - 0.05,
        }))
        .filter((s) => s.life > 0);
    }

    function draw() {
      if (!ctx || !canvas) return;

      // Road background (tiled)
      const roadOffX = ((state.roadOffset.x % 80) + 80) % 80;
      const roadOffY = ((state.roadOffset.y % 80) + 80) % 80;
      ctx.fillStyle = "#3a3a3a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Road grid
      ctx.strokeStyle = "#555";
      ctx.lineWidth = 1;
      for (let x = -roadOffX; x < canvas.width + 80; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = -roadOffY; y < canvas.height + 80; y += 80) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Road markings
      ctx.strokeStyle = "rgba(255,255,0,0.15)";
      ctx.lineWidth = 2;
      ctx.setLineDash([40, 40]);
      const markOffX = ((state.roadOffset.x % 80) + 80) % 80;
      for (let x = -markOffX; x < canvas.width + 80; x += 160) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Passengers (bus stop icons)
      for (const p of state.passengers) {
        if (!p.picked) {
          ctx.fillStyle = "#00ffcc";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#000";
          ctx.font = "bold 14px Arial";
          ctx.textAlign = "center";
          ctx.fillText("\uD83D\uDECF", p.x, p.y + 5);
          ctx.textAlign = "left";
          // Glowing ring
          ctx.strokeStyle = "rgba(0,255,204,0.4)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(
            p.x,
            p.y,
            22 + Math.sin(Date.now() / 200) * 4,
            0,
            Math.PI * 2,
          );
          ctx.stroke();
        }
      }

      // Sparks
      for (const s of state.sparks) {
        ctx.globalAlpha = s.life;
        ctx.fillStyle = `hsl(${Math.random() * 60 + 20}, 100%, 70%)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Bus
      const bus = state.bus;
      ctx.save();
      ctx.translate(bus.x, bus.y);
      ctx.rotate(bus.rotation);

      // Bus body
      ctx.fillStyle = "#FFD700";
      ctx.fillRect(-30, -16, 60, 32);

      // Bus windows
      ctx.fillStyle = "rgba(100,200,255,0.8)";
      for (let i = -20; i <= 10; i += 16) {
        ctx.fillRect(i, -12, 12, 10);
      }

      // Headlights
      ctx.fillStyle = "#fff";
      ctx.fillRect(24, -10, 6, 8);
      ctx.fillStyle = "rgba(255,255,100,0.6)";
      ctx.fillRect(24, -10, 10, 8);

      // Taillights
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(-30, -10, 6, 8);

      // Exhaust smoke
      if (Math.sqrt(bus.velX ** 2 + bus.velY ** 2) > 1) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "#aaa";
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(
            -35 - i * 8,
            (Math.random() - 0.5) * 10,
            4 + i * 2,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      ctx.restore();

      // HUD
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, canvas.width, 44);
      ctx.fillStyle = "#00ffcc";
      ctx.font = "bold 18px Arial";
      ctx.fillText("BUS SIMULATOR: DIVYANSH EDITION", 20, 28);
      ctx.fillStyle = "#fff";
      ctx.fillText(
        `SPEED: ${Math.round(state.bus.speed)}  |  SCORE: ${state.score}`,
        canvas.width - 280,
        28,
      );

      const remaining = state.passengers.filter((p) => !p.picked).length;
      if (remaining === 0) {
        ctx.fillStyle = "rgba(0,255,204,0.9)";
        ctx.font = "bold 36px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          "ALL PASSENGERS PICKED! \uD83C\uDF89",
          canvas.width / 2,
          canvas.height / 2,
        );
        ctx.textAlign = "left";
      }

      // Controls hint
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "12px Arial";
      ctx.fillText(
        "\u2191\u2193 Accelerate/Brake   \u2190\u2192 Steer   Pick up all passengers!",
        20,
        canvas.height - 10,
      );
    }

    let lastTime = performance.now();

    function loop(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      update(dt);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (
        [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [started]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {!started ? (
        <button
          type="button"
          style={{
            width: "100%",
            maxWidth: 800,
            aspectRatio: "4 / 3",
            background:
              "radial-gradient(ellipse at center, #1a1a2e 0%, #0d0d1a 100%)",
            border: "2px solid #00ffcc",
            boxShadow: "0 0 20px #00ffcc",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            borderRadius: 8,
            cursor: "pointer",
          }}
          onClick={() => setStarted(true)}
        >
          <div style={{ fontSize: 48 }}>🚌</div>
          <div
            style={{
              color: "#00ffcc",
              fontSize: 22,
              fontWeight: "bold",
              textShadow: "0 0 10px #00ffcc",
            }}
          >
            BUS SIMULATOR
          </div>
          <div style={{ color: "#fff", fontSize: 14, opacity: 0.7 }}>
            Pick up all passengers to win!
          </div>
          <div style={{ color: "#aaa", fontSize: 13 }}>
            ↑↓ to drive, ←→ to steer
          </div>
        </button>
      ) : (
        <div style={{ position: "relative", width: "100%", maxWidth: 800 }}>
          <div
            style={{
              position: "absolute",
              top: 50,
              right: 12,
              background: "rgba(0,0,0,0.7)",
              color: "#00ffcc",
              padding: "4px 12px",
              borderRadius: 4,
              fontSize: 14,
              fontWeight: "bold",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            Speed: {speed}
          </div>
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              border: "2px solid #00ffcc",
              boxShadow: "0 0 20px #00ffcc",
              borderRadius: 8,
              display: "block",
            }}
            tabIndex={0}
          />
        </div>
      )}
    </div>
  );
}
