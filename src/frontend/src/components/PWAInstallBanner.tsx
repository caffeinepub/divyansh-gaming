import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already installed?
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    const dismissed = sessionStorage.getItem("pwa-banner-dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner after 1 second
      setTimeout(() => setVisible(true), 1000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
    }
    setVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem("pwa-banner-dismissed", "1");
  };

  if (!visible || installed) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "linear-gradient(135deg, #0a0a1a 0%, #0d1a2e 100%)",
        border: "1px solid #00f5ff55",
        borderRadius: "12px",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 0 24px #00f5ff33, 0 4px 20px rgba(0,0,0,0.8)",
        maxWidth: "340px",
        width: "calc(100vw - 32px)",
        animation: "slideUp 0.4s ease",
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
      <span style={{ fontSize: "28px" }}>🎮</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: "#00f5ff",
            fontWeight: 700,
            fontSize: "13px",
            fontFamily: "monospace",
          }}
        >
          Install DIVYANSH GAMING
        </div>
        <div style={{ color: "#aaa", fontSize: "11px", marginTop: "2px" }}>
          Play offline & get faster loads
        </div>
      </div>
      <button
        type="button"
        onClick={handleInstall}
        style={{
          background: "linear-gradient(135deg, #00f5ff, #7c3aed)",
          border: "none",
          borderRadius: "8px",
          padding: "6px 14px",
          color: "#fff",
          fontWeight: 700,
          fontSize: "12px",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Install
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        style={{
          background: "transparent",
          border: "none",
          color: "#666",
          cursor: "pointer",
          fontSize: "18px",
          lineHeight: 1,
          padding: "0 2px",
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
