// ─── Sound Effects Hook ──────────────────────────────────────────────────────
// All sounds generated via Web Audio API — no audio files needed.
// Uses a module-level singleton so the AudioContext is shared across
// all consumers without creating multiple contexts.

const STORAGE_KEY = "divyansh_gaming_muted";

// ── Module-level singleton state ─────────────────────────────────────────────
let audioCtx: AudioContext | null = null;
let muted: boolean = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
})();

// Listeners for reactive mute state
const muteListeners = new Set<(m: boolean) => void>();

function notifyMuteListeners() {
  for (const fn of muteListeners) {
    fn(muted);
  }
}

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// ── Individual sound functions ────────────────────────────────────────────────

/** Very subtle, short high-pitched tick — for nav hover */
export function playHover(): void {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  } catch {}
}

/** Satisfying neon zap/blip — for clicks */
export function playClick(): void {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch {}
}

/** Energetic ascending chime — for game start */
export function playGameStart(): void {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    const notes = [440, 660, 880];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.13;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      osc.start(t);
      osc.stop(t + 0.12);
    });
  } catch {}
}

/** Descending low buzz — for game over */
export function playGameOver(): void {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch {}
}

/** Short impact buzz — for collision */
export function playCollision(): void {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
}

/** Soft upward whoosh — for chat open */
export function playChatOpen(): void {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch {}
}

/** Soft downward whoosh — for chat close */
export function playChatClose(): void {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch {}
}

/** Two-tone soft ping — for notification / ARIA response */
export function playNotification(): void {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    const tones = [440, 660];
    tones.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.11;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    });
  } catch {}
}

/** Barely audible ultra-short blip — for score increment */
export function playScoreTick(): void {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.02);
  } catch {}
}

/** Toggle mute state and persist to localStorage */
export function toggleMute(): void {
  muted = !muted;
  try {
    localStorage.setItem(STORAGE_KEY, String(muted));
  } catch {}
  notifyMuteListeners();
}

/** Get current mute state */
export function getIsMuted(): boolean {
  return muted;
}

// ── React hook ────────────────────────────────────────────────────────────────
import { useCallback, useEffect, useState } from "react";

export function useSoundEffects() {
  const [isMuted, setIsMuted] = useState<boolean>(muted);

  useEffect(() => {
    const listener = (m: boolean) => setIsMuted(m);
    muteListeners.add(listener);
    return () => {
      muteListeners.delete(listener);
    };
  }, []);

  const toggle = useCallback(() => {
    toggleMute();
  }, []);

  return {
    isMuted,
    toggleMute: toggle,
    playHover,
    playClick,
    playGameStart,
    playGameOver,
    playCollision,
    playChatOpen,
    playChatClose,
    playNotification,
    playScoreTick,
  };
}
