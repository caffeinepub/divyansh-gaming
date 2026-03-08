import { MessageSquare, Shield, Users, Zap } from "lucide-react";
// ─── About / Contact Section ──────────────────────────────────────────────────
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { playClick, playHover } from "../hooks/useSoundEffects";

const STAT_CHIPS = [
  { value: "50K+", label: "Players", icon: <Users className="w-3.5 h-3.5" /> },
  { value: "15+", label: "Games", icon: <Zap className="w-3.5 h-3.5" /> },
  {
    value: "Weekly",
    label: "New Games",
    icon: <Shield className="w-3.5 h-3.5" />,
  },
];

export default function AboutContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email.";
    if (!form.message.trim()) e.message = "Message is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    if (!validate()) return;

    setSending(true);
    // Simulate send
    setTimeout(() => {
      toast.success("Message received! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
      setErrors({});
      setSending(false);
    }, 800);
  };

  return (
    <section
      id="about"
      data-ocid="about.section"
      className="relative py-24 overflow-hidden"
      style={{ background: "oklch(0.09 0.025 270 / 0.85)" }}
    >
      {/* Glow orbs */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-8"
        style={{ background: "oklch(var(--neon-violet))" }}
      />
      <div
        className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-6"
        style={{ background: "oklch(var(--neon-cyan))" }}
      />

      <div className="container px-4 md:px-6 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase mb-4"
            style={{
              background: "oklch(var(--neon-violet) / 0.08)",
              border: "1px solid oklch(var(--neon-violet) / 0.35)",
              color: "oklch(var(--neon-violet))",
            }}
          >
            <Shield className="w-3 h-3" />
            About &amp; Contact
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-foreground mb-4">
            The{" "}
            <span
              className="glow-violet"
              style={{ color: "oklch(var(--neon-violet))" }}
            >
              Story
            </span>{" "}
            &amp;{" "}
            <span className="gradient-text-gaming glow-cyan">Contact</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Left column — About */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3
              className="font-display font-black text-2xl mb-5"
              style={{ color: "oklch(var(--neon-violet))" }}
            >
              About DIVYANSH GAMING
            </h3>

            <p className="font-body text-sm text-foreground/65 leading-relaxed mb-4">
              DIVYANSH GAMING was built by{" "}
              <strong className="text-foreground/85">Divyansh Yadav</strong>, a
              passionate gamer who wanted to create the ultimate free gaming
              experience. From humble beginnings to 50,000+ players, this
              platform is built by gamers, for gamers.
            </p>

            <div
              className="p-4 rounded-lg mb-6"
              style={{
                background: "oklch(var(--neon-violet) / 0.05)",
                border: "1px solid oklch(var(--neon-violet) / 0.2)",
              }}
            >
              <p className="font-body text-sm text-foreground/60 leading-relaxed italic">
                "Our mission is to bring high-quality free games to everyone,
                foster a competitive community, and keep adding new games every
                single week."
              </p>
            </div>

            {/* Stat chips */}
            <div className="flex flex-wrap gap-3 mb-6">
              {STAT_CHIPS.map((chip) => (
                <div
                  key={chip.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-xs font-bold tracking-widest uppercase"
                  style={{
                    background: "oklch(var(--neon-cyan) / 0.07)",
                    border: "1px solid oklch(var(--neon-cyan) / 0.25)",
                    color: "oklch(var(--neon-cyan))",
                  }}
                >
                  {chip.icon}
                  <span
                    style={{ color: "oklch(var(--neon-cyan))" }}
                    className="font-black"
                  >
                    {chip.value}
                  </span>{" "}
                  <span className="text-foreground/40">{chip.label}</span>
                </div>
              ))}
            </div>

            {/* Creator badge */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{
                background: "oklch(0.78 0.18 75 / 0.07)",
                border: "1px solid oklch(0.78 0.18 75 / 0.25)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-base shrink-0"
                style={{
                  background: "oklch(0.78 0.18 75 / 0.2)",
                  color: "oklch(0.78 0.18 75)",
                  border: "1.5px solid oklch(0.78 0.18 75 / 0.5)",
                }}
              >
                D
              </div>
              <div>
                <p
                  className="font-display font-bold text-sm"
                  style={{ color: "oklch(0.78 0.18 75)" }}
                >
                  Divyansh Yadav
                </p>
                <p className="font-mono text-xs text-foreground/40 tracking-wider">
                  Creator &amp; Developer
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right column — Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div
              className="rounded-xl p-6"
              style={{
                background: "oklch(var(--card))",
                border: "1px solid oklch(var(--border))",
                boxShadow: "0 4px 32px oklch(0 0 0 / 0.3)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare
                  className="w-5 h-5"
                  style={{ color: "oklch(var(--neon-cyan))" }}
                />
                <h3
                  className="font-display font-black text-xl"
                  style={{ color: "oklch(var(--neon-cyan))" }}
                >
                  Send a Message
                </h3>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
                noValidate
              >
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-mono text-xs text-foreground/50 tracking-widest uppercase mb-1.5"
                  >
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="e.g. Divyansh"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    data-ocid="contact.name.input"
                    className="w-full px-4 py-3 rounded-lg text-sm font-body outline-none transition-all duration-200"
                    style={{
                      background: "oklch(var(--input) / 0.6)",
                      border: errors.name
                        ? "1.5px solid oklch(var(--destructive) / 0.7)"
                        : "1.5px solid oklch(var(--border))",
                      color: "oklch(var(--foreground))",
                    }}
                    onFocus={(e) => {
                      if (!errors.name) {
                        e.target.style.borderColor =
                          "oklch(var(--neon-cyan) / 0.5)";
                        e.target.style.boxShadow =
                          "0 0 12px oklch(var(--neon-cyan) / 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.name) {
                        e.target.style.borderColor = "oklch(var(--border))";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  />
                  {errors.name && (
                    <p
                      className="font-mono text-xs mt-1"
                      style={{ color: "oklch(var(--destructive))" }}
                      data-ocid="contact.name.error_state"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-xs text-foreground/50 tracking-widest uppercase mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="gamer@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    data-ocid="contact.email.input"
                    className="w-full px-4 py-3 rounded-lg text-sm font-body outline-none transition-all duration-200"
                    style={{
                      background: "oklch(var(--input) / 0.6)",
                      border: errors.email
                        ? "1.5px solid oklch(var(--destructive) / 0.7)"
                        : "1.5px solid oklch(var(--border))",
                      color: "oklch(var(--foreground))",
                    }}
                    onFocus={(e) => {
                      if (!errors.email) {
                        e.target.style.borderColor =
                          "oklch(var(--neon-cyan) / 0.5)";
                        e.target.style.boxShadow =
                          "0 0 12px oklch(var(--neon-cyan) / 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.email) {
                        e.target.style.borderColor = "oklch(var(--border))";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  />
                  {errors.email && (
                    <p
                      className="font-mono text-xs mt-1"
                      style={{ color: "oklch(var(--destructive))" }}
                      data-ocid="contact.email.error_state"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block font-mono text-xs text-foreground/50 tracking-widest uppercase mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Tell us what you think, suggest a game, or just say hi!"
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    data-ocid="contact.message.textarea"
                    className="w-full px-4 py-3 rounded-lg text-sm font-body outline-none resize-none transition-all duration-200"
                    style={{
                      background: "oklch(var(--input) / 0.6)",
                      border: errors.message
                        ? "1.5px solid oklch(var(--destructive) / 0.7)"
                        : "1.5px solid oklch(var(--border))",
                      color: "oklch(var(--foreground))",
                    }}
                    onFocus={(e) => {
                      if (!errors.message) {
                        e.target.style.borderColor =
                          "oklch(var(--neon-cyan) / 0.5)";
                        e.target.style.boxShadow =
                          "0 0 12px oklch(var(--neon-cyan) / 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.message) {
                        e.target.style.borderColor = "oklch(var(--border))";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  />
                  {errors.message && (
                    <p
                      className="font-mono text-xs mt-1"
                      style={{ color: "oklch(var(--destructive))" }}
                      data-ocid="contact.message.error_state"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending}
                  data-ocid="contact.submit_button"
                  onMouseEnter={() => playHover()}
                  onClick={() => playClick()}
                  className="gaming-btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-display font-bold text-sm tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
