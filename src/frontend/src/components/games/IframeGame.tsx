import { useEffect, useRef } from "react";

interface IframeGameProps {
  src: string;
  title: string;
}

export default function IframeGame({ src, title }: IframeGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lock scroll while game is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center w-full"
      style={{ width: "100%", maxWidth: 560 }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "75%",
          borderRadius: 10,
          overflow: "hidden",
          background: "#000",
          border: "1px solid rgba(0,229,255,0.2)",
          boxShadow: "0 0 30px rgba(0,229,255,0.1)",
        }}
      >
        <iframe
          src={src}
          title={title}
          allowFullScreen
          allow="autoplay; fullscreen; pointer-lock"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: "none",
            borderRadius: 10,
          }}
        />
      </div>
      <p
        className="mt-3 text-xs font-mono text-center"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        Game powered by CrazyGames
      </p>
    </div>
  );
}
