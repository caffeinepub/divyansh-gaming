import { Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";
import { useSoundEffects } from "../hooks/useSoundEffects";

export default function SoundToggle() {
  const { isMuted, toggleMute, playClick } = useSoundEffects();

  const handleToggle = () => {
    // Play click sound before toggling (only when unmuting, so sound plays)
    if (isMuted) {
      toggleMute();
      // After unmuting, play a small confirmation sound
      setTimeout(() => playClick(), 10);
    } else {
      playClick();
      toggleMute();
    }
  };

  return (
    <motion.button
      type="button"
      data-ocid="sound.toggle"
      aria-label={isMuted ? "Unmute sound effects" : "Mute sound effects"}
      aria-pressed={!isMuted}
      onClick={handleToggle}
      className="fixed bottom-4 left-4 z-50 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
      style={{
        background: "oklch(0.085 0.015 270 / 0.85)",
        border: isMuted
          ? "1px solid oklch(0.4 0.05 270 / 0.5)"
          : "1px solid oklch(0.75 0.2 200 / 0.5)",
        backdropFilter: "blur(8px)",
        boxShadow: isMuted
          ? "none"
          : "0 0 12px oklch(0.75 0.2 200 / 0.2), 0 0 24px oklch(0.75 0.2 200 / 0.08)",
        color: isMuted ? "oklch(0.5 0.05 270)" : "oklch(0.75 0.2 200)",
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: isMuted
          ? "0 0 8px oklch(0.75 0.2 200 / 0.15)"
          : "0 0 20px oklch(0.75 0.2 200 / 0.35), 0 0 40px oklch(0.75 0.2 200 / 0.12)",
      }}
      whileTap={{ scale: 0.92 }}
      title={
        isMuted ? "Sound off — click to enable" : "Sound on — click to mute"
      }
    >
      {isMuted ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </motion.button>
  );
}
