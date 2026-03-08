import { ExternalLink, Play } from "lucide-react";
// ─── YouTube Section ──────────────────────────────────────────────────────────
import { motion } from "motion/react";
import { SiYoutube } from "react-icons/si";
import { playClick, playHover } from "../hooks/useSoundEffects";

interface VideoData {
  id: string;
  title: string;
  description: string;
}

const VIDEOS: VideoData[] = [
  {
    id: "M8G2HFVE0-0",
    title: "GTA 6 Official Trailer",
    description:
      "The most anticipated game reveal of the decade — Rockstar's GTA VI.",
  },
  {
    id: "jD3bMHCgAFU",
    title: "Minecraft 2023 Highlights",
    description:
      "Epic builds, survival runs & the best Minecraft moments of the year.",
  },
  {
    id: "FqnKB22pOC0",
    title: "Fortnite Season Highlights",
    description:
      "Top plays, crazy builds and insane victory royales this season.",
  },
  {
    id: "DXqkLfoBSPs",
    title: "Valorant Official Cinematic",
    description:
      "The electrifying cinematic that launched Valorant to millions.",
  },
  {
    id: "jPFGF3Z1aQk",
    title: "Call of Duty Cinematic",
    description:
      "High-octane action in this stunning Call of Duty cinematic reveal.",
  },
  {
    id: "2lchO4pMDCw",
    title: "Free Fire Highlights",
    description:
      "The best moments from Free Fire's competitive & ranked scenes.",
  },
];

export default function YouTubeSection() {
  return (
    <section
      id="youtube"
      data-ocid="youtube.section"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(0.08 0.02 5 / 0.85)" }}
    >
      {/* Glow orbs — YouTube red tones */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-8"
        style={{ background: "oklch(0.62 0.24 15)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-6"
        style={{ background: "oklch(var(--neon-cyan))" }}
      />

      <div className="container px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase mb-4"
            style={{
              background: "oklch(0.62 0.24 15 / 0.1)",
              border: "1px solid oklch(0.62 0.24 15 / 0.4)",
              color: "oklch(0.72 0.22 15)",
            }}
          >
            <SiYoutube className="w-3 h-3" />
            Gaming Videos
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-foreground mb-4">
            Watch &amp;{" "}
            <span
              style={{
                color: "oklch(0.72 0.22 15)",
                textShadow: "0 0 24px oklch(0.62 0.24 15 / 0.4)",
              }}
            >
              Learn
            </span>
          </h2>
          <p className="font-body text-foreground/50 max-w-xl mx-auto">
            Top gaming highlights, tutorials &amp; epic moments from around the
            world.
          </p>
        </motion.div>

        {/* Video grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {VIDEOS.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} />
          ))}
        </div>

        {/* Subscribe CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-display font-bold text-sm tracking-widest uppercase transition-all duration-200"
            style={{
              background: "oklch(0.62 0.24 15 / 0.18)",
              border: "1.5px solid oklch(0.62 0.24 15 / 0.5)",
              color: "oklch(0.78 0.2 15)",
              boxShadow: "0 0 20px oklch(0.62 0.24 15 / 0.2)",
            }}
            data-ocid="youtube.primary_button"
          >
            <SiYoutube className="w-4 h-4" />
            Subscribe for More
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function VideoCard({ video, index }: { video: VideoData; index: number }) {
  return (
    <motion.div
      className="group rounded-xl overflow-hidden"
      style={{
        background: "oklch(var(--card))",
        border: "1px solid oklch(var(--border))",
        boxShadow: "0 4px 24px oklch(0 0 0 / 0.4)",
        willChange: "transform",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{
        boxShadow:
          "0 8px 40px oklch(0 0 0 / 0.5), 0 0 20px oklch(0.62 0.24 15 / 0.15)",
        borderColor: "oklch(0.62 0.24 15 / 0.45)",
      }}
    >
      {/* Iframe wrapper */}
      <div className="relative">
        <iframe
          width="100%"
          height="215"
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="block"
          style={{ display: "block" }}
        />
      </div>

      {/* Card footer */}
      <div className="p-4">
        <div className="flex items-start gap-2">
          <div
            className="w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5"
            style={{
              background: "oklch(0.62 0.24 15 / 0.15)",
              color: "oklch(0.72 0.22 15)",
            }}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-foreground line-clamp-1 group-hover:text-neon-cyan transition-colors">
              {video.title}
            </h3>
            <p className="font-body text-xs text-foreground/45 mt-1 line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
