import { Check, Copy, Share2, Users2 } from "lucide-react";
// ─── Invite Friends Section ───────────────────────────────────────────────────
import { motion } from "motion/react";
import { useState } from "react";
import { SiWhatsapp, SiX } from "react-icons/si";
import { toast } from "sonner";
import { playClick, playHover } from "../hooks/useSoundEffects";

const SHARE_TEXT =
  "I'm playing games on DIVYANSH GAMING! Can you beat my score? 🎮";

const FEATURE_CHIPS = [
  { emoji: "⚔️", label: "Compete Together" },
  { emoji: "🏆", label: "Beat Their Score" },
  { emoji: "🎁", label: "Win Weekly Prizes" },
];

export default function InviteFriendsSection() {
  const [copied, setCopied] = useState(false);

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "https://divyanshgaming.com";
  const encodedText = encodeURIComponent(SHARE_TEXT);
  const encodedUrl = encodeURIComponent(siteUrl);

  const handleCopy = async () => {
    playClick();
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy — try selecting the URL manually.");
    }
  };

  const handleShare = async () => {
    playClick();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "DIVYANSH GAMING",
          text: SHARE_TEXT,
          url: siteUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard
        .writeText(`${SHARE_TEXT} ${siteUrl}`)
        .catch(() => {});
      toast.success("Share text copied to clipboard!");
    }
  };

  return (
    <section
      id="invite"
      data-ocid="invite.section"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(0.09 0.025 175 / 0.85)" }}
    >
      {/* Glow orbs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-8"
        style={{ background: "oklch(var(--neon-cyan))" }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-6"
        style={{ background: "oklch(var(--neon-green))" }}
      />

      <div className="container px-4 md:px-6 relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase mb-4"
            style={{
              background: "oklch(var(--neon-cyan) / 0.08)",
              border: "1px solid oklch(var(--neon-cyan) / 0.35)",
              color: "oklch(var(--neon-cyan))",
            }}
          >
            <Users2 className="w-3 h-3" />
            Invite & Dominate
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-foreground mb-4">
            Challenge Your{" "}
            <span className="gradient-text-gaming glow-cyan">Friends</span>
          </h2>

          {/* Motivational banner */}
          <motion.div
            className="mb-8 px-6 py-4 rounded-lg mx-auto max-w-xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(var(--neon-cyan) / 0.06), oklch(var(--neon-green) / 0.04))",
              border: "1px solid oklch(var(--neon-cyan) / 0.25)",
            }}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="font-display font-bold text-lg text-foreground/80 italic">
              "Bring your friends. Dominate the leaderboard.{" "}
              <span style={{ color: "oklch(var(--neon-cyan))" }}>
                Together.
              </span>
              "
            </p>
          </motion.div>
        </motion.div>

        {/* Feature chips */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {FEATURE_CHIPS.map((chip) => (
            <div
              key={chip.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm font-semibold tracking-wide"
              style={{
                background: "oklch(var(--neon-cyan) / 0.07)",
                border: "1px solid oklch(var(--neon-cyan) / 0.25)",
                color: "oklch(var(--neon-cyan))",
              }}
            >
              <span>{chip.emoji}</span>
              {chip.label}
            </div>
          ))}
        </motion.div>

        {/* URL Copy box */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label
            className="block font-mono text-xs text-foreground/40 tracking-widest uppercase mb-2"
            htmlFor="invite-url"
          >
            Your Game Link
          </label>
          <div
            className="flex items-center gap-0 rounded-lg overflow-hidden"
            style={{
              border: "1.5px solid oklch(var(--neon-cyan) / 0.3)",
              background: "oklch(var(--card))",
            }}
          >
            <input
              id="invite-url"
              type="text"
              readOnly
              value={siteUrl}
              className="flex-1 bg-transparent px-4 py-3 text-sm font-mono text-foreground/60 outline-none truncate"
              data-ocid="invite.input"
            />
            <button
              type="button"
              onClick={handleCopy}
              onMouseEnter={() => playHover()}
              data-ocid="invite.copy_link.button"
              className="flex items-center gap-2 px-5 py-3 font-mono text-sm font-bold tracking-widest uppercase transition-all duration-200 shrink-0"
              style={{
                background: copied
                  ? "oklch(var(--neon-green) / 0.2)"
                  : "oklch(var(--neon-cyan) / 0.12)",
                borderLeft: "1.5px solid oklch(var(--neon-cyan) / 0.3)",
                color: copied
                  ? "oklch(var(--neon-green))"
                  : "oklch(var(--neon-cyan))",
              }}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </motion.div>

        {/* Social Share Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Twitter/X */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
            className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg font-mono text-sm font-bold tracking-widest uppercase transition-all duration-200"
            style={{
              background: "oklch(0.15 0.005 240 / 0.9)",
              border: "1.5px solid oklch(0.5 0.01 240 / 0.4)",
              color: "oklch(0.9 0.01 240)",
            }}
          >
            <SiX className="w-4 h-4" />
            Share on X
          </a>

          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
            className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg font-mono text-sm font-bold tracking-widest uppercase transition-all duration-200"
            style={{
              background: "oklch(0.42 0.18 145 / 0.15)",
              border: "1.5px solid oklch(0.65 0.2 145 / 0.4)",
              color: "oklch(0.75 0.2 145)",
            }}
          >
            <SiWhatsapp className="w-4 h-4" />
            Share on WhatsApp
          </a>

          {/* Generic Share */}
          <button
            type="button"
            onClick={handleShare}
            onMouseEnter={() => playHover()}
            className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg font-mono text-sm font-bold tracking-widest uppercase transition-all duration-200"
            style={{
              background: "oklch(var(--neon-cyan) / 0.1)",
              border: "1.5px solid oklch(var(--neon-cyan) / 0.35)",
              color: "oklch(var(--neon-cyan))",
            }}
            data-ocid="invite.primary_button"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </motion.div>
      </div>
    </section>
  );
}
