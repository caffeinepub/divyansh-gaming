import {
  Briefcase,
  CheckCircle2,
  Code2,
  ExternalLink,
  Gamepad2,
  Layers,
  Mail,
  MessageCircle,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

const skills = [
  { label: "React", icon: "⚛️" },
  { label: "TypeScript", icon: "📘" },
  { label: "3D Web Dev", icon: "🌐" },
  { label: "Game Development", icon: "🎮" },
  { label: "Full-Stack", icon: "🖥️" },
  { label: "UI/UX Design", icon: "🎨" },
  { label: "Canvas / WebGL", icon: "✨" },
  { label: "Web Audio API", icon: "🔊" },
];

const services = [
  { icon: <Gamepad2 className="w-4 h-4" />, label: "Gaming Websites" },
  { icon: <Briefcase className="w-4 h-4" />, label: "Developer Portfolios" },
  { icon: <Layers className="w-4 h-4" />, label: "E-commerce Sites" },
  { icon: <Code2 className="w-4 h-4" />, label: "Custom Web Apps" },
  { icon: <Smartphone className="w-4 h-4" />, label: "Mobile-Responsive PWAs" },
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: "Interactive Landing Pages",
  },
];

const projectStats = [
  { label: "80+ Games", icon: "🎮" },
  { label: "10 Comic Stories", icon: "📚" },
  { label: "3D Avatars", icon: "👾" },
  { label: "PWA Support", icon: "📱" },
];

export default function FreelancePortfolio() {
  const gold = "oklch(0.82 0.18 85)";
  const goldDim = "oklch(0.72 0.15 85 / 0.6)";
  const goldBorder = "oklch(0.72 0.15 85 / 0.35)";
  const goldGlow = "oklch(0.82 0.18 85 / 0.25)";

  return (
    <section id="hire-me" className="py-20 relative overflow-hidden">
      {/* Gold radial background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.72 0.15 85 / 0.06) 0%, transparent 70%)",
        }}
      />
      {/* Corner decorations */}
      <div
        className="absolute top-0 left-0 w-32 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.72 0.15 85 / 0.12) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(315deg, oklch(0.72 0.15 85 / 0.12) 0%, transparent 60%)",
        }}
      />

      <div className="container px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-4"
            style={{
              background: "oklch(0.82 0.18 85 / 0.12)",
              border: `1px solid ${goldBorder}`,
              color: gold,
            }}
          >
            <Briefcase className="w-3.5 h-3.5" />
            OPEN FOR HIRE
          </div>
          <h2
            className="font-display font-black text-3xl md:text-5xl tracking-tight mb-3"
            style={{
              background: `linear-gradient(135deg, ${gold}, oklch(0.92 0.12 75), ${gold})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Need a Gaming Website
          </h2>
          <h2
            className="font-display font-black text-3xl md:text-5xl tracking-tight mb-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.25 200), oklch(0.82 0.18 85))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            or Web App?
          </h2>
          <p className="text-foreground/60 font-body text-lg max-w-xl mx-auto">
            Built by{" "}
            <span className="font-bold" style={{ color: gold }}>
              Divyansh Yadav
            </span>{" "}
            — Full-Stack Developer &amp; Game Dev
          </p>
        </motion.div>

        {/* Skills grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {skills.map((skill, i) => (
            <motion.div
              key={skill.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              viewport={{ once: true }}
              data-ocid={`hire.skill.${i + 1}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105"
              style={{
                background: "oklch(0.82 0.18 85 / 0.1)",
                border: `1px solid ${goldBorder}`,
                color: gold,
              }}
            >
              <span>{skill.icon}</span>
              {skill.label}
            </motion.div>
          ))}
        </motion.div>

        {/* Project showcase + services grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* DIVYANSH GAMING showcase card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            data-ocid="hire.project.card"
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: "oklch(0.08 0.02 270 / 0.9)",
              border: `1px solid ${goldBorder}`,
              boxShadow: `0 0 40px ${goldGlow}`,
            }}
          >
            {/* Glow top right */}
            <div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
              style={{
                background: "oklch(0.82 0.18 85 / 0.08)",
                filter: "blur(24px)",
              }}
            />

            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎮</span>
              <div>
                <h3
                  className="font-display font-black text-lg"
                  style={{ color: gold }}
                >
                  DIVYANSH GAMING Platform
                </h3>
                <p className="text-xs text-foreground/50">Featured Project</p>
              </div>
            </div>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {["React", "R3F", "TypeScript", "Canvas", "Web Audio"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-xs font-mono"
                    style={{
                      background: "oklch(0.75 0.25 200 / 0.12)",
                      border: "1px solid oklch(0.75 0.25 200 / 0.3)",
                      color: "oklch(0.75 0.25 200)",
                    }}
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {projectStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{
                    background: "oklch(0.82 0.18 85 / 0.07)",
                    border: `1px solid ${goldBorder}`,
                  }}
                >
                  <span className="text-sm">{stat.icon}</span>
                  <span className="text-xs font-bold text-foreground/80">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-sm text-foreground/60 leading-relaxed">
              A full-stack gaming platform with 80+ mini games, 3D avatar
              customization, player progression, leaderboards, cinematic intro
              sequences, and PWA support.
            </p>

            <a
              href="#hero"
              data-ocid="hire.view_project.button"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold transition-colors"
              style={{ color: gold }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Live Project ↗
            </a>
          </motion.div>

          {/* What I can build for you */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-2xl p-6"
            style={{
              background: "oklch(0.08 0.02 270 / 0.9)",
              border: `1px solid ${goldBorder}`,
            }}
          >
            <h3
              className="font-display font-bold text-lg mb-4 flex items-center gap-2"
              style={{ color: gold }}
            >
              <Code2 className="w-5 h-5" />
              What I Can Build For You
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((service, i) => (
                <motion.div
                  key={service.label}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                  style={{
                    background: "oklch(0.82 0.18 85 / 0.06)",
                    border: `1px solid ${goldBorder}`,
                  }}
                >
                  <span style={{ color: goldDim }}>{service.icon}</span>
                  <span className="text-sm font-medium text-foreground/80">
                    {service.label}
                  </span>
                  <CheckCircle2
                    className="w-3.5 h-3.5 ml-auto flex-shrink-0"
                    style={{ color: gold }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Experience note */}
            <div
              className="mt-5 p-3 rounded-lg text-xs text-foreground/50 leading-relaxed"
              style={{
                background: "oklch(0.82 0.18 85 / 0.04)",
                border: `1px solid ${goldBorder}`,
              }}
            >
              🏆 Certified Full-Stack Developer &amp; 3D Web Specialist. Built
              DIVYANSH GAMING solo — from React Three Fiber 3D scenes to Web
              Audio API soundtracks.
            </div>
          </motion.div>
        </div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="hire.whatsapp.button"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.18 145), oklch(0.45 0.15 145))",
                color: "white",
                boxShadow: "0 0 20px oklch(0.55 0.18 145 / 0.4)",
              }}
            >
              <MessageCircle className="w-5 h-5" />💬 WhatsApp Me
            </a>
            <a
              href="mailto:divyansh@example.com"
              data-ocid="hire.email.button"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${gold}, oklch(0.72 0.15 75))`,
                color: "oklch(0.08 0.02 270)",
                boxShadow: `0 0 20px ${goldGlow}`,
              }}
            >
              <Mail className="w-5 h-5" />📧 Email Me
            </a>
          </div>
          <p className="text-xs text-foreground/40 italic">
            Response within 24 hours • Competitive rates • Student-friendly
            pricing
          </p>
        </motion.div>
      </div>
    </section>
  );
}
