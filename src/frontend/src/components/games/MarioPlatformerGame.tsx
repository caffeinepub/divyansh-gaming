import { useEffect, useRef, useState } from "react";

export default function MarioPlatformerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const rafRef = useRef<number>(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    const gravity = 0.8;
    const friction = 0.9;

    const player = {
      x: 100,
      y: 300,
      width: 40,
      height: 40,
      speed: 5,
      velX: 0,
      velY: 0,
      jumping: false,
      color: "#ff0000",
    };

    const platforms = [
      { x: 0, y: 380, width: 2000, height: 20 },
      { x: 300, y: 280, width: 100, height: 20 },
      { x: 500, y: 200, width: 100, height: 20 },
      { x: 700, y: 300, width: 150, height: 20 },
      { x: 200, y: 320, width: 80, height: 20 },
      { x: 600, y: 150, width: 90, height: 20 },
    ];

    const coins: { x: number; y: number; collected: boolean }[] = [
      { x: 330, y: 250, collected: false },
      { x: 530, y: 170, collected: false },
      { x: 730, y: 270, collected: false },
      { x: 220, y: 295, collected: false },
      { x: 620, y: 125, collected: false },
    ];

    let score = 0;
    let cameraX = 0;

    function update() {
      const keys = keysRef.current;

      if (keys.ArrowUp || keys[" "]) {
        if (!player.jumping) {
          player.jumping = true;
          player.velY = -player.speed * 3.2;
        }
      }
      if (keys.ArrowRight) {
        if (player.velX < player.speed) player.velX++;
      }
      if (keys.ArrowLeft) {
        if (player.velX > -player.speed) player.velX--;
      }

      player.velX *= friction;
      player.velY += gravity;
      player.x += player.velX;
      player.y += player.velY;

      // Platform collision
      player.jumping = true;
      for (const p of platforms) {
        if (
          player.x + player.width > p.x &&
          player.x < p.x + p.width &&
          player.y + player.height > p.y &&
          player.y + player.height < p.y + p.height + 10 &&
          player.velY >= 0
        ) {
          player.y = p.y - player.height;
          player.jumping = false;
          player.velY = 0;
        }
      }

      // Bounds
      if (player.x < 0) player.x = 0;
      if (player.y > 500) {
        player.x = 100;
        player.y = 300;
        player.velX = 0;
        player.velY = 0;
      }

      // Coin collection
      for (const c of coins) {
        if (
          !c.collected &&
          Math.abs(player.x + player.width / 2 - c.x) < 20 &&
          Math.abs(player.y + player.height / 2 - c.y) < 20
        ) {
          c.collected = true;
          score += 10;
        }
      }

      // Camera
      cameraX = Math.max(0, player.x - 300);

      draw();
      rafRef.current = requestAnimationFrame(update);
    }

    function draw() {
      if (!ctx || !canvas) return;
      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
      sky.addColorStop(0, "#1a1a2e");
      sky.addColorStop(1, "#5c94fc");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(-cameraX, 0);

      // Platforms
      for (const p of platforms) {
        // Grass top
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(p.x, p.y, p.width, 6);
        // Dirt
        ctx.fillStyle = "#8b4513";
        ctx.fillRect(p.x, p.y + 6, p.width, p.height - 6);
        // Block pattern
        ctx.strokeStyle = "#6b3410";
        ctx.lineWidth = 1;
        for (let bx = p.x; bx < p.x + p.width; bx += 32) {
          ctx.strokeRect(bx, p.y + 6, 32, p.height - 6);
        }
      }

      // Coins
      for (const c of coins) {
        if (!c.collected) {
          ctx.fillStyle = "#FFD700";
          ctx.beginPath();
          ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#FFA500";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = "#FFF";
          ctx.font = "bold 8px Arial";
          ctx.fillText("$", c.x - 4, c.y + 3);
        }
      }

      // Player (Mario-style block)
      ctx.fillStyle = "#cc0000";
      ctx.fillRect(player.x, player.y, player.width, player.height);
      // Hat
      ctx.fillStyle = "#cc0000";
      ctx.fillRect(player.x - 2, player.y - 8, player.width + 4, 8);
      ctx.fillStyle = "#cc0000";
      ctx.fillRect(player.x + 6, player.y - 14, player.width - 12, 8);
      // Face
      ctx.fillStyle = "#ffcc99";
      ctx.fillRect(player.x + 4, player.y + 4, player.width - 8, 22);
      // Eyes
      ctx.fillStyle = "#fff";
      ctx.fillRect(player.x + 8, player.y + 8, 8, 8);
      ctx.fillRect(player.x + 24, player.y + 8, 8, 8);
      ctx.fillStyle = "#000";
      ctx.fillRect(player.x + 11, player.y + 11, 4, 4);
      ctx.fillRect(player.x + 27, player.y + 11, 4, 4);
      // Moustache
      ctx.fillStyle = "#5a3a1a";
      ctx.fillRect(player.x + 6, player.y + 20, 28, 4);
      // Overalls
      ctx.fillStyle = "#003399";
      ctx.fillRect(
        player.x + 4,
        player.y + 24,
        player.width - 8,
        player.height - 28,
      );

      ctx.restore();

      // HUD
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, canvas.width, 40);
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 18px Arial";
      ctx.fillText("DIVYANSH GAMING: MARIO WORLD", 20, 26);
      ctx.fillStyle = "#fff";
      ctx.fillText(`Score: ${score}`, canvas.width - 140, 26);

      // Controls hint
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "12px Arial";
      ctx.fillText(
        "\u2190 \u2192 Move   \u2191 / Space: Jump",
        20,
        canvas.height - 10,
      );
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

    rafRef.current = requestAnimationFrame(update);

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
            aspectRatio: "2 / 1",
            background:
              "radial-gradient(ellipse at center, #1a1a2e 0%, #0d0d1a 100%)",
            border: "2px solid #ff0055",
            boxShadow: "0 0 20px #ff0055",
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
          <div style={{ fontSize: 48 }}>🍄</div>
          <div
            style={{
              color: "#ff0055",
              fontSize: 22,
              fontWeight: "bold",
              textShadow: "0 0 10px #ff0055",
            }}
          >
            MARIO WORLD
          </div>
          <div style={{ color: "#fff", fontSize: 14, opacity: 0.7 }}>
            Use ← → to move, ↑ or Space to jump
          </div>
        </button>
      ) : (
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            maxWidth: 800,
            border: "2px solid #ff0055",
            boxShadow: "0 0 20px #ff0055",
            borderRadius: 8,
            background: "#5c94fc",
            display: "block",
          }}
          tabIndex={0}
        />
      )}
    </div>
  );
}
